import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { LiquidationRequest } from '../domain/LiquidationRequest'
import { ExplorerProvider } from '../services/ExplorerProvider'
import { ChiSwitch } from './ChiSwitch'
import { InputAmount } from './InputAmount'

import { ReactComponent as CloseIcon } from '../assets/images/ic__close.svg'
import Asset from 'bzx-common/src/assets/Asset'
import { useWeb3React } from '@web3-react/core'
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
  const { account } = useWeb3React()
  const [payOffAmount, setPayOffAmount] = useState<BigNumber>(maxPayOffAmount)
  const [seizeAmount, setSeizeAmount] = useState<BigNumber>(maxSeizeAmount)
  const [buttonValue, setButtonValue] = useState<BigNumber>(new BigNumber(1))
  const [didSubmit, setDidSubmit] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [ethBalance, setEthBalance] = useState<BigNumber>(new BigNumber(0))
  const [repayAssetBalance, setRepayAssetBalance] = useState<BigNumber>(new BigNumber(0))

  useEffect(() => {
    if (!account) {
      return
    }
    setIsLoading(true)
    Promise.all([
      ExplorerProvider.Instance.getAssetTokenBalanceOfUser(Asset.ETH, account),
      ExplorerProvider.Instance.getAssetTokenBalanceOfUser(
        ExplorerProvider.Instance.wethToEth(props.request.loanToken),
        account
      )
    ])
      .then(([ethBalanceResp, repayAssetBalanceResp]) => {
        setEthBalance(ethBalanceResp)
        setRepayAssetBalance(repayAssetBalanceResp)
        setIsLoading(false)
      })
      .catch(console.error)
  }, [])

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
    if (amount.gt(maxAmount)) {
      return maxAmount
    }
    return amount
  }

  const onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setDidSubmit(true)
    const request = props.request

    const amountInBaseUnits = new BigNumber(payOffAmount.multipliedBy(10 ** decimals).toFixed(0, 1))
    request.closeAmount = amountInBaseUnits

    await ExplorerProvider.Instance.onLiquidationConfirmed(request)
    setDidSubmit(false)
    props.onClose()
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

  const amountMsg =
    ethBalance && ethBalance.lte(ExplorerProvider.Instance.gasBufferForTrade.div(10 ** 18))
      ? 'Insufficient funds for gas'
      : repayAssetBalance.lt(payOffAmount)
      ? `Your wallet has not enough ${props.request.loanToken}`
      : undefined
  return (
    <form className="liquidation-form" onSubmit={onSubmitClick}>
      <section className="dialog-header">
        <CloseIcon className="dialog-header__title-close" onClick={props.onClose} />
        <div className="dialog-header__title">Liquidate</div>
      </section>
      <section className="dialog-content">
        {!isLoading && amountMsg && <div className="amount-warning">{amountMsg}</div>}
        <InputAmount
          asset={loanToken.reactLogoSvg}
          inputAmountText={formatPrecision(payOffAmount)}
          buttonValue={buttonValue}
          updateButton={onButtonChange}
          onAmountChange={onPayOffAmountChange}
        />
        <InputAmount
          asset={collateralToken.reactLogoSvg}
          inputAmountText={formatPrecision(seizeAmount)}
          onAmountChange={onSeizeAmountChange}
        />
      </section>
      <ChiSwitch />
      <section className="dialog-actions">
        <div className="actions-container">
          <button
            type="submit"
            disabled={didSubmit || !!amountMsg}
            className={`btn btn-submit action`}>
            {didSubmit ? 'Submitting...' : 'Liquidate'}
          </button>
        </div>
      </section>
    </form>
  )
}
