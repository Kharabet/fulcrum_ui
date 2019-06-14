import React, { ChangeEvent, Component } from "react";
import { CheckBox } from "./CheckBox";

export interface ITradeTokenGridHeaderProps {
  showMyTokensOnly: boolean;
  onShowMyTokensOnlyChange: (value: boolean) => void;
}

export class TradeTokenGridHeader extends Component<ITradeTokenGridHeaderProps> {
  public render() {
    return (
      <div className="trade-token-grid-header">
        <div className="trade-token-grid-header__col-token-image">
          <span className="trade-token-grid-header__text">Asset</span>
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
          <span className="trade-token-grid-header__text">Asset Price</span>
        </div>
        <div className="trade-token-grid-header__col-price">
          <span className="trade-token-grid-header__text">Liquidation Price</span>
        </div>
        {/*<div className="trade-token-grid-header__col-change24h">
          <span className="trade-token-grid-header__text">24 hours</span>
        </div>*/}
        <div className="trade-token-grid-header__col-profit">
          <span className="trade-token-grid-header__text">Interest APR</span>
        </div>
        <div className="trade-token-grid-header__col-actions">
          <span className="trade-token-grid-header__text-right">
            <CheckBox checked={this.props.showMyTokensOnly} onChange={this.showMyTokensOnlyChange}>Show my positions only</CheckBox>
          </span>
        </div>
      </div>
    );
  }

  public showMyTokensOnlyChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onShowMyTokensOnlyChange(event.target.checked);
  }
}
