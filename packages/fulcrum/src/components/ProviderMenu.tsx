import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderMenuListItem } from "./ProviderMenuListItem";

export interface IProviderMenuProps {
  providerTypes: ProviderType[];
  selectedProviderType: ProviderType;

  onSelect: (providerType: ProviderType) => void;
}

export class ProviderMenu extends Component<IProviderMenuProps> {
  public render() {
    const listItems = this.props.providerTypes.map(e => (
      <ProviderMenuListItem
        key={e}
        providerType={e}
        selectedProviderType={this.props.selectedProviderType}
        onSelect={this.props.onSelect}
      />
    ));

    return (
      <div className="provider-menu">
        <div className="provider-menu__title">Select Wallet Provider</div>
        <ul className="provider-menu__list">{listItems}</ul>
      </div>
    );
  }
}
