import React, { CSSProperties } from "react";
import { GetRailProps } from "react-compound-slider";

const railOuterStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "2.5rem",
  transform: "translate(0%, -50%)",
  cursor: "pointer"
};

const railInnerStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "0.5rem",
  transform: "translate(0%, -50%)",
  borderRadius: "0.5rem",
  pointerEvents: "none",
  backgroundImage: "linear-gradient(to right, #597beb, #9be2ca)"
};

export function RepayLoanSliderRail(param: { getRailProps: GetRailProps }) {
  return (
    <React.Fragment>
      <div style={railOuterStyle} {...param.getRailProps()} />
      <div style={railInnerStyle} />
    </React.Fragment>
  );
}
