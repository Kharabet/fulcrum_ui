import React, { CSSProperties } from "react";
import { GetRailProps } from "react-compound-slider";

const railOuterStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "38px",
  transform: "translate(0%, -50%)",
  cursor: "pointer"
};

const railInnerStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "6px",
  transform: "translate(0%, -50%)",
  borderRadius: "10px",
  pointerEvents: "none",
  backgroundImage: "linear-gradient(to right, #FF4F4F 0%, #F0E93F 52.16%, #33DFCC 101.16%)"
};

export function CollateralSliderRail(param: { getRailProps: GetRailProps }) {
  return (
    <React.Fragment>
      <div style={railOuterStyle} {...param.getRailProps()} />
      <div style={railInnerStyle} />
    </React.Fragment>
  );
}
