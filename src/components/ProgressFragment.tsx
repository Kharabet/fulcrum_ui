import React, { Component } from "react";
import Modal from "react-modal";
import { RequestTask } from "../domain/RequestTask";
import { TasksQueueEvents } from "../services/events/TasksQueueEvents";
import TasksQueue from "../services/TasksQueue";
import { ProgressBar } from "./ProgressBar";
import { ProgressDetails } from "./ProgressDetails";

export interface IProgressFragmentState {
  isProgressDetailsModalOpen: boolean;
  requestTasks: RequestTask[];
}

export class ProgressFragment extends Component<any, IProgressFragmentState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isProgressDetailsModalOpen: false,
      requestTasks: TasksQueue.getTasksList()
    };

    TasksQueue.on(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged);
    TasksQueue.on(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged);
  }

  public render() {
    return this.state.requestTasks.length === 0 ? null : (
      <React.Fragment>
        <ProgressBar requestTask={this.state.requestTasks[0]} onViewMore={this.onViewMore} />
        <Modal
          isOpen={this.state.isProgressDetailsModalOpen}
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

  public onTasksQueueChanged = () => {
    this.setState({ ...this.state, requestTasks: TasksQueue.getTasksList() });
  };
}
