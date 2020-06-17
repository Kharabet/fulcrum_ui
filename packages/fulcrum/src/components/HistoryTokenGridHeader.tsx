import React, { Component } from "react";

export interface IHistoryTokenGridHeaderProps {
}

export class HistoryTokenGridHeader extends Component<IHistoryTokenGridHeaderProps> {
  public render() {
    return (
      <div className="history-token-grid-header">
        <div className="history-token-grid-header__col-token-date">
          <span className="history-token-grid-header__text">Date</span>
        </div>
        <div className="history-token-grid-header__col-token-asset">
          <span className="history-token-grid-header__text">Asset</span>
        </div>
        <div className="history-token-grid-header__col-type">
          <span className="history-token-grid-header__text">Type</span>
        </div>
        <div className="history-token-grid-header__col-asset-unit">
          <span className="history-token-grid-header__text">Unit of Account</span>
        </div>
        <div className="history-token-grid-header__col-position">
          <span className="history-token-grid-header__text">Position (ETH)</span>
        </div>
        <div className="history-token-grid-header__col-asset-price">
          <span className="history-token-grid-header__text">Open Price</span>
        </div>
        {/* <div className="history-token-grid-header__col-liquidation-price">
          <span className="history-token-grid-header__text">Liq. Price</span>
        </div> */}
        <div className="history-token-grid-header__col-position-value">
          <span className="history-token-grid-header__text">Value</span>
        </div>
        <div className="history-token-grid-header__col-profit">
          <span className="history-token-grid-header__text">Profit</span>
        </div>
        <div className="history-token-grid-header__col-result">
          <span className="history-token-grid-header__text">Result</span>
        </div>
      </div>
    );
  }
}