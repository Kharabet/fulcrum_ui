import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";

export interface ITradeTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;
  defaultLeverageShort: number;
  defaultLeverageLong: number;

  onShowMyTokensOnlyChange: (value: boolean) => void;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
}

interface ITradeTokenGridState {
  tokenRowsData: ITradeTokenGridRowProps[];
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {
  private static readonly assets: Asset[] = [
    Asset.ETH,
    // Asset.DAI,
    // Asset.USDC,
    Asset.USDC,
    //Asset.MKR,
    Asset.ZRX,
    Asset.BAT,
    Asset.REP,
    Asset.KNC
  ];

  constructor(props: ITradeTokenGridProps) {
    super(props);

    this.state = {
      tokenRowsData: TradeTokenGrid.getRowsData(props)
    };
  }

  public async derivedUpdate() {
    this.setState({ ...this.state, tokenRowsData: TradeTokenGrid.getRowsData(this.props) }) ;
  }

  public componentDidMount(): void {
    const e = this.state.tokenRowsData[0];
    this.props.onSelect(new TradeTokenKey(e.asset, e.positionType, e.defaultLeverage));

    this.derivedUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<ITradeTokenGridProps>, prevState: Readonly<ITradeTokenGridState>, snapshot?: any): void {
    if (this.props.selectedKey !== prevProps.selectedKey || this.props.showMyTokensOnly !== prevProps.showMyTokensOnly) {
      this.derivedUpdate();
    }
  }

  public render() {
    const tokenRows = this.state.tokenRowsData.map(e => <TradeTokenGridRow key={`${e.asset}_${e.positionType}`} {...e} />);

    return (
      <div className="trade-token-grid">
        <TradeTokenGridHeader showMyTokensOnly={this.props.showMyTokensOnly} onShowMyTokensOnlyChange={this.props.onShowMyTokensOnlyChange} />
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
