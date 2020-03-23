import React, { Component } from "react";

export interface IOwnTokenGridHeaderProps {
  showMyTokensOnly: boolean;
}

export class OwnTokenGridHeader extends Component<IOwnTokenGridHeaderProps> {
  public render() {
    return this.props.showMyTokensOnly ? (
      <div className="own-token-grid-header">
        <div className="own-token-grid-header__col-token-image">
          <span className="own-token-grid-header__text">Asset Manage Positions</span>
        </div>
        <div className="own-token-grid-header__col-asset-price">
          <span className="own-token-grid-header__text">Unit of Account</span>
        </div>
        <div className="own-token-grid-header__col-asset-price">
          <span className="own-token-grid-header__text">Asset Price</span>
        </div>
        <div className="own-token-grid-header__col-liquidation-price">
          <span className="own-token-grid-header__text">Liquidation Price</span>
        </div>
        <div className="own-token-grid-header__col-position-value">
          <span className="own-token-grid-header__text">Position Value</span>
        </div>
        <div className="own-token-grid-header__col-profit">
          <span className="own-token-grid-header__text">Profit</span>
        </div>
      </div>
    ) : (
      <div className="own-token-grid-header-inner">
      <div className="own-token-grid-header-inner__col-token-image">
        <span className="own-token-grid-header-inner__text">Leverage</span>
      </div>
      <div className="own-token-grid-header-inner__col-asset-price">
        <span className="own-token-grid-header-inner__text">Unit of Account</span>
      </div>
      <div className="own-token-grid-header-inner__col-asset-price">
        <span className="own-token-grid-header-inner__text">Asset Price</span>
      </div>
      <div className="own-token-grid-header-inner__col-liquidation-price">
        <span className="own-token-grid-header-inner__text">Liquidation Price</span>
      </div>
      <div className="own-token-grid-header-inner__col-position-value">
        <span className="own-token-grid-header-inner__text">Position Value</span>
      </div>
      <div className="own-token-grid-header-inner__col-profit">
        <span className="own-token-grid-header-inner__text">Profit</span>
      </div>
    </div>

    );
  }
}
