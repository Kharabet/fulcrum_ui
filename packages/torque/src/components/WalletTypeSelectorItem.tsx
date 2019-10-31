import React, { Component } from "react";
import { WalletType } from "../domain/WalletType";
import { DotsBar } from "./DotsBar";

import ic_small_1 from "./../assets/images/ic_small_1.svg";
import ic_small_2 from "./../assets/images/ic_small_2.png";
import ic_small_3 from "./../assets/images/ic_small_3.svg";
import ic_small_4 from "./../assets/images/ic_small_4.svg";
import ic_small_5 from "./../assets/images/ic_small_5.png";
import ic_small_6 from "./../assets/images/ic_small_6.png";
import { SelectorIconsBar } from "./SelectorIconsBar";

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
        <div className="wallet-type-selector-title">{this.props.children}</div>
        <SelectorIconsBar>
          {this.props.walletType === WalletType.Web3 ? this.renderWeb3Icons() : this.renderNonWeb3Icons()}
          <div className="selector-icons-bar__item selector-icons-bar__button">
            and others...
          </div>
        </SelectorIconsBar>
      </div>
    );
  }

  private renderWeb3Icons = () => {
    return (
      <React.Fragment>
        <img className="selector-icons-bar__item selector-icons-bar__icon" src={ic_small_1} />
        <img className="selector-icons-bar__item selector-icons-bar__icon" src={ic_small_2} />
        <img className="selector-icons-bar__item selector-icons-bar__icon" src={ic_small_3} />
        <img className="selector-icons-bar__item selector-icons-bar__icon" src={ic_small_4} />
      </React.Fragment>
    );
  };

  private renderNonWeb3Icons = () => {
    return (
      <React.Fragment>
        <img className="selector-icons-bar__item selector-icons-bar__icon" src={ic_small_5} />
        <img className="selector-icons-bar__item selector-icons-bar__icon" src={ic_small_6} />
      </React.Fragment>
    );
  };

  private onClick = () => {
    if (this.props.onSelectWalletType) {
      this.props.onSelectWalletType(this.props.walletType);
    }
  };
}
