import { BigNumber } from '@0x/utils'
import React, { Component, FormEvent, ChangeEvent } from 'react'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { IExtendEstimate } from '../domain/IExtendEstimate'
import { TorqueProvider } from '../services/TorqueProvider'
import Slider from 'rc-slider'
import { InputAmount } from './InputAmount'

export interface IExtendLoanFormProps {
  loanOrderState: IBorrowedFundsState

  onSubmit: (request: ExtendLoanRequest) => void
  onClose: () => void
}

interface IExtendLoanFormState {
  assetDetails: AssetDetails | null
  minValue: number
  maxValue: number
  selectedValue: number
  depositAmount: BigNumber
  extendManagementAddress: string | null
  gasAmountNeeded: BigNumber
  balanceTooLow: boolean
  didSubmit: boolean
  interestAmount: number
  inputAmountText: string
  maxDepositAmount: BigNumber
}

export class ExtendLoanForm extends Component<IExtendLoanFormProps, IExtendLoanFormState> {
  private readonly _inputDecimals = 6

  private readonly _inputChange: Subject<string>
  private readonly _selectedValueUpdate: Subject<number>

  constructor(props: IExtendLoanFormProps, context?: any) {
    super(props, context)

    this.state = {
      minValue: 1,
      maxValue: 365,
      assetDetails: null,
      selectedValue: 90,
      depositAmount: new BigNumber(0),
      extendManagementAddress: null,
      gasAmountNeeded: new BigNumber(0),
      balanceTooLow: false,
      didSubmit: false,
      interestAmount: 0,
      inputAmountText: '',
      maxDepositAmount: new BigNumber(0)
    }

    this._selectedValueUpdate = new Subject()
    this._inputChange = new Subject()

    merge(
      this._inputChange.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap((value) => this.rxFromInputAmount(value))
      ),
      this._selectedValueUpdate.pipe(distinctUntilChanged())
    )
      .pipe(switchMap((value) => this.rxGetEstimate(value)))
      .subscribe((value: IExtendEstimate) => {
        this.setState({
          ...this.state,
          depositAmount: value.depositAmount,
          inputAmountText: this.formatPrecision(value.depositAmount)
        })
      })
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanExtendParams(this.props.loanOrderState).then(
      (collateralState) => {
        TorqueProvider.Instance.getLoanExtendManagementAddress(this.props.loanOrderState).then(
          (extendManagementAddress) => {
            this.setState(
              {
                ...this.state,
                minValue: collateralState.minValue,
                maxValue: collateralState.maxValue,
                assetDetails:
                  AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset) || null,
                selectedValue: collateralState.currentValue,
                extendManagementAddress: extendManagementAddress
              },
              () => {
                this._selectedValueUpdate.next(this.state.selectedValue)
              }
            )
          }
        )
      }
    )
    this.getMaxDepositAmount()
  }

  public componentDidUpdate(prevProps: Readonly<IExtendLoanFormProps>): void {
    if (
      prevProps.loanOrderState.accountAddress !== this.props.loanOrderState.accountAddress ||
      prevProps.loanOrderState.loanId !== this.props.loanOrderState.loanId
    ) {
      TorqueProvider.Instance.getLoanExtendManagementAddress(this.props.loanOrderState).then(
        (extendManagementAddress) => {
          TorqueProvider.Instance.getLoanExtendGasAmount().then((gasAmountNeeded) => {
            this.setState(
              {
                ...this.state,
                extendManagementAddress: extendManagementAddress,
                gasAmountNeeded: gasAmountNeeded
              },
              () => {
                this._selectedValueUpdate.next(this.state.selectedValue)
              }
            )
          })
        }
      )
    }
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null
    }
    return (
      <form className="extend-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <div className="extend-loan-form__info-extended-by-container">
            <div className="extend-loan-form__info-extended-by-msg">Loan end date</div>
            <div className="extend-loan-form__info-extended-by-price">
              {new Date(
                Date.now() + this.state.selectedValue * 24 * 60 * 60 * 1000
              ).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
          <Slider
            min={this.state.minValue}
            max={this.state.maxValue}
            step={0.01}
            value={this.state.selectedValue}
            onChange={this.onChange}
            onAfterChange={this.onAfterChange}
          />

          <div className="extend-loan-form__tips">
            <div className="extend-loan-form__tip">Min</div>
            <div className="extend-loan-form__tip">Max</div>
          </div>

          <div className="extend-loan-form__info-extended-by-msg mb-20">You will send</div>
          <InputAmount
            asset={this.state.assetDetails.reactLogoSvg}
            inputAmountText={this.state.inputAmountText}
            updateInterestAmount={this.updateInterestAmount}
            onTradeAmountChange={this.onTradeAmountChange}
            interestAmount={this.state.interestAmount}
          />
          {this.state.balanceTooLow ? (
            <React.Fragment>
              <div className="extend-loan-form__insufficient-balance">
                Insufficient {this.state.assetDetails.displayName} balance in your wallet!
              </div>
            </React.Fragment>
          ) : null}
        </section>
        <section className="dialog-actions">
          <div className="extend-loan-form__actions-container">
            <button
              type="submit"
              className={`btn btn-size--small ${this.state.didSubmit ? `btn-disabled` : ``}`}>
              {this.state.didSubmit ? 'Submitting...' : 'Extend'}
            </button>
          </div>
        </section>
      </form>
    )
  }

  // private pluralize = (singular: string,
  //   plural: string, value: number) => {
  //   const isPlural = value !== 1;
  //   return isPlural ? plural : singular;
  // };

  private rxGetEstimate = (selectedValue: number): Observable<IExtendEstimate> => {
    return new Observable<IExtendEstimate>((observer) => {
      TorqueProvider.Instance.getLoanExtendEstimate(
        this.props.loanOrderState.interestOwedPerDay,
        selectedValue
      ).then((value) => {
        observer.next(value)
      })
    })
  }

  private rxFromInputAmount = (value: string): Observable<number> => {
    return new Observable<number>((observer) => {
      let inputAmountText = value
      const maxDepositAmountText = this.state.maxDepositAmount.toFixed()
      const maxDepositAmountNumber = Number(maxDepositAmountText)

      if (Number(inputAmountText) > maxDepositAmountNumber) {
        inputAmountText = this.formatPrecision(this.state.maxDepositAmount)
      }
      const depositAmountText = new BigNumber(inputAmountText)
      const depositAmountNumber = Number(depositAmountText)
      const selectedValue = Math.round(
        (depositAmountNumber * this.state.maxValue) / maxDepositAmountNumber
      )
      this.setState({ ...this.state, selectedValue })
      observer.next(selectedValue)
    })
  }

  private onChange = (value: number) => {
    this.setState({
      ...this.state,
      selectedValue: value,
      interestAmount: 0
    })
  }

  private onAfterChange = (value: number) => {
    this._selectedValueUpdate.next(this.state.selectedValue)
  }

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (this.state.depositAmount.lte(0)) {
      return
    }

    if (!this.state.didSubmit) {
      this.setState({ ...this.state, didSubmit: true })

      let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(
        this.props.loanOrderState.loanAsset
      )
      if (this.props.loanOrderState.loanAsset === Asset.ETH) {
        assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn)
          ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn)
          : new BigNumber(0)
      }
      const precision =
        AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset)!.decimals || 18
      const amountInBaseUnits = new BigNumber(
        this.state.depositAmount.multipliedBy(10 ** precision).toFixed(0, 1)
      )
      if (assetBalance.lt(amountInBaseUnits)) {
        this.setState({
          ...this.state,
          balanceTooLow: true,
          didSubmit: false
        })

        return
      } else {
        this.setState({
          ...this.state,
          balanceTooLow: false
        })
      }

      this.props.onSubmit(
        new ExtendLoanRequest(
          this.props.loanOrderState.loanAsset,
          this.props.loanOrderState.accountAddress,
          this.props.loanOrderState.loanId,
          this.state.depositAmount
        )
      )
    }
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let inputAmountText = event.target.value ? event.target.value : ''
    if (Number(inputAmountText) == 0) {
      this.setState({
        ...this.state,
        inputAmountText
      })
    } else {
      // setting Text to update display at the same time
      this.setState(
        {
          ...this.state,
          inputAmountText,
          interestAmount: 0
        },
        () => {
          this._inputChange.next(inputAmountText)
        }
      )
    }
  }

  public updateInterestAmount = (interest: number) => {
    const selectedValue = this.state.maxValue * interest
    this.setState({ ...this.state, selectedValue: selectedValue, interestAmount: interest }, () => {
      this._selectedValueUpdate.next(selectedValue)
    })
  }

  private getMaxDepositAmount = async () => {
    let maxDepositAmount = await TorqueProvider.Instance.getLoanExtendEstimate(
      this.props.loanOrderState.interestOwedPerDay,
      this.state.maxValue
    )
    this.setState({ ...this.state, maxDepositAmount: maxDepositAmount.depositAmount })
  }

  public formatPrecision(outputText: BigNumber): string {
    const output = Number(outputText)
    let n = Math.log(Math.abs(output)) / Math.LN10
    let x = 4 - n
    if (x < 0) x = 0
    if (x > this._inputDecimals) x = this._inputDecimals + 1
    var m = Math.pow(10, x)

    return new BigNumber(Math.floor(output * m) / m).toString()
  }
}
