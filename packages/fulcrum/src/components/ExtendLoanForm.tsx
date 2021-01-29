import { BigNumber } from '@0x/utils'
import Slider from 'rc-slider'
import React, { ChangeEvent, Component, FormEvent } from 'react'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { IExtendEstimate } from '../domain/IExtendEstimate'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { InputAmount } from './InputAmount'
import { TradeRequest } from '../domain/TradeRequest'
import { ReactComponent as CloseIcon } from '../assets/images/ic__close.svg'

export interface IExtendLoanFormProps {
  loan: IBorrowedFundsState
  request: ExtendLoanRequest
  onSubmit: (request: ExtendLoanRequest) => void
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | ExtendLoanRequest | undefined,
    isTxCompleted: boolean,
    resultTx: boolean
  ) => void
  onCancel: () => void
  isMobileMedia: boolean
  isOpenModal: boolean
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
  isLoading: boolean
  buttonValue: number
}

export class ExtendLoanForm extends Component<IExtendLoanFormProps, IExtendLoanFormState> {
  private readonly _inputDecimals = 6

  private readonly _inputChange: Subject<string>
  private readonly _selectedValueUpdate: Subject<number>

  constructor(props: IExtendLoanFormProps, context?: any) {
    super(props, context)

    this.state = {
      minValue: 1,
      maxValue: 28,
      assetDetails: null,
      selectedValue: 14,
      depositAmount: new BigNumber(0),
      extendManagementAddress: null,
      gasAmountNeeded: new BigNumber(0),
      balanceTooLow: false,
      didSubmit: false,
      interestAmount: 0,
      inputAmountText: '',
      maxDepositAmount: new BigNumber(0),
      isLoading: false,
      buttonValue: 0.5
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

  public async componentDidMount() {
    await FulcrumProvider.Instance.getLoanExtendParams(this.props.loan).then(
      async (collateralState) => {
        await FulcrumProvider.Instance.getLoanExtendManagementAddress(this.props.loan).then(
          (extendManagementAddress) => {
            this.setState(
              {
                ...this.state,
                minValue: collateralState.minValue,
                maxValue: collateralState.maxValue,
                assetDetails: AssetsDictionary.assets.get(this.props.loan.loanAsset) || null,
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
    await this.getMaxDepositAmount()
  }

  public async componentDidUpdate(prevProps: Readonly<IExtendLoanFormProps>) {
    if (
      prevProps.loan.accountAddress !== this.props.loan.accountAddress ||
      prevProps.loan.loanId !== this.props.loan.loanId
    ) {
      await FulcrumProvider.Instance.getLoanExtendManagementAddress(this.props.loan).then(
        async (extendManagementAddress) => {
          await FulcrumProvider.Instance.getLoanExtendGasAmount().then((gasAmountNeeded) => {
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
  public onInsertMaxValue = async (value: number) => {
    const selectedValue = new BigNumber(this.state.maxValue).multipliedBy(value)
    const selectedValueNumber = selectedValue.toNumber()
    this.setState(
      {
        ...this.state,
        selectedValue: selectedValueNumber,
        buttonValue: value
        ///isLoading: true
      },
      () => {
        // emitting next event for processing with rx.js
        this._selectedValueUpdate.next(selectedValueNumber)
      }
    )
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null
    }
    const estimatedDate = this.props.loan.loanData.endTimestamp
      .multipliedBy(1000)
      .plus(this.state.selectedValue * 24 * 60 * 60 * 1000)
      .toNumber()
    return (
      <form className="extend-loan-form" onSubmit={this.onSubmitClick}>
        <CloseIcon className="close-icon" onClick={this.props.onCancel} />

        <section className="dialog-content">
          <div className="extend-loan-form__info-extended-by-container">
            <div className="extend-loan-form__info-extended-by-msg jc-c">
              Your rollover date will be extended by
            </div>
            <div className="extend-loan-form__info-extended-by-date">
              {new Date(estimatedDate).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
          <div className="extend-loan-form__info-extended-by-container mt-70">
            <div className="extend-loan-form__info-extended-by-msg jc-sb mb-8">
              <div className="extend-loan-form__tip">You will send</div>
            </div>
            <InputAmount
              inputAmountText={this.state.inputAmountText}
              isLoading={this.state.isLoading}
              selectedAsset={this.props.loan!.loanAsset}
              buttonValue={this.state.buttonValue}
              onInsertMaxValue={this.onInsertMaxValue}
              onTradeAmountChange={this.onTradeAmountChange}
              onCollateralChange={this.onCollateralChange}
              withSlider={true}
              readonly
              maxSliderValue={28}
            />
            {this.state.balanceTooLow ? (
              <React.Fragment>
                <div className="extend-loan-form__insufficient-balance">
                  Insufficient {this.state.assetDetails.displayName} balance in your wallet!
                </div>
              </React.Fragment>
            ) : null}
          </div>
        </section>
        <section className="dialog-actions">
          <div className="extend-loan-form__actions-container">
            <button
              type="submit"
              className={`btn btn-size--small button-extend ${
                this.state.didSubmit ? `btn-disabled` : ``
              }`}>
              {this.state.didSubmit ? 'Submitting...' : 'Front interest'}
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
      FulcrumProvider.Instance.getLoanExtendEstimate(
        this.props.loan.interestOwedPerDay,
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

      let assetBalance = await FulcrumProvider.Instance.getAssetTokenBalanceOfUser(
        this.props.loan.loanAsset
      )
      if (this.props.loan.loanAsset === Asset.ETH) {
        assetBalance = assetBalance.gt(FulcrumProvider.Instance.gasBufferForTxn)
          ? assetBalance.minus(FulcrumProvider.Instance.gasBufferForTxn)
          : new BigNumber(0)
      }
      const precision = AssetsDictionary.assets.get(this.props.loan.loanAsset)!.decimals || 18
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

      const request = this.props.request

      request.depositAmount = new BigNumber(this.state.depositAmount)

      this.props.onSubmit(request)
      this.props.changeLoadingTransaction(true, request, false, false)
    }
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const inputAmountText = event.target.value ? event.target.value : ''
    if (Number(inputAmountText) === 0) {
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
    const maxDepositAmount = await FulcrumProvider.Instance.getLoanExtendEstimate(
      this.props.loan.interestOwedPerDay,
      this.state.maxValue
    )
    this.setState({ ...this.state, maxDepositAmount: maxDepositAmount.depositAmount })
  }

  public formatPrecision(outputText: BigNumber): string {
    const output = Number(outputText)
    const n = Math.log(Math.abs(output)) / Math.LN10
    let x = 4 - n
    if (x < 0) x = 0
    if (x > this._inputDecimals) x = this._inputDecimals + 1

    return Number(output.toFixed(x)).toString()
  }
  public onCollateralChange = (asset: Asset) => {}
}
