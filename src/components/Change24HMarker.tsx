import React, { Component } from "react";
import BigNumber from "bignumber.js";

export interface IChange24HMarkerProps {
  value: BigNumber;
}

export class Change24HMarker extends Component<IChange24HMarkerProps> {
  render() {
    return (
      <span className={`change-24-h-marker ${(this.props.value.isNegative()) ? "change-24-h-marker--down" : "change-24-h-marker--up"}`}>
        <span className="change-24-h-marker__trend-pointer">
          {(this.props.value.isNegative()) ? "\u25be" : "\u25b4"}
        </span>
        {` ${this.props.value.toFixed(2)}%`}
      </span>
    );
  }
}
