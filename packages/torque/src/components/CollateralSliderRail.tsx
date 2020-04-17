import React, { CSSProperties } from "react";
import { GetRailProps } from "react-compound-slider";

let railOuterStyle: CSSProperties;
/*const railOuterStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "2.5rem",
  transform: "translate(0%, -50%)",
  cursor: "pointer"
};*/

const railInnerStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "7px",
  transform: "translate(0%, -50%)",
  borderRadius: "20px",
  pointerEvents: "none",
  backgroundImage: "linear-gradient(to right, #FF4F4F 0%, #F0E93F 52.16%, #33DFCC 101.16%)"
};

export function CollateralSliderRail(param: { getRailProps: GetRailProps, readonly: boolean }) {
  if (param.readonly) {
    railOuterStyle = {
      position: "absolute",
      width: "100%",
      height: "2.5rem",
      transform: "translate(0%, -50%)"
    };
  } else {
    railOuterStyle = {
      position: "absolute",
      width: "100%",
      height: "2.5rem",
      transform: "translate(0%, -50%)",
      cursor: "pointer"
    };
  }

  return (
    <React.Fragment>
      <div style={railOuterStyle} {...param.getRailProps()} />
      <div style={railInnerStyle} />
    </React.Fragment>
  );
}
