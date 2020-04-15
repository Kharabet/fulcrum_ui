import React, { Fragment } from "react";
import { Tooltip } from "react-tippy";
import { ReactComponent as OpenManageCollateral } from "../assets/images/openManageCollateral.svg";

export function CollateralSliderHandle({
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
          width: "43px",
          height: "31px",
          cursor: "pointer",
          backgroundColor: "none"
        }}
        {...getHandleProps(id)}
      >
        <Tooltip title={`${value}%`} position="top" open={true} arrow={true} trigger="manual" arrowSize="small">
          <div style={{ lineHeight: "2.25rem" }}>&nbsp;</div>
        </Tooltip>
      </div>

      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="collateral-slider-handle__slider"
        style={{
          left: `${percent}%`        
        }}>
        <div className="collateral-slider-handle__icon">
          <OpenManageCollateral /></div>
      </div>
    </Fragment>
  );
}
