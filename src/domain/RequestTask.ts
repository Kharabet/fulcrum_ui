import { EventEmitter } from "events";
import { TasksQueueEvents } from "../services/events/TasksQueueEvents";
import { LendRequest } from "./LendRequest";
import { RequestStatus } from "./RequestStatus";
import { TradeRequest } from "./TradeRequest";

export class RequestTask {
  private eventEmitter: EventEmitter | null = null;

  public readonly request: LendRequest | TradeRequest;
  public status: RequestStatus;
  public steps: string[];
  public stepCurrent: number;

  constructor(request: LendRequest | TradeRequest) {
    this.request = request;
    this.status = RequestStatus.AWAITING;
    this.steps = ["Preparing processing..."];
    this.stepCurrent = 1;
  }

  public setEventEmitter(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  public processingStart(steps: string[]) {
    this.steps.splice(0, 1);
    steps.forEach(e => this.steps.push(e));
    this.status = RequestStatus.IN_PROGRESS;
    this.stepCurrent = 1;

    if (this.eventEmitter) {
      this.eventEmitter.emit(TasksQueueEvents.TaskChanged);
    }
  }

  public processingStepNext() {
    this.stepCurrent++;

    if (this.eventEmitter) {
      this.eventEmitter.emit(TasksQueueEvents.TaskChanged);
    }
  }

  public processingEnd(isSuccessfull: boolean) {
    this.status = isSuccessfull ? RequestStatus.DONE : RequestStatus.FAILED;

    if (this.eventEmitter) {
      this.eventEmitter.emit(TasksQueueEvents.TaskChanged);
    }
  }
}
