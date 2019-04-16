import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";

export interface IProviderMenuListItemProps {
  providerType: ProviderType;
  selectedProviderType: ProviderType;

  onSelect: (providerType: ProviderType) => void;
}

export class ProviderMenuListItem extends Component<IProviderMenuListItemProps> {
  public render() {
    const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(this.props.providerType) || null;
    if (!providerTypeDetails) {
      return null;
    }

    const content = providerTypeDetails.logoSvg ? (
      <img className="provider-menu__list-item-content-img" src={providerTypeDetails.logoSvg} alt={providerTypeDetails.displayName} />
    ) : (
      <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>
    );

    const isProviderTypeActiveClass =
      this.props.providerType === this.props.selectedProviderType ? "provider-menu__list-item--selected" : "";

    return (
      <li className={`provider-menu__list-item ${isProviderTypeActiveClass}`} onClick={this.onClick}>
        {content}
      </li>
    );
  }

  private onClick = () => {
    this.props.onSelect(this.props.providerType);
  };
}
