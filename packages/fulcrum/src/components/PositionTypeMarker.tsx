import React, { Component } from "react";
import { PositionType } from "../domain/PositionType";

import "../styles/components/position-type-marker.scss";

export interface IPositionTypeMarkerProps {
  value: PositionType;
}

export class PositionTypeMarker extends Component<IPositionTypeMarkerProps> {
  public render() {
    return <span className="position-type-marker">{this.props.value}</span>;
  }
}
