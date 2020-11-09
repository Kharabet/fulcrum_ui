import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { LiquidationRequest } from '../domain/LiquidationRequest'
import { InputAmount } from './InputAmount'

import { ReactComponent as CloseIcon } from '../assets/images/ic__close.svg'
export interface ILiquidationFormProps {
  request: LiquidationRequest
  onSubmit: (request: LiquidationRequest) => void
  onClose: () => void
}

export default function LiquidationForm(props: ILiquidationFormProps) {
  const inputPrecision = 6
  const loanToken = AssetsDictionary.assets.get(props.request.loanToken) as AssetDetails
  const collateralToken = AssetsDictionary.assets.get(props.request.collateralToken) as AssetDetails
  const decimals: number = loanToken.decimals || 18
  const maxPayOffAmount: BigNumber = props.request.closeAmount.dividedBy(10 ** decimals)
  const maxSeizeAmount: BigNumber = maxPayOffAmount.dividedBy(props.request.rate)

  const [payOffAmount, setPayOffAmount] = useState(maxPayOffAmount)
  const [seizeAmount, setSeizeAmount] = useState(maxSeizeAmount)
  const [buttonValue, setButtonValue] = useState(new BigNumber(1))
  const [didSubmit, setDidSubmit] = useState(false)

  function onPayOffAmountChange(event: ChangeEvent<HTMLInputElement>) {
    let amount = new BigNumber(event.target.value ? event.target.value : 0)
    amount = checkAmount(amount, maxPayOffAmount)
    payOffAmountChange(amount)
  }

  function onSeizeAmountChange(event: ChangeEvent<HTMLInputElement>) {
    let amount = new BigNumber(event.target.value ? event.target.value : 0)
    amount = checkAmount(amount, maxSeizeAmount)
    seizeAmountChange(amount)
  }

  function payOffAmountChange(amount: BigNumber) {
    setPayOffAmount(amount)
    setSeizeAmount(amount.dividedBy(props.request.rate))
    setButtonValue(new BigNumber(0))
  }

  function seizeAmountChange(amount: BigNumber) {
    setSeizeAmount(amount)
    setPayOffAmount(amount.multipliedBy(props.request.rate))
    setButtonValue(new BigNumber(0))
  }

  function onButtonChange(value: BigNumber) {
    const amount = maxPayOffAmount.multipliedBy(value)
    setButtonValue(value)
    payOffAmountChange(amount)
  }

  function checkAmount(amount: BigNumber, maxAmount: BigNumber) {
    if (amount.lt(0)) {
      return new BigNumber(0)
    }
    if (amount.gt(maxPayOffAmount)) {
      return maxPayOffAmount
    }
    return amount
  }

  function onSubmitClick(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDidSubmit(true)
    setDidSubmit(false)
  }

  function formatPrecision(output: BigNumber) {
    const outputNumber = Number(output)
    const n = Math.log(Math.abs(outputNumber)) / Math.LN10
    let x = 4 - n
    if (x < 6) x = 4
    if (x < -1) x = 0
    if (x > inputPrecision) x = inputPrecision
    const m = Math.pow(10, x)
    return (Math.floor(outputNumber * m) / m).toString()
  }

  return (
    <form className="liquidation-form" onSubmit={onSubmitClick}>
      <section className="dialog-header">
        <CloseIcon className="dialog-header__title-close" onClick={props.onClose} />
        <div className="dialog-header__title">Liquidate</div>
      </section>
      <section className="dialog-content">
        <InputAmount
          asset={loanToken.logoSvg}
          inputAmountText={formatPrecision(payOffAmount)}
          buttonValue={buttonValue}
          updateButton={onButtonChange}
          onAmountChange={onPayOffAmountChange}
        />
        <InputAmount
          asset={collateralToken.logoSvg}
          inputAmountText={formatPrecision(seizeAmount)}
          onAmountChange={onSeizeAmountChange}
        />
      </section>
      <section className="dialog-actions">
        <div className="actions-container">
          <button
            type="submit"
            className={`btn btn-submit action ${didSubmit ? `btn-disabled` : ``}`}>
            {didSubmit ? 'Submitting...' : 'Liquidate'}
          </button>
        </div>
      </section>
    </form>
  )
}
