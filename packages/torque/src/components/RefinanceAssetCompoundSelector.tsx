import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { WalletType } from "../domain/WalletType";
import { RefinanceAssetCompoundSelectorItem } from "./RefinanceAssetCompoundSelectorItem";

export interface IRefinanceAssetCompoundSelectorProps {
  walletType: WalletType

  onSelectAsset?: (asset: Asset) => void;
}

export class RefinanceAssetCompoundSelector extends Component<IRefinanceAssetCompoundSelectorProps> {

  // true includes ENS support
  private readonly assetsShown: Map<Asset, boolean> = new Map<Asset, boolean>([
    // [
    //   Asset.DAI,
    //   true
    // ],

    [
      Asset.USDC,
      true
    ],
    [
      Asset.SAI,
      false
    ],
    /*[
      Asset.SUSD,
      false
    ],*/
    // [
    //   Asset.ETH,
    //   false
    // ],
    // [
    //   Asset.WBTC,
    //   false
    // ],
    // [
    //   Asset.LINK,
    //   false
    // ],
    // [
    //   Asset.ZRX,
    //   false
    // ],
    // [
    //   Asset.REP,
    //   false
    // ],
    // [
    //   Asset.KNC,
    //   false
    // ],
  ]);


  public render() {

    let assetList = Array.from(this.assetsShown.keys());
    let items;
    if (this.props.walletType === WalletType.Web3) {
      items = assetList.map(e => {
        return (

          <RefinanceAssetCompoundSelectorItem key={e} asset={e}  />
        );
      });
    } else {
      assetList = assetList.sort(e => this.assetsShown.get(e) ? -1 : 1);
      items = assetList.map(e => {
        return (
          <RefinanceAssetCompoundSelectorItem key={e} asset={e} onSelectAsset={this.assetsShown.get(e) ? this.props.onSelectAsset : undefined} />
        );
      });
    }

    return <div className="refinance-asset-selector">{items}</div>;
  }
}
