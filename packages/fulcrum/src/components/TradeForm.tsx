import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, Component, FormEvent } from 'react'
import TagManager from 'react-gtm-module'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { ReactComponent as CloseIcon } from '../assets/images/ic__close.svg'
import { ReactComponent as QuestionIcon } from '../assets/images/ic__question_mark.svg'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary, AssetsDictionaryMobile } from '../domain/AssetsDictionary'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { PositionType } from '../domain/PositionType'
import { TradeRequest } from '../domain/TradeRequest'
import { TradeType } from '../domain/TradeType'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'
import { FulcrumProvider } from '../services/FulcrumProvider'
import '../styles/components/trade-form.scss'
import { CollapsibleContainer } from './CollapsibleContainer'
import { InputAmount } from './InputAmount'
import InputReceive from './InputReceive'
import { PositionTypeMarkerAlt } from './PositionTypeMarkerAlt'
import { Preloader } from './Preloader'
import { TradeExpectedResult } from './TradeExpectedResult'

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

interface IInputAmountLimited {
  inputAmountValue: BigNumber
  inputAmountText: string
  tradeAmountValue: BigNumber
  maxTradeValue: BigNumber
}

interface ITradeAmountChangeEvent {
  inputAmountText: string
  inputAmountValue: BigNumber
  tradeAmountValue: BigNumber
  maxTradeValue: BigNumber

  exposureValue: BigNumber
}

export interface ITradeFormProps {
  stablecoins: Asset[]
  loan?: IBorrowedFundsState
  tradeType: TradeType
  baseToken: Asset
  positionType: PositionType
  leverage: number
  quoteToken: Asset

  onSubmit: (request: TradeRequest) => void
  onCancel: () => void
  isMobileMedia: boolean
}

interface ITradeFormState {
  assetDetails: AssetDetails | null
  depositToken: Asset
  interestRate: BigNumber

  inputAmountText: string
  inputAmountValue: BigNumber
  tradeAmountValue: BigNumber
  maxTradeValue: BigNumber
  buttonValue: number

  maybeNeedsApproval: boolean

  liquidationPrice: BigNumber
  exposureValue: BigNumber

  isLoading: boolean
  isExposureLoading: boolean

  baseTokenPrice: BigNumber
  returnedAsset: Asset
  returnedAmount: BigNumber
  returnTokenIsCollateral: boolean
}

export default class TradeForm extends Component<ITradeFormProps, ITradeFormState> {
  private readonly _inputPrecision = 6

  private readonly _inputChange: Subject<string>
  private readonly _inputSetMax: Subject<BigNumber>

  private _isMounted: boolean

