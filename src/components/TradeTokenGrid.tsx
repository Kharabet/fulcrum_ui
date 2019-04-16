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
  tokenRowsData: ITradeTokenGridRowProps[];
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {
  private static readonly assets: Asset[] = [Asset.wBTC, Asset.ETH, Asset.MKR, Asset.ZRX, Asset.BAT, Asset.REP, Asset.KNC];

  constructor(props: ITradeTokenGridProps) {
    super(props);

    this.state = {
      tokenRowsData: TradeTokenGrid.getRowsData(props)
    };
  }

  public static getDerivedStateFromProps(
    nextProps: Readonly<ITradeTokenGridProps>,
    nextContext: Readonly<ITradeTokenGridState>
  ): ITradeTokenGridState {
    return { tokenRowsData: TradeTokenGrid.getRowsData(nextProps) };
  }

  public componentDidMount(): void {
    const e = this.state.tokenRowsData[0];
    this.props.onSelect(new TradeTokenKey(e.asset, e.positionType, e.defaultLeverage));
  }

  public render() {
    const tokenRows = this.state.tokenRowsData.map(e => <TradeTokenGridRow key={`${e.asset}_${e.positionType}`} {...e} />);

    return (
      <div className="trade-token-grid">
        <TradeTokenGridHeader />
        {tokenRows}
      </div>
    );
  }

  private static getRowsData = (props: ITradeTokenGridProps): ITradeTokenGridRowProps[] => {
    const rowsData: ITradeTokenGridRowProps[] = [];

    TradeTokenGrid.assets.forEach(e => {
      rowsData.push({
        selectedKey: props.selectedKey,
        asset: e,
        positionType: PositionType.SHORT,
        defaultLeverage: props.defaultLeverageShort,
        onSelect: props.onSelect,
        onTrade: props.onTrade
      });

      rowsData.push({
        selectedKey: props.selectedKey,
        asset: e,
        positionType: PositionType.LONG,
        defaultLeverage: props.defaultLeverageLong,
        onSelect: props.onSelect,
        onTrade: props.onTrade
      });
    });

    return rowsData;
  };
}
