import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDetails } from "../domain/ProviderTypeDetails";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";

export interface IProviderMenuListItemParams {
  providerType: ProviderType;
  selectedProviderType: ProviderType;

  onSelect: (providerType: ProviderType) => void;
}

interface IProviderMenuListItemState {
  providerTypeDetails: ProviderTypeDetails | null;
}

export class ProviderMenuListItem extends Component<IProviderMenuListItemParams, IProviderMenuListItemState> {
  constructor(props: IProviderMenuListItemParams) {
    super(props);

    this.state = { providerTypeDetails: ProviderTypeDictionary.providerTypes.get(props.providerType) || null };
  }

  public componentWillReceiveProps(nextProps: Readonly<IProviderMenuListItemParams>, nextContext: any): void {
    this.setState({
      ...this.state,
      providerTypeDetails: ProviderTypeDictionary.providerTypes.get(nextProps.providerType) || null
    });
  }

  public render() {
    if (!this.state.providerTypeDetails) {
      return null;
    }

    const content = this.state.providerTypeDetails.logoSvg ? (
      <img className="provider-menu__list-item-content-img" src={this.state.providerTypeDetails.logoSvg} alt={this.state.providerTypeDetails.displayName} />
    ) : (
      <div className="provider-menu__list-item-content-txt">{this.state.providerTypeDetails.displayName}</div>
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
