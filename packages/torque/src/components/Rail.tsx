import React, { FunctionComponent } from 'react'
import { BigNumber } from '@0x/utils'

interface IRailProps {
  sliderValue: number
  sliderMax: number
  sliderMin: number
}

export const Rail: FunctionComponent<IRailProps> = (props) => {
  function inverseCurve(x: number): number {
    const min = props.sliderMin - 0.30194
    return new BigNumber(Math.log((x - min) / 0.30194) / 2.30097)
      .dp(2, BigNumber.ROUND_HALF_UP)
      .toNumber()
  }

  const width = (1 - inverseCurve(props.sliderValue) / inverseCurve(props.sliderMax)) * 100

  return (
    <div className="rail">
      <div
        className="rail__outer"
        style={{
          width: `${width}%`,
          overflow: `hidden`
        }}>
        <div
          className="rail__inner"
          style={{
            width: `${10000 / width}%`
          }}
        />
      </div>
    </div>
  )
}
