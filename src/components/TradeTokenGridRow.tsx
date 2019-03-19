import React, { Component } from "react";
import BigNumber from "bignumber.js";
import { LeverageSelector } from "./LeverageSelector";
import { PositionTypeMarker } from "./PositionTypeMarker";
import { PositionType } from "../domain/PositionType";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { Change24HMarker } from "./Change24HMarker";
import { TradeRequest } from "../domain/TradeRequest";

export interface ITradeTokenGridRowProps {
  asset: Asset;
  positionType: PositionType;
  price: BigNumber;
  change24h: BigNumber;
  profit?: BigNumber;

  onBuy: (request: TradeRequest) => void;
  onSell: (request: TradeRequest) => void;
}

export interface ITradeTokenGridRowState {
  assetDetails: AssetDetails | null;
  leverage: number;
}

export class TradeTokenGridRow extends Component<ITradeTokenGridRowProps, ITradeTokenGridRowState> {
  constructor(props: ITradeTokenGridRowProps, context?: any) {
    super(props, context);

    let assetDetails = AssetsDictionary.assets.get(props.asset);
    this.state = { leverage: 1, assetDetails: assetDetails || null };
  }

  render() {
    if (!this.state.assetDetails)
      return null;

    return (
      <div className="trade-token-grid-row">
        <div className="trade-token-grid-row__col-token-image" style={{backgroundColor: this.state.assetDetails.bgColor}}>
          <img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName}/>
        </div>
        <div className="trade-token-grid-row__col-token-name">
          {this.state.assetDetails.displayName}
        </div>
        <div className="trade-token-grid-row__col-position-type">
          <PositionTypeMarker value={this.props.positionType}/>
        </div>
        <div className="trade-token-grid-row__col-leverage">
          <LeverageSelector value={this.state.leverage} onChange={this.onLeverageSelect} />
        </div>
        <div className="trade-token-grid-row__col-price">{`$${this.props.price.toFixed(2)}`}</div>
        <div className="trade-token-grid-row__col-change24h">
          <Change24HMarker value={this.props.change24h} />
        </div>
        <div className="trade-token-grid-row__col-profit">{this.props.profit  ? `$${this.props.profit.toFixed(2)}` : "-"}</div>
        <div className="trade-token-grid-row__col-action">
          <button className="trade-token-grid-row__buy-button" onClick={this.onBuyClick}>Buy</button>
          <button className="trade-token-grid-row__sell-button" onClick={this.onSellClick}>Sell</button>
        </div>
      </div>
    );
  }

  onLeverageSelect = (value: number) => {
    this.setState({ ...this.state, leverage: value });
  };

  onBuyClick = () => {
    this.props.onBuy(new TradeRequest(this.props.asset, this.state.leverage, new BigNumber(0)));
  };

  onSellClick = () => {
    this.props.onBuy(new TradeRequest(this.props.asset, this.state.leverage, new BigNumber(0)));
  };
}
