import React, { Component } from "react";

export class TradeTokenGridHeader extends Component {
  render() {
    return (
      <div className="trade-token-grid-header">
        <div className="trade-token-grid-header__col-token-image">Token</div>
        <div className="trade-token-grid-header__col-token-name">&nbsp;</div>
        <div className="trade-token-grid-header__col-position-type">&nbsp;</div>
        <div className="trade-token-grid-header__col-leverage">Leverage</div>
        <div className="trade-token-grid-header__col-price">Price</div>
        <div className="trade-token-grid-header__col-change24h">24 hours</div>
        <div className="trade-token-grid-header__col-profit">Profit</div>
        <div className="trade-token-grid-header__col-actions">&nbsp;</div>
      </div>
    );
  }
}
