import { BigNumber } from '@0x/utils'
import React from 'react'
import { tokenIcons } from 'app-images'
import { InputBasic } from 'ui-framework'

interface IStakeInputProps {
  id: string
  label: string
  max: BigNumber
  onChange: (name: 'bzrx' | 'vbzrx' | 'ibzrx' | 'bpt', value: number) => void
  value: string
}

export function InputStake(props: IStakeInputProps) {
  return (
    <div className="calc-item">
      <InputBasic
        id={props.id}
        name={props.id}
        className="add-to-balance__input"
        type="number"
        step="0.01"
        max={props.max.toFixed(2, 1)}
        title={props.value}
        value={props.value}
        onChange={props.onChange}
        onChangeEmit="name-value"
      />
      <div className="add-to-balance__range">
        <InputBasic
          id={props.id}
          name={props.id}
          step="0.01"
          type="range"
          min="0"
          max={props.max.toFixed(2, 1)}
          value={props.value}
          onChange={props.onChange}
          onChangeEmit="name-value"
        />
        <div className="line">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div
          className="progress"
          style={{
            width: `calc(100%*${props.value}/${props.max.toFixed(2, 1)})`
          }}
        />
      </div>
      <label className="sign">{props.label}</label>
      <span className="add-to-balance__icon">{tokenIcons[props.id]}</span>
    </div>
  )
}

export default React.memo(InputStake)
