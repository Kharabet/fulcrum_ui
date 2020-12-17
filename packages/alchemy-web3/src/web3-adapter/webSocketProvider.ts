import EventEmitter from "eventemitter3";
import SturdyWebSocket from "sturdy-websocket";
import {
  Backfiller,
  dedupeLogs,
  dedupeNewHeads,
  LogsEvent,
  LogsSubscriptionFilter,
  makeBackfiller,
  NewHeadsEvent,
} from "../subscriptions/subscriptionBackfill";
import {
  isSubscriptionEvent,
  JsonRpcRequest,
  SendFunction,
  SubscriptionEvent,
  WebSocketMessage,
} from "../types";
import { fromHex } from "../util/hex";
import {
  JsonRpcSenders,
  makePayloadFactory,
  makeSenders,
} from "../util/jsonRpc";
import {
  makeCancelToken,
  throwIfCancelled,
  withBackoffRetries,
  withTimeout,
} from "../util/promises";
import { SendPayloadFunction } from "./sendPayload";

const HEARTBEAT_INTERVAL = 30000;
const HEARTBEAT_WAIT_TIME = 10000;
const BACKFILL_TIMEOUT = 60000;
const BACKFILL_RETRIES = 5;
/**
 * Subscriptions have a memory of recent events they have sent so that in the
 * event that they disconnect and need to backfill, they can detect re-orgs.
 * Keep a buffer that goes back at least these many blocks, the maximum amount
 * at which we might conceivably see a re-org.
 *
 * Note that while our buffer goes back this many blocks, it may contain more
 * than this many elements, since in the case of logs subscriptions more than
 * one event may be emitted for a block.
 */
const RETAINED_EVENT_BLOCK_COUNT = 10;

/**
 * This is the undocumented interface required by Web3 for providers which
 * handle subscriptions.
 *
 * In addition to the stated methods here, it communicates subscription events
 * by using EventEmitter#emit() to emit the events, with the appropriate
 * subscription id as the event type.
 */
export interface Web3SubscriptionProvider extends EventEmitter {
  sendPayload: SendPayloadFunction;
  send(method: string, params?: any[]): Promise<any>;
  sendBatch(methods: any[], moduleInstance: any): Promise<any>;
  supportsSubscriptions(): true;
  subscribe(
    subscribeMethod: string | undefined,
    subscriptionMethod: string,
    parameters: any[],
  ): Promise<string>;
  unsubscribe(
    subscriptionId: string,
    unsubscribeMethod?: string,
  ): Promise<boolean>;
  disconnect(code?: number, reason?: string): void;
}

interface VirtualSubscription {
  virtualId: string;
  physicalId: string;
  method: string;
  params: any[];
  isBackfilling: boolean;
  startingBlockNumber: number;
  sentEvents: any[];
  backfillBuffer: any[];
}

interface NewHeadsSubscription extends VirtualSubscription {
  method: "eth_subscribe";
  params: ["newHeads"];
  isBackfilling: boolean;
  sentEvents: NewHeadsEvent[];
  backfillBuffer: NewHeadsEvent[];
}

interface LogsSubscription extends VirtualSubscription {
  method: "eth_subscribe";
  params: ["logs", LogsSubscriptionFilter?];
  isBackfilling: boolean;
  sentEvents: LogsEvent[];
  backfillBuffer: LogsEvent[];
}

