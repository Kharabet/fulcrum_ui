import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";

import ic_bitski from "./../assets/images/ic_bitski.svg";
import ic_fortmatic from "./../assets/images/ic_formatic.svg";
import ic_portis from "./../assets/images/ic_portis.svg";
import ic_squarelink from "./../assets/images/ic_squarelink.svg";
import ic_torus from "./../assets/images/ic_torus.svg";
import ic_wallet from "./../assets/images/wallet.svg";

export interface IProviderSelectorItemProps {
  providerType: ProviderType;

  onSelectProvider?: (providerType: ProviderType) => void;
}

export class ProviderSelectorItem extends Component<IProviderSelectorItemProps> {
  public render() {
    const providerModifier =
      this.props.providerType === ProviderType.Bitski
        ? "provider-selector-item--bitski"
        : this.props.providerType === ProviderType.Fortmatic
        ? "provider-selector-item--formatic"
        : this.props.providerType === ProviderType.Portis
        ? "provider-selector-item--portis"
        : this.props.providerType === ProviderType.Squarelink
        ? "provider-selector-item--squarelink"
        : this.props.providerType === ProviderType.Torus
        ? "provider-selector-item--torus"
        : this.props.providerType === ProviderType.WalletLink
        ? "provider-selector-item--walletlink"
        : "";

    const providerIcon =
      this.props.providerType === ProviderType.Bitski
        ? ic_bitski
        : this.props.providerType === ProviderType.Fortmatic
        ? ic_fortmatic
        : this.props.providerType === ProviderType.Portis
        ? ic_portis
        : this.props.providerType === ProviderType.Squarelink
        ? ic_squarelink
        : this.props.providerType === ProviderType.Torus
        ? ic_torus
        : this.props.providerType === ProviderType.WalletLink
        ? ic_wallet
        : "";

    return (
      <div className={`provider-selector-item ${providerModifier}`} onClick={this.onClick}>
        <div className="provider-selector-item__content">
          <div className="provider-selector-item__logo">
            <img src={providerIcon} />
          </div>
          <div className="provider-selector-item__title">{this.props.providerType}</div>
        </div>
      </div>
    );
  }

  private onClick = () => {
    if (this.props.onSelectProvider) {
      this.props.onSelectProvider(this.props.providerType);
    }
  };
}
