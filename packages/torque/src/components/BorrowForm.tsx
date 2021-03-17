import { BigNumber } from '@0x/utils'
import { BorrowRequest } from '../domain/BorrowRequest'
import { CollateralTokenSelectorToggle } from './CollateralTokenSelectorToggle'
import { debounceTime, switchMap } from 'rxjs/operators'
import { IBorrowEstimate } from '../domain/IBorrowEstimate'
import { IDepositEstimate } from '../domain/IDepositEstimate'
import { Loader } from './Loader'
import { merge, Observable, Subject } from 'rxjs'
import { TorqueProvider } from '../services/TorqueProvider'
import appConfig from 'bzx-common/src/config/appConfig'
import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import ethGasStation from 'bzx-common/src/lib/apis/ethGasStation'
import ExpectedResult from './ExpectedResult'
import React, { ChangeEvent, Component, FormEvent } from 'react'
import Slider from 'rc-slider'
import TagManager from 'react-gtm-module'

export interface IBorrowFormProps {
  assetsShown: Asset[]
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
  balanceValue: BigNumber
  didSubmit: boolean
  isLoading: boolean
  isEdit: boolean
  minValue: BigNumber
  maxValue: BigNumber
  sliderValue: number
  collaterizationPercents: string
  ethBalance: BigNumber
  maxAvailableLiquidity: BigNumber
  estimatedFee: BigNumber
  assetDetails: AssetDetails | null
  liquidationPrice: BigNumber
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
      collateralAsset:
        this.props.assetsShown[0] === this.props.borrowAsset
          ? this.props.assetsShown[1]
          : this.props.assetsShown[0],
      borrowAmountValue: '',
      depositAmount: new BigNumber(0),
      depositAmountValue: '',
      ethBalance: new BigNumber(0),
      balanceValue: new BigNumber(0),
      maxAvailableLiquidity: new BigNumber(0),
      estimatedFee: new BigNumber(0),
      gasAmountNeeded: new BigNumber(3000000),
      balanceTooLow: false,
      didSubmit: false,
      isLoading: false,
      isEdit: false,
      minValue: new BigNumber(120.3019),
      maxValue: new BigNumber(3000),
      sliderValue: 0,
      collaterizationPercents: '',
      assetDetails: assetDetails || null,
      liquidationPrice: new BigNumber(0),
    }

    this._initDefaults = new Subject<null>()
    this._initDefaults.pipe(debounceTime(50)).subscribe(async () => {
      await this.setInputDefaults()
      await this.setMaxBorrow()
      await this.setEstimatedFee()
      this.setState({ isLoading: false })
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
        // if (next.depositAmount.eq(0)) {return}
        this.setState({ isLoading: true })
        this.setDepositEstimate(next.depositAmount)
        await this.setEstimatedFee()
        await this.setLiquidationPrice()
        await this.checkBalanceTooLow()
        this.setState({ isLoading: false })
      })

    merge(
      this._depositAmountChange.pipe(
        debounceTime(100),
        switchMap((value) => this.rxConvertToBigNumber(value))
      ),
      this._collateralChange.pipe(
        debounceTime(100),
        switchMap((value) => this.rxConvertToBigNumber(this.state.depositAmountValue))
      )
    )
      .pipe(switchMap((value) => this.rxGetBorrowEstimate(value)))
      .subscribe(async (next) => {
        if (next.borrowAmount.eq(0)) {
          // otherwise collaterization percent will be NaN
          return
        }
        this.setState({ isLoading: true })
        await this.setBorrowEstimate(next.borrowAmount)
        // if (next.exceedsLiquidity) {
        //   this._borrowAmountChange.next(next.borrowAmount.toFixed(5))
        // }
        await this.setEstimatedFee()
        await this.setLiquidationPrice()
        await this.checkBalanceTooLow()

        this.setState({ isLoading: false })
      })
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input
  }

  private async setInputDefaults() {
    const ethBalance = await TorqueProvider.Instance.getEthBalance()

    const minInitialMargin = await TorqueProvider.Instance.getMinInitialMargin(
      this.props.borrowAsset,
      this.state.collateralAsset
    )

    const initialMargin = minInitialMargin.plus(30)

    this.setState(
      {
        maxAvailableLiquidity: this.props.liquidity.times(0.95),
        ethBalance,
        minValue: minInitialMargin.plus(0.3019),
        collaterizationPercents: initialMargin.toFixed(0),
        borrowAmountValue: '0',
        borrowAmount: new BigNumber(0),
      },
      async () => {
        await this.setLiquidationPrice()

        this.setState({ sliderValue: this.inverseCurve(initialMargin) })
      }
    )
  }

  public async componentDidMount() {
    this.setState({ isLoading: true })
    this._initDefaults.next()
  }

  // custom logarithmic-like scale for slider
  // based on https://codesandbox.io/s/qxm182k0mw
  private sliderCurve(x: number): BigNumber {
    const min = this.state.minValue.toNumber() - 0.3019
    return new BigNumber(0.30194 * Math.exp(2.30097 * x) + min).dp(2, BigNumber.ROUND_HALF_UP)
  }

  private inverseCurve(x: BigNumber): number {
    const min = this.state.minValue.toNumber() - 0.3019
    return new BigNumber(Math.log((Number(x) - min) / 0.30194) / 2.30097)
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

    const gasPrice = await ethGasStation.getGasPrice()
    const rate = await TorqueProvider.Instance.getSwapToUsdRate(
      appConfig.isBsc ? Asset.BNB : Asset.ETH
    )
    const estimatedFee = await TorqueProvider.Instance.getBorrowEstimatedGas(
      tradeRequest,
      false
    ).then((result) => {
      return result
        .times(gasPrice)
        .div(10 ** 18)
        .times(rate)
    })

    this.setState({ estimatedFee })
  }

  public setLiquidationPrice = async () => {
    const maintenanceMargin = await TorqueProvider.Instance.getMaintenanceMargin(
      this.props.borrowAsset,
      this.state.collateralAsset
    )

    const loanTokenDecimals = AssetsDictionary.assets.get(this.props.borrowAsset)?.decimals || 18
    const collateralTokenDecimals =
      AssetsDictionary.assets.get(this.state.collateralAsset)?.decimals || 18

    const loanAssetPrecision = new BigNumber(10 ** (18 - loanTokenDecimals))
    const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralTokenDecimals))
    const liquidationCollateralToLoanRate = maintenanceMargin
      .times(this.state.borrowAmount.times(10 ** loanTokenDecimals).times(loanAssetPrecision))
      .div(10 ** 20)
      .plus(this.state.borrowAmount.times(10 ** loanTokenDecimals).times(loanAssetPrecision))
      .div(
        this.state.depositAmount
          .times(10 ** collateralTokenDecimals)
          .times(collateralAssetPrecision)
      )
      .times(10 ** 18)

    const liquidationPrice = liquidationCollateralToLoanRate.div(10 ** 18)

    this.setState({ liquidationPrice })
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

    const loanStatus = this.state.borrowAmount.eq(0)
      ? ''
      : this.state.minValue.plus(10).gt(this.state.collaterizationPercents)
      ? 'risky'
      : 'safe'

    const minSliderValue = -this.inverseCurve(this.state.maxValue)
    const maxSliderValue = -this.inverseCurve(this.state.minValue)
    const amountMsg =
      this.state.ethBalance && this.state.ethBalance.lte(TorqueProvider.Instance.gasBufferForTxn)
        ? 'Insufficient funds for gas'
        : new BigNumber(this.state.borrowAmountValue).gt(this.state.maxAvailableLiquidity) ||
          this.state.borrowAmount.gt(this.state.maxAvailableLiquidity) ||
          (this.state.isLoading && this.state.borrowAmount.eq(0) && this.state.depositAmount.gt(0))
        ? 'There is insufficient liquidity available for this loan'
        : this.state.balanceTooLow || this.state.balanceValue.isZero()
        ? `Insufficient ${this.state.collateralAsset} balance in your wallet!`
        : this.state.borrowAmount.gt(0) && this.state.depositAmount.eq(0)
        ? `Loan is too large`
        : undefined
    const TokenIcon = this.state.assetDetails.reactLogoSvg
    return (
      <form className="borrow-form" onSubmit={this.onSubmit}>
        <section className="borrow-form__left_block">
          <div className="borrow-form__info_block">
            <div className="borrow-form__info_block__logo">
              <TokenIcon />
            </div>
            <div className="borrow-form__asset-stats">
              <div className="borrow-form__info_block__asset">Borrow {this.props.borrowAsset}</div>
              <div className="borrow-form__info_block__stats">
                <div className="borrow-form__info_block__stats__data">
                  APR FIXED {`${this.props.interestRate.toFixed(1)}%`}
                </div>
                <div
                  className="borrow-form__info_block__stats__data"
                  title={this.props.liquidity.toFixed()}>
                  Liquidity {this.formatLiquidity(this.props.liquidity)}
                </div>
              </div>
            </div>
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
            <div>
              Balance&nbsp;
              <span
                title={this.state.balanceValue.toFixed()}
                onClick={this.onMaxClick}
                style={{ cursor: 'pointer' }}>
                <span className="borrow-form__label-balance">
                  {this.formatPrecision(this.state.balanceValue)}&nbsp;
                </span>
                {this.state.collateralAsset}
              </span>
            </div>
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

          <div className="borrow-form__info-by-amount">
            <div className="borrow-form__insufficient-balance borrow-form__error">
              {this.state.isLoading ? (
                <Loader quantityDots={3} sizeDots="small" title="" isOverlay={false} />
              ) : (
                amountMsg
              )}
            </div>
          </div>

          <div className="borrow-form__slider">
            <div className="borrow-form__row-container">
              <span className="borrow-form__label-safe">Safer</span>
              <span className="borrow-form__label-safe">Riskier</span>
            </div>
            <Slider
              step={(maxSliderValue - minSliderValue) / 100}
              min={minSliderValue}
              max={maxSliderValue}
              value={-this.state.sliderValue}
              onChange={this.onChange}
              onAfterChange={this.onChange}
            />
          </div>

          <ExpectedResult
            collaterizationPercents={this.state.collaterizationPercents}
            liquidationPrice={this.state.liquidationPrice}
            estimatedFee={this.state.estimatedFee}
            loanToken={this.props.borrowAsset}
            collateralToken={this.state.collateralAsset}
            loanStatus={loanStatus}
          />
          <div className="dialog-actions">
            <div className="borrow-form__actions-container">
              <button
                className={`btn btn-size--small`}
                disabled={
                  this.state.isLoading ||
                  this.state.didSubmit ||
                  this.state.balanceTooLow ||
                  amountMsg !== undefined ||
                  !Number(this.state.depositAmountValue)
                }
                type="submit">
                {this.state.didSubmit
                  ? 'Submitting...'
                  : `Borrow${
                      this.state.borrowAmount.eq(0)
                        ? ''
                        : ` ${this.state.borrowAmount.toFixed(2)} ${this.props.borrowAsset}`
                    }`}
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
      )
        .then((value) => {
          observer.next(value)
        })
        .catch((e) => {
          this.setState({ isLoading: false })
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
      )
        .then((value) => {
          observer.next(value)
        })
        .catch((e) => {
          this.setState({ isLoading: false })
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

      if (appConfig.isGTMEnabled) {
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
                quantity: 1,
              },
            ],
          },
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
    this.state.collateralAsset !== asset &&
      this.setState(
        {
          collateralAsset: asset,
          isLoading: true,
        },
        async () => {
          await this.setInputDefaults()
          await this.setMaxBorrow()
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
        isLoading: true,
      },
      () => {
        this._borrowAmountChange.next(this.state.borrowAmountValue)
      }
    )
  }

  public onMaxClick = async () => {
    const precisionDigits = TorqueProvider.Instance.isStableAsset(this.state.collateralAsset)
      ? 2
      : 5
    if (this.state.balanceValue.eq(0)) {
      return
    }
    const depositAmountValue = this.state.balanceValue
      .dp(precisionDigits, BigNumber.ROUND_CEIL)
      .toString()

    this.setState(
      {
        isLoading: true,
        sliderValue: this.inverseCurve(this.state.minValue),
        collaterizationPercents: this.state.minValue.toFixed(0),
        depositAmount: this.state.balanceValue,
        depositAmountValue,
      },
      () => {
        this._depositAmountChange.next(depositAmountValue)
      }
    )
  }

  private checkBalanceTooLow = async () => {
    const collateralAsset = this.state.collateralAsset
    let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(collateralAsset)
    if (
      (appConfig.isMainnet && collateralAsset === Asset.ETH) ||
      (appConfig.isBsc && collateralAsset === Asset.BNB)
    ) {
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
    const precisionDigits = TorqueProvider.Instance.isStableAsset(this.state.collateralAsset)
      ? 2
      : 5

    const depositAmountValue = depositAmount.dp(precisionDigits, BigNumber.ROUND_CEIL).toString()

    this.setState({
      depositAmount: depositAmount,
      depositAmountValue: depositAmountValue,
    })
  }

  private setBorrowEstimate = async (borrowAmount: BigNumber) => {
    const precisionDigits = TorqueProvider.Instance.isStableAsset(this.props.borrowAsset) ? 2 : 5

    const borrowAmountValue = borrowAmount.dp(precisionDigits, BigNumber.ROUND_CEIL).toString()

    this.setState({
      borrowAmount,
      borrowAmountValue,
    })
  }

  public changeStateLoading = () => {
    if (this.state.depositAmount) this.setState({ isLoading: false })
  }

  private onChange = async (value: number) => {
    const sliderValue = -value
    this.setState(
      {
        sliderValue,
        collaterizationPercents: this.sliderCurve(sliderValue).toFixed(0),
      },
      () => this._collateralChange.next()
    )
  }

  public onChangeDeposit = async (event: ChangeEvent<HTMLInputElement>) => {
    const depositAmountValue = event.target.value ? event.target.value : ''
    if (parseFloat(depositAmountValue) < 0) {
      return
    }
    this.setState(
      {
        depositAmount: new BigNumber(depositAmountValue),
        depositAmountValue: depositAmountValue,
        isLoading: true,
      },
      () => {
        this._depositAmountChange.next(depositAmountValue)
      }
    )
  }

  private setMaxBorrow = async () => {
    await TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.state.collateralAsset).then(
      async (balance) => {
        if (
          (appConfig.isMainnet && this.state.collateralAsset === Asset.ETH) ||
          (appConfig.isBsc && Asset.BNB)
        ) {
          balance = balance.gt(TorqueProvider.Instance.gasBufferForTxn)
            ? balance.minus(TorqueProvider.Instance.gasBufferForTxn)
            : new BigNumber(0)
        }

        const decimals = AssetsDictionary.assets.get(this.state.collateralAsset)!.decimals || 18

        const depositAmount = balance.dividedBy(10 ** decimals)
        const precisionDigits = TorqueProvider.Instance.isStableAsset(this.state.collateralAsset)
          ? 2
          : 5
        const depositAmountValue = depositAmount
          .dp(precisionDigits, BigNumber.ROUND_CEIL)
          .toString()

        if (balance.gt(0)) {
          this.setState({ isLoading: true })
          this._depositAmountChange.next(depositAmountValue)
        }
        this.setState({
          balanceValue: depositAmount,
          depositAmountValue,
          depositAmount,
        })
      }
    )
  }
}
