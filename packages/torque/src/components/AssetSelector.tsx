import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetSelectorItem } from "./AssetSelectorItem";

export interface IAssetSelectorProps {
  onSelectAsset?: (asset: Asset) => void;
}

export class AssetSelector extends Component<IAssetSelectorProps> {
  private readonly assets: Asset[] = [Asset.DAI, Asset.ETH];

  public render() {
    const items = this.assets.map(e => (
      <AssetSelectorItem key={e} asset={e} onSelectAsset={this.props.onSelectAsset} />
    ));
    return <div className="asset-selector">{items}</div>;
  }
}
