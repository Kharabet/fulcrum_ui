import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { TradeRequest } from '../domain/TradeRequest'
import Slider from 'rc-slider'
import { BigNumber } from '@0x/utils'
import { ChangeEvent, Component, FormEvent } from 'react'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { ReactComponent as CloseIcon } from '../assets/images/ic__close.svg'
import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { ICollateralChangeEstimate } from '../domain/ICollateralChangeEstimate'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { InputAmount } from './InputAmount'
import { LiquidationDropdown } from './LiquidationDropdown'

import '../styles/components/manage-collateral-form.scss'
import { PositionType } from '../domain/PositionType'
import { getCurrentAccount, getEthBalance } from 'bzx-common/src/utils'
import appConfig from 'bzx-common/src/config/appConfig'

export interface IManageCollateralFormProps {
  loan: IBorrowedFundsState

  request: ManageCollateralRequest
  onSubmit: (request: ManageCollateralRequest) => void
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | ManageCollateralRequest | undefined,
    isTxCompleted: boolean,
    resultTx: boolean
  ) => void
  onCancel: () => void
  isMobileMedia: boolean
  isOpenModal: boolean
}

interface IManageCollateralFormState {
  assetDetails: AssetDetails | null

  minValue: number
  maxValue: number

  loanValue: number
  selectedValue: number
  assetBalanceValue: BigNumber
  ethBalanceValue: BigNumber
  buttonValue: number

  collateralAmount: BigNumber
  collateralExcess: BigNumber
  gasAmountNeeded: BigNumber
  collateralizedPercent: BigNumber
  collateralToLoanRate: BigNumber
  balanceTooLow: boolean
  collateralTooLow: boolean

  inputAmountText: string

  didSubmit: boolean
  isLoading: boolean
  liquidationPrice: BigNumber
  activeTokenLiquidation: Asset
}

export default class ManageCollateralForm extends Component<
  IManageCollateralFormProps,
  IManageCollateralFormState
