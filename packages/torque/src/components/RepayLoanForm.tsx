import React from 'react'
import { BigNumber } from '@0x/utils'
import { ChiSwitch } from './ChiSwitch'
import { debounceTime } from 'rxjs/operators'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { InputAmount } from './InputAmount'
import { RepayLoanRequest } from '../domain/RepayLoanRequest'
import { Subject } from 'rxjs'
import { TorqueProvider } from '../services/TorqueProvider'
import appConfig from 'bzx-common/src/config/appConfig'
import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { ChangeEvent, Component, FormEvent } from 'react'
import providerUtils from 'bzx-common/src/lib/providerUtils'

export interface IRepayLoanFormProps {
  loanOrderState: IBorrowedFundsState

  onSubmit: (request: RepayLoanRequest) => void
  onClose: () => void
}

interface IRepayLoanFormState {
  assetDetails: AssetDetails | null
  repayAmountText: string
  repayAmount: BigNumber
  repayManagementAddress: string | null
  gasAmountNeeded: BigNumber
  balanceTooLow: boolean
  didSubmit: boolean
  interestAmount: number
  assetBalance: BigNumber
  ethBalance: BigNumber
}

export class RepayLoanForm extends Component<IRepayLoanFormProps, IRepayLoanFormState> {
  private readonly _inputTextChange: Subject<string>

