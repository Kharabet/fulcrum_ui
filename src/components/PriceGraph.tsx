import BigNumber from "bignumber.js";
import React, { Component, ReactNode } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { Change24HMarker, Change24HMarkerSize } from "./Change24HMarker";

export interface IPriceGraphProps {
  data: IPriceGraphDataPoint[];
}

interface IPriceGraphState {
  displayedDataPoint: IPriceGraphDataPoint | null;
}

export interface IPriceGraphDataPoint {
  price: number;
  change24h: number;
}

export class PriceGraph extends Component<IPriceGraphProps, IPriceGraphState> {
  private _latestDataPoint: IPriceGraphDataPoint | null = null;

  constructor(props: IPriceGraphProps, context?: any) {
    super(props, context);

    this.state = { displayedDataPoint: null };
  }

  public componentDidMount(): void {
    this.setState({ displayedDataPoint: this.props.data[this.props.data.length - 1] });
  }

  public render() {
    const price = this.state.displayedDataPoint ? new BigNumber(this.state.displayedDataPoint.price) : new BigNumber(0);
    const change24h = this.state.displayedDataPoint
      ? new BigNumber(this.state.displayedDataPoint.change24h)
      : new BigNumber(0);
    const priceText = price.toFixed(2);

    return (
      <div className="price-graph">
        <div className="price-graph__hovered-price-marker">{`$${priceText}`}</div>
        <div className="price-graph__hovered-change-1h-marker">
          <Change24HMarker value={change24h} size={Change24HMarkerSize.LARGE} />
        </div>
        <div className="price-graph__graph-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={this.props.data}>
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
      </div>
    );
  }

  public renderTooltip = (e: TooltipProps): ReactNode => {
    if (e.active) {
      if (e.payload) {
        const value = e.payload[0].payload as IPriceGraphDataPoint;
        if (this._latestDataPoint) {
          if (value === this._latestDataPoint) {
            return;
          }
        }

        this._latestDataPoint = value;
        this.setState({ displayedDataPoint: value });
      }
    }
    return null;
  };
}
