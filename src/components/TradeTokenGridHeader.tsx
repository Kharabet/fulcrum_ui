import React, { Component } from "react";

export class TradeTokenGridHeader extends Component {
  public render() {
    return (
      <div className="trade-token-grid-header">
        <div className="trade-token-grid-header__col-token-image">
          <span className="trade-token-grid-header__text">Token</span>
        </div>
        <div className="trade-token-grid-header__col-token-name">
          <span className="trade-token-grid-header__text">&nbsp;</span>
        </div>
        <div className="trade-token-grid-header__col-position-type">
          <span className="trade-token-grid-header__text">&nbsp;</span>
        </div>
        <div className="trade-token-grid-header__col-leverage">
          <span className="trade-token-grid-header__text">Leverage</span>
        </div>
        <div className="trade-token-grid-header__col-price">
          <span className="trade-token-grid-header__text">Price</span>
        </div>
        <div className="trade-token-grid-header__col-change24h">
          <span className="trade-token-grid-header__text">24 hours</span>
        </div>
        <div className="trade-token-grid-header__col-profit">
          <span className="trade-token-grid-header__text">Profit</span>
        </div>
        <div className="trade-token-grid-header__col-actions">
          <span className="trade-token-grid-header__text">&nbsp;</span>
        </div>
      </div>
    );
  }
}
