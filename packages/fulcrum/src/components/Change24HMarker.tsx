import { BigNumber } from "@0x/utils";
import React, { Component } from "react";

export enum Change24HMarkerSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

export interface IChange24HMarkerProps {
  value: BigNumber;
  size: Change24HMarkerSize;
}

export class Change24HMarker extends Component<IChange24HMarkerProps> {
  public render() {
    const sizeStyleName = `change-24-h-marker--${this.props.size}`;
    const trendDirectionStyleName = this.props.value.isNegative()
      ? "change-24-h-marker--down"
      : "change-24-h-marker--up";

    return (
      <span className={`change-24-h-marker ${trendDirectionStyleName} ${sizeStyleName}`}>
        <span className="change-24-h-marker__trend-pointer">{this.props.value.isNegative() ? "\u25be" : "\u25b4"}</span>
        &nbsp;
        <span className="change-24-h-marker__value">{` ${this.props.value.absoluteValue().toFixed(2)}%`}</span>
      </span>
    );
  }
}
