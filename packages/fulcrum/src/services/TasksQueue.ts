import { EventEmitter } from "events";
import { RequestTask } from "../domain/RequestTask";
import { TasksQueueEvents } from "./events/TasksQueueEvents";

export class TasksQueue {
  public static Instance: TasksQueue;

  private readonly requestTasks: RequestTask[];
  private readonly eventEmitter: EventEmitter;

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();
    this.requestTasks = [];

    // singleton
    if (!TasksQueue.Instance) {
      TasksQueue.Instance = this;
    }

    return TasksQueue.Instance;
  }

  public on(event: TasksQueueEvents, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  };

  public off(event: TasksQueueEvents, listener: (...args: any[]) => void) {
    this.eventEmitter.off(event, listener);
  };

  public enqueue(task: RequestTask): void {
    task.setEventEmitter(this.eventEmitter);
    this.requestTasks.push(task);

    this.eventEmitter.emit(TasksQueueEvents.Enqueued, task);
    this.eventEmitter.emit(TasksQueueEvents.QueueChanged);
  }

  public dequeue(task: RequestTask): void {
    for(let i = 0; i < this.requestTasks.length; i++) {
      if (this.requestTasks[i].request.id === task.request.id) {
        this.requestTasks.splice(i, 1);
        this.eventEmitter.emit(TasksQueueEvents.Dequeued, this.requestTasks);
        this.eventEmitter.emit(TasksQueueEvents.QueueChanged);
        break;
      }
    }
  }

  public peek(): RequestTask | null {
    return this.any() ? this.requestTasks[this.requestTasks.length-1] : null;
  }

  public any(): boolean {
    return this.requestTasks.length > 0;
  }

  public allProcessing(): boolean {
    return this.requestTasks.length > 0 && this.requestTasks.filter(t => t.isProcessing).length == this.requestTasks.length;
  }

  public getTasksList() {
    return [...this.requestTasks];
  }
}

// tslint:disable-next-line:no-unused-expression
new TasksQueue();
