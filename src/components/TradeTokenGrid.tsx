import React, { Component } from "react";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";
import { PositionType } from "../domain/PositionType";
import BigNumber from "bignumber.js";
import { Asset } from "../domain/Asset";
import { TradeRequest } from "../domain/TradeRequest";

export class TradeTokenGrid extends Component {
  private _tokens: ITradeTokenGridRowProps[] = [
    {
      asset: Asset.wBTC,
      positionType: PositionType.LONG,
      price: new BigNumber("21.26"),
      change24h: new BigNumber("-0.36"),
      profit: new BigNumber("14.32"),
      onBuy: e => this.onBuy(e),
      onSell: e => this.onSell(e)
    },
    {
      asset: Asset.DAI,
      positionType: PositionType.SHORT,
      price: new BigNumber("42.71"),
      change24h: new BigNumber("0.17"),
      onBuy: e => this.onBuy(e),
      onSell: e => this.onSell(e)
    }
  ];

  render() {
    const tokenRows = this._tokens.map(e => <TradeTokenGridRow key={e.asset} {...e} />);
    return (
      <div className="trade-token-grid">
        <TradeTokenGridHeader />
        {tokenRows}
      </div>
    );
  }

  onBuy = (request: TradeRequest) => {
    if (request)
      alert(`buy ${request.amount} of ${request.asset} at ${request.leverage}x`);
  };

  onSell = (request: TradeRequest) => {
    if (request)
      alert(`sell ${request.amount} of ${request.asset} at ${request.leverage}x`);
  };
}
