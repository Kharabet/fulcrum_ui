import React, { Component } from 'react'

export interface IOwnTokenGridHeaderProps {}

export class OwnTokenGridHeader extends Component<IOwnTokenGridHeaderProps> {
  public render() {
    return (
      <div className="own-token-grid-header">
        <div className="own-token-grid-header__col-token-name">
          <span className="own-token-grid-header__text">Pair</span>
        </div>
        <div className="own-token-grid-header__col-position-type">
          <span className="own-token-grid-header__text">Type</span>
        </div>

        <div className="own-token-grid-header__col-position">
          <span className="own-token-grid-header__text">Position</span>
        </div>
        <div className="own-token-grid-header__col-asset-price">
          <span className="own-token-grid-header__text">Open Price</span>
        </div>
        <div className="own-token-grid-header__col-liquidation-price">
          <span className="own-token-grid-header__text">Liq. Price</span>
        </div>
        <div className="own-token-grid-header__col-collateral">
          <span className="own-token-grid-header__text">Collateral</span>
        </div>
        <div className="own-token-grid-header__col-position-value">
          <span className="own-token-grid-header__text">Value</span>
        </div>
        <div className="own-token-grid-header__col-profit">
          <span className="own-token-grid-header__text">Profit</span>
        </div>
      </div>
    )
  }
}
