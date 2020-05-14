import React, { Component } from "react";
import { RequestTask } from "../domain/RequestTask";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TasksQueueEvents } from "../services/events/TasksQueueEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { TasksQueue } from "../services/TasksQueue";
import { ProgressDetails } from "./ProgressDetails";
import { Loader } from "./Loader";

export interface IProgressFragmentProps {
  taskId: number;
}

export interface IProgressFragmentState {
  isProgressDetailsModalOpen: boolean;
  counterProgressDetails: number;
  requestTask: RequestTask | undefined;
}

export class ProgressFragment extends Component<IProgressFragmentProps, IProgressFragmentState> {
  constructor(props: IProgressFragmentProps) {
    super(props);

    this.state = {
      isProgressDetailsModalOpen: false,
      counterProgressDetails: 0,
      requestTask: TasksQueue.Instance.getTasksList().find(t => t.request.id === this.props.taskId)
    };

    TasksQueue.Instance.on(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged);
    TasksQueue.Instance.on(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged);

    // TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    // TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
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

    // TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    // TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }

  public render() {
    // return this.state.isProgressDetailsModalOpen === false ? null : (
      console.log(this.state.requestTask)
    return <React.Fragment>
      {/*<ProgressBar requestTask={this.state.requestTask[0]} onViewMore={this.onViewMore} />*/}
      {this.state.requestTask !== undefined && <Loader quantityDots={4} sizeDots={'middle'} title={this.state.requestTask.steps.find((s, i) => i + 1 === this.state.requestTask!.stepCurrent)!} isOverlay={true} />}
    </React.Fragment>
    // );
  }

  public onViewMore = () => {
    this.setState({ ...this.state, isProgressDetailsModalOpen: true });
  };

  public onRequestClose = () => {
    this.setState({ ...this.state, isProgressDetailsModalOpen: false });
  };

  public onAskToOpenProgressDlg = () => {
    // this.setState(p => ({ ...this.state, counterProgressDetails: this.state.counterProgressDetails + 1, isProgressDetailsModalOpen: true }));
    this.setState({ ...this.state, isProgressDetailsModalOpen: true });
  };

  public onAskToCloseProgressDlg = () => {
    this.setState({ ...this.state, isProgressDetailsModalOpen: false });

    // this.setState(p => ({ ...this.state, counterProgressDetails: this.state.counterProgressDetails - 1, isProgressDetailsModalOpen: p.counterProgressDetails === 1 ? false : p.isProgressDetailsModalOpen }));
  };

  public onTasksQueueChanged = () => {
    const tasks = TasksQueue.Instance.getTasksList().find(t => t.request.id === this.props.taskId);

    // if (this.state.requestTask.length === 0 && tasks.length > 0) {
    //   this.scrollDownAndShift();
    // } else if (this.state.requestTask.length > 0 && tasks.length === 0) {
    //   this.scrollUpAndShift();
    // }

    this.setState({
      ...this.state,
      requestTask: tasks
    });
  };
}
