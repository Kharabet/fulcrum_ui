import React, { Fragment } from "react";

export function CollaterallRefinanceSliderHandle({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps
}: {
  domain: ReadonlyArray<number>;
  handle: { id: string; value: number; percent: number };
  getHandleProps: any;
}) {
  return (
    <Fragment>
      <div
        style={{
          left: `${percent}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          WebkitTapHighlightColor: "rgba(0,0,0,0)",
          zIndex: 5,
          width: "2.25rem",
          height: "2.25rem",
          cursor: "pointer",
          backgroundColor: "none"
        }}
        {...getHandleProps(id)}
      >
        <div style={{ lineHeight: "2.25rem" }}>&nbsp;</div>
      </div>

      <div
        className="slider-handle"
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          left: `${percent}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          width: "23px",
          height: "23px",
          borderRadius: "50%",
          backgroundColor: "#8E7DF6"
        }}
      />
      <div 
        className="slider-track-after"
        style={{
        position: "absolute",
        width: `${100 - percent}%`,        
        height: "0.5rem",
        right: "-1px",
        transform: "translate(0%, -50%)",
        borderRadius: "0.5rem",
        pointerEvents: "none",
      }} />
    </Fragment>
  );
}
