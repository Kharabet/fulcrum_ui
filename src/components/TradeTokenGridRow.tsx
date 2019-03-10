import React, { Component } from "react";
import BigNumber from "bignumber.js";
import { LeverageSelector } from "./LeverageSelector";
import { PositionTypeMarker } from "./PositionTypeMarker";
import { PositionType } from "../domain/PositionType";

export interface ITradeTokenGridRowParams {
  tokenAddress: string;
  tokenLogoImageSrc: any;
  tokenName: string;
  positionType: PositionType;
  price: BigNumber;
  change24h: BigNumber;
  profit?: BigNumber;
}

export interface ITradeTokenGridRowState {
  leverage: number;
}

export class TradeTokenGridRow extends Component<ITradeTokenGridRowParams, ITradeTokenGridRowState> {
  constructor(props: ITradeTokenGridRowParams, context?: any) {
    super(props, context);

    this.state = { leverage: 1 };
  }

  render() {
    return (
      <div className="trade-token-grid-row">
        <div className="trade-token-grid-row__token-image"><img src={this.props.tokenLogoImageSrc} alt={this.props.tokenName}/></div>
        <div className="trade-token-grid-row__token-name">{this.props.tokenName}</div>
        <div className="trade-token-grid-row__position-type">
          <PositionTypeMarker value={this.props.positionType}/>
        </div>
        <div className="trade-token-grid-row__leverage">
          <LeverageSelector value={this.state.leverage} onChange={this.onLeverageSelect} />
        </div>
        <div className="trade-token-grid-row__price">{`$${this.props.price.toFixed(2)}`}</div>
        <div className="trade-token-grid-row__change24h">{`${this.props.change24h.toFixed(2)}%`}</div>
        <div className="trade-token-grid-row__profit">{this.props.profit  ? `$${this.props.profit.toFixed(2)}` : "-"}</div>
        <div className="trade-token-grid-row__action">
          <button className="trade-token-grid-row__buy-button" onClick={this.onBuyClick}>Buy</button>
          <button className="trade-token-grid-row__sell-button" onClick={this.onSellClick}>Sell</button>
        </div>
      </div>
    );
  }

  onLeverageSelect = (value: number) => {
    this.setState({ ...this.state, leverage: value });
  };

  onBuyClick = () => {
    alert(this.props.tokenName);
  };

  onSellClick = () => {
    alert(this.props.tokenName);
  };
}
