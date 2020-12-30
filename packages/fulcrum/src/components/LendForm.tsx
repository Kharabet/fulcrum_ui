import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, Component, FormEvent } from 'react'
import TagManager from 'react-gtm-module'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import Asset from 'bzx-common/src/assets/Asset'

import AssetDetails from 'bzx-common/src/assets/AssetDetails'

import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'

import { LendRequest } from '../domain/LendRequest'
import { LendType } from '../domain/LendType'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'
import { FulcrumProvider } from '../services/FulcrumProvider'

import { ReactComponent as CloseIcon } from '../assets/images/ic__close.svg'
import { AssetDropdown } from './AssetDropdown'
import { Preloader } from './Preloader'

import '../styles/components/input-amount.scss'
import '../styles/components/lend-form.scss'

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

interface ILendAmountChangeEvent {
  isLendAmountTouched: boolean
  lendAmountText: string
  lendAmount: BigNumber
  maxLendAmount: BigNumber
  lendedAmountEstimate: BigNumber
}

export interface ILendFormProps {
  lendType: LendType
  asset: Asset

  onSubmit: (request: LendRequest) => void
  onCancel: () => void
  isMobileMedia: boolean
}

interface ILendFormState {
  assetDetails: AssetDetails | null

  isLendAmountTouched: boolean
  lendAmountText: string

  interestRate: BigNumber | null
  lendAmount: BigNumber | null
  maxLendAmount: BigNumber | null
  maxTokenAmount: BigNumber | null
  lendedAmountEstimate: BigNumber | null
  ethBalance: BigNumber | null
  iTokenAddress: string
  maybeNeedsApproval: boolean
  useWrapped: boolean
  useWrappedDai: boolean
  tokenPrice: BigNumber | null
  chaiPrice: BigNumber | null

  isLoading: boolean
  infoMessage: string
  isExpired: boolean
}

export default class LendForm extends Component<ILendFormProps, ILendFormState> {
  private readonly _inputPrecision = 6
  private readonly _staleDataDelay = 300000
  private readonly _inputChange: Subject<string>
  private readonly _inputSetMax: Subject<BigNumber>
  private _input: HTMLInputElement | null = null
  private _isMounted: boolean
  private _timer: any

