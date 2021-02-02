import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import Slider from 'rc-slider'
import React, { ChangeEvent, Component, FormEvent } from 'react'
import TagManager from 'react-gtm-module'
import ReactTooltip from 'react-tooltip'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, switchMap } from 'rxjs/operators'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import { BorrowRequest } from '../domain/BorrowRequest'
import { IBorrowEstimate } from '../domain/IBorrowEstimate'
import { IDepositEstimate } from '../domain/IDepositEstimate'
import { TorqueProvider } from '../services/TorqueProvider'
import { ChiSwitch } from './ChiSwitch'
import { CollateralTokenSelectorToggle } from './CollateralTokenSelectorToggle'
import { Loader } from './Loader'

const isMainnet = process.env.NODE_ENV && process.env.REACT_APP_ETH_NETWORK === 'mainnet'

export interface IBorrowFormProps {
  borrowAsset: Asset
  interestRate: BigNumber
  liquidity: BigNumber
  onSubmit?: (value: BorrowRequest) => void
  onDecline: () => void
}

interface IBorrowFormState {
  borrowAmount: BigNumber
  collateralAsset: Asset
  borrowAmountValue: string
  depositAmount: BigNumber
  depositAmountValue: string
  gasAmountNeeded: BigNumber
  balanceTooLow: boolean
  didSubmit: boolean
  isLoading: boolean
  isEdit: boolean
  minValue: BigNumber
  maxValue: BigNumber
  maxBorrow: BigNumber
  sliderValue: number
  collaterizationPercents: string
  ethBalance: BigNumber
  maxAvailableLiquidity: BigNumber
  estimatedFee: BigNumber
  estimatedFeeChi: BigNumber
  assetDetails: AssetDetails | null
}

export class BorrowForm extends Component<IBorrowFormProps, IBorrowFormState> {
  private _input: HTMLInputElement | null = null
  private _isMounted: boolean

  private readonly _initDefaults: Subject<null>
  private readonly _borrowAmountChange: Subject<string>
  private readonly _depositAmountChange: Subject<string>
  private readonly _collateralChange: Subject<null>

  public constructor(props: IBorrowFormProps, context?: any) {
    super(props, context)
    const assetDetails = AssetsDictionary.assets.get(props.borrowAsset)
    this._isMounted = false

    this.state = {
      borrowAmount: new BigNumber(0),
      collateralAsset: TorqueProvider.Instance.isETHAsset(props.borrowAsset)
        ? Asset.USDC
        : isMainnet
        ? Asset.ETH
        : Asset.fWETH,
      borrowAmountValue: '',
      depositAmount: new BigNumber(0),
      depositAmountValue: '',
      ethBalance: new BigNumber(0),
      maxAvailableLiquidity: new BigNumber(0),
      estimatedFee: new BigNumber(0),
      estimatedFeeChi: new BigNumber(0),
      gasAmountNeeded: new BigNumber(3000000),
      balanceTooLow: false,
      didSubmit: false,
      isLoading: true,
      isEdit: false,
      minValue: new BigNumber(120.3019),
      maxValue: new BigNumber(3000),
      maxBorrow: new BigNumber(0),
      sliderValue: 0,
      collaterizationPercents: '',
      assetDetails: assetDetails || null
    }

    this._initDefaults = new Subject<null>()
    this._initDefaults.pipe(debounceTime(50)).subscribe(async () => {
      await this.setInputDefaults()
    })

    this._borrowAmountChange = new Subject<string>()
    this._collateralChange = new Subject<null>()
    this._depositAmountChange = new Subject<string>()

    this._borrowAmountChange
      .pipe(
        debounceTime(100),
        switchMap((value) => this.rxConvertToBigNumber(value)),
        switchMap((value) => this.rxGetDepositEstimate(value))
      )
      .subscribe(async (next) => {
        this.setDepositEstimate(next.depositAmount)
        this.changeStateLoading()
        await this.checkBalanceTooLow()
        await this.setEstimatedFee()
      })

    this._collateralChange
      .pipe(
        debounceTime(500),
        switchMap((value) => this.rxConvertToBigNumber(this.state.depositAmountValue))
      )
      .pipe(switchMap((value) => this.rxGetBorrowEstimate(value)))
      .subscribe(async (next) => {
        this.setBorrowEstimate(next.borrowAmount)
        this.changeStateLoading()
        await this.setMaxBorrow()
        await this.checkBalanceTooLow()
        await this.setEstimatedFee()
      })

    this._depositAmountChange
      .pipe(
        debounceTime(100),
        switchMap((value) => this.rxConvertToBigNumber(value))
      )
      .pipe(switchMap((value) => this.rxGetBorrowEstimate(value)))
      .subscribe(async (next) => {
        this.setBorrowEstimate(next.borrowAmount)
        this.changeStateLoading()
        await this.checkBalanceTooLow()
        await this.setEstimatedFee()
      })
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input
  }

