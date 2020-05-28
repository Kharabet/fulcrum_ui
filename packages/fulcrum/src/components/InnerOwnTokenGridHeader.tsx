import React, { Component } from "react";
import { Asset } from "../domain/Asset";

export interface IInnerOwnTokenGridHeaderProps {
  asset?: Asset;
  unitOfAccount?: Asset;
}

export class InnerOwnTokenGridHeader extends Component<IInnerOwnTokenGridHeaderProps> {
  public render() {
    return (
      <div className="inner-own-token-grid-header">
        <div className="inner-own-token-grid-header__col-token-image">
    <span className="inner-own-token-grid-header__text">{`Position (${this.props.asset}/${this.props.unitOfAccount})`}</span>
        </div>
        <div className="inner-own-token-grid-header__col-asset-type">
          <span className="inner-own-token-grid-header__text">Type</span>
        </div>
        <div className="inner-own-token-grid-header__col-asset-price">
          <span className="inner-own-token-grid-header__text">Value</span>
        </div>
        <div className="inner-own-token-grid-header__col-asset-collateral">
          <span className="inner-own-token-grid-header__text">Collateral</span>
        </div>
        <div className="inner-own-token-grid-header__col-position-value">
          <span className="inner-own-token-grid-header__text">Open Price</span>
        </div>
        <div className="inner-own-token-grid-header__col-liquidation-price">
          <span className="inner-own-token-grid-header__text">Liquidation Price</span>
        </div>
        <div className="inner-own-token-grid-header__col-profit">
          <span className="inner-own-token-grid-header__text">Profit</span>
        </div>
      </div>
    );
  }
}