import React, { Component } from "react";

export interface IStatsTokenGridHeaderProps {
}

export class StatsTokenGridHeader extends Component<IStatsTokenGridHeaderProps> {
  public render() {
    return (
      <div className="stats-grid-header">
        <div className="stats-grid-header__col-name">
          <span className="stats-grid-header__text">Reserve</span>
        </div>
        <div className="stats-grid-header__col-total-tvl-usd">
          <span className="stats-grid-header__text">TVL (USD)</span>
        </div>
        <div className="stats-grid-header__col-total-supply-usd">
          <span className="stats-grid-header__text">Total Supply (USD)</span>
        </div>
        <div className="stats-grid-header__col-total-supply">
          <span className="stats-grid-header__text">Total Supply</span>
        </div>
        <div className="stats-grid-header__col-total-borrow">
          <span className="stats-grid-header__text">Total Borrow</span>
        </div>
        <div className="stats-grid-header__col-total-borrow">
          <span className="stats-grid-header__text">Vault Locked</span>
        </div>
        <div className="stats-grid-header__col-liquidity">
          <span className="stats-grid-header__text">Free Liquidity</span>
        </div>
        {/*<div className="stats-grid-header__col-liquidity-reserved">
          <span className="stats-grid-header__text">Reserved Liquidity</span>
        </div>*/}
        <div className="stats-grid-header__col-supply-rate">
          <span className="stats-grid-header__text">Supply Rate (APR)</span>
        </div>
        <div className="stats-grid-header__col-borrow-rate">
          {/*<span className="stats-grid-header__text">Avg/Next Borrow Rate (APR)</span>*/}
          <span className="stats-grid-header__text">Borrow Rate (APR)</span>
          <span className="stats-grid-header__text">Fulcrum / Torque</span>
        </div>
        {/*<div className="stats-grid-header__col-next-rate">
          <span className="stats-grid-header__text">Next Rate (variable)</span>
        </div>*/}
      </div>
    );
  }
}
