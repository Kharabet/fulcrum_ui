import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";

export interface ITradeExpectedResult {
  exposureValue: BigNumber;
  exposureAsset: Asset;
  exposureType: PositionType;
  liquidationPrice: BigNumber;
}

export interface ITradeExpectedResultProps {
  value: ITradeExpectedResult;
}

export class TradeExpectedResult extends Component<ITradeExpectedResultProps> {
  public render() {
    const exposureTypeName = this.props.value.exposureType === PositionType.SHORT ? "Short" : "Long";

    return (
      <div className="trade-expected-result">
        <div className="trade-expected-result__column">
          <div title={`${this.props.value.exposureValue.toFixed(18)}`} className="trade-expected-result__column-value">
            {`${this.props.value.exposureValue.toFixed(2)} ${this.props.value.exposureAsset}`}
          </div>
          <div className="trade-expected-result__column-title">
            {exposureTypeName} Exposure
          </div>
        </div>

        <div className="trade-expected-result__delimiter" />

        <div className="trade-expected-result__column">
          <div title={`${this.props.value.liquidationPrice.toFixed(18)}`} className="trade-expected-result__column-value">
            {`${this.props.value.liquidationPrice.toFixed(2)} USD`}
          </div>
          <div className="trade-expected-result__column-title">
            Liquidation Price
          </div>
        </div>
      </div>
    );
  }
}
