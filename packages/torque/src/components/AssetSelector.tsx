import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetSelectorItem } from "./AssetSelectorItem";

export interface IAssetSelectorProps {
  onSelectAsset: (asset: Asset) => void;
  isLoadingTransaction: boolean;
  selectedAsset: Asset;
}

export class AssetSelector extends Component<IAssetSelectorProps> {

  // true includes ENS support
  private assetsShown: Asset[];

  public constructor(props: IAssetSelectorProps) {
    super(props);

    if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
      this.assetsShown = [
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.SUSD,
        Asset.ETH,
        Asset.WBTC,
        Asset.LINK,
        Asset.ZRX,
        Asset.KNC,
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      this.assetsShown = [
        Asset.SAI,
        Asset.DAI,
        Asset.ETH,
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      this.assetsShown = [
        Asset.DAI,
        Asset.ETH,
      ];
    } else {
      this.assetsShown = [];
    }
  }

  public render() {

    const assetSelectorItems = this.assetsShown.map(asset => {
      return (
        <AssetSelectorItem key={asset} asset={asset} {...this.props} />
      );
    });

    return <div className="asset-selector">{assetSelectorItems}</div>;
  }
}
