import React, { Component } from "react";
import { RequestTask } from "../domain/RequestTask";
import { TokenSpinner } from "./TokenSpinner";

export interface IProgressBarProps {
  requestTask: RequestTask;

  onViewMore: () => void;
}

export class ProgressBar extends Component<IProgressBarProps> {
  public render() {
    return (
      <div className="progress-bar">
        <div className="progress-bar__container">
          <TokenSpinner  asset={this.props.requestTask.request.asset} />
          <div className="progress-bar__info">
            <div className="progress-bar__title">Submitting request</div>
            <div className="progress-bar__step">Step {this.props.requestTask.stepCurrent} of {this.props.requestTask.steps.length}</div>
          </div>
          <button className="progress-bar__btn-more" onClick={this.props.onViewMore}>View more</button>
        </div>
      </div>
    );
  }
}
