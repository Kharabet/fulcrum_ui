import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, useRef } from 'react'

interface IInputAmountProps {
  children?: string
  asset: any
  inputAmountText: string
  buttonValue?: BigNumber
  onAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  updateButton?: (state: BigNumber) => void
}

export function InputAmount(props: IInputAmountProps) {
  const _input: HTMLInputElement | null = null
  const _setInputRef = useRef(_input)

  const onButtonValueChange = (event: any) => {
    event.preventDefault()
    const target = event.currentTarget as HTMLButtonElement
    props.updateButton!(new BigNumber(target.dataset.value || 0))
  }

  return (
    <React.Fragment>
      <div className="input-container">
        <div className="input-row">
          <span className="asset-icon">
            <props.asset />
          </span>
          <input
            ref={_setInputRef}
            className="input-amount"
            type="number"
            step="any"
            placeholder={props.children || 'Enter amount'}
            value={props.inputAmountText}
            onChange={props.onAmountChange}
          />
        </div>
        {props.buttonValue && (
          <div className="input-amount__group-button">
            <button
              data-value="0.25"
              className={props.buttonValue.eq(0.25) ? 'active' : ''}
              onClick={onButtonValueChange}>
              25%
            </button>
            <button
              data-value="0.5"
              className={props.buttonValue.eq(0.5) ? 'active' : ''}
              onClick={onButtonValueChange}>
              50%
            </button>
            <button
              data-value="0.75"
              className={props.buttonValue.eq(0.75) ? 'active' : ''}
              onClick={onButtonValueChange}>
              75%
            </button>
            <button
              data-value="1"
              className={props.buttonValue.eq(1) ? 'active' : ''}
              onClick={onButtonValueChange}>
              100%
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
