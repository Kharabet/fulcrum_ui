import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
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
  const _inputTextChange = new Subject<string>()
  const loanToken = AssetsDictionary.assets.get(props.request.loanToken) as AssetDetails
  const collateralToken = AssetsDictionary.assets.get(props.request.collateralToken) as AssetDetails
  const decimals: number = loanToken.decimals || 18
  const maxAmount: BigNumber = props.request.closeAmount.dividedBy(10 ** decimals)

  const [liquidationAmountText, setAmountText] = useState('')
  const [liquidationAmount, setAmountValue] = useState(new BigNumber(0))
  const [seizeAmount, setSeizeAmount] = useState(new BigNumber(0))
  const [didSubmit, setDidSubmit] = useState(false)

  useEffect(() => {
    // subscribe to input value change
    const subscription = _inputTextChange
      .pipe(
        distinctUntilChanged(),
        debounceTime(100),
        switchMap((value) => rxFromInputAmount(value))
      )
      .subscribe((value: string) => {
        setAmountText(value)
      })
    // return unsubscribe method to execute when component unmounts
    return subscription.unsubscribe()
  }, [])

  function onSubmitClick(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  const onAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let amountText = event.target.value ? event.target.value : ''
    const amount = new BigNumber(amountText)

    if (amount.lt(0)) {
      amountText = '0'
    } else if (amount.gt(maxAmount)) {
      amountText = maxAmount.toString()
    }

    setAmountText(amountText)
    // setAmountValue(amount)
    _inputTextChange.next(amountText)
  }

  const rxFromInputAmount = (value: string): Observable<string> => {
    return new Observable<string>((observer) => {
      const amount = new BigNumber(value)
      setSeizeAmount(amount.dividedBy(props.request.rate))
      setAmountValue(amount)
      observer.next(value)
    })
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
          inputAmountText={liquidationAmountText}
          buttonValue={liquidationAmount}
          updateButton={(amount) => setAmountValue(amount)}
          onAmountChange={onAmountChange}
        />
        <InputAmount
          asset={collateralToken.logoSvg}
          inputAmountText={liquidationAmountText}
          onAmountChange={onAmountChange}
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
