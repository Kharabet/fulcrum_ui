import React, { Component } from "react";
import { Provider } from "web3/providers";

export interface IOnChainIndicatorParams {
  provider: Provider | null;
  onNetworkConnect: () => void;
}

export class OnChainIndicator extends Component<IOnChainIndicatorParams> {
  public render() {
    const dotStyle = this.props.provider ? "on-chain-indicator__dot--online" : "on-chain-indicator__dot--offline";
    const indicatorText = this.props.provider ? "Online" : "Connect wallet";

    return (
      <div className="on-chain-indicator" onClick={this.props.onNetworkConnect}>
        <button className="on-chain-indicator__container">
          <span className="on-chain-indicator__title">
            <span className={`on-chain-indicator__dot ${dotStyle}`}>&#x25CF;</span>
            {indicatorText}
          </span>
        </button>
      </div>
    );
  }
}
