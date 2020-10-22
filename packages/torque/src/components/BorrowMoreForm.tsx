import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, Component, FormEvent } from 'react'
import { Observable, Subject } from 'rxjs'
import { debounceTime, switchMap } from 'rxjs/operators'
import { ActionType } from '../domain/ActionType'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { IBorrowMoreState } from '../domain/IBorrowMoreState'
import { IBorrowMoreEstimate } from '../domain/IBorrowMoreEstimate'
import { BorrowRequest } from '../domain/BorrowRequest'
import { TorqueProvider } from '../services/TorqueProvider'
import { Rail } from './Rail'
import { Loader } from './Loader'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import TagManager from 'react-gtm-module'

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

export interface IBorrowMoreFormProps {
  loanOrderState: IBorrowedFundsState
  onSubmit?: (value: BorrowRequest) => void
  onDecline: () => void
}

interface IBorrowMoreFormState {
  borrowMoreLoanOrderState: IBorrowedFundsState
  borrowAmount: BigNumber
  inputAmountText: string
  didSubmit: boolean
  borrowMoreColalterizationMin: BigNumber
}

export class BorrowMoreForm extends Component<IBorrowMoreFormProps, IBorrowMoreFormState> {
  private _input: HTMLInputElement | null = null

  private readonly _inputTextChange: Subject<string>

  constructor(props: IBorrowMoreFormProps, context?: any) {
    super(props, context)

    this.state = {
      borrowMoreLoanOrderState: Object.assign({}, props.loanOrderState),
      borrowAmount: new BigNumber(0),
      borrowMoreColalterizationMin: new BigNumber(150),
      inputAmountText: '',
      didSubmit: false
    }

    this._inputTextChange = new Subject<string>()
    this._inputTextChange.pipe(debounceTime(100)).subscribe(async (inputAmountText: string) => {
      await this.getCollateralPercent(inputAmountText)
    })
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input
  }

  public componentDidMount(): void {}

  public render() {
    const assetDetails =
      AssetsDictionary.assets.get(this.state.borrowMoreLoanOrderState.loanAsset) || null

    if (assetDetails === null) {
      return null
    }

    const loan =
      this.state.inputAmountText === ''
        ? this.props.loanOrderState
        : this.state.borrowMoreLoanOrderState

    const positionSafetyText = TorqueProvider.Instance.getPositionSafetyText(loan)
    const collateralizedStateSelector =
      positionSafetyText === 'Safe' ? 'safe' : positionSafetyText === 'Danger' ? 'danger' : 'unsafe'

    const collateralizedStateText =
      positionSafetyText === 'Safe'
        ? 'Safe'
        : positionSafetyText === 'Danger'
        ? 'Danger'
        : 'Liquidation Pending'

    //115%
    const sliderMin = loan.loanData!.maintenanceMargin.div(10 ** 18).toNumber()
    //300%
    const sliderMax = sliderMin + 185

    let sliderValue = loan.collateralizedPercent.multipliedBy(100).toNumber()
    if (sliderValue > sliderMax) {
      sliderValue = sliderMax
    } else if (sliderValue < sliderMin) {
      sliderValue = sliderMin
    }

    return (
      <form className="borrow-more-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <div className="borrow-more-loan-form__body">
            <div className="d-flex j-c-sb">
              <div>
                <div
                  title={`${loan.collateralizedPercent
                    .multipliedBy(100)
                    .plus(100)
                    .toFixed(18)}%`}
                  className={`borrow-more-loan-form__body-collateralized ${collateralizedStateSelector}`}>
                  <span className="value">
                    {loan.collateralizedPercent
                      .multipliedBy(100)
                      .plus(100)
                      .toFixed(2)}
                  </span>
                  %
                </div>
                <div className="borrow-more-loan-form__body-collateralized-label">
                  Collateralized
                </div>
              </div>

              <div
                className={`borrow-more-loan-form__body-collateralized-state ${collateralizedStateSelector}`}
                title={collateralizedStateText === 'Safe' ? '' : 'Please input less vallue'}>
                {collateralizedStateText}
              </div>
            </div>
          </div>

          <Rail sliderValue={sliderValue} sliderMax={sliderMax} />

          <div className="input-container mt-30">
            <div className="input-row">
              <span className="asset-icon">{assetDetails.reactLogoSvg.render()}</span>
              <input
                ref={this._setInputRef}
                className="input-amount"
                type="number"
                step="any"
                placeholder={`Enter amount`}
                value={this.state.inputAmountText}
                onChange={this.onTradeAmountChange}
              />
            </div>
          </div>
        </section>
        <section className="dialog-actions">
          <div className="borrow-more-loan-form__actions-container">
            {loan.collateralizedPercent
              .times(100)
              .plus(100)
              .lte(150) || !Number(this.state.inputAmountText) ? (
              <button type="button" className="btn btn-size--small" onClick={this.props.onDecline}>
                Close
              </button>
            ) : (
              <button
                type="submit"
                className={`btn btn-size--small ${this.state.didSubmit ? `btn-disabled` : ``}`}>
                {this.state.didSubmit ? 'Submitting...' : 'Borrow'}
              </button>
            )}
          </div>
        </section>
      </form>
    )
  }

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (this.state.borrowAmount.lte(0)) {
      return
    }

