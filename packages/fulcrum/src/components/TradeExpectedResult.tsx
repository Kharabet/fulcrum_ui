import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { TradeType } from "../domain/TradeType";

export interface ITradeExpectedResult {
  tradeType: TradeType;
  currentPrice: BigNumber;
  liquidationPrice: BigNumber;
}

export interface ITradeExpectedResultProps {
  value: ITradeExpectedResult;
}

export class TradeExpectedResult extends Component<ITradeExpectedResultProps> {
  public render() {

    return (
      <div className="trade-expected-result">
        <div className="trade-expected-result__column">
          <div className="trade-expected-result__column-title">
            {this.props.value.tradeType === TradeType.SELL ? `Exit Price` : `Entry Price`}
          </div>
          <div title={`${this.props.value.currentPrice.toFixed(18)}`} className="trade-expected-result__column-value">
            {`${this.props.value.currentPrice.toFixed(2)} USD`}
          </div>
        </div>

        <div className="trade-expected-result__delimiter" />

        <div className="trade-expected-result__column">
          <div className="trade-expected-result__column-title">
            Liquidation Price
          </div>
          <div title={`${this.props.value.liquidationPrice.toFixed(18)}`} className="trade-expected-result__column-value">
            {`${this.props.value.liquidationPrice.toFixed(2)} USD`}
          </div>
        </div>
      </div>
    );
  }
}
