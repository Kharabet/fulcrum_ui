import React, { Component } from "react";

export interface IWalletAddressHintProps {
  walletAddress: string;

  onSelectNewWalletAddress?: () => void;
  onClearWalletAddress?: () => void;
}

export class WalletAddressHint extends Component<IWalletAddressHintProps> {
  public render() {
    return (
      <div className="wallet-address-hint">
        <div className="wallet-address-hint__address-container">
          <span className="wallet-address-hint__address-container-title">Wallet address:</span>
          <span className="wallet-address-hint__address-container-value">{" " + this.props.walletAddress}</span>
        </div>
        <div className="wallet-address-hint__actions-container">
          <div className="wallet-address-hint__action" onClick={this.props.onSelectNewWalletAddress}>
            Enter another address
          </div>
          {/*<div className="wallet-address-hint__action" onClick={this.props.onClearWalletAddress}>
            Clear wallet address
          </div>*/}
        </div>
      </div>
    );
  }
}