  constructor(props: ITradeFormProps, context?: any) {
    super(props, context)
    let assetDetails = AssetsDictionary.assets.get(props.baseToken)
    if (this.props.isMobileMedia) {
      assetDetails = AssetsDictionaryMobile.assets.get(this.props.baseToken)
    }
    const maxTradeValue = new BigNumber(0)
    const liquidationPrice = new BigNumber(0)
    const exposureValue = new BigNumber(0)
    this._isMounted = false
    this.state = {
      assetDetails: assetDetails || null,
      depositToken: props.baseToken,
      inputAmountText: '',
      inputAmountValue: maxTradeValue,
      tradeAmountValue: maxTradeValue,
      maxTradeValue: maxTradeValue,
      buttonValue: 0,
      interestRate: new BigNumber(0),
      maybeNeedsApproval: false,
      liquidationPrice: liquidationPrice,
      exposureValue: exposureValue,
      isLoading: true,
      isExposureLoading: true,
      baseTokenPrice: new BigNumber(0),
      returnedAsset: props.baseToken,
      returnedAmount: new BigNumber(0),
      returnTokenIsCollateral: props.positionType === PositionType.LONG ? true : false
    }

    this._inputChange = new Subject()
    this._inputSetMax = new Subject()

    merge(
      this._inputChange.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((value) => this.rxFromCurrentAmount(value))
      ),
      this._inputSetMax.pipe(switchMap((value) => this.rxFromMaxAmountWithMultiplier(value)))
    )
      .pipe(
        switchMap(
          (value) =>
            new Observable<ITradeAmountChangeEvent | null>((observer) => observer.next(value))
        )
      )
      .subscribe((next) => {
        if (next) {
          this._isMounted &&
            this.setState({ ...this.state, ...next, isLoading: false, isExposureLoading: false })
        } else {
          this._isMounted &&
            this.setState({
              ...this.state,
              inputAmountText: '',
              inputAmountValue: new BigNumber(0),
              tradeAmountValue: new BigNumber(0),
              exposureValue: new BigNumber(0),
              isLoading: false,
              isExposureLoading: false
            })
        }
      })

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private async derivedUpdate() {
    let assetDetails = AssetsDictionary.assets.get(this.props.baseToken)
    if (this.props.isMobileMedia) {
      assetDetails = AssetsDictionaryMobile.assets.get(this.props.baseToken)
    }
    const baseTokenPrice = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.baseToken)
    const maxTradeValue = await FulcrumProvider.Instance.getMaxTradeValue(
      this.props.tradeType,
      this.props.baseToken,
      this.props.quoteToken,
      this.state.depositToken,
      this.props.positionType,
      this.props.loan
    )
    const tradeRequest = new TradeRequest(
      this.props.loan?.loanId ||
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      this.props.tradeType,
      this.props.baseToken,
      this.props.quoteToken,
      this.state.depositToken,
      this.props.positionType,
      this.props.leverage,
      this.state.tradeAmountValue,
      this.state.returnTokenIsCollateral
    )

    // const maybeNeedsApproval = this.props.tradeType === TradeType.BUY ?
    //   await FulcrumProvider.Instance.checkCollateralApprovalForTrade(tradeRequest) :
    //   false;

    const collateralToPrincipalRate =
      this.props.positionType === PositionType.LONG
        ? await FulcrumProvider.Instance.getSwapRate(this.props.baseToken, this.props.quoteToken)
        : await FulcrumProvider.Instance.getSwapRate(this.props.quoteToken, this.props.baseToken)

    const initialMargin =
      this.props.positionType === PositionType.LONG
        ? new BigNumber(10 ** 38).div(new BigNumber(this.props.leverage - 1).times(10 ** 18))
        : new BigNumber(10 ** 38).div(new BigNumber(this.props.leverage).times(10 ** 18))
    const maintenanceMargin =
      this.props.loan && this.props.loan.loanData
        ? this.props.loan.loanData.maintenanceMargin
        : this.props.positionType === PositionType.LONG
        ? await FulcrumProvider.Instance.getMaintenanceMargin(
            this.props.quoteToken,
            this.props.baseToken
          )
        : await FulcrumProvider.Instance.getMaintenanceMargin(
            this.props.baseToken,
            this.props.quoteToken
          )
    // liq_price_before_trade = (maintenance_margin * collateralToLoanRate / 10^20) + collateralToLoanRate) / ((10^20 + current_margin) / 10^20
    // if it's a SHORT then -> 10^36 / above
    const liquidationPriceBeforeTrade = maintenanceMargin
      .times(collateralToPrincipalRate.times(10 ** 18))
      .div(10 ** 20)
      .plus(collateralToPrincipalRate.times(10 ** 18))
      .div(new BigNumber(10 ** 20).plus(initialMargin).div(10 ** 20))
    const liquidationPrice =
      this.props.positionType === PositionType.LONG
        ? liquidationPriceBeforeTrade.div(10 ** 18)
        : new BigNumber(10 ** 36).div(liquidationPriceBeforeTrade).div(10 ** 18)

