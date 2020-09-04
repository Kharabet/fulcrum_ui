import React, { FunctionComponent } from "react";

interface IRailProps {
  sliderValue: number,
  sliderMax: number
}

export const Rail: FunctionComponent<IRailProps> = (props) =>
  <div className="outer-rail">
    <div className="inner-rail" style={{ width: `${props.sliderValue / props.sliderMax * 100}%`, backgroundImage: `linear-gradient(90deg, rgb(255, 79, 79) 0%, rgb(240, 233, 63) 52.16%, rgb(51, 223, 204) 483px)` }}></div>
  </div>