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
  quantityDots: number,
  sizeDots: string,
  isOverlay: boolean,  
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
    if (this.state.requestTask === undefined) return null;
    // return this.state.isProgressDetailsModalOpen === false ? null : (
    console.log(this.state.requestTask);
    let title = this.state.requestTask.steps.find((s, i) => i + 1 === this.state.requestTask!.stepCurrent)
    if (!title)
      title = this.state.requestTask.status;


    let errorMsg;
    if (this.state.requestTask.error) {
      if (this.state.requestTask.error.message) {
        errorMsg = this.state.requestTask.error.message;
      } else if (typeof this.state.requestTask.error === "string") {
        errorMsg = this.state.requestTask.error;
      }

      if (errorMsg) {
        if (errorMsg.includes(`Request for method "eth_estimateGas" not handled by any subprovider`) ||
          errorMsg.includes(`always failing transaction`)) {
          errorMsg = "The transaction seems like it will fail. You can submit the transaction anyway, or cancel.";
        } else if (errorMsg.includes("Reverted by EVM")) {
          errorMsg = "The transaction failed. Etherscan link:";
        } else if (errorMsg.includes("MetaMask Tx Signature: User denied transaction signature.")) {
          errorMsg = "You didn't confirm in MetaMask. Please try again.";
        } else if (errorMsg.includes("User denied account authorization.")) {
          errorMsg = "You didn't authorize MetaMask. Please try again.";
        } else if (errorMsg.includes("Transaction rejected")) {
          errorMsg = "You didn't confirm in Gnosis Safe. Please try again.";
        } else {
          errorMsg = this.state.requestTask.status;
        }
      }
    }
    if (errorMsg)
      title = errorMsg;
    return <React.Fragment>
      {/*<ProgressBar requestTask={this.state.requestTask[0]} onViewMore={this.onViewMore} />*/}
      <Loader {...this.props} title={title} isWarningTitle={!!errorMsg} />
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
