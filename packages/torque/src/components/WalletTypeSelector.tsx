import React, { Component } from "react";
import { WalletType } from "../domain/WalletType";
import { WalletTypeSelectorItem } from "./WalletTypeSelectorItem";

export interface IWalletTypeSelectorProps {
  onSelectWalletType?: (walletType: WalletType) => void;
}

export class WalletTypeSelector extends Component<IWalletTypeSelectorProps> {
  public render() {
    return (
      <div className="wallet-type-selector">
        <WalletTypeSelectorItem walletType={WalletType.Web3} onSelectWalletType={this.props.onSelectWalletType}>
          Browser wallets
        </WalletTypeSelectorItem>
        <WalletTypeSelectorItem walletType={WalletType.NonWeb3} onSelectWalletType={this.props.onSelectWalletType}>
          Non Web 3 wallets
        </WalletTypeSelectorItem>
      </div>
    );
  }
}
