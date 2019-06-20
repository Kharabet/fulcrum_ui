import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderSelectorItem } from "./ProviderSelectorItem";

export interface IProviderSelectorProps {
  onSelectProvider?: (providerType: ProviderType) => void;
}

export class ProviderSelector extends Component<IProviderSelectorProps> {
  public render() {
    return (
      <div className="provider-selector">
        <ProviderSelectorItem providerType={ProviderType.Bitski} onSelectProvider={this.props.onSelectProvider} />
        <ProviderSelectorItem providerType={ProviderType.Fortmatic} onSelectProvider={this.props.onSelectProvider} />
        <ProviderSelectorItem providerType={ProviderType.Portis} onSelectProvider={this.props.onSelectProvider} />
      </div>
    );
  }
}
