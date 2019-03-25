import BigNumber from "bignumber.js";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";

export interface ITradeTokenGridProps {
  selectedKey: string;

  onSelect: (key: string) => void;
  onTrade: (tradeType: TradeType, request: TradeRequest) => void;
}

export interface ITradeTokenGridState {
  tokens: ITradeTokenGridRowProps[];
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {
  constructor(props: ITradeTokenGridProps) {
    super(props);

    this.state = {
      tokens: this._getTokens(props)
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<ITradeTokenGridProps>, nextContext: any): void {
    this.setState({
      ...this.state,
      tokens: this._getTokens(nextProps)
    });
  }

  public componentDidMount(): void {
    const e = this.state.tokens[0];
    this.props.onSelect(`${e.asset}_${e.positionType}_${e.defaultLeverage}`);
  }

  public render() {
    const tokenRows = this.state.tokens.map(e => <TradeTokenGridRow key={`${e.asset}_${e.positionType}`} {...e} />);

    return (
      <div className="trade-token-grid">
        <TradeTokenGridHeader />
        {tokenRows}
      </div>
    );
  }

  private _getTokens = (props: ITradeTokenGridProps) => {
    return [
      {
        selectedKey: props.selectedKey,
        asset: Asset.wBTC,
        positionType: PositionType.LONG,
        defaultLeverage: 2,
        price: new BigNumber("21.26"),
        change24h: new BigNumber("-0.36"),
        profit: new BigNumber("14.32"),
        onSelect: props.onSelect,
        onTrade: props.onTrade
      },
      {
        selectedKey: props.selectedKey,
        asset: Asset.DAI,
        positionType: PositionType.SHORT,
        defaultLeverage: 2,
        price: new BigNumber("42.71"),
        change24h: new BigNumber("0.17"),
        onSelect: props.onSelect,
        onTrade: props.onTrade
      }
    ];
  };
}
