import React, { Component } from "react";
import { Handles, HandlesObject, Rail, Slider } from "react-compound-slider";
import { RailObject } from "react-compound-slider/Rail/Rail";
import { RepayLoanSliderHandle } from "./RepayLoanSliderHandle";
import { RepayLoanSliderRail } from "./RepayLoanSliderRail";

export interface IRepayLoanSliderProps {
  readonly: boolean;
  minValue: number;
  maxValue: number;
  value: number;

  onUpdate?: (value: number) => void;
  onChange?: (value: number) => void;
}

export class RepayLoanSlider extends Component<IRepayLoanSliderProps> {
  public render() {
    return (
      <Slider
        disabled={this.props.readonly}
        mode={1}
        step={1}
        domain={[this.props.minValue, this.props.maxValue]}
        rootProps={{ className: "xexe" }}
        rootStyle={{
          position: "relative",
          width: "100%",
          touchAction: "none"
        }}
        onUpdate={this.onUpdate}
        onChange={this.onChange}
        values={[this.props.value]}
      >
        <Rail>{(railObject: RailObject) => <RepayLoanSliderRail getRailProps={railObject.getRailProps} />}</Rail>
        <Handles>
          {(handlesObject: HandlesObject) => (
            <div className="slider-handles">
              {handlesObject.handles.map(handle => (
                <RepayLoanSliderHandle
                  key={handle.id}
                  handle={handle}
                  domain={[this.props.minValue, this.props.maxValue]}
                  getHandleProps={handlesObject.getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
      </Slider>
    );
  }

  private onUpdate = (values: ReadonlyArray<number>) => {
    if (this.props.onUpdate) {
      this.props.onUpdate(values[0]);
    }
  };

  private onChange = (values: ReadonlyArray<number>) => {
    if (this.props.onChange) {
      this.props.onChange(values[0]);
    }
  };
}
