import React, { Component, ReactNode } from "react";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { FulcrumProvider} from "../services/FulcrumProvider";
import { TokenSpinner } from "./TokenSpinner";

export interface IProgressBarProps {
  requestTask: RequestTask;

  onViewMore: () => void;
}

export class ProgressBar extends Component<IProgressBarProps> {
  public render() {
    return (
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-bar__info-container">
            <TokenSpinner asset={this.props.requestTask.request.asset} />
            <div className="progress-bar__info">
              <div className="progress-bar__title">{this.props.requestTask.steps[this.props.requestTask.stepCurrent-1]}</div>
              <div className="progress-bar__step">
                Step {this.props.requestTask.stepCurrent} of {this.props.requestTask.steps.length}
              </div>
            </div>
          </div>
          <div className="progress-bar__actions-container">
            {this.renderTaskFailedStateActions()}
            <button className="progress-bar__btn progress-bar__btn--more" onClick={this.props.onViewMore}>
              View more
            </button>
          </div>
        </div>
      </div>
    );
  }

  public renderTaskFailedStateActions = (): ReactNode => {
    
    let forceRetry = false;
    let errorMsg;
    if (this.props.requestTask.error) {
      if (this.props.requestTask.error.message) {
        errorMsg = this.props.requestTask.error.message;
      } else if (typeof this.props.requestTask.error === "string") {
        errorMsg = this.props.requestTask.error;
      }

      if (errorMsg) {
        if (errorMsg.includes(`Request for method "eth_estimateGas" not handled by any subprovider`) ||
            errorMsg.includes(`always failing transaction`)) {
          errorMsg = "The transaction seems like it will fail. You can submit the transaction anyway, or cancel.";
          forceRetry = true;
        } else if (errorMsg.includes("Reverted by EVM")) {
          errorMsg = "The transaction failed. Click View More for details.";
        } else if (errorMsg.includes("MetaMask Tx Signature: User denied transaction signature.")) {
          errorMsg = "You didn't confirm in MetaMask. Please try again.";
        } else if (errorMsg.includes("User denied account authorization.")) {
          errorMsg = "You didn't authorize MetaMask. Please try again.";
        } else if (errorMsg.includes("Transaction rejected")) {
          errorMsg = "You didn't confirm in Gnosis Safe. Please try again.";
        } else {
          errorMsg = "";
        }
      }
    }

    return this.props.requestTask.status === RequestStatus.FAILED || this.props.requestTask.status === RequestStatus.FAILED_SKIPGAS ? (
      <React.Fragment>
        {errorMsg ? (
          <React.Fragment>
            <div className="progress-bar__error-message">
              {errorMsg}
            </div>
          </React.Fragment>
        ) : ``}
        {forceRetry ? (
          <button className="progress-bar__btn progress-bar__btn--try-again" onClick={this.onForceRetry}>
            Submit
          </button>
        ) : (
          <button className="progress-bar__btn progress-bar__btn--try-again" onClick={this.onTaskRetry}>
            Try again
          </button>
        )}
        <button className="progress-bar__btn progress-bar__btn--cancel" onClick={this.onTaskCancel}>
          Cancel
        </button>
      </React.Fragment>
    ) : null;
  };

  private onTaskRetry = async () => {
    await FulcrumProvider.Instance.onTaskRetry(this.props.requestTask, false);
  };

  private onForceRetry = async () => {
    await FulcrumProvider.Instance.onTaskRetry(this.props.requestTask, true);
  };

  private onTaskCancel = async () => {
    await FulcrumProvider.Instance.onTaskCancel(this.props.requestTask);
  };
}
