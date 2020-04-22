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

  return (
    <Fragment>
      <div
        className="handle-outer"
        style={{ left: `${percent}%` }}
        {...getHandleProps(id)}
      >
      </div>

      <div
        className="handle-inner"
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{ left: `${percent}%` }}
      />
    </Fragment>
  );
}
