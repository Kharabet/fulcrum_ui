import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, Component, FormEvent } from 'react'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { IRepayEstimate } from '../domain/IRepayEstimate'
import { RepayLoanRequest } from '../domain/RepayLoanRequest'
import { TorqueProvider } from '../services/TorqueProvider'
import { ChiSwitch } from './ChiSwitch'
import { InputAmount } from './InputAmount'

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
}

export class RepayLoanForm extends Component<IRepayLoanFormProps, IRepayLoanFormState> {
  private readonly _inputTextChange: Subject<string>

  constructor(props: IRepayLoanFormProps, context?: any) {
    super(props, context)

    this.state = {
      assetDetails: null,
      repayAmountText: props.loanOrderState.amountOwed.toString(),
      repayAmount: props.loanOrderState.amountOwed,
      repayManagementAddress: null,
      gasAmountNeeded: new BigNumber(0),
      balanceTooLow: false,
      didSubmit: false,
      interestAmount: 0
    }

    this._inputTextChange = new Subject<string>()
    this._inputTextChange.pipe(debounceTime(100)).subscribe((value: string) => {
      this.setState({
        ...this.state,
        repayAmountText: value
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
                  gasAmountNeeded: gasAmountNeeded
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
                gasAmountNeeded: gasAmountNeeded
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

    return (
      <form className="repay-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <InputAmount
            asset={this.state.assetDetails.reactLogoSvg}
            inputAmountText={this.state.repayAmountText}
            updateInterestAmount={this.updateInterestAmount}
            onTradeAmountChange={this.onTradeAmountChange}
            interestAmount={this.state.interestAmount}
          />
          {this.state.balanceTooLow ? (
            <div className="repay-loan-form__insufficient-balance">
              Insufficient {this.state.assetDetails.displayName} balance in your wallet!
            </div>
          ) : null}
        </section>
        <ChiSwitch />
        <section className="dialog-actions">
          <div className="repay-loan-form__actions-container">
            <button
              type="submit"
              className={`btn btn-size--small ${this.state.didSubmit ? `btn-disabled` : ``}`}>
              {this.state.didSubmit ? 'Submitting...' : 'Repay'}
            </button>
          </div>
        </section>
      </form>
    )
  }

  private rxGetEstimate = (selectedValue: number): Observable<IRepayEstimate> => {
    return new Observable<IRepayEstimate>((observer) => {
      TorqueProvider.Instance.getLoanRepayEstimate(this.props.loanOrderState, selectedValue).then(
        (value) => {
          observer.next(value)
        }
      )
    })
  }

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let repayAmount = this.state.repayAmount
    if (this.state.repayAmount.lt(0)) {
      repayAmount = new BigNumber(0)
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
        repayAmount.multipliedBy(10 ** precision).toFixed(0, 1)
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
    if (repayAmount.lt(0)) {
      repayAmount = new BigNumber(0)
      repayAmountText = '0'
    } else if (repayAmount.gt(this.props.loanOrderState.amountOwed)) {
      repayAmount = this.props.loanOrderState.amountOwed
      repayAmountText = repayAmount.toString()
    }

    this.setState(
      {
        ...this.state,
        repayAmountText: repayAmountText,
        repayAmount: repayAmount,
        interestAmount: 0
      },
      () => {
        // emitting next event for processing with rx.js
        this._inputTextChange.next(this.state.repayAmountText)
      }
    )
  }

  public updateRepayAmount = (value: number) => {
    if (value !== 0) {
      const repayAmount = this.props.loanOrderState.amountOwed.multipliedBy(
        this.state.interestAmount
      )

      this.setState(
        {
          ...this.state,
          repayAmount: repayAmount,
          repayAmountText: repayAmount.toString()
        },
        () => {
          // emitting next event for processing with rx.js
          this._inputTextChange.next(this.state.repayAmountText)
        }
      )
    }
  }

  public updateInterestAmount = (interest: number) => {
    this.setState({ ...this.state, interestAmount: interest })
  }
}
