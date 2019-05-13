import { BigNumber } from "@0x/utils";
import moment from "moment";
import React, { Component, ReactNode } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { Change24HMarker, Change24HMarkerSize } from "./Change24HMarker";

export interface IPriceGraphProps {
  data: IPriceDataPoint[];
}

interface IPriceGraphState {
  priceBaseLine: number;
  data: IPriceDataPoint[];
  displayedDataPoint: IPriceDataPoint | null;
}

export class PriceGraph extends Component<IPriceGraphProps, IPriceGraphState> {
  private _latestDataPoint: IPriceDataPoint | null = null;

  constructor(props: IPriceGraphProps, context?: any) {
    super(props, context);

    this.state = { priceBaseLine: 0, data: [], displayedDataPoint: null };
  }

  public derivedUpdate() {
    const normalizedData = this.normalizePrices(this.props.data);

    this.setState({
      ...this.state,
      priceBaseLine: normalizedData.priceBaseLine,
      data: normalizedData.points,
      displayedDataPoint: normalizedData.points[normalizedData.points.length - 1]
    });
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<IPriceGraphProps>, prevState: Readonly<IPriceGraphState>, snapshot?: any): void {
    if (
      this.props.data !== prevProps.data
    ) {
      this.derivedUpdate();
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
    const priceText = price.toFixed(4);
    const change24h = this.state.displayedDataPoint
      ? new BigNumber(this.state.displayedDataPoint.change24h)
      : new BigNumber(0);

    return (
      <div className="price-graph">
        <div className="price-graph__hovered-time-container">
          <div className="price-graph__hovered-time">{`${timeStampText}`}</div>
          <div className="price-graph__hovered-time-delimiter">
            <div />
          </div>
        </div>
        <div className="price-graph__hovered-price-marker">{`$${priceText}`}</div>
        <div className="price-graph__hovered-change-1h-marker">
          <Change24HMarker value={change24h} size={Change24HMarkerSize.LARGE} />
        </div>
        <div className="price-graph__graph-container">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={this.state.data}>
              <Tooltip content={this.renderTooltip} />

              <Line
                type="monotone"
                dataKey="price"
                animationDuration={500}
                dot={false}
                activeDot={false}
                stroke="#ffffff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="price-graph__timeline">
          <div className="price-graph__timeline-from">{timeStampFromText}</div>
          <div className="price-graph__timeline-to">{timeStampToText}</div>
        </div>
      </div>
    );
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

  private normalizePrices(priceDataPoints: IPriceDataPoint[]): { priceBaseLine: number, points: IPriceDataPoint[] } {
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
