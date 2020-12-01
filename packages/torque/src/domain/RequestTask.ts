import { EventEmitter } from 'events'
import { TasksQueueEvents } from '../services/events/TasksQueueEvents'
import { BorrowRequest } from './BorrowRequest'
import { ExtendLoanRequest } from './ExtendLoanRequest'
import { ManageCollateralRequest } from './ManageCollateralRequest'
import { RepayLoanRequest } from './RepayLoanRequest'
import { RequestStatus } from './RequestStatus'
import { RolloverRequest } from './RolloverRequest'


export class RequestTask {
  private eventEmitter: EventEmitter | null = null

  public readonly request:
    | BorrowRequest
    | ManageCollateralRequest
    | ExtendLoanRequest
    | RepayLoanRequest
    | RolloverRequest
  public status: RequestStatus
  public steps: string[]
  public stepCurrent: number
  public txHash: string | null
  public error: Error | null

  constructor(
    request: BorrowRequest | ManageCollateralRequest | ExtendLoanRequest | RepayLoanRequest | RolloverRequest
  ) {
    this.request = request
    this.status = RequestStatus.AWAITING
    this.steps = ['Preparing processing...']
    this.stepCurrent = 1
    this.txHash = null
    this.error = null
  }

  public setEventEmitter(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter
  }

  public setTxHash(txHash: string) {
    this.txHash = txHash

    if (this.eventEmitter) {
      this.eventEmitter.emit(TasksQueueEvents.TaskChanged)
    }
  }

  public processingStart(steps: string[]) {
    while (this.steps.length > 0) {
      this.steps.splice(0, 1)
    }
    steps.forEach((e) => this.steps.push(e))
    this.status = RequestStatus.IN_PROGRESS
    this.stepCurrent = 1
    console.log('step ', this.stepCurrent)

    if (this.eventEmitter) {
      this.eventEmitter.emit(TasksQueueEvents.TaskChanged)
    }
  }

  public processingStepNext() {
    this.stepCurrent++
    console.log('step ', this.stepCurrent)
    if (this.eventEmitter) {
      this.eventEmitter.emit(TasksQueueEvents.TaskChanged)
    }
  }

  public processingEnd(isSuccessful: boolean, skipGas: boolean, error: Error | null) {
    this.error = error
    this.status = isSuccessful
      ? RequestStatus.DONE
      : skipGas
      ? RequestStatus.FAILED_SKIPGAS
      : RequestStatus.FAILED

    if (this.eventEmitter) {
      this.eventEmitter.emit(TasksQueueEvents.TaskChanged)
    }
  }
}
