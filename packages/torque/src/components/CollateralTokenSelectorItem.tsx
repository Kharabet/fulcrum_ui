import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";

export interface ICollateralTokenSelectorItemProps {
  selectedCollateral: Asset;
  asset: Asset;

  onCollateralChange: (asset: Asset) => void;
}

interface ICollateralTokenSelectorItemState {
  assetDetails: AssetDetails | null;
}

export class CollateralTokenSelectorItem extends Component<ICollateralTokenSelectorItemProps, ICollateralTokenSelectorItemState> {
  constructor(props: ICollateralTokenSelectorItemProps) {
    super(props);

    const assetDetails = AssetsDictionary.assets.get(props.asset);

    this.state = { assetDetails: assetDetails || null };
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const selectedStyle = this.props.asset === this.props.selectedCollateral ? "collateral-token-selector-item--selected" : "";

    return (
      <div 
        className={`collateral-token-selector-item ${selectedStyle}`}
        onClick={this.onTokenClick}
      >
        <div className="collateral-token-selector-item__image-container">
          {this.state.assetDetails.reactLogoSvg.render()}
        </div>
        <div className="collateral-token-selector-item__description-container">
          <div className="collateral-token-selector-item__name">{this.state.assetDetails.displayName}</div>
        </div>
      </div>
    );
  }

  public onTokenClick = () => {
    this.props.onCollateralChange(this.props.asset);
  };
}