  private async setInputDefaults() {
    const ethBalance = await TorqueProvider.Instance.getEthBalance()
    const maxAvailableLiquidity = await TorqueProvider.Instance.getAvailableLiquidaity(
      this.props.borrowAsset
    )
    const minInitialMargin = await TorqueProvider.Instance.getMinInitialMargin(
      this.props.borrowAsset,
      this.state.collateralAsset
    )
    const sliderValue: BigNumber = minInitialMargin.plus(30)

    this.setState({
      isLoading: false,
      maxAvailableLiquidity,
      ethBalance,
      minValue: minInitialMargin.plus(0.3019),
      sliderValue: this.inverseCurve(sliderValue),
      collaterizationPercents: this.formatPrecision(sliderValue)
    })
    await this.setMaxBorrow()
  }

  public async componentDidMount() {
    this._initDefaults.next()
  }

  // custom logarithmic-like scale for slider
  // based on https://codesandbox.io/s/qxm182k0mw
  private sliderCurve(x: number): BigNumber {
    return new BigNumber(0.30194 * Math.exp(2.30097 * x) + 120).dp(2, BigNumber.ROUND_HALF_UP)
  }

  private inverseCurve(x: BigNumber): number {
    return new BigNumber(Math.log((Number(x) - 120) / 0.30194) / 2.30097)
      .dp(2, BigNumber.ROUND_HALF_UP)
      .toNumber()
  }

  private async setEstimatedFee() {
    if (this.state.borrowAmount.eq(0)) {
      return this._isMounted && this.setState({ estimatedFee: new BigNumber(0) })
    }

    const tradeRequest = new BorrowRequest(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      this.props.borrowAsset,
      this.state.borrowAmount,
      this.state.collateralAsset,
      this.state.depositAmount
    )

    const gasPrice = await TorqueProvider.Instance.gasPrice()
    const rate = await TorqueProvider.Instance.getSwapToUsdRate(Asset.ETH)
    const estimatedFee = await TorqueProvider.Instance.getBorrowEstimatedGas(
      tradeRequest,
      false
    ).then((result) => {
      return result
        .times(gasPrice)
        .div(10 ** 18)
        .times(rate)
    })

    const estimatedFeeChi = estimatedFee.times(0.4)

    this.setState({ estimatedFee, estimatedFeeChi })
  }

  public formatLiquidity(value: BigNumber): string {
    if (value.lt(1000)) return value.toFixed(2)
    if (value.lt(10 ** 6)) return `${Number(value.dividedBy(1000).toFixed(2)).toString()}k`
    if (value.lt(10 ** 9)) return `${Number(value.dividedBy(10 ** 6).toFixed(2)).toString()}m`
    return `${Number(value.dividedBy(10 ** 9).toFixed(2)).toString()}b`
  }

  public formatPrecision(output: BigNumber): string {
    const outputNumber = Number(output)
    const n = Math.log(outputNumber) / Math.LN10
    let x = 3 - n
    x = x < 0 ? 0 : 2
    const result = Number(outputNumber.toFixed(x)).toString()
    return result
  }