  constructor(props: IRepayLoanFormProps, context?: any) {
    super(props, context)

    this.state = {
      assetDetails: null,
      repayAmountText: '',
      repayAmount: new BigNumber(0),
      repayManagementAddress: null,
      gasAmountNeeded: new BigNumber(0),
      balanceTooLow: false,
      didSubmit: false,
      interestAmount: 0,
      assetBalance: new BigNumber(0),
      ethBalance: new BigNumber(0),
    }

    this._inputTextChange = new Subject<string>()
    this._inputTextChange.pipe(debounceTime(100)).subscribe((value: string) => {
      this.setState({
        ...this.state,
        repayAmountText: value,
      })
    })
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanRepayParams(this.props.loanOrderState).then(
      (collateralState) => {
        TorqueProvider.Instance.getLoanRepayAddress(this.props.loanOrderState).then(
          (repayManagementAddress) => {
            TorqueProvider.Instance.getLoanRepayGasAmount().then((gasAmountNeeded) => {
              this.setState(
                {
                  ...this.state,
                  assetDetails:
                    AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset) || null,
                  repayManagementAddress: repayManagementAddress,
                  gasAmountNeeded: gasAmountNeeded,
                },
                () => {
                  this._inputTextChange.next(this.state.repayAmountText)
                }
              )
            })
          }
        )
      }
    )
    providerUtils
      .getAssetTokenBalanceOfUser(TorqueProvider.Instance, this.props.loanOrderState.loanAsset)
      .then((balance) => {
        const precision = this.state.assetDetails!.decimals || 18
        const amountOwed = this.props.loanOrderState.amountOwed.multipliedBy(10 ** precision)
        const isBalanceTooLow = amountOwed.gt(balance) ? true : false
        const repayAmount = amountOwed.gt(balance)
          ? balance.div(10 ** precision)
          : this.props.loanOrderState.amountOwed
        const repayAmountText = repayAmount.toString()
        this.setState({
          ...this.state,
          assetBalance: balance,
          repayAmount: repayAmount,
          repayAmountText: repayAmountText,
          balanceTooLow: isBalanceTooLow,
        })
      })
    TorqueProvider.Instance.web3Wrapper &&
      providerUtils.getEthBalance(TorqueProvider.Instance).then((ethBalance) => {
        this.setState({
          ...this.state,
          ethBalance: ethBalance,
        })
      })
  }

  public componentDidUpdate(
    prevProps: Readonly<IRepayLoanFormProps>,
    prevState: Readonly<IRepayLoanFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.accountAddress !== this.props.loanOrderState.accountAddress ||
      prevProps.loanOrderState.loanId !== this.props.loanOrderState.loanId
    ) {
      TorqueProvider.Instance.getLoanRepayAddress(this.props.loanOrderState).then(
        (repayManagementAddress) => {
          TorqueProvider.Instance.getLoanRepayGasAmount().then((gasAmountNeeded) => {
            this.setState(
              {
                ...this.state,
                repayManagementAddress: repayManagementAddress,
                gasAmountNeeded: gasAmountNeeded,
              },
              () => {
                this._inputTextChange.next(this.state.repayAmountText)
              }
            )
          })
        }
      )
    }
    prevState.interestAmount !== this.state.interestAmount &&
      this.updateRepayAmount(this.state.interestAmount)
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null
    }

    const ratio = this.state.assetBalance.div(
      this.props.loanOrderState.amountOwed.times(10 ** this.state.assetDetails.decimals)
    )

    return (
      <form className="repay-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          {this.state.ethBalance &&
            this.state.ethBalance.lte(TorqueProvider.Instance.gasBufferForTxn) && (
              <span className="error insufficient-gas">Insufficient funds for gas</span>
            )}
          <InputAmount
            asset={this.state.assetDetails.reactLogoSvg}
            inputAmountText={this.state.repayAmountText}
            updateInterestAmount={this.updateInterestAmount}
            onTradeAmountChange={this.onTradeAmountChange}
            interestAmount={this.state.interestAmount}
            onMaxClick={this.onMaxClick}
            ratio={ratio}
          />
          {this.state.balanceTooLow && (
            <div className="error insufficient-balance">
              Insufficient {this.state.assetDetails.displayName} wallet balance to repay 100%!
            </div>
          )}
        </section>
        <ChiSwitch />
        <section className="dialog-actions">
          <div className="repay-loan-form__actions-container">
            <button type="submit" className={`btn btn-size--small`} disabled={this.state.didSubmit}>
              {this.state.didSubmit ? 'Submitting...' : 'Repay'}
            </button>
          </div>
        </section>
      </form>
    )
  }

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let repayAmount = this.state.repayAmount
    if (this.state.repayAmount.lt(0)) {
      repayAmount = new BigNumber(0)
    }

    if (!this.state.didSubmit) {
      this.setState({ ...this.state, didSubmit: true })

      if (
        (appConfig.isMainnet && this.props.loanOrderState.loanAsset === Asset.ETH) ||
        (appConfig.isBsc && this.props.loanOrderState.loanAsset === Asset.BNB)
      ) {
        const assetBalance = this.state.assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn)
          ? this.state.assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn)
          : new BigNumber(0)
        this.setState({ ...this.state, assetBalance: assetBalance })
      }

      const precision = this.state.assetDetails!.decimals || 18
      const amountInBaseUnits = new BigNumber(
        repayAmount.multipliedBy(10 ** precision).toFixed(0, 1)
      )
      if (this.state.assetBalance.lt(amountInBaseUnits)) {
        this.setState({
          ...this.state,
          didSubmit: false,
        })
        return
      }

      const percentData = await TorqueProvider.Instance.getLoanRepayPercent(
        this.props.loanOrderState,
        repayAmount
      )

      this.props.onSubmit(
        new RepayLoanRequest(
          this.props.loanOrderState.loanAsset,
          this.props.loanOrderState.collateralAsset,
          this.props.loanOrderState.accountAddress,
          this.props.loanOrderState.loanId,
          repayAmount,
          percentData.repayPercent ? new BigNumber(percentData.repayPercent) : new BigNumber(0),
          this.props.loanOrderState.amountOwed
        )
      )
    }
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let repayAmountText = event.target.value ? event.target.value : ''
    let repayAmount = new BigNumber(repayAmountText)

    const precision = this.state.assetDetails!.decimals || 18
    const amountOwed = this.props.loanOrderState.amountOwed
    const balance = this.state.assetBalance.div(10 ** precision)
    const maxRepayAmount = this.state.balanceTooLow ? balance : amountOwed

    if (repayAmount.lt(0)) {
      repayAmount = new BigNumber(0)
      repayAmountText = repayAmount.toString()
    }

    if (repayAmount.gt(balance) || repayAmount.gt(amountOwed)) {
      repayAmount = maxRepayAmount
      repayAmountText = repayAmount.toString()
    }

    this.setState(
      {
        ...this.state,
        repayAmountText: repayAmountText,
        repayAmount: repayAmount,
        interestAmount: 0,
      },
      () => {
        // emitting next event for processing with rx.js
        this._inputTextChange.next(this.state.repayAmountText)
      }
    )
  }

  public updateRepayAmount = (value: number) => {
    if (value === 0) {
      return
    }
    const repayAmount = this.props.loanOrderState.amountOwed.multipliedBy(this.state.interestAmount)
    const repayAmountText = repayAmount.toString()

    this.setState(
      { ...this.state, repayAmount: repayAmount, repayAmountText: repayAmountText },
      () => {
        // emitting next event for processing with rx.js
        this._inputTextChange.next(this.state.repayAmountText)
      }
    )
  }

  public onMaxClick = () => {
    const repayAmount = this.state.assetBalance.div(10 ** this.state.assetDetails!.decimals)
    const repayAmountText = repayAmount.dp(4, BigNumber.ROUND_HALF_DOWN).toFixed()

    this.setState(
      { ...this.state, repayAmount: repayAmount, repayAmountText: repayAmountText },
      () => {
        // emitting next event for processing with rx.js
        this._inputTextChange.next(this.state.repayAmountText)
      }
    )
  }

  public updateInterestAmount = (interest: number) => {
    this.setState({ ...this.state, interestAmount: interest })
  }
}