    let exposureValue = new BigNumber(0)
    let interestRate = new BigNumber(0)
    // const interestRate = new BigNumber(0);//await FulcrumProvider.Instance.getTradeTokenInterestRate(tradeTokenKey);
    if (this.props.tradeType === TradeType.SELL) {
      interestRate = await FulcrumProvider.Instance.getBorrowInterestRate(this.props.baseToken)
      exposureValue = this.state.inputAmountValue
    } else {
      const estimatedMargin = await FulcrumProvider.Instance.getEstimatedMarginDetails(tradeRequest)
      exposureValue = estimatedMargin.exposureValue
      interestRate = estimatedMargin.interestRate
    }
    this._isMounted &&
      this.setState({
        ...this.state,
        assetDetails: assetDetails || null,
        // inputAmountText: limitedAmount.inputAmountText,// "",
        // inputAmountValue: limitedAmount.inputAmountValue,// new BigNumber(0),
        // tradeAmountValue: limitedAmount.tradeAmountValue,// new BigNumber(0),
        // maxTradeValue: limitedAmount.maxTradeValue,
        maxTradeValue,
        interestRate: interestRate,
        liquidationPrice: liquidationPrice,
        baseTokenPrice,
        exposureValue: exposureValue,
        isExposureLoading: false,
        isLoading: false
      })
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    this._isMounted = false

