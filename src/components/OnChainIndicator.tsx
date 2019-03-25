import React, { Component } from "react";
import Web3 from "web3";

export interface IOnChainIndicatorParams {
  web3: Web3 | null;
  onNetworkConnect: () => void;
}

export class OnChainIndicator extends Component<IOnChainIndicatorParams> {
  public render() {
    const dotStyle = this.props.web3 ? "on-chain-indicator__dot--online" : "on-chain-indicator__dot--offline";
    const indicatorText = this.props.web3 ? "Online" : "Connect wallet";

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
