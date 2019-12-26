import React, { ChangeEvent, Component } from "react";


export interface ITradeTokenGridHeaderProps {
  showMyTokensOnly: boolean;
  onShowMyTokensOnlyChange: (value: boolean) => void;
}

export class TradeTokenGridHeaderMobile extends Component<ITradeTokenGridHeaderProps> {

  public render() {
    return (
      <div>

        <div className="trade-token-grid-header">

          <div className="trade-token-grid-header__col-leverage">
            <span className="trade-token-grid-header__text">Leverage</span>
          </div>
          <div className="trade-token-grid-header__col-price">
            <span className="trade-token-grid-header__text">Price</span>
          </div>
          {/*<div className="trade-token-grid-header__col-price">*/}
            {/*<span className="trade-token-grid-header__text">Liquidation Price</span>*/}
          {/*</div>*/}
          <div className="trade-token-grid-header__col-change24h">
            <span className="trade-token-grid-header__text">Liquidation</span>
          </div>
          <div className="trade-token-grid-header__col-profit">
            <span className="trade-token-grid-header__text">APR</span>
          </div>
          <div className="trade-token-grid-header__col-profit">
            <span className="trade-token-grid-header__text"></span>
          </div>
          {/*<div className="trade-token-grid-header__col-actions">*/}
            {/*<span className="trade-token-grid-header__text-right">*/}
              {/*<CheckBox checked={this.props.showMyTokensOnly} onChange={this.showMyTokensOnlyChange}>Manage Positions</CheckBox>*/}
            {/*</span>*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }



  public showMyTokensOnlyChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onShowMyTokensOnlyChange(event.target.checked);
  }
}