  constructor(props: ILendFormProps, context?: any) {
    super(props, context)

    const assetDetails = AssetsDictionary.assets.get(this.props.asset)

    this._isMounted = false

    this.state = {
      assetDetails: assetDetails || null,
      isLendAmountTouched: false,
      lendAmountText: '0',
      lendAmount: null,
      maxLendAmount: null,
      maxTokenAmount: null,
      lendedAmountEstimate: null,
      interestRate: null,
      ethBalance: null,
      iTokenAddress: '',
      maybeNeedsApproval: false,
      useWrapped: false,
      useWrappedDai: false,
      tokenPrice: null,
      chaiPrice: null,
      isLoading: true,
      infoMessage: '',
      isExpired: false
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
            new Observable<ILendAmountChangeEvent | null>((observer) => observer.next(value))
        )
      )
      .subscribe((next) => {
        if (next) {
          this._isMounted && this.setState({ ...this.state, ...next, isLoading: false })
        } else {
          this._isMounted &&
            this.setState({
              ...this.state,
              isLendAmountTouched: false,
              lendAmountText: '',
              lendAmount: new BigNumber(0),
              lendedAmountEstimate: new BigNumber(0),
              isLoading: false
            })
        }
      })

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input
  }

  private async derivedUpdate() {
    window.clearTimeout(this._timer)
    this._isMounted &&
      this.setState({
        isExpired: false,
        isLoading: true
      })

    const assetDetails = AssetsDictionary.assets.get(this.props.asset)

    let assetOrWrapped: Asset
    if (this.props.asset === Asset.ETH) {
      assetOrWrapped = this.state.useWrapped ? Asset.WETH : Asset.ETH
    } else if (this.props.asset === Asset.DAI) {
      assetOrWrapped = this.state.useWrappedDai ? Asset.CHAI : Asset.DAI
    } else {
      assetOrWrapped = this.props.asset
    }

    const interestRate = await FulcrumProvider.Instance.getLendTokenInterestRate(this.props.asset)
    const maxLendAmountArr = await FulcrumProvider.Instance.getMaxLendValue(
      new LendRequest(this.props.lendType, assetOrWrapped, new BigNumber(0))
    )
    const maxLendAmount: BigNumber = maxLendAmountArr[0]
    const maxTokenAmount: BigNumber = maxLendAmountArr[1]
    const tokenPrice: BigNumber = maxLendAmountArr[2]
    const chaiPrice: BigNumber = maxLendAmountArr[3]
    const infoMessage = maxLendAmountArr[4]

    const lendRequest = new LendRequest(this.props.lendType, assetOrWrapped, maxLendAmount)
    const lendedAmountEstimate = await FulcrumProvider.Instance.getLendedAmountEstimate(lendRequest)
    const ethBalance = await FulcrumProvider.Instance.getEthBalance()
    const address = FulcrumProvider.Instance.contractsSource
      ? FulcrumProvider.Instance.contractsSource.getITokenErc20Address(this.props.asset) || ''
      : ''

    const maybeNeedsApproval =
      this.props.lendType === LendType.LEND
        ? await FulcrumProvider.Instance.checkCollateralApprovalForLend(assetOrWrapped)
        : false

    this._isMounted &&
      this.setState({
        ...this.state,
        assetDetails: assetDetails || null,
        lendAmountText: this.formatPrecision(maxLendAmount),
        lendAmount: maxLendAmount,
        maxLendAmount: maxLendAmount,
        maxTokenAmount: maxTokenAmount,
        lendedAmountEstimate: lendedAmountEstimate,
        interestRate: interestRate,
        ethBalance: ethBalance,
        iTokenAddress: address,
        maybeNeedsApproval: maybeNeedsApproval,
        tokenPrice: tokenPrice,
        chaiPrice: chaiPrice,
        isLoading: false,
        infoMessage: infoMessage
      })
    this._timer = window.setTimeout(() => this.setState({ isExpired: true }), this._staleDataDelay)
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    this._isMounted = false
    window.clearTimeout(this._timer)
    window.history.pushState(null, 'Lend Modal Closed', `/lend`)
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
      'Lend Modal Opened',
      `/lend/${this.props.lendType.toLocaleLowerCase()}-${this.props.asset}/`
    )

    if (this._input) {
      // this._input.select();
      this._input.focus()
      this._inputSetMax.next(new BigNumber(1))
    }
  }

  public async componentDidUpdate(
    prevProps: Readonly<ILendFormProps>,
    prevState: Readonly<ILendFormState>,
    snapshot?: any
  ) {
    if (
      this.props.lendType !== prevProps.lendType ||
      this.props.asset !== prevProps.asset ||
      this.state.useWrapped !== prevState.useWrapped ||
      this.state.useWrappedDai !== prevState.useWrappedDai
    ) {
      await this.derivedUpdate()
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null
    }

    const submitClassName =
      this.props.lendType === LendType.LEND
        ? 'lend-form__submit-button--lend'
        : 'lend-form__submit-button--un-lend'
    const tokenNameBase = this.state.assetDetails.displayName
    const tokenNamePosition = `i${this.state.assetDetails.displayName}`

    // const tokenNameSource = this.props.lendType === LendType.LEND ? tokenNameBase : tokenNamePosition;
    // const tokenNameDestination = this.props.lendType === LendType.LEND ? tokenNamePosition : tokenNameBase;
    const tokenNameSource = tokenNameBase
    const tokenNameDestination = tokenNamePosition

    const isAmountMaxed = this.state.lendAmount
      ? this.state.lendAmount.eq(this.state.maxLendAmount!)
      : false

    const amountMsg =
      this.state.ethBalance && this.state.ethBalance.lte(FulcrumProvider.Instance.gasBufferForLend)
        ? 'Insufficient funds for gas'
        : this.state.maxLendAmount && this.state.maxLendAmount.eq(0)
        ? 'Your wallet is empty'
        : this.state.infoMessage
        ? this.state.infoMessage
        : this.state.isExpired
        ? 'Price has changed'
        : ''

    const lendedAmountEstimateText =
      !this.state.lendedAmountEstimate || this.state.lendedAmountEstimate.eq(0)
        ? '0'
        : this.state.lendedAmountEstimate.gte(new BigNumber('0.000001'))
        ? this.state.lendedAmountEstimate.toFixed(6)
        : this.state.lendedAmountEstimate.toExponential(3)

    const needsApprovalMessage =
      (!this.state.maxLendAmount || this.state.maxLendAmount.gt(0)) &&
      this.props.lendType === LendType.LEND &&
      this.state.maybeNeedsApproval &&
      this.props.asset !== Asset.ETH

    return (
      <form
        className={`lend-form${this.state.isExpired ? ' expired' : ''}`}
        onSubmit={this.onSubmitClick}>
        <CloseIcon className="close-icon" onClick={this.onCancelClick} />
        <div className={`lend-form__image ${this.props.asset === Asset.ETH ? 'notice' : ''}`}>
          {this.state.iTokenAddress &&
          FulcrumProvider.Instance.web3ProviderSettings &&
          FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
            <a
              className="lend-form__info_block"
              title={this.state.iTokenAddress}
              href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.iTokenAddress}#readContract`}
              target="_blank"
              rel="noopener noreferrer">
              {this.state.assetDetails.reactLogoSvg.render()}
            </a>
          ) : (
            this.state.assetDetails.reactLogoSvg.render()
          )}
          {/*{this.props.asset === Asset.ETH && this.props.lendType === LendType.LEND &&
            <p className="lend-form__notification">This pool is currently paying above the standard market rate as it can lack sufficient liquidity to facilitate timely withdrawals. Please understand this risk before proceeding.</p>
          }
          {this.props.asset === Asset.ETH && this.props.lendType === LendType.UNLEND &&
            <React.Fragment>
              <p className="lend-form__notification">You can convert iETH to vBZRX, a token representing BZRX that vests over 4 years with a six month cliff. The current conversion rate is 0.0002 vBZRX per iETH, but the exchange rate will be changed to reflect market rates in the coming days.</p>
              <p className="lend-form__notification">Read more about Lenders Rescue program <a href="https://bzx.network/blog/compensation-plan" target="_blank" rel="noopener noreferrer">here</a></p>
            </React.Fragment>
          }*/}
        </div>
        <div className="lend-form__form-container">
          <div className="lend-form__form-values-container">
            <div className="lend-form__kv-container">
              <div className="lend-form__label">Asset</div>
              <hr />

              <div className="lend-form__value">{tokenNameSource}</div>
            </div>
            <div className="lend-form__kv-container">
              <div className="lend-form__label">Interest APR</div>
              <hr />
              <div
                title={this.state.interestRate ? `${this.state.interestRate.toFixed(18)}%` : ``}
                className="lend-form__value">
                {this.state.interestRate ? `${this.state.interestRate.toFixed(2)}%` : `0.00%`}
              </div>
            </div>

            <div className="lend-form__amount-message">{amountMsg}</div>

            <div className="input-amount__container">
              <input
                type="number"
                step="any"
                ref={this._setInputRef}
                className="input-amount__input"
                value={!this.state.isLoading ? this.state.lendAmountText : ''}
                onChange={this.onLendAmountChange}
              />
              {!this.state.isLoading ? null : (
                <div className="preloader-container">
                  {' '}
                  <Preloader width="80px" />
                </div>
              )}

              {this.props.asset === Asset.ETH ? (
                <AssetDropdown
                  selectedAsset={this.state.useWrapped ? Asset.WETH : Asset.ETH}
                  onAssetChange={this.onChangeUseWrapped}
                  assets={[Asset.WETH, Asset.ETH]}
                />
              ) : this.props.asset === Asset.DAI ? (
                <AssetDropdown
                  selectedAsset={this.state.useWrappedDai ? Asset.CHAI : Asset.DAI}
                  onAssetChange={this.onChangeUseWrappedDai}
                  assets={[Asset.DAI, Asset.CHAI]}
                />
              ) : (
                <AssetDropdown selectedAsset={this.props.asset} assets={[this.props.asset]} />
              )}
            </div>

            <div className="input-amount__group-button">
              <button data-value="0.25" onClick={this.onInsertMaxValue}>
                25%
              </button>
              <button data-value="0.5" onClick={this.onInsertMaxValue}>
                50%
              </button>
              <button data-value="0.75" onClick={this.onInsertMaxValue}>
                75%
              </button>
              <button data-value="1" onClick={this.onInsertMaxValue}>
                100%
              </button>
            </div>

            <div className="lend-form__kv-container jc-fe">
              <div
                title={
                  this.state.lendedAmountEstimate
                    ? `$${this.state.lendedAmountEstimate.toFixed(18)}`
                    : ``
                }
                className="lend-form__value lend-estimate">
                {this.state.iTokenAddress &&
                FulcrumProvider.Instance.web3ProviderSettings &&
                FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                  <a
                    className="lend-form__value lend-estimate"
                    title={this.state.iTokenAddress}
                    href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.iTokenAddress}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {lendedAmountEstimateText} {tokenNameDestination}
                  </a>
                ) : (
                  <React.Fragment>
                    &nbsp; {lendedAmountEstimateText} {tokenNameDestination}
                  </React.Fragment>
                )}
              </div>
            </div>

            {needsApprovalMessage ? (
              <div className="lend-form__token-message-container">
                <div className="lend-form__token-message-container--message">
                  You may be prompted to approve the asset after clicking LEND.
                </div>
              </div>
            ) : (
              <div style={{ height: '10px' }} />
            )}
          </div>

          <div className="lend-form__actions-container">
            {this.state.isExpired ? (
              <button
                type="submit"
                onClick={this.onUpdateClick}
                className={`lend-form__submit-button`}>
                Update Price
              </button>
            ) : (
              <button type="submit" className={`lend-form__submit-button ${submitClassName}`}>
                {this.props.lendType}
              </button>
            )}
          </div>
        </div>
      </form>
    )
  }

  public onLendAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : ''

    // setting tradeAmountText to update display at the same time
    this._isMounted &&
      this.setState({ lendAmountText: amountText }, () => {
        // emitting next event for processing with rx.js
        this._inputChange.next(this.state.lendAmountText)
      })
  }

  public onChangeUseWrapped = async (asset: Asset) => {
    if (this.state.useWrapped && asset === Asset.ETH) {
      this._isMounted && this.setState({ useWrapped: false })
    } else if (!this.state.useWrapped && asset === Asset.WETH) {
      this._isMounted && this.setState({ useWrapped: true })
    }
  }

  public onChangeUseWrappedDai = async (asset: Asset) => {
    if (this.state.useWrappedDai && asset === Asset.DAI) {
      this._isMounted && this.setState({ useWrappedDai: false })
    } else if (!this.state.useWrappedDai && asset === Asset.CHAI) {
      this._isMounted && this.setState({ useWrappedDai: true })
    }
  }

  public onInsertMaxValue = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!this.state.assetDetails) {
      return null
    }
    const buttonElement = event.currentTarget as HTMLButtonElement
    const value = new BigNumber(parseFloat(buttonElement.dataset.value!))

    // emitting next event for processing with rx.js
    this._isMounted &&
      this.setState({ isLoading: true }, () => {
        // emitting next event for processing with rx.js
        this._inputSetMax.next(value)
      })
  }

  public onCancelClick = () => {
    // let tmpNum = parseInt(this.state.lendAmount) +150
    // alert(tmpNum)
    // let randomNumber = Math.floor(Math.random() * 100000) + 1;
    // const tagManagerArgs = {
    //   dataLayer: {
    //     event: 'purchase',
    //     transactionId: randomNumber,
    //     transactionTotal: this.state.lendAmount,
    //     transactionProducts: [{
    //       name: this.props.lendType + '-' + this.props.asset,
    //       sku: this.props.asset,
    //       category:this.props.lendType,
    //     }],
    //   }
    // }
    // TagManager.dataLayer(tagManagerArgs)
    this.props.onCancel()
  }

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const usdAmount = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.asset)
    if (!this.state.lendAmount || this.state.lendAmount.isZero()) {
      if (this._input) {
        this._input.focus()
      }
      return
    }

    if (!this.state.assetDetails) {
      this.props.onCancel()
      return
    }

    if (
      !this.state.lendAmount.isPositive() ||
      !this.state.tokenPrice ||
      !this.state.maxTokenAmount ||
      !this.state.maxLendAmount
    ) {
      this.props.onCancel()
      return
    }

    let sendAmount
    if (this.props.lendType === LendType.LEND) {
      sendAmount = this.state.lendAmount
    } else {
      sendAmount = this.state.lendAmount.gte(this.state.maxLendAmount)
        ? this.state.maxTokenAmount
        : this.state.lendAmount.multipliedBy(10 ** 18).dividedBy(this.state.tokenPrice)

      if (this.props.asset === Asset.CHAI && this.state.chaiPrice) {
        sendAmount = sendAmount.multipliedBy(this.state.chaiPrice).dividedBy(10 ** 18)
      }

      if (sendAmount.gt(this.state.maxTokenAmount)) {
        sendAmount = this.state.maxTokenAmount
      }
    }

    const usdPrice = sendAmount.multipliedBy(usdAmount)

    if (isMainnetProd && LendType.LEND) {
      const randomNumber = Math.floor(Math.random() * 100000) + 1
      const tagManagerArgs = {
        dataLayer: {
          event: 'purchase',
          transactionId: randomNumber,
          transactionTotal: new BigNumber(usdPrice),
          transactionProducts: [
            {
              name: this.props.lendType + '-' + this.props.asset,
              sku: this.props.asset,
              category: this.props.lendType,
              price: new BigNumber(usdPrice),
              quantity: 1
            }
          ]
        }
      }
      TagManager.dataLayer(tagManagerArgs)
    }

    let assetOrWrapped: Asset
    if (this.props.asset === Asset.ETH) {
      assetOrWrapped = this.state.useWrapped ? Asset.WETH : Asset.ETH
    } else if (this.props.asset === Asset.DAI) {
      assetOrWrapped = this.state.useWrappedDai ? Asset.CHAI : Asset.DAI
    } else {
      assetOrWrapped = this.props.asset
    }

    // console.log(`send amount`,sendAmount.toString());

    if (this.props.lendType === LendType.UNLEND && sendAmount.gte(this.state.maxTokenAmount)) {
      // indicates a 100% burn
      sendAmount = FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS.times(10 ** 18)
    }

    this.props.onSubmit(new LendRequest(this.props.lendType, assetOrWrapped, sendAmount))
  }

  public onUpdateClick = async (event: any) => {
    event.preventDefault()
    await this.derivedUpdate()
  }

  private rxFromMaxAmountWithMultiplier = (
    multiplier: BigNumber = new BigNumber(1)
  ): Observable<ILendAmountChangeEvent | null> => {
    let assetOrWrapped: Asset
    if (this.props.asset === Asset.ETH) {
      assetOrWrapped = this.state.useWrapped ? Asset.WETH : Asset.ETH
    } else if (this.props.asset === Asset.DAI) {
      assetOrWrapped = this.state.useWrappedDai ? Asset.CHAI : Asset.DAI
    } else {
      assetOrWrapped = this.props.asset
    }

    const multipliedLendAmount = this.state.maxLendAmount
      ? this.state.maxLendAmount.multipliedBy(multiplier)
      : new BigNumber(0)

    const lendRequest = new LendRequest(
      this.props.lendType,
      assetOrWrapped,
      multipliedLendAmount || new BigNumber(0)
    )

    return new Observable<ILendAmountChangeEvent | null>((observer) => {
      FulcrumProvider.Instance.getLendedAmountEstimate(lendRequest).then((lendedAmountEstimate) => {
        observer.next({
          isLendAmountTouched: this.state.isLendAmountTouched || false,
          lendAmountText: multipliedLendAmount ? this.formatPrecision(multipliedLendAmount) : '0',
          lendAmount: multipliedLendAmount || new BigNumber(0),
          maxLendAmount: this.state.maxLendAmount || new BigNumber(0),
          lendedAmountEstimate: lendedAmountEstimate || new BigNumber(0)
        })
      })

      /*FulcrumProvider.Instance.getMaxLendValue(
        new LendRequest(this.props.lendType, this.props.asset, new BigNumber(0))
      ).then(maxLendValue => {
        const lendRequest = new LendRequest(
          this.props.lendType,
          this.props.asset,
          maxLendValue
        );

        FulcrumProvider.Instance.getLendedAmountEstimate(lendRequest).then(lendedAmountEstimate => {
          observer.next({
            isLendAmountTouched: this.state.isLendAmountTouched,
            lendAmountText: maxLendValue.decimalPlaces(this._inputPrecision).toFixed(),
            lendAmount: maxLendValue,
            maxLendAmount: maxLendValue,
            lendedAmountEstimate: lendedAmountEstimate
        });
      });*/
    })
  }

  private rxFromCurrentAmount = (value: string): Observable<ILendAmountChangeEvent | null> => {
    return new Observable<ILendAmountChangeEvent | null>((observer) => {
      const amountText = value
      const amountTextForConversion =
        amountText === '' ? '0' : amountText[0] === '.' ? `0${amountText}` : amountText
      const maxAmount = this.state.maxLendAmount || new BigNumber(0)

      let amount = new BigNumber(amountTextForConversion)
      // handling negative values (incl. Ctrl+C)
      if (amount.isNegative()) {
        amount = amount.absoluteValue()
      }
      if (amount.gt(maxAmount)) {
        amount = maxAmount
      }

      if (!amount.isNaN()) {
        let assetOrWrapped: Asset
        if (this.props.asset === Asset.ETH) {
          assetOrWrapped = this.state.useWrapped ? Asset.WETH : Asset.ETH
        } else if (this.props.asset === Asset.DAI) {
          assetOrWrapped = this.state.useWrappedDai ? Asset.CHAI : Asset.DAI
        } else {
          assetOrWrapped = this.props.asset
        }

        const lendRequest = new LendRequest(this.props.lendType, assetOrWrapped, amount)

        // updating stored value only if the new input value is a valid number
        FulcrumProvider.Instance.getLendedAmountEstimate(lendRequest).then(
          (lendedAmountEstimate) => {
            observer.next({
              isLendAmountTouched: true,
              lendAmountText: this.formatPrecision(amount),
              lendAmount: amount,
              maxLendAmount: this.state.maxLendAmount || new BigNumber(0),
              lendedAmountEstimate: lendedAmountEstimate
            })
          }
        )
      } else {
        observer.next(null)
      }
    })
  }

  public formatPrecision(output: BigNumber): string {
    const outputNumber = Number(output)

    const n = Math.log(Math.abs(outputNumber)) / Math.LN10
    let x = 4 - n
    if (x < 6) x = 4
    if (x < -1) x = 0
    if (x > this._inputPrecision) x = this._inputPrecision
    const m = Math.pow(10, x)
    return (Math.floor(outputNumber * m) / m).toString()
  }
}
