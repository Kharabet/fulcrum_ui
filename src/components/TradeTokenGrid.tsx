import React, { Component } from "react";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { ITradeTokenGridRowParams, TradeTokenGridRow } from "./TradeTokenGridRow";
import { PositionType } from "../domain/PositionType";
import BigNumber from "bignumber.js";

export class TradeTokenGrid extends Component {
  private _tokens: ITradeTokenGridRowParams[] = [
    {
      tokenAddress: "0x1",
      tokenLogoImageSrc: null,
      tokenName: "DAI",
      positionType: PositionType.LONG,
      price: new BigNumber("21.26"),
      change24h: new BigNumber("-0.36"),
      profit: new BigNumber("14.32")
    },
    {
      tokenAddress: "0x2",
      tokenLogoImageSrc: null,
      tokenName: "MKR",
      positionType: PositionType.SHORT,
      price: new BigNumber("42.71"),
      change24h: new BigNumber("0.17")
    }
  ];

  render() {
    const tokenRows = this._tokens.map(e => <TradeTokenGridRow key={e.tokenAddress} {...e} />);
    return (
      <div className="trade-token-grid">
        <TradeTokenGridHeader />
        {tokenRows}
      </div>
    );
  }
}
