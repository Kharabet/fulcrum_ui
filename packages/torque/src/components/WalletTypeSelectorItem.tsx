import React, { Component } from "react";
import { WalletType } from "../domain/WalletType";
import { DotsBar } from "./DotsBar";

export interface IWalletTypeSelectorItemProps {
  walletType: WalletType;

  onSelectWalletType?: (walletType: WalletType) => void;
}

export class WalletTypeSelectorItem extends Component<IWalletTypeSelectorItemProps> {
  public render() {
    const walletTypeModifier =
      this.props.walletType === WalletType.Web3
        ? "wallet-type-selector-item--browser-wallet"
        : this.props.walletType === WalletType.NonWeb3
          ? "wallet-type-selector-item--non-web3-wallet"
          : "";

    return (
      <div className={`wallet-type-selector-item ${walletTypeModifier}`} onClick={this.onClick}>
        <DotsBar />
        <div className="wallet-type-selector-title">
          {this.props.children}
        </div>
      </div>
    );
  }

  private onClick = () => {
    if (this.props.onSelectWalletType) {
      this.props.onSelectWalletType(this.props.walletType);
    }
  };
}
