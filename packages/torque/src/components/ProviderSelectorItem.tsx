import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";

import ic_bitski from "./../assets/images/ic_bitski.svg";
import ic_fortmatic from "./../assets/images/ic_formatic.svg";
import ic_portis from "./../assets/images/ic_portis.svg";
import ic_walletconnect from "./../assets/images/ic_walletconnect.svg";

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
        : this.props.providerType === ProviderType.WalletConnect
        ? "provider-selector-item--wallet-connect"
        : "";

    const providerIcon =
      this.props.providerType === ProviderType.Bitski
        ? ic_bitski
        : this.props.providerType === ProviderType.Fortmatic
        ? ic_fortmatic
        : this.props.providerType === ProviderType.Portis
        ? ic_portis
        : this.props.providerType === ProviderType.WalletConnect
        ? ic_walletconnect
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