> {
  private readonly _inputPrecision = 6

  private readonly _inputChange: Subject<string>
  private readonly _selectedValueUpdate: Subject<BigNumber>

  constructor(props: IManageCollateralFormProps, context?: any) {
    super(props, context)

    this.state = {
      minValue: 0,
      maxValue: 0,
      assetDetails: null,
      selectedValue: 0,
      loanValue: 0,
      assetBalanceValue: new BigNumber(0),
      ethBalanceValue: new BigNumber(0),
      buttonValue: 0,
      gasAmountNeeded: new BigNumber(0),
      collateralAmount: new BigNumber(0),
      collateralExcess: new BigNumber(0),
      collateralizedPercent: new BigNumber(0),
      collateralToLoanRate: new BigNumber(0),
      balanceTooLow: false,
      collateralTooLow: false,
      inputAmountText: '',
      didSubmit: false,
      isLoading: true,
      liquidationPrice: new BigNumber(0),
      activeTokenLiquidation: this.props.loan.collateralAsset,
    }

    this._inputChange = new Subject()
    this._selectedValueUpdate = new Subject()

    merge(
      this._inputChange.pipe(
        distinctUntilChanged(),
        debounceTime(100),
        switchMap((value) => this.rxFromInputAmount(value))
      ),
      this._selectedValueUpdate.pipe(
        distinctUntilChanged(),
        switchMap((value) => this.rxFromSelectedValue(value))
      )
    )
      .pipe(switchMap((value) => this.rxFromCurrentAmount(value)))
      .pipe(
        switchMap(
          (value) =>
            new Observable<ICollateralChangeEstimate | null>((observer) => observer.next(value))
        )
      )
      .subscribe((next) => {
        this.getLiquidationPrice()
        this.setState({
          ...this.state,
          collateralAmount: next!.collateralAmount,
          collateralizedPercent: next!.collateralizedPercent,
          collateralTooLow: next!.collateralizedPercent.lt(
            this.props.loan!.loanData!.maintenanceMargin.div(10 ** 18).plus(10) || 25
          ),
          inputAmountText: this.formatPrecision(next!.collateralAmount.toString(), true),
        })
      })
  }

  public componentWillUnmount(): void {
    window.history.pushState(null, 'Manage Collateral Modal Closed', `/trade`)
  }

  public async componentDidMount() {
    FulcrumProvider.Instance.getManageCollateralParams().then((collateralState) => {
      this.setState({
        ...this.state,
        minValue: collateralState.minValue,
        maxValue: collateralState.maxValue,
        assetDetails: AssetsDictionary.assets.get(this.props.loan!.collateralAsset) || null,
      })

      FulcrumProvider.Instance.getManageCollateralGasAmount().then(async (gasAmountNeeded) => {
        FulcrumProvider.Instance.web3Wrapper
          && await getEthBalance(FulcrumProvider.Instance.web3Wrapper, getCurrentAccount(FulcrumProvider.Instance.accounts)).then(
            (ethBalance) => {
              FulcrumProvider.Instance.getManageCollateralExcessAmount(this.props.loan!).then(
                (collateralExcess) => {
                  FulcrumProvider.Instance.getAssetTokenBalanceOfUser(
                    this.props.loan!.collateralAsset
                  ).then(async (assetBalance) => {
                    const collateralizedPercent = this.props.loan!.collateralizedPercent.multipliedBy(
                      100
                    )

                    let minCollateral
                    let maxCollateral

                    minCollateral = this.props
                      .loan!.collateralAmount.minus(collateralExcess)
                      .times(collateralState.minValue)

                    maxCollateral = minCollateral
                      .times(collateralState.maxValue - collateralState.minValue)
                      .dividedBy(10 ** 20)

                    // set range for case when loan has zero margin. Actually it don't affect slider range.
                    // TODO: review the logic of the component
                    if (this.props.loan!.loanData!.collateral.isZero()) {
                      minCollateral = new BigNumber(
                        this.props.loan!.loanData.maintenanceMargin.div(10 ** 18).plus(5)
                      )
                      maxCollateral = new BigNumber(
                        this.props.loan!.loanData.maintenanceMargin.div(10 ** 18).plus(50)
                      )
                    }

                    const currentCollateral = this.props.loan!.collateralAmount.times(10 ** 18)

                    if (maxCollateral.lt(currentCollateral)) {
                      maxCollateral = currentCollateral
                    }

                    // new_v = (new_max - new_min) / (old_max - old_min) * (v - old_min) + new_min
                    let currentCollateralNormalizedBN = new BigNumber(
                      collateralState.maxValue - collateralState.minValue
                    )
                      .dividedBy(maxCollateral.minus(minCollateral))
                      .times(currentCollateral.minus(minCollateral))
                      .plus(collateralState.minValue)

                    if (
                      currentCollateralNormalizedBN
                        .dividedBy(collateralState.maxValue - collateralState.minValue)
                        .lte(0.01)
                    ) {
                      currentCollateralNormalizedBN = new BigNumber(collateralState.minValue)
                    }

                    // check balance
                    if (
                      (appConfig.isMainnet && this.props.loan!.collateralAsset === Asset.ETH) ||
                      (appConfig.isBsc && this.props.loan!.collateralAsset === Asset.BNB)
                    ) {
                      assetBalance = assetBalance.gt(FulcrumProvider.Instance.gasBufferForTrade)
                        ? assetBalance.minus(FulcrumProvider.Instance.gasBufferForTrade)
                        : new BigNumber(0)
                    }

                    let assetBalanceNormalizedBN = new BigNumber(
                      collateralState.maxValue - collateralState.minValue
                    )
                      .dividedBy(maxCollateral.minus(minCollateral))
                      .times(assetBalance.minus(minCollateral))
                      .plus(collateralState.minValue)

                    if (
                      assetBalanceNormalizedBN
                        .dividedBy(collateralState.maxValue - collateralState.minValue)
                        .lte(0.01)
                    ) {
                      assetBalanceNormalizedBN = new BigNumber(collateralState.minValue)
                    }
                    const collateralToLoanRate = await FulcrumProvider.Instance.getKyberSwapRate(
                      this.props.loan!.collateralAsset,
                      this.props.loan!.loanAsset
                    )

                    this.setState(
                      {
                        ...this.state,
                        collateralToLoanRate,
                        assetDetails:
                          AssetsDictionary.assets.get(this.props.loan!.collateralAsset) || null,
                        loanValue: currentCollateralNormalizedBN.toNumber(),
                        selectedValue: currentCollateralNormalizedBN.toNumber(),
                        gasAmountNeeded: gasAmountNeeded,
                        collateralizedPercent: collateralizedPercent,
                        collateralExcess: collateralExcess,
                        assetBalanceValue: assetBalance.div(10 ** 18),
                        ethBalanceValue: ethBalance,
                      },
                      () => {
                        if (this.props.isOpenModal) {
                          window.history.pushState(
                            null,
                            'Manage Collateral Modal Opened',
                            `/trade/manage-collateral/`
                          )
                          this._selectedValueUpdate.next(new BigNumber(this.state.selectedValue))
                        }
                      }
                    )
                  })
                }
              )
            })
      })
    })
  }

  public async componentDidUpdate(
    prevProps: Readonly<IManageCollateralFormProps>,
    prevState: Readonly<IManageCollateralFormState>,
    snapshot?: any
  ): Promise<void> {
    if (prevState.assetDetails !== this.state.assetDetails) {
      this.getLiquidationPrice()
    }
  }

  public getLiquidationPrice = () => {
    if (this.props.loan) {
      const loanAssetDecimals =
        AssetsDictionary.assets.get(this.props.loan.loanAsset)!.decimals || 18
      const collateralAssetDecimals =
        AssetsDictionary.assets.get(this.props.loan.collateralAsset)!.decimals || 18
      const loanAssetPrecision = new BigNumber(10 ** (18 - loanAssetDecimals))
      const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralAssetDecimals))

      const currentCollateralAmount = this.state.collateralAmount.times(
        10 ** collateralAssetDecimals
      )
      const collateralAmount =
        this.state.loanValue > this.state.selectedValue
          ? this.props.loan.loanData!.collateral.minus(currentCollateralAmount)
          : this.props.loan.loanData!.collateral.plus(currentCollateralAmount)

      const liquidationCollateralToLoanRate = this.props.loan
        .loanData!.maintenanceMargin.times(
          this.props.loan.loanData!.principal.times(loanAssetPrecision)
        )
        .div(10 ** 20)
        .plus(this.props.loan.loanData!.principal.times(loanAssetPrecision))
        .div(collateralAmount.times(collateralAssetPrecision))
        .times(10 ** 18)

      const liquidationPrice =
        this.props.request.positionType === PositionType.LONG
          ? liquidationCollateralToLoanRate.div(10 ** 18)
          : new BigNumber(10 ** 36).div(liquidationCollateralToLoanRate).div(10 ** 18)

      this.setState({ ...this.state, liquidationPrice })
    }
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null
    }

    const amountMsg =
      this.state.ethBalanceValue && this.state.ethBalanceValue.lte(this.state.gasAmountNeeded)
        ? 'Insufficient funds for gas'
        : this.state.balanceTooLow
          ? 'Your wallet is empty'
          : this.state.assetBalanceValue.lt(this.state.inputAmountText)
            ? `Insufficient ${this.props.loan.collateralAsset} balance in your wallet!`
            : ''
    const liquidationPrice =
      this.state.activeTokenLiquidation === this.props.loan.collateralAsset
        ? this.state.liquidationPrice
        : new BigNumber(1).div(this.state.liquidationPrice)

    return (
      <form className="manage-collateral-form" onSubmit={this.onSubmitClick}>
        <div>
          {' '}
          <CloseIcon className="close-icon" onClick={this.props.onCancel} />
          <div className="manage-collateral-form__title">Manage Collateral</div>
          <div className="manage-collateral-form__text">Your position is collateralized</div>
          <div className="manage-collateral-form__collaterized">
            <span className={`${this.state.collateralTooLow && `text-danger`}`}>
              {this.state.collateralizedPercent.toFixed(2)}
            </span>
            %
          </div>
          <Slider
            step={0.01}
            min={this.state.minValue}
            max={this.state.maxValue}
            value={this.state.selectedValue}
            onChange={this.onChange}
            onAfterChange={this.onAfterChange}
          />
          <div className="manage-collateral-form__tips">
            <div className="manage-collateral-form__tip">Withdraw</div>
            <div className="manage-collateral-form__tip">Top Up</div>
          </div>
          <div className="manage-collateral-form__liquidation-price">
            <span>{this.props.isMobileMedia ? 'Liq.' : 'Liquidation'} price</span>
            <div className="manage-collateral-form__liquidation-price-container">
              <span title={liquidationPrice.toFixed()}>
                {this.formatPrecision(liquidationPrice.toFixed(), false)}
              </span>
              <LiquidationDropdown
                selectedAsset={this.state.activeTokenLiquidation}
                loanAsset={this.props.loan.loanAsset}
                collateralAsset={this.props.loan.collateralAsset}
                onAssetChange={(activeTokenLiquidation) =>
                  this.setState({ activeTokenLiquidation })
                }
              />
            </div>
          </div>
          <div className="manage-collateral-form__text">
            You will {this.state.loanValue > this.state.selectedValue ? 'withdraw' : 'top up'}
          </div>
          <div className="manage-collateral-form__input-amount-form">
            <div className={`manage-collateral-form__form-container`}>
              <div className="manage-collateral-form__form-values-container">
                <div className="manage-collateral-form__kv-container">
                  <div className="manage-collateral-form__label">
                    {!this.state.isLoading && amountMsg}
                  </div>
                </div>

                <InputAmount
                  inputAmountText={this.state.inputAmountText}
                  isLoading={this.state.isLoading}
                  selectedAsset={this.props.loan!.collateralAsset}
                  buttonValue={this.state.buttonValue}
                  onInsertMaxValue={this.onInsertMaxValue}
                  onTradeAmountChange={this.onTradeAmountChange}
                  onCollateralChange={this.onCollateralChange}
                  withSlider={false}
                  maxSliderValue={100}
                />
              </div>
            </div>
          </div>
          <div className="manage-collateral-form__actions-container">
            {this.state.loanValue > this.state.selectedValue ? (
              <button type="submit" className="manage-collateral-form__action-withdraw">
                Withdraw
              </button>
            ) : (
              <button
                type="submit"
                className="manage-collateral-form__action-top-up"
                disabled={!!amountMsg}>
                Top Up
              </button>
            )}
          </div>
        </div>
      </form>
    )
  }

  private onChange = (value: number) => {
    this.setState({
      ...this.state,
      selectedValue: value,
      buttonValue: 0,
      isLoading: true,
    })
  }

  private onAfterChange = (value: number) => {
    this._selectedValueUpdate.next(new BigNumber(this.state.selectedValue))
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : ''

    // setting Text to update display at the same time
    this.setState({ ...this.state, inputAmountText: amountText, buttonValue: 0 }, () => {
      this._inputChange.next(this.state.inputAmountText)
    })
  }

  public onInsertMaxValue = async (value: number) => {
    const selectedValue = new BigNumber(this.state.maxValue).multipliedBy(value)

    this.setState(
      {
        ...this.state,
        selectedValue: selectedValue.toNumber(),
        buttonValue: value,
        isLoading: true,
      },
      () => {
        // emitting next event for processing with rx.js
        this._selectedValueUpdate.next(selectedValue)
      }
    )
  }

  public onCollateralChange = async (asset: Asset) => {
    this._selectedValueUpdate.next()
  }

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!this.state.didSubmit && this.state.collateralAmount.gt(0)) {
      this.setState({ ...this.state, didSubmit: true })

      if (this.state.loanValue < this.state.selectedValue) {
        let assetBalance = await FulcrumProvider.Instance.getAssetTokenBalanceOfUser(
          this.props.loan!.collateralAsset
        )
        if (
          (appConfig.isMainnet && this.props.loan!.collateralAsset === Asset.ETH) ||
          (appConfig.isBsc && this.props.loan!.collateralAsset === Asset.BNB)
        ) {
          assetBalance = assetBalance.gt(FulcrumProvider.Instance.gasBufferForTrade)
            ? assetBalance.minus(FulcrumProvider.Instance.gasBufferForTrade)
            : new BigNumber(0)
        }
        const precision =
          AssetsDictionary.assets.get(this.props.loan!.collateralAsset)!.decimals || 18
        const amountInBaseUnits = new BigNumber(
          this.state.collateralAmount.multipliedBy(10 ** precision).toFixed(0, 1)
        )
        if (assetBalance.lt(amountInBaseUnits)) {
          this.setState({
            ...this.state,
            balanceTooLow: true,
            didSubmit: false,
          })

          return
        } else {
          this.setState({
            ...this.state,
            balanceTooLow: false,
          })
        }
      } else {
        this.setState({
          ...this.state,
          balanceTooLow: false,
        })
      }

      const request = this.props.request

      request.isWithdrawal = this.state.loanValue > this.state.selectedValue
      request.collateralAmount = new BigNumber(this.state.collateralAmount)

      this.props.onSubmit(request)
      this.props.changeLoadingTransaction(true, request, false, false)
    }
  }

  private rxFromSelectedValue = (value: BigNumber): Observable<number> => {
    return new Observable<number>((observer) => {
      this.setState({ ...this.state, isLoading: true })
      observer.next(value.toNumber())
    })
  }

  private rxFromInputAmount = (value: string): Observable<number> => {
    return new Observable<number>((observer) => {
      let collateralAmount = new BigNumber(Math.abs(Number(value)))

      const decimals = AssetsDictionary.assets.get(this.props.loan!.loanAsset)!.decimals || 18
      // collateral amount enough to get maintenance margin + 200%
      const maxCollateralForZeroMarginLoan = this.props
        .loan!.loanData.principal.div(10 ** decimals)
        .times(this.props.loan!.loanData!.maintenanceMargin.div(10 ** 20).plus(3))
        .div(this.state.collateralToLoanRate)
      let selectedValue = (Number(value) > 0
        ? collateralAmount
          .dividedBy(
            this.props.loan!.collateralAmount.isZero()
              ? maxCollateralForZeroMarginLoan
              : this.props.loan!.collateralAmount
          )
          .multipliedBy(this.state.maxValue - this.state.loanValue)
          .plus(this.state.loanValue)
        : new BigNumber(this.state.loanValue).minus(
          collateralAmount
            .dividedBy(this.state.collateralExcess)
            .multipliedBy(this.state.loanValue)
        )
      ).toNumber()

      if (selectedValue < this.state.minValue) {
        selectedValue = this.state.minValue
      }

      this.setState({ selectedValue: selectedValue })

      observer.next(selectedValue)
    })
  }

  private rxFromCurrentAmount = (value: number): Observable<ICollateralChangeEstimate> => {
    return new Observable<ICollateralChangeEstimate>((observer) => {
      let collateralAmount = new BigNumber(0)

      const decimals = AssetsDictionary.assets.get(this.props.loan!.loanAsset)!.decimals || 18
      // collateral amount enough to get maintenance margin + 200%
      const maxCollateralForZeroMarginLoan = this.props
        .loan!.loanData.principal.div(10 ** decimals)
        .times(this.props.loan!.loanData!.maintenanceMargin.div(10 ** 20).plus(3))
        .div(this.state.collateralToLoanRate)
      if (this.state.loanValue !== value && this.props.loan!.loanData) {
        if (value < this.state.loanValue) {
          collateralAmount = new BigNumber(this.state.loanValue)
            .minus(value)
            .dividedBy(this.state.loanValue)
            .multipliedBy(this.state.collateralExcess)
        } else {
          collateralAmount = new BigNumber(value)
            .minus(this.state.loanValue)
            .dividedBy(this.state.maxValue - this.state.loanValue)
            .multipliedBy(
              this.props.loan!.collateralAmount.isZero()
                ? maxCollateralForZeroMarginLoan
                : this.props.loan!.collateralAmount
            )
        }
        this.setState({ ...this.state, collateralAmount: collateralAmount })
      }

      FulcrumProvider.Instance.getManageCollateralChangeEstimate(
        this.props.loan!,
        collateralAmount,
        value < this.state.loanValue
      ).then((value) => {
        observer.next(value)
        this.changeStateLoading()
      })
    })
  }

  public changeStateLoading = () => {
    if (this.state.collateralAmount) {
      this.setState({ ...this.state, isLoading: false })
    }
  }

  public formatPrecision(outputText: string, isNecessarySign: boolean): string {
    const output = Number(outputText)
    let sign = ''
    if (this.state.loanValue > this.state.selectedValue) sign = '-'
    let n = Math.log(Math.abs(output)) / Math.LN10
    let x = 4 - n
    if (x < 0) x = 0
    if (x > 5) x = 5
    let result = new Number(output.toFixed(x)).toString()
    return isNecessarySign && result != '0' ? sign + result : result
  }
}