  public render() {
    if (!this.state.assetDetails) {
      return null
    }

    const amountMsg =
      this.state.ethBalance && this.state.ethBalance.lte(TorqueProvider.Instance.gasBufferForTxn)
        ? 'Insufficient funds for gas'
        : this.state.borrowAmount.gt(this.state.maxAvailableLiquidity) ||
          (this.state.borrowAmount.eq(0) && this.state.depositAmount.gt(0))
        ? 'There is insufficient liquidity available for this loan'
        : this.state.balanceTooLow
        ? `Insufficient ${this.state.collateralAsset} balance in your wallet!`
        : this.state.borrowAmount.gt(0) && this.state.depositAmount.eq(0)
        ? `Loan is too large`
        : undefined
    return (
      <form className="borrow-form" onSubmit={this.onSubmit}>
        <section className="borrow-form__left_block">
          <div className="borrow-form__info_block">
            <div className="borrow-form__info_block__logo">
              {this.state.assetDetails.reactLogoSvg.render()}
            </div>
            <div className="borrow-form__asset-stats">
              <div className="borrow-form__info_block__asset">Borrow {this.props.borrowAsset}</div>
              <div className="borrow-form__info_block__stats">
                <div className="borrow-form__info_block__stats__data">
                  APR FIXED {`${this.props.interestRate.toFixed(1)}%`}
                </div>
                <div className="borrow-form__info_block__stats__data">
                  Liquidity {this.formatLiquidity(this.props.liquidity)}
                </div>
              </div>
            </div>
          </div>

          <div className="borrow-form__fee_block">
            <div className="borrow-form__column-title">
              Fees (Overestimated)
              <IconInfo
                className="tooltip__icon"
                data-tip="Please note our system overestimates gas limits to ensure transactions are processed. They will rarely exceed 90% of the stated cost."
                data-for="fee-estimated"
              />
              <ReactTooltip
                id="fee-estimated"
                className="tooltip__info"
                place="top"
                effect="solid"
              />
            </div>
            <div
              title={`${this.state.estimatedFee.toFixed(18)}`}
              className="borrow-form__column-value">
              <span className="borrow-form__fee" title={this.state.estimatedFee.toFixed()}>
                ~$<span className="value">{this.state.estimatedFee.toFixed(2)}</span>
              </span>
            </div>
            <div className="borrow-form__column-title">
              <span>
                Save&nbsp;
                <span className="value" title={this.state.estimatedFeeChi.toFixed()}>
                  {this.formatPrecision(this.state.estimatedFeeChi)}$
                </span>
                &nbsp; <br />
                with CHI
              </span>

              <IconInfo
                className="tooltip__icon"
                data-multiline="true"
                data-html={true}
                data-tip="<p>Use CHI token to save on gas fees. 
            CHI will be burned from your wallet, saving you up to 50% on all transaction fees.</p>
            <a href='https://app.uniswap.org/#/swap?inputCurrency=0x0000000000004946c0e9f43f4dee607b0ef1fa1c' class='tooltip__button'>Buy CHI</a>
            <a href='https://1inch-exchange.medium.com/everything-you-wanted-to-know-about-chi-gastoken-a1ba0ea55bf3' class='tooltip__button'>Learn More</a>"
                data-for="chi-estimated"
              />
              <ReactTooltip
                id="chi-estimated"
                className="tooltip__info"
                place="top"
                delayHide={500}
                effect="solid"
              />
            </div>
            <span className="borrow-form__chi">CHI Enabled</span> <ChiSwitch noLabel={true} />
          </div>
        </section>

        <section className="borrow-form__content">
          <div className="borrow-form__row-container">
            <div>How much would you like to borrow?</div>
          </div>
          <div className="borrow-form__input-container">
            <input
              ref={this._setInputRef}
              className="borrow-form__input-amount"
              type="number"
              step="any"
              value={this.state.borrowAmountValue}
              onChange={this.onTradeAmountChange}
              placeholder={`Enter amount`}
            />
            <div className="borrow-form__max-deposit" onClick={this.onMaxClick}>
              Max
            </div>
          </div>
          <div className="borrow-form__row-container">
            <div>How much would you like to deposit?</div>
            <div className="borrow-form__label-collateral">Collateral</div>
          </div>
          <div className="borrow-form__input-container">
            <input
              ref={this._setInputRef}
              className="borrow-form__input-amount"
              type="number"
              step="any"
              value={this.state.depositAmountValue}
              onChange={this.onChangeDeposit}
              placeholder={`Enter amount`}
            />
            <span className="borrow-form__collateral-asset">
              <CollateralTokenSelectorToggle
                borrowAsset={this.props.borrowAsset}
                collateralAsset={this.state.collateralAsset}
                readonly={this.state.didSubmit}
                onChange={this.onChangeCollateralAsset}
              />
            </span>
          </div>

          <div className="borrow-form__edit-collateral-by-container">
            <div className="edit-input-wrapper">
              <span>Collateralized</span>
              <div className="edit-input-container">
                {this.state.collaterizationPercents === '' ? (
                  <div className="loader-container">
                    <Loader quantityDots={3} sizeDots={'small'} title={''} isOverlay={false} />
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="edit-input-collateral">
                      <input
                        type="number"
                        step="any"
                        placeholder={`Enter`}
                        value={this.state.collaterizationPercents}
                        className="input-collateral"
                        onChange={this.onCollateralAmountChange}
                      />
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
          {/* <span className="borrow-form__label-safe">Safe</span>
            <React.Fragment>
              <Slider
                step={
                  (this.inverseCurve(this.state.maxValue) -
                    this.inverseCurve(this.state.minValue)) /
                  100
                }
                max={-this.inverseCurve(this.state.minValue)}
                min={-this.inverseCurve(this.state.maxValue)}
                value={-this.state.collaterizationValue}
                onChange={this.onChange}
                onAfterChange={this.onChange}
              />
            </React.Fragment> */}
          <div className="borrow-form__row-container">
            <span className="borrow-form__label-safe">Safer</span>
            <span className="borrow-form__label-safe">Riskier</span>
          </div>

          <React.Fragment>
            <Slider
              step={
                (this.inverseCurve(this.state.maxValue) - this.inverseCurve(this.state.minValue)) /
                100
              }
              max={-this.inverseCurve(this.state.minValue)}
              min={-this.inverseCurve(this.state.maxValue)}
              value={-this.state.sliderValue}
              onChange={this.onChange}
              onAfterChange={this.onChange}
            />
          </React.Fragment>

          {!this.state.isLoading && amountMsg !== undefined && (
            <div className="borrow-form__info-by-amount">
              <div className="borrow-form__insufficient-balance borrow-form__error">
                {amountMsg}
              </div>
            </div>
          )}

          <div className="dialog-actions">
            <div className="borrow-form__actions-container">
              <button
                className={`btn btn-size--small`}
                disabled={
                  this.state.didSubmit ||
                  this.state.balanceTooLow ||
                  amountMsg !== undefined ||
                  !Number(this.state.depositAmountValue)
                }
                type="submit">
                {this.state.didSubmit ? 'Submitting...' : 'Borrow'}
              </button>
            </div>
          </div>
        </section>
      </form>
    )
  }

  private rxConvertToBigNumber = (textValue: string): Observable<BigNumber> => {
    return new Observable<BigNumber>((observer) => {
      observer.next(new BigNumber(textValue))
    })
  }

  private rxGetDepositEstimate = (borrowAmount: BigNumber): Observable<IDepositEstimate> => {
    return new Observable<IDepositEstimate>((observer) => {
      TorqueProvider.Instance.getDepositAmountEstimate(
        this.props.borrowAsset,
        this.state.collateralAsset,
        borrowAmount,
        this.sliderCurve(this.state.sliderValue)
      ).then((value) => {
        observer.next(value)
      })
    })
  }

  private rxGetBorrowEstimate = (depositAmount: BigNumber): Observable<IBorrowEstimate> => {
    return new Observable<IBorrowEstimate>((observer) => {
      TorqueProvider.Instance.getBorrowAmountEstimate(
        this.props.borrowAsset,
        this.state.collateralAsset,
        depositAmount,
        this.sliderCurve(this.state.sliderValue)
      ).then((value) => {
        observer.next(value)
      })
    })
  }

  private onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (this.state.borrowAmount.lte(0) || this.state.depositAmount.lte(0)) {
      return
    }

    if (this.props.onSubmit && !this.state.didSubmit && this.state.depositAmount.gt(0)) {
      this.setState({ didSubmit: true })
      await this.checkBalanceTooLow()
      if (this.state.balanceTooLow) {
        this.setState({ didSubmit: false })
        return
      }
      const randomNumber = Math.floor(Math.random() * 100000) + 1
      const usdAmount = await TorqueProvider.Instance.getSwapToUsdRate(this.props.borrowAsset)
      let usdPrice = this.state.borrowAmount
      usdPrice = usdPrice.multipliedBy(usdAmount)

      if (isMainnet) {
        const tagManagerArgs = {
          dataLayer: {
            event: 'purchase',
            transactionId: randomNumber,
            transactionTotal: usdPrice,
            transactionProducts: [
              {
                name: 'Borrow-' + this.props.borrowAsset,
                sku: 'Borrow-' + this.props.borrowAsset + '-' + this.state.collateralAsset,
                category: 'Borrow',
                price: usdPrice,
                quantity: 1
              }
            ]
          }
        }
        TagManager.dataLayer(tagManagerArgs)
      }

      this.props.onSubmit(
        new BorrowRequest(
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          this.props.borrowAsset,
          this.state.borrowAmount,
          this.state.collateralAsset,
          this.state.depositAmount
        )
      )
    }
  }

  private onChangeCollateralAsset = async (asset: Asset) => {
    this.setState(
      {
        collateralAsset: asset
      },
      () => {
        this._collateralChange.next()
      }
    )
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const inputAmountText = event.target.value ? event.target.value : ''
    if (parseFloat(inputAmountText) < 0) return
    // setting inputAmountText to update display at the same time
    this.setState(
      {
        ...this.state,
        borrowAmountValue: inputAmountText,
        borrowAmount: new BigNumber(inputAmountText),
        isLoading: true
      },
      () => {
        this._borrowAmountChange.next(this.state.borrowAmountValue)
      }
    )
  }

  public onMaxClick = () => {
    const borrowAmountValue = this.state.maxBorrow.dp(5, BigNumber.ROUND_CEIL).toString()

    this.setState(
      {
        sliderValue: this.inverseCurve(this.state.minValue),
        collaterizationPercents: this.formatPrecision(this.state.minValue),
        borrowAmount: this.state.maxBorrow,
        borrowAmountValue
      },
      () => {
        this._borrowAmountChange.next(this.state.borrowAmountValue)
      }
    )
  }

  private checkBalanceTooLow = async () => {
    const collateralAsset = this.state.collateralAsset
    let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(collateralAsset)
    if (collateralAsset === Asset.ETH) {
      assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn)
        ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn)
        : new BigNumber(0)
    }
    const decimals = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18

