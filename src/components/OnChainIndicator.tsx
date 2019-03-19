import React, { Component } from "react";

export interface IOnChainIndicatorParams {
  provider: any;
  onClick: () => void;
}

export class OnChainIndicator extends Component {
  render() {
    return (
      <div className="on-chain-indicator" onClick={this.onClick}>
        <div className="on-chain-indicator__container">
          <span className="on-chain-indicator__title">
            <span className="on-chain-indicator__dot">&#x25CF;</span>
            Rinkeby Network
          </span>
        </div>
      </div>
    );
  }

  onClick = () => {
    alert("connect to network");
  }
}
