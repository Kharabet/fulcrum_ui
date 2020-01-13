import React, { Component, ReactNode } from "react";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { FulcrumProvider } from "../services/FulcrumProvider";

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
        <div className="task-list-item-details">{this.props.task.steps.map((e, i) => this.renderSingleStep(e, i))}</div>
      </React.Fragment>
    );
  }

  public renderSingleStep = (title: string, index: number): ReactNode => {
    const titleStateClassName =
      index + 1 === this.props.task.stepCurrent
        ? this.props.task.status === RequestStatus.IN_PROGRESS
          ? "task-list-item-details__step-title--in-progress"
          : "task-list-item-details__step-title--failed"
        : index < this.props.task.stepCurrent
        ? "task-list-item-details__step-title--done"
        : "task-list-item-details__step-title--future";

    const stepStateClassName =
      index + 1 === this.props.task.stepCurrent
        ? this.props.task.status === RequestStatus.FAILED || this.props.task.status === RequestStatus.FAILED_SKIPGAS
          ? "task-list-item-details__step--failed"
          : "task-list-item-details__step--normal"
        : "task-list-item-details__step--normal";

    return (
      <div key={index} className={`task-list-item-details__step ${stepStateClassName}`}>
        <div className="task-list-item-details__step-img-container">{this.renderStepProgressIndicator(index)}</div>
        <div className={`task-list-item-details__step-title ${titleStateClassName}`}>{title}</div>
        {this.renderTaskFailedStateActions(index)}
      </div>
    );
  };

  public renderStepProgressIndicator = (index: number): ReactNode => {
    const tx = this.props.task.txHash || ``;

    const titleStateClassName =
      index + 1 === this.props.task.stepCurrent
        ? this.props.task.status === RequestStatus.IN_PROGRESS
          ? "task-list-item-details__step-img--in-progress"
          : "task-list-item-details__step-img--failed"
        : index < this.props.task.stepCurrent
        ? "task-list-item-details__step-img--done"
        : "task-list-item-details__step-img--future";

    return tx && FulcrumProvider.Instance.web3ProviderSettings ?
      (
        <a
          className={`task-list-item-details__step-img ${titleStateClassName}`}
          href={`${FulcrumProvider.Instance.web3ProviderSettings!.etherscanURL}tx/${tx}`}
          target="_blank"
          rel="noopener noreferrer"
        />
      ) : <div className={`task-list-item-details__step-img ${titleStateClassName}`} />;
  };

  public renderTaskFailedStateActions = (index: number): ReactNode => {
    const tx = this.props.task.txHash || ``;

    let forceRetry = false;
    let errorMsg;
    if (this.props.task.error) {
      if (this.props.task.error.message) {
        errorMsg = this.props.task.error.message;
      } else if (typeof this.props.task.error === "string") {
        errorMsg = this.props.task.error;
      }
      
      if (errorMsg) {
        if (errorMsg.includes(`Request for method "eth_estimateGas" not handled by any subprovider`) ||
            errorMsg.includes(`always failing transaction`)) {
          errorMsg = "The transaction seems like it will fail. You can submit the transaction anyway, or cancel.";
          forceRetry = true;
        } else if (errorMsg.includes("Reverted by EVM")) {
          errorMsg = "The transaction failed. Etherscan link:";
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

    return (this.props.task.status === RequestStatus.FAILED || this.props.task.status === RequestStatus.FAILED_SKIPGAS) && index + 1 === this.props.task.stepCurrent ? (
      <React.Fragment>
        {errorMsg ? (
            <React.Fragment>
              <div className="task-list-item-details__step-title--failed-txn">
                {errorMsg}
              </div>
              {tx && FulcrumProvider.Instance.web3ProviderSettings ? (
                <a
                  className="task-list-item-details__step-title--failed-txn"
                  href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}tx/${tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx.slice(0, 20)}...{tx.slice(tx.length - 18, tx.length)}
                </a>
              ) : ``}
            </React.Fragment>
          ) : ``}
        <div className="task-list-item-details__step-actions">
          <button
            className="task-list-item-details__step-action-btn task-list-item-details__step-action-btn--cancel"
            onClick={this.onTaskCancel}
          >
            Cancel
          </button>
          {forceRetry ? (
            <button
              className="task-list-item-details__step-action-btn task-list-item-details__step-action-btn--try-again"
              onClick={this.onForceRetry}
            >
              Submit
            </button>
          ) : (
            <button
              className="task-list-item-details__step-action-btn task-list-item-details__step-action-btn--try-again"
              onClick={this.onTaskRetry}
            >
              Try again
            </button>
          )}
        </div>
      </React.Fragment>
    ) : null;
  };

  private onTaskRetry = async () => {
    await FulcrumProvider.Instance.onTaskRetry(this.props.task, false);
  };

  private onForceRetry = async () => {
    await FulcrumProvider.Instance.onTaskRetry(this.props.task, true);
  };

  private onTaskCancel = async () => {
    await FulcrumProvider.Instance.onTaskCancel(this.props.task);
  };
}