    const balance = assetBalance.dividedBy(10 ** decimals)
    this.setState({ balanceTooLow: balance.lt(this.state.depositAmount) })
  }

  private setDepositEstimate = (amount: BigNumber) => {
    const depositAmount = amount.times(this.state.collaterizationPercents).div(this.state.minValue)

    const depositAmountValue = depositAmount.dp(5, BigNumber.ROUND_CEIL).toString()
    this.setState({
      depositAmount: depositAmount,
      depositAmountValue: depositAmountValue,
      isLoading: false
    })
  }

  private setBorrowEstimate = (borrowAmount: BigNumber) => {
    const borrowAmountValue = borrowAmount.dp(5, BigNumber.ROUND_CEIL).toString()

    const collaterizationPercents = this.formatPrecision(this.sliderCurve(this.state.sliderValue))

    this.setState({
      borrowAmount,
      borrowAmountValue,
      collaterizationPercents
    })
  }

  public changeStateLoading = () => {
    if (this.state.depositAmount) this.setState({ isLoading: false })
  }

  public onCollateralAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputCollateralText = event.target.value ? event.target.value : ''
    const inputCollateralValue = new BigNumber(inputCollateralText)

    if (parseFloat(inputCollateralText) < 0) return

    const collateralText = inputCollateralText
    let collaterizationPercents = inputCollateralValue

    if (inputCollateralValue.lt(this.state.minValue)) collaterizationPercents = this.state.minValue
    else if (inputCollateralValue.gt(this.state.maxValue)) {
      collaterizationPercents = this.state.maxValue
    }

    this.setState(
      {
        collaterizationPercents: collateralText,
        sliderValue: this.inverseCurve(collaterizationPercents)
      },
      () => {
        this._collateralChange.next()
      }
    )
  }

  public editCollateralInput = () => {
    this.setState({ isEdit: true })
  }

  private onChange = async (value: number) => {
    const sliderValue = -value
    this.setState(
      {
        sliderValue,
        collaterizationPercents: this.formatPrecision(this.sliderCurve(sliderValue))
      },
      () => this._collateralChange.next()
    )
  }

  public onChangeDeposit = async (event: ChangeEvent<HTMLInputElement>) => {
    const depositAmountValue = event.target.value ? event.target.value : ''

    this.setState(
      {
        depositAmount: new BigNumber(depositAmountValue),
        depositAmountValue: depositAmountValue
      },
      () => {
        this._depositAmountChange.next(depositAmountValue)
      }
    )
  }

  private setMaxBorrow = async () => {
    await TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.state.collateralAsset).then(
      async (balance) => {
        if (this.state.collateralAsset === Asset.ETH) {
          balance = balance.gt(TorqueProvider.Instance.gasBufferForTxn)
            ? balance.minus(TorqueProvider.Instance.gasBufferForTxn)
            : new BigNumber(0)
        }
        const decimals = AssetsDictionary.assets.get(this.state.collateralAsset)!.decimals || 18

        const depositAmount = balance.dividedBy(10 ** decimals)

        await TorqueProvider.Instance.getBorrowAmountEstimate(
          this.props.borrowAsset,
          this.state.collateralAsset,
          depositAmount,
          this.state.minValue
        ).then(async (borrowEstimate) => {
          this.setState({
            isLoading: true,
            maxBorrow: borrowEstimate.borrowAmount.eq(0)
              ? this.state.maxAvailableLiquidity.dp(5, BigNumber.ROUND_DOWN)
              : borrowEstimate.borrowAmount.dp(5, BigNumber.ROUND_DOWN)
          })
        })
      }
    )
  }
}
