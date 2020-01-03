import { BigNumber } from "@0x/utils";
import moment from "moment";
import React, {ChangeEvent, Component, ReactNode} from "react";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
// import { Change24HMarker, Change24HMarkerSize } from "./Change24HMarker";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import {TradeType} from "../domain/TradeType";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { CheckBox } from "./CheckBox";

export interface IPriceGraphProps {
  data: IPriceDataPoint[];
  selectedKey: TradeTokenKey;
  isLong: boolean;
  isShort: boolean;
  changeActiveBtn:  (activeType:string) => void;
  showMyTokensOnly: boolean;
  onShowMyTokensOnlyChange: (value: boolean) => void;
}

interface IPriceGraphState {
  priceBaseLine: number;
  data: IPriceDataPoint[];
  displayedDataPoint: IPriceDataPoint | null;
  liquidationPrice: number | null;
  liquidationPriceNormed: number | null;
  assetDetails: AssetDetails | null;

}

export class PriceGraph extends Component<IPriceGraphProps, IPriceGraphState> {
  private _latestDataPoint: IPriceDataPoint | null = null;

  constructor(props: IPriceGraphProps, context?: any) {
    super(props, context);

    this.state = {  priceBaseLine: 0, data: [], displayedDataPoint: null, liquidationPrice: null, liquidationPriceNormed: null, assetDetails: null };
  }

  public async derivedUpdate() {
    const latestPriceData = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(this.props.selectedKey);
    const normalizedData = await this.normalizePrices(this.props.data, latestPriceData);

    const assetDetails = AssetsDictionary.assets.get(this.props.selectedKey.asset) || null;

    this.setState({
      ...this.state,
      priceBaseLine: normalizedData.priceBaseLine,
      data: normalizedData.points,
      displayedDataPoint: normalizedData.points[normalizedData.points.length - 1],
      liquidationPrice: latestPriceData.liquidationPrice !== 0 ? latestPriceData.liquidationPrice : null,
      liquidationPriceNormed: 0,
      assetDetails
    });
  }

  public async componentDidMount() {
    await this.derivedUpdate();
  }

  public async componentDidUpdate(prevProps: Readonly<IPriceGraphProps>, prevState: Readonly<IPriceGraphState>, snapshot?: any) {
    if (
      this.props.data !== prevProps.data
    ) {
      await this.derivedUpdate();
    }
  }

  public render() {
    const timeStampFromText = this.props.data.length > 0
      ? moment.unix(this.props.data.map(e => e.timeStamp).reduce((a, b) => Math.min(a, b))).format("MMM DD, hh:mm A")
      : "-";
    const timeStampToText = this.props.data.length > 0
      ? moment.unix(this.props.data.map(e => e.timeStamp).reduce((a, b) => Math.max(a, b))).format("MMM DD, hh:mm A")
      : "-";

    const timeStampText = this.state.displayedDataPoint
      ? moment.unix(this.state.displayedDataPoint.timeStamp).format("MMM DD, hh:mm A")
      : "-";
    const price = this.state.displayedDataPoint
      ? new BigNumber(this.state.priceBaseLine + this.state.displayedDataPoint.price)
      : new BigNumber(0);
    // console.log("price = = ",price)
    const priceText = price.toFixed(4);

    /*const change24h = this.state.displayedDataPoint
      ? new BigNumber(this.state.displayedDataPoint.change24h)
      : new BigNumber(0);*/

    /*let liq
      const liquidationPrice = this.props.data.length > 0 && this.props.data
      ? */
    const changeActiveBtn  =   this.props.changeActiveBtn;
    const isMobileMedia = (window.innerWidth <= 959);
    return (
      <div className="price-graph">
        {(isMobileMedia && !this.props.showMyTokensOnly ?
        <div className="trade-token-grid-row__col-action-mb">

          <button className={"trade-token-grid-row__group-button button-lg " + (this.props.isLong ? 'btn-active': '' )} onClick={() => changeActiveBtn('long')}>
            Long
          </button>
          <button className={"trade-token-grid-row__group-button button-sh "+ (this.props.isShort ? 'btn-active': '' )} onClick={() => changeActiveBtn('short')}>
            Short
          </button>
        </div> : '')}

        {(isMobileMedia && this.props.showMyTokensOnly ?
            <div className="trade-token-grid-header__col-actions">
              <span className="">
                <CheckBox checked={this.props.showMyTokensOnly} onChange={this.showMyTokensOnlyChange}>Manage Open Positions</CheckBox>
              </span>
            </div>
          :'')}
        <div className="price-graph__hovered-time-container">
          <div className="price-graph__hovered-price-marker-label" >{this.state.assetDetails ? this.state.assetDetails.labelName : ``}</div>
          <div className="price-graph__hovered-time-delimiter">
            <div />
          </div>
          <div className="price-graph__hovered-time">{`${timeStampText}`}</div>
        </div>
        <div className="price-graph__hovered-price-marker">{ priceText ==='1.0000' || priceText ==='0.0000' ? 'Loading...' : `$${priceText}`}</div>
        {/*<div className="price-graph__hovered-change-1h-marker">
          <Change24HMarker value={change24h} size={Change24HMarkerSize.LARGE} />
        </div>*/}
        <div className="price-graph__graph-container">
          {isMobileMedia ?
            (<ResponsiveContainer className="price-graph__line" width="80%" height={60}>
            <LineChart data={this.state.data}>
              <Tooltip content={this.renderTooltip} />

              <Line
                type="monotone"
                dataKey="price"
                animationDuration={500}
                dot={false}
                activeDot={false}
                stroke={this.state.assetDetails ? this.state.assetDetails.bgColor : `#ffffff`}
                strokeWidth={2}
              />

              {this.state.liquidationPriceNormed ? (
                <ReferenceLine y={this.state.liquidationPriceNormed} stroke="#ff0000" strokeDasharray="5 5" />
              ): ``}
            </LineChart>
          </ResponsiveContainer>)
            :

            (<ResponsiveContainer width="100%" height={160}>
            <LineChart data={this.state.data}>
              <Tooltip content={this.renderTooltip} />

              <Line
                type="monotone"
                dataKey="price"
                animationDuration={500}
                dot={false}
                activeDot={false}
                stroke={this.state.assetDetails ? this.state.assetDetails.bgColor : `#ffffff`}
                strokeWidth={2}
              />

              {this.state.liquidationPriceNormed ? (
                <ReferenceLine y={this.state.liquidationPriceNormed} stroke="#ff0000" strokeDasharray="5 5" />
              ): ``}
            </LineChart>
          </ResponsiveContainer>)}
        </div>
        <div className="price-graph__timeline">
          <div className="price-graph__timeline-from">{timeStampFromText}</div>
          <div className="price-graph__timeline-dots" />
          <div className="price-graph__timeline-to">{timeStampToText}</div>
        </div>
      </div>
    );
  }

