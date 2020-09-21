import React, { Component } from "react";

import { RequestTask } from "../domain/RequestTask";
import { StakingProvider } from "../services/StakingProvider";
import { StakingProviderEvents } from "../services/events/StakingProviderEvents";

export interface ITitle {
  message: string;
  isWarning: boolean;
}

export interface ITxLoaderStepProps {
}

export interface ITxLoaderStepState {
  requestTask: RequestTask | undefined;
  title: ITitle | null;
}

export class TxLoaderStep extends Component<ITxLoaderStepProps, ITxLoaderStepState> {
  constructor(props: ITxLoaderStepProps) {
    super(props);

    this.state = {
      requestTask: StakingProvider.Instance.getRequestTask(),
      title: { message: "Loading", isWarning: false }
    };

    StakingProvider.Instance.eventEmitter.on(StakingProviderEvents.TaskChanged, this.onTaskChanged);
    this.stepDiv = React.createRef();
    this._isMounted = false;
  }

  private _isMounted: boolean;

  private stepDiv: React.RefObject<HTMLDivElement>;

  public componentDidMount(): void {
    this._isMounted = true;

    this.setState({ ...this.state, title: this.getTitle(this.state.requestTask) });
  }


  public componentWillUnmount(): void {
    this._isMounted = false;

    StakingProvider.Instance.eventEmitter.off(StakingProviderEvents.TaskChanged, this.onTaskChanged);

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
          ? <a href={`${StakingProvider.Instance.web3ProviderSettings!.etherscanURL}tx/${this.state.requestTask!.txHash}`} target="_blank" rel="noopener noreferrer">
            <span ref={this.stepDiv} className={`transaction-step ${this.state.title.isWarning ? "warning" : ""}`}>
              {this.state.title.message}
            </span>
          </a>
          :
          <span ref={this.stepDiv} className={`transaction-step ${this.state.title.isWarning ? "warning" : ""}`}>
            {this.state.title.message}
          </span>
        }
      </React.Fragment >
    )
  }

  public onTaskChanged = async () => {
    const task = StakingProvider.Instance.getRequestTask();
    let title = this.getTitle(this.state.requestTask);
    if (!title && this.state.requestTask?.status === "Done")
      title = { message: "Updating data", isWarning: false };

    this._isMounted && this.setState({
      ...this.state,
      title: title
    });

    window.setTimeout(async () => {
      await this._isMounted && this.setState({
        ...this.state,
        requestTask: task
      });
    }, 500)
  };
}
