import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { CollateralTokenSelectorItem } from "./CollateralTokenSelectorItem";
import { TradeType } from "../domain/TradeType";

export interface ICollateralTokenSelectorProps {
  selectedCollateral: Asset;
  collateralType: string;
  tradeType: string;

  onCollateralChange: (asset: Asset) => void;
  onClose: () => void;
}

export class CollateralTokenSelector extends Component<ICollateralTokenSelectorProps> {
  private readonly assets: Asset[] = [
    Asset.ETH,
    Asset.DAI,
    Asset.USDC,
    Asset.SUSD,
    Asset.WBTC,
    Asset.LINK,
    Asset.ZRX,
    Asset.REP,
    Asset.KNC
  ];

  componentDidMount() {
    const collateralTokenSelector = document.querySelector(".collateral-token-selector__wrapper") as HTMLElement;
    const boundingClient = collateralTokenSelector.getBoundingClientRect();
    //collateralTokenSelector!.style.top =-1 * boundingClient!.top + "px";
    collateralTokenSelector!.style.left =-1 * boundingClient!.left + "px";
  }
  public render() {
    const tokenItems = this.assets.map(e => (
      <CollateralTokenSelectorItem
        key={e}
        asset={e}
        selectedCollateral={this.props.selectedCollateral}
        onCollateralChange={this.props.onCollateralChange}
      />
    ));

    return (
      <React.Fragment>
        <div className="collateral-token-selector__wrapper" onClick={this.props.onClose}></div>
        <div className="collateral-token-selector">
          <div className="collateral-token-selector__title">Select {this.props.collateralType} token</div>
          <div className="collateral-token-selector__items">{tokenItems}</div>
          {/*<div className="collateral-token-selector__actions">
            <div className="collateral-token-selector__action--close" onClick={this.props.onClose}>Close</div>
          </div>*/}
          <p className="collateral-token-selector__description">{this.props.tradeType === TradeType.BUY ? `There are a few options for purchase tokens available and you can choose any token to swap during opening trade(and thus save time on visiting exchange).` : `There are a few options for redemption tokens available and you can choose any token to swap during closing trade(and thus save time on visiting exchange).`}</p>
        </div>
      </React.Fragment>
    );
  }
}