    window.history.pushState(null, 'Trade Modal Closed', `/trade`)
    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public async componentDidMount() {
    this._isMounted = true

    await this.derivedUpdate()
    window.history.pushState(
      null,
      'Trade Modal Opened',
      `/trade/${this.props.tradeType.toLocaleLowerCase()}-${
        this.props.leverage
      }x-${this.props.positionType.toLocaleLowerCase()}-${this.props.baseToken}/`
    )
    if (this.props.tradeType === TradeType.BUY) {
      this.onInsertMaxValue(1)
    } else {
      this.rxFromCurrentAmount('0')
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<ITradeFormProps>,
    prevState: Readonly<ITradeFormState>,
    snapshot?: any
  ): void {
    if (
      this.props.tradeType !== prevProps.tradeType ||
      this.props.baseToken !== prevProps.baseToken ||
      this.props.positionType !== prevProps.positionType ||
      this.props.leverage !== prevProps.leverage ||
      // this.state.depositToken !== prevState.depositToken ||
      this.state.tradeAmountValue !== prevState.tradeAmountValue
    ) {
      if (this.state.depositToken !== prevState.depositToken) {
        this._isMounted &&
          this.setState(
            {
              ...this.state,
              inputAmountText: '',
              inputAmountValue: new BigNumber(0),
              tradeAmountValue: new BigNumber(0)
            },
            () => {
              this.derivedUpdate()
            }
          )
      } else {
        // this.derivedUpdate();
        if (this.props.tradeType === TradeType.SELL) {
          // TODO: need to handle this with a feedback to the user?
          this.getLoanCloseAmount(this.state.returnedAsset)
        }
      }
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null
    }

    const submitClassName =
      this.props.tradeType === TradeType.BUY
        ? 'trade-form__submit-button--buy'
        : 'trade-form__submit-button--sell'

    // const amountMsg =
    //   this.state.ethBalance && this.state.ethBalance.lte(FulcrumProvider.Instance.gasBufferForTrade)
    //     ? "Insufficient funds for gas"
    //     : this.state.balance && this.state.balance.eq(0)
    //       ? "Your wallet is empty"
    //       : (this.state.tradeAmountValue.gt(0) && this.state.slippageRate.eq(0))
    //         && (this.state.depositToken === Asset.ETH || !this.state.maybeNeedsApproval)
    //         ? ``// `Your trade is too small.`
    //         : this.state.slippageRate.gte(0.01) && this.state.slippageRate.lt(99) // gte(0.2)
    //           ? `Slippage:`
    //           : "";

    let submitButtonText = ``
    if (this.props.tradeType === TradeType.BUY) {
      if (this.props.positionType === PositionType.SHORT) {
        submitButtonText = `SHORT`
      } else {
        submitButtonText = `LEVERAGE`
      }
    } else {
      submitButtonText = `CLOSE`
    }
    if (this.state.exposureValue.gt(0)) {
      submitButtonText += ` ${this.formatPrecision(this.state.exposureValue.toNumber())} ${
        this.props.baseToken
      }`
    } else {
      submitButtonText += ` ${this.props.baseToken}`
    }

    return (
      <form className="trade-form" onSubmit={this.onSubmitClick}>
        <CloseIcon className="close-icon" onClick={this.onCancelClick} />
        <div className="trade-form__left_block">
          <div className="trade-form__info_block">
            <div className="trade-form__info_block__logo">
              {this.state.assetDetails.reactLogoSvg.render()}
              <PositionTypeMarkerAlt value={this.props.positionType} />
            </div>
            <div className="trade-form__asset-stats">
              <div className="trade-form__info_block__asset">
                <span className="base-asset">{this.props.baseToken}</span>-{this.props.quoteToken}
              </div>
              <div className="trade-form__info_block__stats">
                <div className="trade-form__info_block__stats__data">
                  {`${this.state.interestRate.toFixed(1)}%`} APR
                </div>
                <div className="trade-form__info_block__stats__data">{`${this.props.leverage.toString()}x`}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`trade-form__form-container ${
            this.props.tradeType === TradeType.BUY ? 'buy' : 'sell'
          }`}>
          <div className="trade-form__form-values-container">
            {!this.props.isMobileMedia && this.props.tradeType === TradeType.BUY ? (
              <TradeExpectedResult
                entryPrice={this.state.baseTokenPrice}
                liquidationPrice={this.state.liquidationPrice}
              />
            ) : null}

            {/*<div className="trade-form__kv-container">
              {amountMsg.includes("Slippage:") ? (
                <div title={`${this.state.slippageRate.toFixed(18)}%`} className="trade-form__label slippage">
                  {amountMsg}
                  <span className="trade-form__slippage-amount">
                    &nbsp;{`${this.state.slippageRate.toFixed(2)}%`}<SlippageDown />
                  </span>
                </div>
              ) : (<div className="trade-form__label">{amountMsg}</div>)}

            </div> */}

            <InputAmount
              inputAmountText={this.state.inputAmountText}
              selectorAssets={[this.props.baseToken, this.props.quoteToken]}
              buttonValue={this.state.buttonValue}
              isLoading={false}
              tradeType={this.props.tradeType}
              selectedAsset={this.state.depositToken}
              onInsertMaxValue={this.onInsertMaxValue}
              onTradeAmountChange={this.onTradeAmountChange}
              onCollateralChange={this.onCollateralChange}
            />
            {this.props.tradeType === TradeType.SELL && (
              <InputReceive
                receiveAmout={this.state.returnedAmount}
                returnedAsset={this.state.returnedAsset}
                getLoanCloseAmount={this.getLoanCloseAmount}
                assetDropdown={[
                  this.props.loan?.collateralAsset || Asset.UNKNOWN,
                  this.props.loan?.loanAsset || Asset.UNKNOWN
                ]}
              />
            )}

            {this.props.isMobileMedia && this.props.tradeType === TradeType.BUY ? (
              <TradeExpectedResult
                entryPrice={this.state.baseTokenPrice}
                liquidationPrice={this.state.liquidationPrice}
              />
            ) : null}
          </div>

          <div className="trade-form__actions-container">
            <button
              title={
                this.state.exposureValue.gt(0)
                  ? `${this.state.exposureValue.toFixed(18)} ${this.props.baseToken}`
                  : ``
              }
              type="submit"
              className={`trade-form__submit-button ${submitClassName}`}>
              {this.state.isExposureLoading || this.state.isLoading ? (
                <Preloader width="75px" />
              ) : (
                submitButtonText
              )}
            </button>
          </div>
          {this.props.tradeType === TradeType.BUY ? (
            <div className="trade-how-it-works-container">
              <CollapsibleContainer
                titleOpen="What is this?"
                titleClose="What is this?"
                isTransparent={false}>
                <div className="trade-form__how-it-works">
                  <div className="hiw-icon">
                    <QuestionIcon />
                  </div>
                  <div className="hiw-content">
                    You are opening {this.props.leverage}x {this.props.positionType}{' '}
                    {this.state.assetDetails.displayName} position. This will borrow{' '}
                    {this.props.positionType === PositionType.LONG
                      ? this.props.quoteToken
                      : this.state.assetDetails.displayName}{' '}
                    from a Fulcrum lending pool and that{' '}
                    {this.props.positionType === PositionType.LONG
                      ? this.props.quoteToken
                      : this.state.assetDetails.displayName}{' '}
                    is swapped into{' '}
                    {this.props.positionType === PositionType.LONG
                      ? this.state.assetDetails.displayName
                      : this.props.quoteToken}{' '}
                    using an on-chain DEX.
                  </div>
                </div>
              </CollapsibleContainer>
            </div>
          ) : null}
        </div>
      </form>
    )
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : ''

    // setting inputAmountText to update display at the same time
    this._isMounted &&
      this.setState(
        {
          ...this.state,
          inputAmountText: amountText,
          buttonValue: 0,
          tradeAmountValue: new BigNumber(amountText)
        },
        () => {
          // emitting next event for processing with rx.js
          this._inputChange.next(this.state.inputAmountText)
        }
      )
  }

