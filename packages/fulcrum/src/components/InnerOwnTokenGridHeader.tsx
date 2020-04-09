import React, { Component } from "react";

export interface IInnerOwnTokenGridHeaderProps {
}

export class InnerOwnTokenGridHeader extends Component<IInnerOwnTokenGridHeaderProps> {
  public render() {
    return (
      <div className="own-token-grid-header-inner">
        <div className="own-token-grid-header-inner__col-token-image">
          <span className="own-token-grid-header-inner__text">Position (ETH/DAI)</span>
        </div>
        <div className="own-token-grid-header-inner__col-asset-type">
          <span className="own-token-grid-header-inner__text">Type</span>
        </div>
        <div className="own-token-grid-header-inner__col-asset-price">
          <span className="own-token-grid-header-inner__text">Value</span>
        </div>
        <div className="own-token-grid-header-inner__col-asset-collateral">
          <span className="own-token-grid-header-inner__text">Collateral</span>
        </div>
        <div className="own-token-grid-header-inner__col-position-value">
          <span className="own-token-grid-header-inner__text">Open Price</span>
        </div>
        <div className="own-token-grid-header-inner__col-liquidation-price">
          <span className="own-token-grid-header-inner__text">Liquidation Price</span>
        </div>
        <div className="own-token-grid-header-inner__col-profit">
          <span className="own-token-grid-header-inner__text">Profit</span>
        </div>
      </div>
    );
  }
}