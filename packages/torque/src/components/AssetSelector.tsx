import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { WalletType } from "../domain/WalletType";
import { AssetSelectorItem } from "./AssetSelectorItem";

export interface IAssetSelectorProps {
  walletType: WalletType

  onSelectAsset?: (asset: Asset) => void;
}

export class AssetSelector extends Component<IAssetSelectorProps> {
  private readonly assetsAvailableForWeb3: Asset[] = [Asset.DAI, Asset.ETH];
  private readonly assetsAvailableForNonWeb3: Asset[] = [Asset.DAI];

  public render() {
    const assets =
      this.props.walletType === WalletType.Web3
        ? this.assetsAvailableForWeb3
        : this.props.walletType === WalletType.NonWeb3
        ? this.assetsAvailableForNonWeb3
        : [];

    const items = assets.map(e => (
      <AssetSelectorItem key={e} asset={e} onSelectAsset={this.props.onSelectAsset} />
    ));
    return <div className="asset-selector">{items}</div>;
  }
}