  public onInsertMaxValue = async (value: number) => {
    this._isMounted &&
      this.setState({ ...this.state, buttonValue: value }, () => {
        // emitting next event for processing with rx.js
        this._inputSetMax.next(new BigNumber(value))
      })
  }

  public onCancelClick = () => {
    this.props.onCancel()
  }

  public getLoanCloseAmount = async (asset: Asset) => {
    let loanCloseAmount = new BigNumber(0)
    const returnTokenIsCollateral =
      (asset === this.props.baseToken && this.props.positionType === PositionType.LONG) ||
      (asset !== this.props.baseToken && this.props.positionType === PositionType.SHORT)
        ? true
        : false
    const tradeRequest = new TradeRequest(
      this.props.loan!.loanId,
      this.props.tradeType,
      this.props.baseToken,
      this.props.quoteToken,
      this.state.depositToken,
      this.props.positionType,
      this.props.leverage,
      this.state.tradeAmountValue,
      returnTokenIsCollateral
    )

    if (tradeRequest.amount.gt(0)) {
      const loanCloseData = await FulcrumProvider.Instance.getLoanCloseAmount(tradeRequest)
      const loanAssetDecimals =
        AssetsDictionary.assets.get(this.props.loan!.loanAsset)!.decimals || 18
      const collateralAssetDecimals =
        AssetsDictionary.assets.get(this.props.loan!.collateralAsset)!.decimals || 18
      const loanAssetPrecision = new BigNumber(10 ** (18 - loanAssetDecimals))
      const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralAssetDecimals))

