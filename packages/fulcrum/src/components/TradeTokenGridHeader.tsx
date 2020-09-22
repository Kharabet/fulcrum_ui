import React from "react";

export const TradeTokenGridHeader = () => {
  return (
    <div className="trade-token-grid-header">
      <div className="trade-token-grid-header__col-token-name">
        <span className="trade-token-grid-header__text">Asset</span>
      </div>
      <div className="trade-token-grid-header__col-position-type">
        <span className="trade-token-grid-header__text">&nbsp;</span>
      </div>
      <div className="trade-token-grid-header__col-leverage">
        <span className="trade-token-grid-header__text">Leverage</span>
      </div>
      <div className="trade-token-grid-header__col-price">
        <span className="trade-token-grid-header__text">Mid Market Price</span>
      </div>
      <div className="trade-token-grid-header__col-liquidation">
        <span className="trade-token-grid-header__text">Liquidation Price</span>
      </div>
      <div className="trade-token-grid-header__col-profit">
        <span className="trade-token-grid-header__text">Estimated Yield</span>
      </div>
    </div>
  );
}