export class AlchemyWebSocketProvider extends EventEmitter
  implements Web3SubscriptionProvider {
  // In the case of a WebSocket reconnection, all subscriptions are lost and we
  // create new ones to replace them, but we want to create the illusion that
  // the original subscriptions persist. Thus, maintain a mapping from the
  // "virtual" subscription ids which are visible to the consumer to the
  // "physical" subscription ids of the actual connections. This terminology is
  // borrowed from virtual and physical memory, which has a similar mapping.
  private readonly virtualSubscriptionsById: Map<
    string,
    VirtualSubscription
  > = new Map();
  private readonly virtualIdsByPhysicalId: Map<string, string> = new Map();
  private readonly makePayload = makePayloadFactory();
  private readonly senders: JsonRpcSenders;
  private readonly backfiller: Backfiller;
  private heartbeatIntervalId?: NodeJS.Timeout;
  private cancelBackfill = noop;

  constructor(
    private readonly ws: SturdyWebSocket,
    public readonly sendPayload: SendPayloadFunction,
  ) {
    super();
    this.senders = makeSenders(sendPayload, this.makePayload);
    this.backfiller = makeBackfiller(this.senders);
    this.send = this.senders.send;
    this.addSocketListeners();
    this.startHeartbeat();
  }

  public supportsSubscriptions(): true {
    return true;
  }

  public async subscribe(
    subscribeMethod = "eth_subscribe",
    subscriptionMethod: string,
    parameters: any[],
  ): Promise<string> {
    const method = subscribeMethod;
    const params = [subscriptionMethod, ...parameters];
    const startingBlockNumber = await this.getBlockNumber();
    const id = await this.send(method, params);
    this.virtualSubscriptionsById.set(id, {
      method,
      params,
      startingBlockNumber,
      virtualId: id,
      physicalId: id,
      sentEvents: [],
      isBackfilling: false,
      backfillBuffer: [],
    });
    this.virtualIdsByPhysicalId.set(id, id);
    return id;
  }

  public async unsubscribe(
    subscriptionId: string,
    unsubscribeMethod = "eth_unsubscribe",
  ): Promise<boolean> {
    const virtualSubscription = this.virtualSubscriptionsById.get(
      subscriptionId,
    );
    if (!virtualSubscription) {
      return false;
    }
    const { physicalId } = virtualSubscription;
    const response = await this.send(unsubscribeMethod, [physicalId]);
    this.virtualSubscriptionsById.delete(subscriptionId);
    this.virtualIdsByPhysicalId.delete(physicalId);
    return response;
  }

  public disconnect(code?: number, reason?: string): void {
    this.removeSocketListeners();
    this.removeAllListeners();
    this.stopHeartbeatAndBackfill();
    this.ws.close(code, reason);
  }

  // tslint:disable-next-line: member-ordering
  public readonly send: SendFunction;

  public sendBatch(methods: any[], moduleInstance: any): Promise<any> {
    const payload: JsonRpcRequest[] = [];
    methods.forEach(method => {
      method.beforeExecution(moduleInstance);
      payload.push(this.makePayload(method.rpcMethod, method.parameters));
    });
    return this.sendPayload(payload);
  }

  private addSocketListeners(): void {
    this.ws.addEventListener("message", this.handleMessage);
    this.ws.addEventListener("reopen", this.handleReopen);
    this.ws.addEventListener("down", this.stopHeartbeatAndBackfill);
  }

  private removeSocketListeners(): void {
    this.ws.removeEventListener("message", this.handleMessage);
    this.ws.removeEventListener("reopen", this.handleReopen);
    this.ws.removeEventListener("down", this.stopHeartbeatAndBackfill);
  }

  private startHeartbeat = (): void => {
    if (this.heartbeatIntervalId != null) {
      return;
    }
    this.heartbeatIntervalId = setInterval(async () => {
      try {
        await withTimeout(this.send("net_version"), HEARTBEAT_WAIT_TIME);
      } catch {
        this.ws.reconnect();
      }
    }, HEARTBEAT_INTERVAL);
  };

  private stopHeartbeatAndBackfill = (): void => {
    if (this.heartbeatIntervalId != null) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = undefined;
    }
    this.cancelBackfill();
  };

  private handleMessage = (event: MessageEvent): void => {
    const message: WebSocketMessage = JSON.parse(event.data);
    if (!isSubscriptionEvent(message)) {
      return;
    }
    const physicalId = message.params.subscription;
    const virtualId = this.virtualIdsByPhysicalId.get(physicalId);
    if (!virtualId) {
      return;
    }
    const subscription = this.virtualSubscriptionsById.get(virtualId)!;
    if (subscription.method !== "eth_subscribe") {
      this.emitGenericEvent(virtualId, message.params.result);
      return;
    }
    switch (subscription.params[0]) {
      case "newHeads": {
        const newHeadsSubscription = subscription as NewHeadsSubscription;
        const newHeadsMessage = message as SubscriptionEvent<NewHeadsEvent>;
        const { isBackfilling, backfillBuffer } = newHeadsSubscription;
        const { result } = newHeadsMessage.params;
        if (isBackfilling) {
          addToNewHeadsEventsBuffer(backfillBuffer, result);
        } else {
          this.emitNewHeadsEvent(virtualId, result);
        }
        break;
      }
      case "logs": {
        const logsSubscription = subscription as LogsSubscription;
        const logsMessage = message as SubscriptionEvent<LogsEvent>;
        const { isBackfilling, backfillBuffer } = logsSubscription;
        const { result } = logsMessage.params;
        if (isBackfilling) {
          addToLogsEventsBuffer(backfillBuffer, result);
        } else {
          this.emitLogsEvent(virtualId, result);
        }
        break;
      }
      default:
        this.emitGenericEvent(virtualId, message.params.result);
    }
  };

  private handleReopen = (): void => {
    this.virtualIdsByPhysicalId.clear();
    const { cancel, isCancelled } = makeCancelToken();
    this.cancelBackfill = cancel;
    for (const subscription of this.virtualSubscriptionsById.values()) {
      (async () => {
        try {
          await this.resubscribeAndBackfill(isCancelled, subscription);
        } catch (error) {
          if (!isCancelled()) {
            console.error(
              `Error while backfilling "${subscription.params[0]}" subscription. Some events may be missing.`,
              error,
            );
          }
        }
      })();
    }
    this.startHeartbeat();
  };

  private async resubscribeAndBackfill(
    isCancelled: () => boolean,
    subscription: VirtualSubscription,
  ): Promise<void> {
    const {
      virtualId,
      method,
      params,
      sentEvents,
      backfillBuffer,
      startingBlockNumber,
    } = subscription;
    subscription.isBackfilling = true;
    backfillBuffer.length = 0;
    try {
      const physicalId = await this.send(method, params);
      throwIfCancelled(isCancelled);
      subscription.physicalId = physicalId;
      this.virtualIdsByPhysicalId.set(physicalId, virtualId);
      switch (params[0]) {
        case "newHeads": {
          const backfillEvents = await withBackoffRetries(
            () =>
              withTimeout(
                this.backfiller.getNewHeadsBackfill(
                  isCancelled,
                  sentEvents,
                  startingBlockNumber,
                ),
                BACKFILL_TIMEOUT,
              ),
            BACKFILL_RETRIES,
            () => !isCancelled(),
          );
          throwIfCancelled(isCancelled);
          const events = dedupeNewHeads([...backfillEvents, ...backfillBuffer]);
          events.forEach(event => this.emitNewHeadsEvent(virtualId, event));
          break;
        }
        case "logs": {
          const filter: LogsSubscriptionFilter = params[1] || {};
          const backfillEvents = await withBackoffRetries(
            () =>
              withTimeout(
                this.backfiller.getLogsBackfill(
                  isCancelled,
                  filter,
                  sentEvents,
                  startingBlockNumber,
                ),
                BACKFILL_TIMEOUT,
              ),
            BACKFILL_RETRIES,
            () => !isCancelled(),
          );
          throwIfCancelled(isCancelled);
          const events = dedupeLogs([...backfillEvents, ...backfillBuffer]);
          events.forEach(event => this.emitLogsEvent(virtualId, event));
          break;
        }
        default:
          break;
      }
    } finally {
      subscription.isBackfilling = false;
      backfillBuffer.length = 0;
    }
  }

  private async getBlockNumber(): Promise<number> {
    const blockNumberHex: string = await this.send("eth_blockNumber");
    return fromHex(blockNumberHex);
  }

  private emitNewHeadsEvent(virtualId: string, result: NewHeadsEvent): void {
    this.emitAndRememberEvent(virtualId, result, getNewHeadsBlockNumber);
  }

  private emitLogsEvent(virtualId: string, result: LogsEvent): void {
    this.emitAndRememberEvent(virtualId, result, getLogsBlockNumber);
  }

  /**
   * Emits an event to consumers, but also remembers it in its subscriptions's
   * `sentEvents` buffer so that we can detect re-orgs if the connection drops
   * and needs to be reconnected.
   */
  private emitAndRememberEvent<T>(
    virtualId: string,
    result: T,
    getBlockNumber: (result: T) => number,
  ): void {
    const subscription = this.virtualSubscriptionsById.get(virtualId);
    if (!subscription) {
      return;
    }
    // Web3 modifies these event objects once we pass them on (changing hex
    // numbers to numbers). We want the original event, so make a defensive
    // copy.
    addToPastEventsBuffer(
      subscription.sentEvents,
      { ...result },
      getBlockNumber,
    );
    this.emitGenericEvent(virtualId, result);
  }

  private emitGenericEvent(virtualId: string, result: any): void {
    const event: SubscriptionEvent["params"] = {
      subscription: virtualId,
      result,
    };
    this.emit(virtualId, event);
  }
}

