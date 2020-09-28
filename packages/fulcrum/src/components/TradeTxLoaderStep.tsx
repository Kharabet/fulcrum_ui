import React, { Component } from "react";
import { RequestTask } from "../domain/RequestTask";
import { TasksQueueEvents } from "../services/events/TasksQueueEvents";
import { TasksQueue } from "../services/TasksQueue";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface ITitle {
  message: string;
  isWarning: boolean;
}

export interface ITradeTxLoaderStepProps {
  taskId: number;
}

export interface ITradeTxLoaderStepState {
  requestTask: RequestTask | undefined;
  complete: boolean;
  title: ITitle | null;
}

export class TradeTxLoaderStep extends Component<ITradeTxLoaderStepProps, ITradeTxLoaderStepState> {
  constructor(props: ITradeTxLoaderStepProps) {
    super(props);

    this.state = {
      requestTask: TasksQueue.Instance.getTasksList().find(t => t.request.id === this.props.taskId),
      title: null,
      complete: false
    };

    TasksQueue.Instance.on(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged);
    TasksQueue.Instance.on(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged);
    this.stepDiv = React.createRef();
    this._isMounted = false;
  }

  private _isMounted: boolean;

  private stepDiv: React.RefObject<HTMLDivElement>;

  public componentDidMount(): void {
    this._isMounted = true;

    this.setState({ ...this.state, title: this.getTitle(this.state.requestTask) });

    const div = this.stepDiv.current;
    if (!div) return;
    div.classList.remove("animation-in");
    div.classList.add("animation-in");
  }

  public componentDidUpdate(prevProps: Readonly<ITradeTxLoaderStepProps>, prevState: Readonly<ITradeTxLoaderStepState>): void {

    const div = this.stepDiv.current;
    if (!div) return;
    if (prevState.requestTask && this.state.requestTask && this.getTitle(prevState.requestTask) === this.getTitle(this.state.requestTask)) return;
    div.classList.remove("animation-out");
    div.classList.remove("animation-in");
    div.classList.add("animation-in");
  }

  public componentWillUnmount(): void {
    this._isMounted = false;

    const div = this.stepDiv.current;
    if (div) {
      div.classList.remove("animation-out");
      div.classList.add("animation-out");
    }

    TasksQueue.Instance.off(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged);
    TasksQueue.Instance.off(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged);
    if (this.state.requestTask)
      FulcrumProvider.Instance.onTaskCancel(this.state.requestTask);

  }


  public getTitle = (requestTask: RequestTask | undefined) => {
    if (requestTask === undefined) return null;
    let title = requestTask.steps.find((s, i) => i + 1 === requestTask!.stepCurrent)
    if (!title)
      title = requestTask.status;


    let errorMsg = "";
    if (requestTask.error) {
      if (requestTask.error.message) {
        errorMsg = requestTask.error.message;
      } else if (typeof requestTask.error === "string") {
        errorMsg = requestTask.error;
      }

      if (errorMsg) {
        if (errorMsg.includes(`Request for method "eth_estimateGas" not handled by any subprovider`) ||
          errorMsg.includes(`always failing transaction`)) {
          errorMsg = "The transaction seems like it will fail. Change request parameters and try agian, please."; //The transaction seems like it will fail. You can submit the transaction anyway, or cancel.
        } else if (errorMsg.includes("Reverted by EVM")) {
          errorMsg = "The transaction failed. Reverted by EVM"; //. Etherscan link:";
        } else if (errorMsg.includes("MetaMask Tx Signature: User denied transaction signature.")) {
          errorMsg = "You didn't confirm in MetaMask. Please try again.";
        } else if (errorMsg.includes("User denied account authorization.")) {
          errorMsg = "You didn't authorize MetaMask. Please try again.";
        } else if (errorMsg.includes("Transaction rejected")) {
          errorMsg = "You didn't confirm in Gnosis Safe. Please try again.";
        } else {
          errorMsg = requestTask.status;
        }
      }
    }
    if (errorMsg)
      title = errorMsg;

    return { message: title, isWarning: errorMsg !== "" }
  }

  public render() {

    if (!this.state.title) return null;
    return (
      <React.Fragment>
        {this.state.requestTask && this.state.requestTask.txHash
          ? <a href={`${FulcrumProvider.Instance.web3ProviderSettings!.etherscanURL}tx/${this.state.requestTask!.txHash}`} target="_blank" rel="noopener noreferrer">
            <div ref={this.stepDiv} className={`trade-transaction-step ${this.state.title.isWarning ? "warning" : ""}`}>
              {this.state.title.message}
            </div>
          </a>
          : <div ref={this.stepDiv} className={`trade-transaction-step ${this.state.title.isWarning ? "warning" : ""}`}>
            {this.state.title.message}
          </div>
        }
      </React.Fragment>
    )
  }

  public onTasksQueueChanged = async () => {
    const taskList = TasksQueue.Instance.getTasksList();
    const task = taskList.find(t => t.request.id === this.props.taskId);
    let title = this.getTitle(task);
    if (!title && this.state.requestTask?.status == "Done")
      title = { message: "Updating data", isWarning: false };

    this._isMounted && this.setState({
      ...this.state,
      title: title
    });

    const div = this.stepDiv.current;
    //if (div && task && this.state.requestTask && this.getTitle(task) !== this.getTitle(this.state.requestTask)) {
    if (div && this.state.requestTask && this.getTitle(task) !== this.getTitle(this.state.requestTask)) {
      div.classList.remove("animation-in");
      div.classList.remove("animation-out");
      div.classList.add("animation-out");
    }
    window.setTimeout(async () => {
      await this._isMounted && this.setState({
        ...this.state,
        requestTask: task
      });
    }, 500)
  };
}
