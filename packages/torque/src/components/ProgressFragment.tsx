import React, { Component } from "react";
import { RequestTask } from "../domain/RequestTask";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TasksQueueEvents } from "../services/events/TasksQueueEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { TasksQueue } from "../services/TasksQueue";
import { ProgressDetails } from "./ProgressDetails";

export interface IProgressFragmentState {
  isProgressDetailsModalOpen: boolean;
  counterProgressDetails: number;
  requestTasks: RequestTask[];
}

export class ProgressFragment extends Component<any, IProgressFragmentState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isProgressDetailsModalOpen: false,
      counterProgressDetails: 0,
      requestTasks: TasksQueue.Instance.getTasksList()
    };

    TasksQueue.Instance.on(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged);
    TasksQueue.Instance.on(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged);

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }

  public scrollDownAndShift = () => {
    window.scrollBy(0, 5 * parseFloat(getComputedStyle(document.documentElement).fontSize!));
  }

  public scrollUpAndShift = () => {
    window.scrollBy(0, -5 * parseFloat(getComputedStyle(document.documentElement).fontSize!));
  }

  public componentWillUnmount(): void {
    TasksQueue.Instance.off(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged);
    TasksQueue.Instance.off(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged);

    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }

  public render() {
    return this.state.requestTasks.length === 0 ? null : (
      <React.Fragment>
        {/*<ProgressBar requestTask={this.state.requestTasks[0]} onViewMore={this.onViewMore} />*/}
        <ProgressDetails tasks={this.state.requestTasks} onRequestClose={this.onRequestClose} />
      </React.Fragment>
    );
  }

  public onViewMore = () => {
    this.setState({ ...this.state, isProgressDetailsModalOpen: true });
  };

  public onRequestClose = () => {
    this.setState({ ...this.state, isProgressDetailsModalOpen: false });
  };

  public onAskToOpenProgressDlg = () => {
    this.setState(p => ({ ...this.state, counterProgressDetails: this.state.counterProgressDetails + 1, isProgressDetailsModalOpen: true }));
  };

  public onAskToCloseProgressDlg = () => {
    this.setState(p => ({ ...this.state, counterProgressDetails: this.state.counterProgressDetails - 1, isProgressDetailsModalOpen: p.counterProgressDetails === 1 ? false : p.isProgressDetailsModalOpen }));
  };

  public onTasksQueueChanged = () => {
    const tasks = TasksQueue.Instance.getTasksList();

    if (this.state.requestTasks.length === 0 && tasks.length > 0) {
      this.scrollDownAndShift();
    } else if (this.state.requestTasks.length > 0 && tasks.length === 0) {
      this.scrollUpAndShift();
    }

    this.setState({
      ...this.state,
      requestTasks: tasks
    });
  };
}
