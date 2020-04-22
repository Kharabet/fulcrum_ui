import React, { CSSProperties, useEffect, useRef } from "react";
import { GetRailProps } from "react-compound-slider";

export function CollateralSliderRail(param: {
  getRailProps: GetRailProps,
  readonly: boolean,
  showExactCollaterization?: boolean;
  minValue: number;
  maxValue: number;
  value: number;
}) {
  const percent = param.value / param.maxValue * 100;
  const railInner = useRef<HTMLDivElement>(null);
  const railGradient = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (param.showExactCollaterization === undefined || param.showExactCollaterization === false ) return
    const linearGradient = `linear-gradient(90deg, #FF4F4F 0%, #F0E93F 52.16%, #33DFCC ${railInner.current!.offsetWidth}px)`;
    railGradient.current!.style.backgroundImage = linearGradient;
  });
  return (
    <React.Fragment>
      <div
        className="rail-outer"
        {...param.getRailProps()}
      />
      <div className="rail-inner" ref={railInner}>
        <div className="gradient" ref={railGradient} style={{ width: param.showExactCollaterization !== undefined && param.showExactCollaterization === true ? `${percent}%` : "100%" }}></div>
      </div>
    </React.Fragment>
  );
}
