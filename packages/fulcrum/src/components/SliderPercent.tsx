import React, { Component, ChangeEvent } from 'react'
import Slider from 'rc-slider'

import '../styles/components/input-amount.scss'

interface ISliderPercentProps {
  onInsertMaxValue: (value: number) => void
  percentSlider: number
}

interface ISliderPercentState {
  selectedPercent: number
}

export class SliderPercent extends Component<ISliderPercentProps, ISliderPercentState> {
  private _input: HTMLInputElement | null = null

  constructor(props: ISliderPercentProps) {
    super(props)
  }
  public async componentDidMount() {
    if (this._input) {
      this._input.focus()
    }
  }
  public render() {
    return (
      <React.Fragment>
        <div className="wrapper-slider-percent">
          <div className="slider-percent">
            <Slider
              min={1}
              max={28}
              step={1}
              value={this.props.percentSlider}
              onChange={this.onChange}
              onAfterChange={this.onAfterChange}
            />
            <div
              style={{ left: `${(this.props.percentSlider / 28) * 100}%` }}
              className="label-percent">
              {this.props.percentSlider}&nbsp;days
            </div>
            <div className="dots-percent">
              <div className="dot-percent"></div>
              <div className="dot-percent"></div>
              <div className="dot-percent"></div>
              <div className="dot-percent"></div>
              <div className="dot-percent"></div>
            </div>
          </div>
          <div className="max-percent" onClick={this.setMaxPercent}>
            Max
          </div>
        </div>
      </React.Fragment>
    )
  }
  public onChange = (value: number) => {
    this.props.onInsertMaxValue(value)
  }
  public onAfterChange = (value: number) => {
    this.props.onInsertMaxValue(value)
  }
  public setMaxPercent = (event: any) => {
    this.props.onInsertMaxValue(100)
  }
}
