import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { CollateralTokenSelectorItem } from "./CollateralTokenSelectorItem";

export interface ICollateralTokenSelectorProps {
  borrowAsset: Asset;
  selectedCollateral: Asset;

  onCollateralChange: (asset: Asset) => void;
  onClose: () => void;
}

export class CollateralTokenSelector extends Component<ICollateralTokenSelectorProps> {
  private readonly assets: Asset[] = [
    Asset.ETH,
    Asset.SAI,
    Asset.DAI,
    Asset.USDC,
    // Asset.SUSD,
    Asset.LINK,
    Asset.WBTC,
    Asset.MKR,
    Asset.ZRX,
    Asset.BAT,
    Asset.REP,
    Asset.KNC
  ];

  public render() {
    const tokenItems = this.assets.filter(e => e !== this.props.borrowAsset).map(e => (
      <CollateralTokenSelectorItem
        key={e}
        asset={e}
        selectedCollateral={this.props.selectedCollateral}
        onCollateralChange={this.props.onCollateralChange}
      />
    ));

    return (
      <div className="collateral-token-selector">
        <section className="dialog-content">
          <div className="collateral-token-selector__items">{tokenItems}</div>
        </section>
      </div>
    );
  }
}
