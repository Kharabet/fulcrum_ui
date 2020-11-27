import { EventEmitter } from 'events'
import { RequestTask } from '../domain/RequestTask'
import { TasksQueueEvents } from './events/TasksQueueEvents'

export class TasksQueue {
  public static Instance: TasksQueue

  private readonly requestTasks: RequestTask[]
  private readonly eventEmitter: EventEmitter

  constructor() {
    // init
    this.eventEmitter = new EventEmitter()
    this.requestTasks = []

    // singleton
    if (!TasksQueue.Instance) {
      TasksQueue.Instance = this
    }

    return TasksQueue.Instance
  }

  public on(event: TasksQueueEvents, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener)
  }

  public off(event: TasksQueueEvents, listener: (...args: any[]) => void) {
    this.eventEmitter.off(event, listener)
  }

  public enqueue(task: RequestTask): void {
    task.setEventEmitter(this.eventEmitter)
    this.requestTasks.push(task)

    this.eventEmitter.emit(TasksQueueEvents.Enqueued, task)
    this.eventEmitter.emit(TasksQueueEvents.QueueChanged)
  }

  public dequeue(requestId: number) {
    const index = this.getIndex(requestId)
    const result = index > -1 ? this.requestTasks.splice(index, 1) : null

    this.eventEmitter.emit(TasksQueueEvents.Dequeued, result)
    this.eventEmitter.emit(TasksQueueEvents.QueueChanged)

    return result
  }

  public peek(requestId: number): RequestTask | null {
    const index = this.getIndex(requestId)
    return this.any() && index > -1 ? this.requestTasks[index] : null
  }

  public any(): boolean {
    return this.requestTasks.length > 0
  }

  public getIndex(requestId: number): number {
    return this.requestTasks.findIndex((task) => task.request.id === requestId)
  }

  public getTasksList() {
    return [...this.requestTasks]
  }
}

// tslint:disable-next-line:no-unused-expression
new TasksQueue()