    if (this.props.onSubmit && !this.state.didSubmit) {
      this.setState({ ...this.state, didSubmit: true })

      const randomNumber = Math.floor(Math.random() * 100000) + 1
      const usdAmount = await TorqueProvider.Instance.getSwapToUsdRate(
        this.props.loanOrderState.loanAsset
      )
      let usdPrice = this.state.borrowAmount
      if (usdPrice !== null) {
        usdPrice = usdPrice.multipliedBy(usdAmount)
      }

      if (isMainnetProd) {
        const tagManagerArgs = {
          dataLayer: {
            event: 'purchase',
            transactionId: randomNumber,
            transactionTotal: new BigNumber(usdPrice),
            transactionProducts: [
              {
                name: 'Borrow-More-' + this.props.loanOrderState.loanAsset,
                sku:
                  'Borrow-More-' +
                  this.props.loanOrderState.loanAsset +
                  '-' +
                  this.props.loanOrderState.collateralAsset,
                category: 'Borrow More',
                price: new BigNumber(usdPrice),
                quantity: 1
              }
            ]
          }
        }
        //console.log("tagManagerArgs = ", tagManagerArgs)
        TagManager.dataLayer(tagManagerArgs)
      }

      this.props.onSubmit(
        new BorrowRequest(
          this.props.loanOrderState.loanId,
          this.props.loanOrderState.loanAsset,
          this.state.borrowAmount,
          this.props.loanOrderState.collateralAsset,
          new BigNumber(0)
        )
      )
    }
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    let amountText = event.target.value ? event.target.value : ''
    if (parseFloat(amountText) < 0) return
    this.setState(
      {
        ...this.state,
        inputAmountText: amountText,
        borrowAmount: new BigNumber(amountText)
      },
      () => {
        // emitting next event for processing with rx.js
        this._inputTextChange.next(amountText)
      }
    )
  }

  private getCollateralPercent = async (inputAmountText: string) => {
    const borrowMoreLoanOrderState = { ...this.props.loanOrderState }
    borrowMoreLoanOrderState.loanData = { ...this.props.loanOrderState.loanData! } //deep copy
    const decimals = AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset)!.decimals
    borrowMoreLoanOrderState.loanData.principal = borrowMoreLoanOrderState.loanData!.principal.plus(
      new BigNumber(inputAmountText).times(10 ** decimals)
    )
    const collateralChangeEstimate = await TorqueProvider.Instance.getLoanCollateralChangeEstimate(
      borrowMoreLoanOrderState,
      new BigNumber(0),
      false
    )
    borrowMoreLoanOrderState.collateralizedPercent = collateralChangeEstimate.collateralizedPercent
      .minus(100)
      .div(100)
    this.setState({
      ...this.state,
      borrowMoreLoanOrderState
    })
  }
}
