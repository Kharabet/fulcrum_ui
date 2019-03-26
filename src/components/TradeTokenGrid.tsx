import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";

export interface ITradeTokenGridProps {
  selectedKey: TradeTokenKey;
  defaultLeverageShort: number;
  defaultLeverageLong: number;

  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
}

interface ITradeTokenGridState {
  tokens: ITradeTokenGridRowProps[];
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {
  private readonly assets: Asset[] = [Asset.wBTC, Asset.ETH, Asset.MKR, Asset.ZRX, Asset.BAT, Asset.REP, Asset.KNC];

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
    this.props.onSelect(new TradeTokenKey(e.asset, e.positionType, e.defaultLeverage));
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

  private _getTokens = (props: ITradeTokenGridProps): ITradeTokenGridRowProps[] => {
    const tokens: ITradeTokenGridRowProps[] = [];

    this.assets.forEach(e => {
      tokens.push({
        selectedKey: props.selectedKey,
        asset: e,
        positionType: PositionType.SHORT,
        defaultLeverage: props.defaultLeverageShort,
        onSelect: props.onSelect,
        onTrade: props.onTrade
      });

      tokens.push({
        selectedKey: props.selectedKey,
        asset: e,
        positionType: PositionType.LONG,
        defaultLeverage: props.defaultLeverageLong,
        onSelect: props.onSelect,
        onTrade: props.onTrade
      });
    });

    return tokens;
  };
}
