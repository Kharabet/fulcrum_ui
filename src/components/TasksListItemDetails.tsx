import React, { Component, ReactNode } from "react";
import { RequestTask } from "../domain/RequestTask";

export interface ITasksListItemDetailsProps {
  task: RequestTask;
}

export class TasksListItemDetails extends Component<ITasksListItemDetailsProps> {
  public render() {
    if (this.props.task.steps.length < 2) {
      return null;
    }

    return (
      <div className="task-list-item-details">
        {this.props.task.steps.map((e, i) => this.renderSingleStep(e, i))}
      </div>
    );
  }

  public renderSingleStep = (title: string, index: number): ReactNode => {
    const titleStateClassName = index === this.props.task.stepCurrent
      ? "task-list-item-details__step-title--in-progress"
      : index < this.props.task.stepCurrent
        ? "task-list-item-details__step-title--done"
        : "task-list-item-details__step-title--future";

    return (
      <div key={index} className="task-list-item-details__step">
        <div className="task-list-item-details__step-img-container">
          { /**/ } &nbsp;
        </div>
        <div className={`task-list-item-details__step-title ${titleStateClassName}`}>{title}</div>
      </div>
    );
  }
}