  public showMyTokensOnlyChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onShowMyTokensOnlyChange(event.target.checked);
  }

  public renderTooltip = (e: TooltipProps): ReactNode => {
    if (e.active) {
      if (e.payload) {
        const value = e.payload[0].payload as IPriceDataPoint;
        if (this._latestDataPoint) {
          if (value === this._latestDataPoint) {
            return;
          }
        }

        this._latestDataPoint = value;
        this.setState({ ...this.state, displayedDataPoint: value });
      }
    }
    return null;
  };

  private normalizePrices(priceDataPoints: IPriceDataPoint[], latestPriceData: IPriceDataPoint): { priceBaseLine: number, points: IPriceDataPoint[] } {

    let lastItem: IPriceDataPoint | null;
    if (priceDataPoints.length > 0) {
      lastItem = priceDataPoints[priceDataPoints.length-1];
    } else {
      lastItem = null;
    }

    if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
      /*if (latestPriceData.price !== 0 && (!lastItem || lastItem.timeStamp < latestPriceData.timeStamp)) {
        priceDataPoints.push(latestPriceData);
      }*/
    } else {
      // TEMP FIX: normalize mainnet prices to ropsten
      if (lastItem && latestPriceData.price !== 0) {
        Object.keys(priceDataPoints).map((obj, index) => {
          priceDataPoints[index].price = new BigNumber(priceDataPoints[index].price).multipliedBy(latestPriceData.price).dividedBy(lastItem!.price).toNumber();
        });
      }
    }

    let prev: number;
    priceDataPoints = priceDataPoints.map(e => {
      if (prev && e.price === 0) {
        e.price = prev;
      }
      prev = e.price;
      return e;
    });
    const prices = priceDataPoints.map(e => e.price);
    const priceMin = prices.length > 0 ? prices.reduce((a, b) => Math.min(a, b)) : 0;
    const priceMax = prices.length > 0 ? prices.reduce((a, b) => Math.max(a, b)) : 0;
    const priceBaseLine = priceMin - (priceMax - priceMin) * 0.3;
    if (priceBaseLine > 0) {
      const normalizedData = priceDataPoints.map(e => {
        return { ...e, price: e.price - priceBaseLine };
      });
      return { points: normalizedData, priceBaseLine: priceBaseLine };
    } else {
      // tslint:disable-next-line:arrow-return-shorthand
      return { points: priceDataPoints.map(e => { return { ...e }; }), priceBaseLine: 0 };
    }
  }
}
