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
      this.props.value === PositionType.SHORT ?
        "data:image/svg+xml;base64," +
        btoa(
          '<svg xmlns="http://www.w3.org/2000/svg" id="ic_short" width="27" height="27" viewBox="0 0 27 27"><defs><style>.cls-1{fill:#fff}.cls-2{fill:#ff5353}.cls-3{fill:#AAA}</style></defs><rect id="Rectangle_517" width="27" height="27" class="cls-3" data-name="Rectangle 517" rx="13.5"/><rect id="Rectangle_376" width="19" height="19" class="cls-2" data-name="Rectangle 376" rx="9.5" transform="translate(4 4)"/><g id="Group_1080" data-name="Group 1080" transform="translate(10.672 10)"><path id="Rectangle_500" d="M0 0h1v6H0z" class="cls-1" data-name="Rectangle 500" transform="translate(2.328)"/><path id="Rectangle_501" d="M0 0h1v4H0z" class="cls-1" data-name="Rectangle 501" transform="rotate(-45 5.078 2.103)"/><path id="Rectangle_502" d="M0 0h1v4H0z" class="cls-1" data-name="Rectangle 502" transform="rotate(45 -1.75 7.725)"/></g></svg>'
          .replace("#AAA", this.props.assetDetails.bgColor)
        )
      : this.props.value === PositionType.LONG ?
          "data:image/svg+xml;base64," +
          btoa(
            '<svg xmlns="http://www.w3.org/2000/svg" id="ic_long" width="27" height="27" viewBox="0 0 27 27"><defs><style>.cls-1{fill:#fff}.cls-2{fill:#69bf83;stroke:#69bf83}.cls-3{stroke:none}.cls-4{fill:none}.cls-5{fill:#AAA}</style></defs><rect id="Rectangle_517" width="27" height="27" class="cls-5" data-name="Rectangle 517" rx="13.5"/><g id="Rectangle_376" class="cls-2" data-name="Rectangle 376" transform="translate(4 4)"><rect width="19" height="19" class="cls-3" rx="9.5"/><rect width="18" height="18" x=".5" y=".5" class="cls-4" rx="9"/></g><g id="Group_1080" data-name="Group 1080" transform="translate(10.672 9.964)"><path id="Rectangle_500" d="M0 0h1v6H0z" class="cls-1" data-name="Rectangle 500" transform="translate(2.328 1.036)"/><path id="Rectangle_501" d="M0 0h1v4H0z" class="cls-1" data-name="Rectangle 501" transform="rotate(45 1.414 3.414)"/><path id="Rectangle_502" d="M0 0h1v4H0z" class="cls-1" data-name="Rectangle 502" transform="rotate(-45 1.914 -2.207)"/></g></svg>'
            .replace("#AAA", this.props.assetDetails.bgColor)
          )
      : undefined;
    return <img className="position-type-marker-alt" src={img} />;
  }
}
