import React, { Component } from "react";
import Modal from "react-modal";
import { RequestTask } from "../domain/RequestTask";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { TasksQueueEvents } from "../services/events/TasksQueueEvents";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { TasksQueue } from "../services/TasksQueue";
import { ProgressBar } from "./ProgressBar";
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
      isProgressDetailsModalOpen: true,
      counterProgressDetails: 0,
      requestTasks: TasksQueue.Instance.getTasksList()
    };

    TasksQueue.Instance.on(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged);
    TasksQueue.Instance.on(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged);

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }

  public componentWillUnmount(): void {
    TasksQueue.Instance.off(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged);
    TasksQueue.Instance.off(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged);

    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }

  public render() {
    return this.state.requestTasks.length === 0 ? null : (
      <React.Fragment>
        <ProgressBar requestTask={this.state.requestTasks[0]} onViewMore={this.onViewMore} />
        <Modal
          isOpen={this.state.isProgressDetailsModalOpen && this.state.counterProgressDetails > 0}
          onRequestClose={this.onRequestClose}
          className="modal-content-div"
          overlayClassName="modal-overlay-div"
        >
          <ProgressDetails tasks={this.state.requestTasks} onRequestClose={this.onRequestClose} />
        </Modal>
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
    this.setState({ ...this.state, counterProgressDetails: this.state.counterProgressDetails + 1 });
  };

  public onAskToCloseProgressDlg = () => {
    this.setState({ ...this.state, counterProgressDetails: this.state.counterProgressDetails - 1 });
  };

  public onTasksQueueChanged = () => {
    const tasks = TasksQueue.Instance.getTasksList();
    this.setState({
      ...this.state,
      requestTasks: tasks
    });
  };
}
