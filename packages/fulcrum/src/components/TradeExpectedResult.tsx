import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { TradeType } from "../domain/TradeType";
import { Preloader } from "./Preloader";

import "../styles/components/trade-expected-result.scss";

export interface ITradeExpectedResult {
  tradeType: TradeType;
}

export interface ITradeExpectedResultProps {
  entryPrice: BigNumber;
  liquidationPrice: BigNumber;
}

export class TradeExpectedResult extends Component<ITradeExpectedResultProps> {
  public render() {

    return (
      <div className="trade-expected-result">
        <div className="trade-expected-result__column">
          <div className="trade-expected-result__column-title">
            Entry Price
          </div>
          <div title={`${this.props.entryPrice.toFixed(18)}`} className="trade-expected-result__column-value">
            <span className="value">{this.props.entryPrice.eq(0) ? <Preloader width="55px" /> : this.props.entryPrice.toFixed(2)}</span>&nbsp;USD
          </div>
        </div>


        <div className="trade-expected-result__column">
          <div className="trade-expected-result__column-title">
            Liquidation Price
          </div>
          <div title={`${this.props.liquidationPrice.toFixed(18)}`} className="trade-expected-result__column-value">
            <span className="value">{this.props.liquidationPrice.eq(0) ? <Preloader width="55px" /> : this.props.liquidationPrice.toFixed(2)}</span>&nbsp;USD
          </div>
        </div>
      </div>
    );
  }
}
