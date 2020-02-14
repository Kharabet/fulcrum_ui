import React, { Component } from "react";
import { AssetDetails } from "../domain/AssetDetails";
import { PositionType } from "../domain/PositionType";

export interface IPositionTypeMarkerAltProps {
  assetDetails: AssetDetails;
  value: PositionType;
}

export class PositionTypeMarkerAlt extends Component<IPositionTypeMarkerAltProps> {
  public render() {
    const img =
      this.props.value === PositionType.LONG ?
        "data:image/svg+xml;base64," +
        btoa(
          `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0)">
          <path d="M1.00536e-06 11.5C4.50116e-07 17.8513 5.14873 23 11.5 23C17.8513 23 23 17.8513 23 11.5C23 5.14873 17.8513 -4.50116e-07 11.5 -1.00536e-06C5.14873 -1.56061e-06 1.56061e-06 5.14872 1.00536e-06 11.5Z" fill="#00C0AB"/>
          <path d="M12.105 15.7368L10.8945 15.7368L10.8945 8.47366L12.105 8.47366L12.105 15.7368Z" fill="white"/>
          <path d="M14.9229 10.6445L14.0669 11.5005L10.643 8.07662L11.499 7.22064L14.9229 10.6445Z" fill="white"/>
          <path d="M8.9314 11.5L8.07543 10.644L11.4993 7.22014L12.3553 8.07611L8.9314 11.5Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0">
          <rect x="23" y="23" width="23" height="23" transform="rotate(-180 23 23)" fill="white"/>
          </clipPath>
          </defs>
          </svg>
          `
          .replace("#AAA", this.props.assetDetails.bgColor)
        )
      : this.props.value === PositionType.SHORT ?
          "data:image/svg+xml;base64," +
          btoa(
            `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 11.5C23 5.14873 17.8513 0 11.5 0C5.14873 0 0 5.14873 0 11.5C0 17.8513 5.14873 23 11.5 23C17.8513 23 23 17.8513 23 11.5Z" fill="#FF5353"/>
            <path d="M10.895 7.26318H12.1055V14.5263H10.895V7.26318Z" fill="white"/>
            <path d="M8.07715 12.3555L8.93312 11.4995L12.357 14.9234L11.501 15.7794L8.07715 12.3555Z" fill="white"/>
            <path d="M14.0686 11.5L14.9246 12.356L11.5007 15.7799L10.6447 14.9239L14.0686 11.5Z" fill="white"/>
            </svg>`
            .replace("#AAA", this.props.assetDetails.bgColor)
          )
      : undefined;
    return <img className="position-type-marker-alt" src={img} />;
  }
}
