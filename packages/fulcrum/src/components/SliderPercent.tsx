import React, { Component } from 'react'
import Slider from 'rc-slider'

interface ISliderPercentProps {
  onInsertMaxValue: (value: number) => void
  percentSlider: number
  maxSliderValue: number
}
export class SliderPercent extends Component<ISliderPercentProps> {
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
    const sliderValue = this.props.percentSlider * this.props.maxSliderValue
    return (
      <React.Fragment>
        <div className="wrapper-slider-percent green-slider">
          <div className="slider-percent">
            <Slider
              min={0}
              max={this.props.maxSliderValue}
              step={1}
              value={sliderValue}
              onChange={this.onChange}
              // onAfterChange={this.onAfterChange}
            />
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
    this.props.onInsertMaxValue(value / this.props.maxSliderValue)
  }
  public setMaxPercent = (event: any) => {
    this.props.onInsertMaxValue(1)
  }
}
