import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import FulcrumProvider from "../services/FulcrumProvider";
import { Change24HMarker, Change24HMarkerSize } from "./Change24HMarker";
import { LeverageSelector } from "./LeverageSelector";
import { PositionTypeMarker } from "./PositionTypeMarker";

export interface ITradeTokenGridRowProps {
  selectedKey: TradeTokenKey;

  asset: Asset;
  positionType: PositionType;
  defaultLeverage: number;

  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
}

interface ITradeTokenGridRowState {
  assetDetails: AssetDetails | null;
  leverage: number;
}

export class TradeTokenGridRow extends Component<ITradeTokenGridRowProps, ITradeTokenGridRowState> {
  constructor(props: ITradeTokenGridRowProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.asset);

    this.state = {
      leverage: this.props.defaultLeverage,
      assetDetails: assetDetails || null
    };
  }

  private getTradeTokenGridRowSelectionKey(leverage: number = this.state.leverage) {
    return new TradeTokenKey(this.props.asset, this.props.positionType, leverage);
  }

  public shouldComponentUpdate(
    nextProps: Readonly<ITradeTokenGridRowProps>,
    nextState: Readonly<ITradeTokenGridRowState>,
    nextContext: any
  ): boolean {
    const currentTradeTokenKey = this.getTradeTokenGridRowSelectionKey(this.state.leverage);
    const nextTradeTokenKey = this.getTradeTokenGridRowSelectionKey(nextState.leverage);

    return (
      nextState.leverage !== this.state.leverage ||
      (nextProps.selectedKey.toString() === nextTradeTokenKey.toString()) !==
        (this.props.selectedKey.toString() === currentTradeTokenKey.toString())
    );
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const tradeTokenKey = this.getTradeTokenGridRowSelectionKey(this.state.leverage);
    const latestPriceDataPoint = FulcrumProvider.getPriceLatestDataPoint(tradeTokenKey);
    const bnPrice = new BigNumber(latestPriceDataPoint.price);
    const bnChange24h = new BigNumber(latestPriceDataPoint.change24h);
    const profit = FulcrumProvider.getTradeProfit(tradeTokenKey);

    const isActiveClassName =
      tradeTokenKey.toString() === this.props.selectedKey.toString() ? "trade-token-grid-row--active" : "";

    return (
      <div className={`trade-token-grid-row ${isActiveClassName}`} onClick={this.onSelectClick}>
        <div
          className="trade-token-grid-row__col-token-image"
          style={{ backgroundColor: this.state.assetDetails.bgColor, borderLeftColor: this.state.assetDetails.bgColor }}
        >
          <img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName} />
        </div>
        <div className="trade-token-grid-row__col-token-name">{this.state.assetDetails.displayName}</div>
        <div className="trade-token-grid-row__col-position-type">
          <PositionTypeMarker value={this.props.positionType} />
        </div>
        <div className="trade-token-grid-row__col-leverage">
          <LeverageSelector
            value={this.state.leverage}
            minValue={this.props.positionType === PositionType.SHORT ? 1 : 2}
            maxValue={4}
            onChange={this.onLeverageSelect}
          />
        </div>
        <div className="trade-token-grid-row__col-price">{`$${bnPrice.toFixed(2)}`}</div>
        <div className="trade-token-grid-row__col-change24h">
          <Change24HMarker value={bnChange24h} size={Change24HMarkerSize.MEDIUM} />
        </div>
        <div className="trade-token-grid-row__col-profit">{profit ? `$${profit.toFixed(2)}` : "-"}</div>
        <div className="trade-token-grid-row__col-action">
          <button className="trade-token-grid-row__buy-button" onClick={this.onBuyClick}>
            {TradeType.BUY}
          </button>
          <button className="trade-token-grid-row__sell-button" onClick={this.onSellClick}>
            {TradeType.SELL}
          </button>
        </div>
      </div>
    );
  }

  public onLeverageSelect = (value: number) => {
    this.setState({ ...this.state, leverage: value });

    this.props.onSelect(this.getTradeTokenGridRowSelectionKey(value));
  };

  public onSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onSelect(this.getTradeTokenGridRowSelectionKey());
  };

  public onBuyClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onTrade(
      new TradeRequest(TradeType.BUY, this.props.asset, this.props.positionType, this.state.leverage, new BigNumber(0))
    );
  };

  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onTrade(
      new TradeRequest(TradeType.SELL, this.props.asset, this.props.positionType, this.state.leverage, new BigNumber(0))
    );
  };
}