function addToNewHeadsEventsBuffer(
  pastEvents: NewHeadsEvent[],
  event: NewHeadsEvent,
): void {
  addToPastEventsBuffer(pastEvents, event, getNewHeadsBlockNumber);
}

function addToLogsEventsBuffer(
  pastEvents: LogsEvent[],
  event: LogsEvent,
): void {
  addToPastEventsBuffer(pastEvents, event, getLogsBlockNumber);
}

/**
 * Adds a new event to an array of events, evicting any events which
 * are so old that they will no longer feasibly be part of a reorg.
 */
function addToPastEventsBuffer<T>(
  pastEvents: T[],
  event: T,
  getBlockNumber: (event: T) => number,
): void {
  const currentBlockNumber = getBlockNumber(event);
  // Find first index of an event recent enough to retain, then drop everything
  // at a lower index.
  const firstGoodIndex = pastEvents.findIndex(
    e => getBlockNumber(e) > currentBlockNumber - RETAINED_EVENT_BLOCK_COUNT,
  );
  if (firstGoodIndex === -1) {
    pastEvents.length = 0;
  } else {
    pastEvents.splice(0, firstGoodIndex);
  }
  pastEvents.push(event);
}

function getNewHeadsBlockNumber(event: NewHeadsEvent): number {
  return fromHex(event.number);
}

function getLogsBlockNumber(event: LogsEvent): number {
  return fromHex(event.blockNumber);
}

function noop(): void {
  // Nothing.
}
