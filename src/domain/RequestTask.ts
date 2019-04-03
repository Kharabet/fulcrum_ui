import { LendRequest } from "./LendRequest";
import { RequestStatus } from "./RequestStatus";
import { TradeRequest } from "./TradeRequest";

export class RequestTask {
  public readonly request: LendRequest | TradeRequest;
  public readonly status: RequestStatus;
  public readonly steps: string[];
  public readonly stepCurrent: number;

  constructor(request: LendRequest | TradeRequest, status: RequestStatus) {
    this.request = request;
    this.status = status;
    this.steps = [
      "Initializing loan",
      "Detecting token allowance",
      "Prompting token allowance",
      "Waiting for token allowance",
      "Submitting loan",
    ];
    this.stepCurrent = 1;
  }
}
