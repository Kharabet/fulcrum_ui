import React, { Component } from "react";
import { RequestTask } from "../domain/RequestTask";
import { TasksList } from "./TasksList";

export interface IProgressFormProps {
  tasks: RequestTask[];
  onRequestClose: () => void;
}

export class ProgressDetails extends Component<IProgressFormProps> {
  public render() {
    return (
      <div className="progress-details">
        <TasksList tasks={this.props.tasks} />
        <div className="progress-details__actions-container">
          <button className="progress-details__close-btn" onClick={this.props.onRequestClose}>Close</button>
        </div>
      </div>
    );
  }
}
