import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { CollateralTokenSelectorItem } from "./CollateralTokenSelectorItem";

export interface ICollateralTokenSelectorProps {
  onCollateralChange: (asset: Asset) => void;
}

export class CollateralTokenSelector extends Component<ICollateralTokenSelectorProps> {
  private readonly assets: Asset[] = [
    Asset.wBTC,
    Asset.ETH,
    Asset.DAI,
    Asset.MKR,
    Asset.ZRX,
    Asset.BAT,
    Asset.REP,
    Asset.KNC
  ];

  public render() {
    const tokenItems = this.assets.map(e => <CollateralTokenSelectorItem key={e} asset={e} onCollateralChange={this.props.onCollateralChange} />);

    return <div className="collateral-token-selector">{tokenItems}</div>;
  }
}