      loanCloseAmount = returnTokenIsCollateral
        ? loanCloseData[1].div(10 ** 18).times(collateralAssetPrecision)
        : loanCloseData[1].div(10 ** 18).times(loanAssetPrecision)
    }

    this._isMounted &&
      this.setState({
        ...this.state,
        returnedAsset: asset,
        returnedAmount: loanCloseAmount,
        returnTokenIsCollateral
      })
  }

  public onCollateralChange = async (asset: Asset) => {
    this._isMounted && this.setState({ ...this.state, depositToken: asset }, () => {
      this.onInsertMaxValue(1)
    })
  }

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const rateUSD = await FulcrumProvider.Instance.getSwapToUsdRate(this.state.depositToken)

    if (!this.state.assetDetails) {
      this.props.onCancel()
      return
    }

    if (!this.state.tradeAmountValue.isPositive()) {
      this.props.onCancel()
      return
    }

    const usdPrice = this.state.tradeAmountValue.multipliedBy(rateUSD)

    if (isMainnetProd) {
      const randomNumber = Math.floor(Math.random() * 100000) + 1
      const tagManagerArgs = {
        dataLayer: {
          event: 'purchase',
          transactionId: randomNumber,
          transactionTotal: new BigNumber(usdPrice).toNumber(),
          transactionProducts: [
            {
              name:
                this.props.leverage +
                'x' +
                this.props.baseToken +
                '-' +
                this.props.positionType +
                '-' +
                this.props.quoteToken,
              sku: this.props.leverage + 'x' + this.props.baseToken + '-' + this.props.positionType,
              category: this.props.positionType,
              price: new BigNumber(usdPrice).toNumber(),
              quantity: 1
            }
          ]
        }
      }
      TagManager.dataLayer(tagManagerArgs)
    }

    this.props.onSubmit(
      new TradeRequest(
        this.props.loan?.loanId ||
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        this.props.tradeType,
        this.props.baseToken,
        this.props.quoteToken,
        this.state.depositToken,
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmountValue,
        this.state.returnTokenIsCollateral
      )
    )
  }

  private rxFromMaxAmountWithMultiplier = (
    multiplier: BigNumber
  ): Observable<ITradeAmountChangeEvent | null> => {
    return new Observable<ITradeAmountChangeEvent | null>((observer) => {
      this._isMounted && this.setState({ ...this.state, isLoading: true, isExposureLoading: true })
      FulcrumProvider.Instance.getMaxTradeValue(
        this.props.tradeType,
        this.props.baseToken,
        this.props.quoteToken,
        this.state.depositToken,
        this.props.positionType,
        this.props.loan
      ).then((maxTradeValue) => {
        this.getInputAmountLimitedFromBigNumber(maxTradeValue, maxTradeValue, multiplier).then(
          (limitedAmount) => {
            this.createTradeAmountChangedEvent(limitedAmount, maxTradeValue).then((changeEvent) =>
              observer.next(changeEvent)
            )
          }
        )
      })
    })
  }

  private rxFromCurrentAmount = (value: string): Observable<ITradeAmountChangeEvent | null> => {
    return new Observable<ITradeAmountChangeEvent | null>((observer) => {
      this._isMounted && this.setState({ ...this.state, isExposureLoading: true })
      FulcrumProvider.Instance.getMaxTradeValue(
        this.props.tradeType,
        this.props.baseToken,
        this.props.quoteToken,
        this.state.depositToken,
        this.props.positionType,
        this.props.loan
      ).then((maxTradeValue) => {
        this.getInputAmountLimitedFromText(value, maxTradeValue).then((limitedAmount) => {
          this.createTradeAmountChangedEvent(limitedAmount, maxTradeValue).then((changeEvent) =>
            observer.next(changeEvent)
          )
        })
      })
    })
  }

  public createTradeAmountChangedEvent = async (
    limitedAmount: IInputAmountLimited,
    maxTradeValue: BigNumber
  ): Promise<ITradeAmountChangeEvent | null> => {
    if (limitedAmount.tradeAmountValue.isNaN()) return null
    const tradeRequest = new TradeRequest(
      this.props.loan?.loanId ||
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      this.props.tradeType,
      this.props.baseToken,
      this.props.quoteToken,
      this.state.depositToken,
      this.props.positionType,
      this.props.leverage,
      limitedAmount.tradeAmountValue,
      this.state.returnTokenIsCollateral
    )
    const {
      exposureValue,
      collateral,
      interestRate
    } = await FulcrumProvider.Instance.getEstimatedMarginDetails(tradeRequest)
    if (this.props.tradeType === TradeType.BUY) await this.setState({ ...this.state, interestRate })

    return {
      inputAmountText: limitedAmount.inputAmountText,
      inputAmountValue: limitedAmount.inputAmountValue,
      tradeAmountValue: limitedAmount.tradeAmountValue,
      maxTradeValue: maxTradeValue,
      exposureValue:
        this.props.tradeType === TradeType.BUY ? exposureValue : limitedAmount.inputAmountValue
    }
  }

  private getInputAmountLimitedFromText = async (
    textValue: string,
    maxTradeValue: BigNumber
  ): Promise<IInputAmountLimited> => {
    const inputAmountText = textValue
    const amountTextForConversion =
      inputAmountText === ''
        ? '0'
        : inputAmountText[0] === '.'
        ? `0${inputAmountText}`
        : inputAmountText
    const inputAmountValue = new BigNumber(amountTextForConversion)

    return this.getInputAmountLimited(inputAmountText, inputAmountValue, maxTradeValue)
  }

  private getInputAmountLimitedFromBigNumber = async (
    bnValue: BigNumber,
    maxTradeValue: BigNumber,
    multiplier: BigNumber
  ): Promise<IInputAmountLimited> => {
    const inputAmountValue = bnValue
    const inputAmountText = bnValue.decimalPlaces(this._inputPrecision).toFixed()

    return this.getInputAmountLimited(inputAmountText, inputAmountValue, maxTradeValue, multiplier)
  }

  private getInputAmountLimited = async (
    textValue: string,
    bnValue: BigNumber,
    maxTradeValue: BigNumber,
    multiplier: BigNumber = new BigNumber(1)
  ): Promise<IInputAmountLimited> => {
    let inputAmountText = textValue
    let inputAmountValue = bnValue

    // handling negative values (incl. Ctrl+C)
    if (inputAmountValue.isNegative()) {
      inputAmountValue = inputAmountValue.absoluteValue()
      inputAmountText = inputAmountValue.decimalPlaces(this._inputPrecision).toFixed()
    }

    let tradeAmountValue = new BigNumber(0)

    if (this.props.tradeType === TradeType.SELL) {
      tradeAmountValue = inputAmountValue
      const loanAssetDecimals =
        AssetsDictionary.assets.get(this.props.loan!.loanAsset)!.decimals || 18
      const collateralAssetDecimals =
        AssetsDictionary.assets.get(this.props.loan!.collateralAsset)!.decimals || 18

      const loanAssetPrecision = new BigNumber(10 ** (18 - loanAssetDecimals))
      const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralAssetDecimals))
      const collateralAssetAmount = this.props
        .loan!.loanData!.collateral.div(10 ** 18)
        .times(collateralAssetPrecision)
      const loanAssetAmount = this.props
        .loan!.loanData!.principal.div(10 ** 18)
        .times(loanAssetPrecision)

      const positionAmount =
        this.props.positionType === PositionType.LONG ? collateralAssetAmount : loanAssetAmount
      if (tradeAmountValue.gt(positionAmount)) {
        inputAmountValue = positionAmount.multipliedBy(multiplier)
        inputAmountText = positionAmount
          .multipliedBy(multiplier)
          .decimalPlaces(this._inputPrecision)
          .toFixed()
        tradeAmountValue = positionAmount.multipliedBy(multiplier)
      }
    } else if (this.props.tradeType === TradeType.BUY) {
      tradeAmountValue = inputAmountValue
      if (tradeAmountValue.gt(maxTradeValue)) {
        inputAmountValue = maxTradeValue.multipliedBy(multiplier)
        inputAmountText = maxTradeValue
          .multipliedBy(multiplier)
          .decimalPlaces(this._inputPrecision)
          .toFixed()
        tradeAmountValue = maxTradeValue.multipliedBy(multiplier)
      }
    }

    return {
      inputAmountValue: inputAmountValue.multipliedBy(multiplier),
      inputAmountText: isNaN(parseFloat(inputAmountText))
        ? ''
        : new BigNumber(parseFloat(inputAmountText)).multipliedBy(multiplier).toFixed(),
      tradeAmountValue: tradeAmountValue.multipliedBy(multiplier),
      maxTradeValue
    }
  }

  private formatPrecision(output: number): string {
    const n = Math.log(output) / Math.LN10
    let x = 3 - n
    if (x < 0) x = 0
    if (x > 5) x = 5
    const result = Number(output.toFixed(x)).toString()
    return result
  }
}
