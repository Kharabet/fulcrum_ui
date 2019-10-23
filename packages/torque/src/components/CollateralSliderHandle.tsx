import React, { Fragment } from "react";

export function CollateralSliderHandle({
  domain: [min, max],
  handle: { id, value, percent },
  readonly: readonly,
  getHandleProps
}: {
  domain: ReadonlyArray<number>;
  handle: { id: string; value: number; percent: number };
  readonly: boolean,
  getHandleProps: any;
}) {
  const style = {
    left: `${percent}%`,
    position: "absolute",
    transform: "translate(-50%, -50%)",
    WebkitTapHighlightColor: "rgba(0,0,0,0)",
    zIndex: 5,
    width: "2.25rem",
    height: "2.25rem",
    backgroundColor: "none",
    cursor: ""
  };
  if (!readonly) {
    style.cursor = "pointer";
  }
  
    return (
    <Fragment>
      <div
        style={style}
        {...getHandleProps(id)}
      >
        <div style={{ lineHeight: "2.25rem" }}>&nbsp;</div>
      </div>

      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          left: `${percent}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          width: "1.625rem",
          height: "1.625rem",
          border: "0.25rem solid #fff",
          borderRadius: "50%",
          backgroundColor: "#6488ff"
        }}
      />
    </Fragment>
  );
}
