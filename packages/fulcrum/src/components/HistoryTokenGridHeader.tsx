import React, { Component } from "react";

export interface IHistoryTokenGridHeaderProps {
}

export class HistoryTokenGridHeader extends Component<IHistoryTokenGridHeaderProps> {
  public render() {
    return (
      <div className="own-token-grid-header-history">
        <div className="own-token-grid-header-history__col-token-date">
          <span className="own-token-grid-header-history__text">Date</span>
        </div>
        <div className="own-token-grid-header-history__col-token-asset">
          <span className="own-token-grid-header-history__text">Asset</span>
        </div>
        <div className="own-token-grid-header-history__col-type">
          <span className="own-token-grid-header-history__text">Type</span>
        </div>
        <div className="own-token-grid-header-history__col-asset-unit">
          <span className="own-token-grid-header-history__text">Unit of Account</span>
        </div>
        <div className="own-token-grid-header-history__col-position">
          <span className="own-token-grid-header-history__text">Position (ETH)</span>
        </div>
        <div className="own-token-grid-header-history__col-asset-price">
          <span className="own-token-grid-header-history__text">Open Price</span>
        </div>
        <div className="own-token-grid-header-history__col-liquidation-price">
          <span className="own-token-grid-header-history__text">Liq. Price</span>
        </div>
        <div className="own-token-grid-header-history__col-position-value">
          <span className="own-token-grid-header-history__text">Value</span>
        </div>
        <div className="own-token-grid-header-history__col-profit">
          <span className="own-token-grid-header-history__text">Profit</span>
        </div>
        <div className="own-token-grid-header-history__col-result">
          <span className="own-token-grid-header-history__text">Result</span>
        </div>
      </div>
    );
  }
}