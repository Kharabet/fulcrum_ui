import EventEmitter from "eventemitter3";
import SturdyWebSocket from "sturdy-websocket";
import { SendFunction } from "../types";
import { SendPayloadFunction } from "./sendPayload";
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
    subscribe(subscribeMethod: string | undefined, subscriptionMethod: string, parameters: any[]): Promise<string>;
    unsubscribe(subscriptionId: string, unsubscribeMethod?: string): Promise<boolean>;
    disconnect(code?: number, reason?: string): void;
}
export declare class AlchemyWebSocketProvider extends EventEmitter implements Web3SubscriptionProvider {
    private readonly ws;
    readonly sendPayload: SendPayloadFunction;
    private readonly virtualSubscriptionsById;
    private readonly virtualIdsByPhysicalId;
    private readonly makePayload;
    private readonly senders;
    private readonly backfiller;
    private heartbeatIntervalId?;
    private cancelBackfill;
    constructor(ws: SturdyWebSocket, sendPayload: SendPayloadFunction);
    supportsSubscriptions(): true;
    subscribe(subscribeMethod: string | undefined, subscriptionMethod: string, parameters: any[]): Promise<string>;
    unsubscribe(subscriptionId: string, unsubscribeMethod?: string): Promise<boolean>;
    disconnect(code?: number, reason?: string): void;
    readonly send: SendFunction;
    sendBatch(methods: any[], moduleInstance: any): Promise<any>;
    private addSocketListeners;
    private removeSocketListeners;
    private startHeartbeat;
    private stopHeartbeatAndBackfill;
    private handleMessage;
    private handleReopen;
    private resubscribeAndBackfill;
    private getBlockNumber;
    private emitNewHeadsEvent;
    private emitLogsEvent;
    /**
     * Emits an event to consumers, but also remembers it in its subscriptions's
     * `sentEvents` buffer so that we can detect re-orgs if the connection drops
     * and needs to be reconnected.
     */
    private emitAndRememberEvent;
    private emitGenericEvent;
}
