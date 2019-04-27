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
      <React.Fragment>
        <div className="task-list-item-delimiter-container">
          <hr className="task-list-item-delimiter" />
        </div>
        <div className="task-list-item-details">
          {this.props.task.steps.map((e, i) => this.renderSingleStep(e, i))}
        </div>
      </React.Fragment>
    );
  }

  public renderSingleStep = (title: string, index: number): ReactNode => {
    const titleStateClassName =
      index + 1 === this.props.task.stepCurrent
        ? "task-list-item-details__step-title--in-progress"
        : index < this.props.task.stepCurrent
          ? "task-list-item-details__step-title--done"
          : "task-list-item-details__step-title--future";

    return (
      <div key={index} className="task-list-item-details__step">
        <div className="task-list-item-details__step-img-container">
          {this.renderStepProgressIndicator(index)}
        </div>
        <div className={`task-list-item-details__step-title ${titleStateClassName}`}>{title}</div>
      </div>
    );
  };

  public renderStepProgressIndicator = (index: number): ReactNode => {
    const titleStateClassName =
      index + 1 === this.props.task.stepCurrent
        ? "task-list-item-details__step-img--in-progress"
        : index < this.props.task.stepCurrent
          ? "task-list-item-details__step-img--done"
          : "task-list-item-details__step-img--future";

    return <div className={`task-list-item-details__step-img ${titleStateClassName}`} />;
  }
}
