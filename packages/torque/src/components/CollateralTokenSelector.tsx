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
  private assets: Asset[];
  
  public constructor(props: ICollateralTokenSelectorProps) {
    super(props);
    
    if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
      this.assets = [
        Asset.ETH,
        // Asset.SAI,
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.SUSD,
        Asset.LINK,
        Asset.WBTC,
        Asset.MKR,
        Asset.ZRX,
        Asset.BAT,
        Asset.REP,
        Asset.KNC
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      this.assets = [
        Asset.ETH,
        Asset.SAI,
        Asset.DAI,
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      this.assets = [
        Asset.ETH,
        Asset.DAI,
      ];
    } else {
      this.assets = [];
    }
  }

  public render() {
    const tokenItems = this.assets.filter(e => 
        !(e === this.props.borrowAsset
          || (e === Asset.SAI && this.props.borrowAsset === Asset.DAI)
          || (e === Asset.DAI && this.props.borrowAsset === Asset.SAI)
        )
      ).map(e => (
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
