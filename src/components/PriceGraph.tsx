import { Component } from "react";
import React from "react";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";

export interface IPriceGraphParams {}

export interface IPriceGraphState {}

const data = [
  {
    name: "Page A",
    pv: 2400
  },
  {
    name: "Page B",
    pv: 1398
  },
  {
    name: "Page C",
    pv: 9800
  },
  {
    name: "Page D",
    pv: 3908
  },
  {
    name: "Page E",
    pv: 4800
  },
  {
    name: "Page F",
    pv: 3800
  },
  {
    name: "Page G",
    pv: 4300
  }
];

export class PriceGraph extends Component<IPriceGraphParams> {
  constructor(props: IPriceGraphParams, context?: any) {
    super(props, context);

    this.state = {};
  }

  render() {
    return (
      <div className="price-graph">
        <div className="price-graph__hovered-price-marker">$118.31</div>
        <div className="price-graph__hovered-change-1h-marker">0.17%</div>
        <div className="price-graph__graph-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <Tooltip content={() => null} />

              <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
