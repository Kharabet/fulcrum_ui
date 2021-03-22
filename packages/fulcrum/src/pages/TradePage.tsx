import { BigNumber } from '@0x/utils'
import React, { PureComponent } from 'react'
import Modal from 'react-modal'

import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import ProviderChangedEvent from 'bzx-common/src/services/ProviderChangedEvent'
import { FulcrumProvider } from '../services/FulcrumProvider'

import { HistoryTokenGrid } from '../components/HistoryTokenGrid'
import { IHistoryTokenGridRowProps } from '../components/HistoryTokenGridRow'
import { OwnTokenGrid } from '../components/OwnTokenGrid'
import { IOwnTokenGridRowProps } from '../components/OwnTokenGridRow'
import { TokenGridTabs } from '../components/TokenGridTabs'
import { TradeTokenGrid } from '../components/TradeTokenGrid'
import { ITradeTokenGridRowProps } from '../components/TradeTokenGridRow'
import { TVChartContainer } from '../components/TVChartContainer'
import { ExtendLoanForm } from '../components/ExtendLoanForm'

import Asset from 'bzx-common/src/assets/Asset'

import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { tradePairs } from 'bzx-common/src/config/appConfig'
import {
  CloseWithSwapEvent,
  DepositCollateralEvent,
  LiquidationEvent,
  RolloverEvent,
  TradeEvent,
  WithdrawCollateralEvent,
} from 'bzx-common/src/domain/events'

import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { IHistoryEvents } from '../domain/IHistoryEvents'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { PositionType } from '../domain/PositionType'
import { TokenGridTab } from '../domain/TokenGridTab'
import { TradeRequest } from '../domain/TradeRequest'
import { TradeType } from '../domain/TradeType'
import loansWithOldOpenPriceFormat from '../config/loansWithOldOpenPriceFormat'
import '../styles/pages/_trade-page.scss'
import RolloverRequest from 'bzx-common/src/domain/RolloverRequest'
import InfoBlock from 'bzx-common/src/shared-components/InfoBlock'
import { StatsTokenGrid } from '../components/StatsTokenGrid'
import TVChartComingSoon from '../components/TVChartComingSoon'
import providerUtils from 'bzx-common/src/lib/providerUtils'
import blockchainEventsUtils from 'bzx-common/src/lib/blockchainEventsUtils'

const networkName = process.env.REACT_APP_ETH_NETWORK

const TradeForm = React.lazy(() => import('../components/TradeForm'))
const ManageCollateralForm = React.lazy(() => import('../components/ManageCollateralForm'))
//const ExtendLoanForm = React.lazy(() => import('../components/ExtendLoanForm'))

export interface ITradePageProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
}

export interface IMarketPair {
  baseToken: Asset
  quoteToken: Asset
}

interface ITradePageState {
  selectedMarket: IMarketPair
  isTradeModalOpen: boolean
  activeTokenGridTab: TokenGridTab
  tradeType: TradeType
  tradePositionType: PositionType
  tradeLeverage: number
  loanId?: string
  loans: IBorrowedFundsState[] | undefined
  isManageCollateralModalOpen: boolean
  isExtendLoanModalOpen: boolean

  openedPositionsCount: number
  tokenRowsData: ITradeTokenGridRowProps[]
  innerOwnRowsData: IOwnTokenGridRowProps[]
  ownRowsData: IOwnTokenGridRowProps[]
  historyEvents: IHistoryEvents | undefined
  historyRowsData: IHistoryTokenGridRowProps[]
  tradeRequestId: number
  isDataLoaded: boolean
  isLoadingTransaction: boolean
  request: TradeRequest | ManageCollateralRequest | RolloverRequest | ExtendLoanRequest | undefined
  isTxCompleted: boolean
  activePositionType: PositionType

  recentLiquidationsNumber: number
  isSupportNetwork: boolean
}

export default class TradePage extends PureComponent<ITradePageProps, ITradePageState> {
  private _isMounted: boolean = false
  private readonly daysNumberForLoanActionNotification = 2
  private readonly loanIdsWithOldOpenPriceFormat = loansWithOldOpenPriceFormat
  constructor(props: any) {
    super(props)
    if (networkName === 'kovan') {
      this.baseTokens = [Asset.fWETH, Asset.WBTC]
      this.quoteTokens = [Asset.USDC, Asset.WBTC]
    } else if (networkName === 'ropsten') {
      // this.baseTokens = [
      // ];
    } else if (networkName === 'bsc') {
      this.baseTokens = [Asset.BNB, Asset.ETH, Asset.BTC, Asset.BUSD]
      this.quoteTokens = [Asset.BUSD, Asset.USDT]
    } else {
      this.baseTokens = [
        Asset.ETH,
        Asset.DAI,
        Asset.WBTC,
        Asset.BZRX,
        Asset.LINK,
        Asset.MKR,
        Asset.YFI,
        Asset.KNC,
        Asset.UNI,
        Asset.AAVE,
        Asset.LRC,
        Asset.COMP,
      ]
      this.quoteTokens = [Asset.DAI, Asset.USDC, Asset.USDT, Asset.BZRX, Asset.WBTC]
    }
    this.stablecoins = [Asset.DAI, Asset.USDC, Asset.USDT, Asset.SUSD]
    const activePair = window.localStorage.getItem(`${networkName}-activePair`) || undefined
    const localStoragePair: { baseToken: Asset; quoteToken: Asset } | undefined =
      (activePair && JSON.parse(activePair)) || undefined
    this.state = {
      selectedMarket: localStoragePair || {
        baseToken: this.baseTokens[0],
        quoteToken: this.quoteTokens[0],
      },
      loans: undefined,
      isTradeModalOpen: false,
      activeTokenGridTab: TokenGridTab.Chart,
      tradeType: TradeType.BUY,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 0,
      isManageCollateralModalOpen: false,
      isExtendLoanModalOpen: false,
      openedPositionsCount: 0,
      tokenRowsData: [],
      innerOwnRowsData: [],
      ownRowsData: [],
      historyEvents: undefined,
      historyRowsData: [],
      tradeRequestId: 0,
      recentLiquidationsNumber: 0,
      isDataLoaded: false,
      isLoadingTransaction: false,
      isTxCompleted: false,
      request: undefined,
      activePositionType: PositionType.LONG,
      isSupportNetwork: true,
    }

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }
  private readonly defaultLeverageLong: number = 2
  private readonly defaultLeverageShort: number = 1
  private readonly baseTokens: Asset[] = []
  private readonly quoteTokens: Asset[] = []
  private readonly stablecoins: Asset[] = []

  public componentWillUnmount(): void {
    this._isMounted = false
    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public async componentDidMount() {
    this._isMounted = true
    const isSupportedNetwork = FulcrumProvider.Instance.unsupportedNetwork
    this.setState({ ...this.state, isSupportNetwork: isSupportedNetwork })
    const provider = providerUtils.getLocalstorageItem('providerType')
    if (!FulcrumProvider.Instance.web3Wrapper && (!provider || provider === 'None')) {
      this.props.doNetworkConnect()
    }
    await this.getTokenRowsData()
    await this.getInnerOwnRowsData()
    await this.setRecentLiquidationsNumber()
    // await this.fetchPositionsRecursive(3)
    setTimeout(() => {
      this.forceUpdate() // solves bug with positions not appearing on the first render.
    }, 5000)
  }

  private fetchPositionsRecursive = async (retries: number) => {
    await this.getInnerOwnRowsData()
    await this.getOwnRowsData().then(() => {
      if (!this._isMounted || this.state.ownRowsData.length > 0 || retries === 0) {
        return this._isMounted && this.setState({ isDataLoaded: true }) //exit recursive call
      } else {
        window.setTimeout(() => this.fetchPositionsRecursive(--retries), 1000)
      }
    })
  }

  private async setRecentLiquidationsNumber() {
    const liquidationsNumber = await FulcrumProvider.Instance.getLiquidationsInPastNDays(
      this.daysNumberForLoanActionNotification
    )
    this.setState({ ...this.state, recentLiquidationsNumber: liquidationsNumber })
  }

  public async componentDidUpdate(
    prevProps: Readonly<ITradePageProps>,
    prevState: Readonly<ITradePageState>,
    snapshot?: any
  ) {
    if (prevState.selectedMarket !== this.state.selectedMarket) {
      await this.getTokenRowsData()
      await this.getInnerOwnRowsData()
    }
    if (
      prevState.isTxCompleted !== this.state.isTxCompleted ||
      prevProps.isMobileMedia !== this.props.isMobileMedia
    ) {
      await this.getTokenRowsData()
      await this.getInnerOwnRowsData()
      await this.getOwnRowsData().then(() => {
        this.setState({
          ...this.state,
          historyEvents: undefined,
          historyRowsData: [],
        })
      })
    }
  }

  public render() {
    const tvBaseToken = this.checkWethOrFwethToken(this.state.selectedMarket.baseToken)
    const tvQuoteToken = this.checkWethOrFwethToken(this.state.selectedMarket.quoteToken)
    const loan =
      this.state.request && this.state.loans?.find((e) => e.loanId === this.state.request!.loanId)
    return (
      <div className="trade-page">
        {!this.state.isSupportNetwork ? (
          <main>
            {process.env.REACT_APP_ETH_NETWORK !== 'bsc' &&
              this.state.recentLiquidationsNumber > 0 && (
                <InfoBlock localstorageItemProp="past-liquidations-info">
                  {this.state.recentLiquidationsNumber === 1
                    ? 'One'
                    : this.state.recentLiquidationsNumber}
                  &nbsp;of your loans&nbsp;
                  {this.state.recentLiquidationsNumber === 1 ? 'has' : 'have'} been liquidated
                  during the past {this.daysNumberForLoanActionNotification} days. For more
                  information visit your&nbsp;
                  <a
                    href="#"
                    className="regular-link"
                    onClick={(e) => {
                      e.preventDefault()
                      this.onTokenGridTabChange(TokenGridTab.History)
                    }}>
                    Trade History
                  </a>
                  .
                </InfoBlock>
              )}
            <TokenGridTabs
              tradePairs={tradePairs}
              baseTokens={this.baseTokens}
              quoteTokens={this.quoteTokens}
              selectedMarket={this.state.selectedMarket}
              activeTokenGridTab={this.state.activeTokenGridTab}
              onMarketSelect={this.onTabSelect}
              onTokenGridTabChange={this.onTokenGridTabChange}
              isMobile={this.props.isMobileMedia}
              openedPositionsCount={this.state.openedPositionsCount}
            />

            <div
              className={`chart-wrapper${this.state.activeTokenGridTab !== TokenGridTab.Chart ? ' hidden' : ''
                }${networkName === 'bsc' ? ' bsc' : ''}`}>
              {networkName === 'bsc' ? (
                <TVChartComingSoon />
              ) : (
                <TVChartContainer
                  symbol={`${tvBaseToken}_${tvQuoteToken}`}
                  preset={this.props.isMobileMedia ? 'mobile' : undefined}
                />
              )}
            </div>

            {this.state.activeTokenGridTab === TokenGridTab.Chart && (
              <TradeTokenGrid
                isMobileMedia={this.props.isMobileMedia}
                tokenRowsData={this.state.tokenRowsData.filter(
                  (e) =>
                    e.baseToken === this.state.selectedMarket.baseToken &&
                    e.quoteToken === this.state.selectedMarket.quoteToken
                )}
                innerOwnRowsData={this.state.innerOwnRowsData.filter(
                  (e) =>
                    (this.checkWethOrFwethToken(e.baseToken) ===
                      this.checkWethOrFwethToken(this.state.selectedMarket.baseToken) ||
                      e.baseToken === this.state.selectedMarket.baseToken) &&
                    (this.checkWethOrFwethToken(e.quoteToken) ===
                      this.checkWethOrFwethToken(this.state.selectedMarket.quoteToken) ||
                      e.quoteToken === this.state.selectedMarket.quoteToken)
                )}
                changeLoadingTransaction={this.changeLoadingTransaction}
                onTransactionsCompleted={this.onTransactionsCompleted}
                request={this.state.request}
                isLoadingTransaction={this.state.isLoadingTransaction}
                isTxCompleted={this.state.isTxCompleted}
                changeGridPositionType={this.changeGridPositionType}
                activePositionType={this.state.activePositionType}
              />
            )}

            {this.state.activeTokenGridTab === TokenGridTab.Open && (
              <OwnTokenGrid
                isDataLoaded={this.state.isDataLoaded}
                ownRowsData={this.state.ownRowsData}
                isMobileMedia={this.props.isMobileMedia}
                onStartTrading={() => this.onTokenGridTabChange(TokenGridTab.Chart)}
              />
            )}

            {this.state.activeTokenGridTab === TokenGridTab.History && (
              <HistoryTokenGrid
                historyEvents={this.state.historyEvents}
                historyRowsData={this.state.historyRowsData}
                isMobileMedia={this.props.isMobileMedia}
                stablecoins={this.stablecoins}
                baseTokens={this.baseTokens}
                quoteTokens={this.quoteTokens}
                updateHistoryRowsData={this.updateHistoryRowsData}
                changeLoadingTransaction={this.changeLoadingTransaction}
                onStartTrading={() => this.onTokenGridTabChange(TokenGridTab.Chart)}
              />
            )}

            {this.state.activeTokenGridTab === TokenGridTab.Stats && (
              <StatsTokenGrid isMobileMedia={this.props.isMobileMedia} />
            )}

            {this.state.request &&
              this.state.request instanceof TradeRequest &&
              (this.state.tradeType === TradeType.BUY ||
                (this.state.tradeType === TradeType.SELL && loan && loan.loanData)) && (
                <Modal
                  isOpen={this.state.isTradeModalOpen}
                  onRequestClose={this.onTradeRequestClose}
                  className="modal-content-div modal-content-div-form"
                  overlayClassName="modal-overlay-div">
                  <TradeForm
                    stablecoins={this.quoteTokens}
                    loan={loan}
                    isMobileMedia={this.props.isMobileMedia}
                    tradeType={this.state.tradeType}
                    baseToken={this.state.request.asset}
                    positionType={this.state.tradePositionType}
                    leverage={this.state.tradeLeverage}
                    quoteToken={this.state.request.quoteToken}
                    onSubmit={this.onTradeConfirmed}
                    onCancel={this.onTradeRequestClose}
                  />
                </Modal>
              )}
            {this.state.request !== undefined && loan !== undefined && (
              <Modal
                isOpen={this.state.isManageCollateralModalOpen}
                onRequestClose={this.onManageCollateralRequestClose}
                className="modal-content-div"
                overlayClassName="modal-overlay-div">
                <ManageCollateralForm
                  loan={loan}
                  request={this.state.request as ManageCollateralRequest}
                  onSubmit={this.onManageCollateralConfirmed}
                  onCancel={this.onManageCollateralRequestClose}
                  isOpenModal={this.state.isManageCollateralModalOpen}
                  isMobileMedia={this.props.isMobileMedia}
                  changeLoadingTransaction={this.changeLoadingTransaction}
                />
              </Modal>
            )}
            {this.state.request !== undefined && loan !== undefined && (
              <Modal
                isOpen={this.state.isExtendLoanModalOpen}
                onRequestClose={this.onExtendLoanRequestClose}
                className="modal-content-div"
                overlayClassName="modal-overlay-div">
                <ExtendLoanForm
                  loan={loan}
                  request={this.state.request as ExtendLoanRequest}
                  onSubmit={this.onExtendLoanConfirmed}
                  onCancel={this.onExtendLoanRequestClose}
                  isOpenModal={this.state.isExtendLoanModalOpen}
                  isMobileMedia={this.props.isMobileMedia}
                  changeLoadingTransaction={this.changeLoadingTransaction}
                />
              </Modal>
            )}
          </main>
        ) : (
          <div className="message-wrong-network">You are connected to the wrong network.</div>
        )}
      </div>
    )
  }

  public checkWethOrFwethToken = (token: Asset) => {
    return token === Asset.WETH || token === Asset.fWETH ? Asset.ETH : token
  }

  public onTabSelect = async (baseToken: Asset, quoteToken: Asset) => {
    const marketPair = {
      baseToken,
      quoteToken,
    }
    await this.onTokenGridTabChange(TokenGridTab.Chart)
    window.localStorage.setItem(`${networkName}-activePair`, JSON.stringify(marketPair))
      ; (await this._isMounted) && this.setState({ ...this.state, selectedMarket: marketPair })
  }

  private onProviderAvailable = async () => {
    // await this.derivedUpdate()
  }

  private clearData = async () => {
    ; (await this._isMounted) &&
      this.setState({
        ownRowsData: [],
        innerOwnRowsData: [],
        loans: [],
        openedPositionsCount: 0,
        recentLiquidationsNumber: 0,
        isDataLoaded: false,
        historyEvents: undefined,
      })
  }

  private onProviderChanged = async () => {
    const isSupportedNetwork = FulcrumProvider.Instance.unsupportedNetwork
    this.setState({ ...this.state, isSupportNetwork: isSupportedNetwork })
    await this.clearData()
    await this.setRecentLiquidationsNumber()

    // await this.getInnerOwnRowsData()
    // await this.getOwnRowsData()

    await this.fetchPositionsRecursive(3)
    await this.getHistoryEvents()
  }

  public onManageCollateralRequested = async (request: ManageCollateralRequest) => {
    if (
      !FulcrumProvider.Instance.contractsSource ||
      !FulcrumProvider.Instance.contractsSource.canWrite
    ) {
      this.props.doNetworkConnect()
      return
    }

    if (request) {
      // if (this.state.activeTokenGridTab === TokenGridTab.Open) {
      //   await this.onTabSelect(request.asset, request.collateralAsset)
      // }
      ; (await this._isMounted) &&
        this.setState({
          ...this.state,
          isManageCollateralModalOpen: true,
          loanId: request.loanId,
          request,
        })
    }
  }

  public onManageCollateralConfirmed = async (request: ManageCollateralRequest) => {
    await FulcrumProvider.Instance.onManageCollateralConfirmed(request)
    this.onManageCollateralRequestClose()
  }

  public onManageCollateralRequestClose = async () => {
    ; (await this._isMounted) &&
      this.setState({
        ...this.state,
        isManageCollateralModalOpen: false,
      })
  }

  public onExtendLoanRequested = async (request: ExtendLoanRequest) => {
    if (
      !FulcrumProvider.Instance.contractsSource ||
      !FulcrumProvider.Instance.contractsSource.canWrite
    ) {
      this.props.doNetworkConnect()
      return
    }

    if (request) {
      // if (this.state.activeTokenGridTab === TokenGridTab.Open) {
      //   await this.onTabSelect(request.asset, request.collateralAsset)
      // }
      ; (await this._isMounted) &&
        this.setState({
          ...this.state,
          isExtendLoanModalOpen: true,
          loanId: request.loanId,
          request,
        })
    }
  }

  public onExtendLoanRequestClose = async () => {
    ; (await this._isMounted) &&
      this.setState({
        ...this.state,
        isExtendLoanModalOpen: false,
      })
  }
  public onExtendLoanConfirmed = async (request: ExtendLoanRequest) => {
    request.id = this.state.tradeRequestId
    FulcrumProvider.Instance.onExtendLoanConfirmed(request)
    this.setState({
      ...this.state,
      isExtendLoanModalOpen: false,
      request,
    })
  }

  public onTradeRequested = async (request: TradeRequest) => {
    if (
      !FulcrumProvider.Instance.contractsSource ||
      !FulcrumProvider.Instance.contractsSource.canWrite
    ) {
      this.props.doNetworkConnect()
      return
    }

    if (request) {
      // if (this.state.showMyTokensOnly) await this.onTabSelect(request.asset, request.quoteToken)
      ; (await this._isMounted) &&
        this.setState({
          ...this.state,
          isTradeModalOpen: true,
          tradeType: request.tradeType,
          tradePositionType: request.positionType,
          tradeLeverage: request.leverage,
          loanId: request.loanId,
          tradeRequestId: request.id,
          request,
        })
    }
  }

  public onTradeConfirmed = async (request: TradeRequest) => {
    request.id = this.state.tradeRequestId
    FulcrumProvider.Instance.onTradeConfirmed(request)
      ; (await this._isMounted) &&
        this.setState({
          ...this.state,
          isTradeModalOpen: false,
          request,
        })
  }

  public onRolloverConfirmed = async (request: RolloverRequest) => {
    FulcrumProvider.Instance.onRolloverConfirmed(request)
    this.setState({
      ...this.state,
      request,
    })
  }

  public onTradeRequestClose = async () => {
    ; (await this._isMounted) &&
      this.setState({
        ...this.state,
        isTradeModalOpen: false,
      })
  }

  public onTokenGridTabChange = async (activeTokenGridTab: TokenGridTab) => {
    ; (await this._isMounted) && this.setState({ ...this.state, activeTokenGridTab })

    activeTokenGridTab === TokenGridTab.Open &&
      this.state.ownRowsData === undefined &&
      (await this.getOwnRowsData())

    activeTokenGridTab === TokenGridTab.History &&
      this.state.historyEvents === undefined &&
      (await this.getHistoryEvents())
  }

  private getOwnRowDataProps = async (
    loan: IBorrowedFundsState,
    collateralToPrincipalRate?: BigNumber
  ): Promise<IOwnTokenGridRowProps> => {
    // approx date when Open Price precision update was deployed https://github.com/bZxNetwork/contractsV2/commit/2afdeb8c6b9951456d835fbd90a6bc38c699de89
    // https://etherscan.io/tx/0xd69e0d550a665975ce963b4069206257c279223bf3fda4cbe019efff2b70bf61

    const maintenanceMargin = loan.loanData.maintenanceMargin

    const currentCollateralToPrincipalRate = collateralToPrincipalRate
      ? collateralToPrincipalRate
      : await FulcrumProvider.Instance.getKyberSwapRate(loan.collateralAsset, loan.loanAsset)

    let positionType
    const possiblePairs = tradePairs.filter(
      (p) =>
        (p.baseToken === loan.loanAsset && p.quoteToken === loan.collateralAsset) ||
        (p.baseToken === loan.collateralAsset && p.quoteToken === loan.loanAsset)
    )
    if (tradePairs.length > 0 && possiblePairs && possiblePairs.length > 0) {
      if (possiblePairs.length > 1) {
        console.error(
          "The position fits to more than one pair. Couldn't treat it exactly as LONG/SHORT"
        )
      }
      positionType =
        possiblePairs[0].baseToken === loan.collateralAsset ? PositionType.LONG : PositionType.SHORT
    } else {
      const isLoanTokenOnlyInQuoteTokens =
        !this.baseTokens.includes(loan.loanAsset) && this.quoteTokens.includes(loan.loanAsset)
      const isCollateralTokenNotInQuoteTokens =
        this.baseTokens.includes(loan.collateralAsset) &&
        !this.quoteTokens.includes(loan.collateralAsset)
      positionType =
        isCollateralTokenNotInQuoteTokens || isLoanTokenOnlyInQuoteTokens
          ? PositionType.LONG
          : PositionType.SHORT
    }
    const baseAsset = positionType === PositionType.LONG ? loan.collateralAsset : loan.loanAsset

    const quoteAsset = positionType === PositionType.LONG ? loan.loanAsset : loan.collateralAsset

    const currentPrice =
      positionType === PositionType.LONG
        ? currentCollateralToPrincipalRate
        : new BigNumber(1).div(currentCollateralToPrincipalRate)

    let leverage = new BigNumber(10 ** 38)
      .div(loan.loanData.startMargin.times(10 ** 18))
      .dp(0, BigNumber.ROUND_HALF_UP)
    if (positionType === PositionType.LONG) leverage = leverage.plus(1)

    let positionValue = new BigNumber(0)
    let value = new BigNumber(0)
    let collateral = new BigNumber(0)
    let openPrice = new BigNumber(0)
    let liquidationPrice = new BigNumber(0)
    let profitCollateralToken: BigNumber | undefined = new BigNumber(0)
    let profitLoanToken: BigNumber | undefined = new BigNumber(0)
    let profitUSD = new BigNumber(0)
    let depositAmountCollateralToken = new BigNumber(0)
    let depositAmountLoanToken = new BigNumber(0)

    const loanAssetDecimals = AssetsDictionary.assets.get(loan.loanAsset)!.decimals || 18
    const collateralAssetDecimals =
      AssetsDictionary.assets.get(loan.collateralAsset)!.decimals || 18
    const loanAssetPrecision = new BigNumber(10 ** (18 - loanAssetDecimals))
    const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralAssetDecimals))
    const collateralAssetAmount = loan.loanData.collateral
      .div(10 ** 18)
      .times(collateralAssetPrecision)
    const loanAssetAmount = loan.loanData.principal.div(10 ** 18).times(loanAssetPrecision)
    // liquidation_collateralToLoanRate = ((maintenance_margin * principal / 10^20) + principal) / collateral * 10^18
    // If SHORT -> 10^36 / liquidation_collateralToLoanRate
    const liquidation_collateralToLoanRate = maintenanceMargin
      .times(loan.loanData.principal.times(loanAssetPrecision))
      .div(10 ** 20)
      .plus(loan.loanData.principal.times(loanAssetPrecision))
      .div(loan.loanData.collateral.times(collateralAssetPrecision))
      .times(10 ** 18)

    const maxTradeAmount = await FulcrumProvider.Instance.getMaxTradeValue(
      TradeType.SELL,
      loan.loanAsset,
      loan.collateralAsset,
      Asset.UNKNOWN,
      positionType,
      loan
    )
    const tradeRequestCollateral = new TradeRequest(
      loan.loanId,
      TradeType.SELL,
      loan.loanAsset,
      loan.collateralAsset,
      Asset.UNKNOWN,
      positionType,
      leverage.toNumber(),
      maxTradeAmount,
      true // false - return in loan token
    )
    const tradeRequestLoan = new TradeRequest(
      loan.loanId,
      TradeType.SELL,
      loan.loanAsset,
      loan.collateralAsset,
      Asset.UNKNOWN,
      positionType,
      leverage.toNumber(),
      maxTradeAmount,
      false // false - return in loan token
    )
    if (positionType === PositionType.LONG) {
      positionValue = collateralAssetAmount
      value = collateralAssetAmount.times(currentCollateralToPrincipalRate)
      collateral = collateralAssetAmount

      // earlier startRate was stored from Chainlink and had this format
      openPrice = loan.loanData.startRate
        .div(10 ** 18)
        .times(loanAssetPrecision)
        .div(collateralAssetPrecision)
      // https://github.com/bZxNetwork/contractsV2/commit/2afdeb8c6b9951456d835fbd90a6bc38c699de89
      // but then we started to store startRate as a price from Kyber (the real swap rate from trade event)
      // that has another format and should be handled in the following way:
      const newOpenPrice = new BigNumber(10 ** 36)
        .div(loan.loanData.startRate)
        .div(10 ** 18)
        .times(10 ** (collateralAssetDecimals - loanAssetDecimals))

      // the wrong price will be much larger.
      // For example 307854115598597579198986971899 and 0.03263155. The latest is the correct price
      openPrice = !this.loanIdsWithOldOpenPriceFormat.includes(loan.loanId)
        ? newOpenPrice
        : openPrice
      liquidationPrice = liquidation_collateralToLoanRate.div(10 ** 18)

      if (
        loan.loanData.depositValueAsCollateralToken.eq(0) ||
        loan.loanData.depositValueAsLoanToken.eq(0)
      ) {
        profitUSD = currentCollateralToPrincipalRate.minus(openPrice).times(positionValue)
      } else {
        const estimatedCollateralReceived = await FulcrumProvider.Instance.getLoanCloseAmount(
          tradeRequestCollateral
        )
        const estimatedLoanReceived = await FulcrumProvider.Instance.getLoanCloseAmount(
          tradeRequestLoan
        )

        const estimatedReceivedCollateralToken = estimatedCollateralReceived[1].div(
          10 ** collateralAssetDecimals
        )
        const estimatedReceivedLoanToken = estimatedLoanReceived[1].div(10 ** loanAssetDecimals)

        depositAmountCollateralToken = loan.loanData.depositValueAsCollateralToken.div(
          10 ** collateralAssetDecimals
        )

        depositAmountLoanToken = loan.loanData.depositValueAsLoanToken.div(10 ** loanAssetDecimals)

        profitCollateralToken = estimatedReceivedCollateralToken.gt(0)
          ? estimatedReceivedCollateralToken.minus(depositAmountCollateralToken)
          : undefined
        profitLoanToken = estimatedReceivedLoanToken.gt(0)
          ? estimatedReceivedLoanToken.minus(depositAmountLoanToken)
          : undefined
      }
    } else {
      collateral = collateralAssetAmount.times(currentCollateralToPrincipalRate)

      const shortsDiff = collateralAssetAmount
        .times(currentCollateralToPrincipalRate)
        .minus(loanAssetAmount)

      positionValue = collateralAssetAmount
        .times(currentCollateralToPrincipalRate)
        .minus(shortsDiff)

      value = positionValue.div(currentCollateralToPrincipalRate)
      // earlier startRate was stored from Chainlink and had this format
      openPrice = new BigNumber(10 ** 36)
        .div(loan.loanData.startRate.times(loanAssetPrecision).div(collateralAssetPrecision))
        .div(10 ** 18)

      // https://github.com/bZxNetwork/contractsV2/commit/2afdeb8c6b9951456d835fbd90a6bc38c699de89
      // but then we started to store startRate as a price from Kyber (the real swap rate from trade event)
      // that has another format and should be handled in the following way:
      const newOpenPrice = loan.loanData.startRate
        .div(10 ** 18)
        .times(10 ** (loanAssetDecimals - collateralAssetDecimals))

      // the wrong price will be much larger.
      // For example 307854115598597579198986971899 and 0.03263155. The latest is the correct price
      openPrice = !this.loanIdsWithOldOpenPriceFormat.includes(loan.loanId)
        ? newOpenPrice
        : openPrice
      liquidationPrice = new BigNumber(10 ** 36).div(liquidation_collateralToLoanRate).div(10 ** 18)

      if (
        loan.loanData.depositValueAsCollateralToken.eq(0) ||
        loan.loanData.depositValueAsLoanToken.eq(0)
      ) {
        profitUSD = openPrice
          .minus(new BigNumber(1).div(currentCollateralToPrincipalRate))
          .times(positionValue)
      } else {
        const estimatedCollateralReceived = await FulcrumProvider.Instance.getLoanCloseAmount(
          tradeRequestCollateral
        )
        const estimatedLoanReceived = await FulcrumProvider.Instance.getLoanCloseAmount(
          tradeRequestLoan
        )

        const estimatedReceivedCollateralToken = estimatedCollateralReceived[1].div(
          10 ** collateralAssetDecimals
        )
        const estimatedReceivedLoanToken = estimatedLoanReceived[1].div(10 ** loanAssetDecimals)

        depositAmountCollateralToken = loan.loanData.depositValueAsCollateralToken.div(
          10 ** collateralAssetDecimals
        )

        depositAmountLoanToken = loan.loanData.depositValueAsLoanToken.div(10 ** loanAssetDecimals)

        profitCollateralToken = estimatedReceivedCollateralToken.gt(0)
          ? estimatedReceivedCollateralToken.minus(depositAmountCollateralToken)
          : undefined
        profitLoanToken = estimatedReceivedLoanToken.gt(0)
          ? estimatedReceivedLoanToken.minus(depositAmountLoanToken)
          : undefined
      }
    }

    return {
      loan: loan,
      baseToken: baseAsset,
      quoteToken: quoteAsset,
      leverage: leverage.toNumber(),
      positionType,
      positionValue,
      value,
      collateral:
        positionType === PositionType.LONG
          ? depositAmountCollateralToken.gt(0)
            ? depositAmountCollateralToken
            : collateral
          : depositAmountLoanToken.gt(0)
            ? depositAmountLoanToken
            : collateral,
      openPrice,
      currentPrice,
      liquidationPrice,
      profitCollateralToken,
      profitLoanToken,
      profitUSD,
      maintenanceMargin: maintenanceMargin.div(10 ** 20),
      onTrade: this.onTradeRequested,
      onManageCollateralOpen: this.onManageCollateralRequested,
      onExtendLoanOpen: this.onExtendLoanRequested,
      onRolloverConfirmed: this.onRolloverConfirmed,
      changeLoadingTransaction: this.changeLoadingTransaction,
      onTransactionsCompleted: this.onTransactionsCompleted,
      isTxCompleted: this.state.isTxCompleted,
    } as IOwnTokenGridRowProps
  }

  public getOwnRowsData = async () => {
    // if (
    //   !FulcrumProvider.Instance.web3Wrapper ||
    //   !FulcrumProvider.Instance.contractsSource ||
    //   !FulcrumProvider.Instance.contractsSource.canWrite
    // ) {
    //   ;(await this._isMounted) &&
    //     this.setState({ ownRowsData: [], loans: undefined, openedPositionsCount: 0 })
    //   return null
    // }
    await FulcrumProvider.Instance.getUserMarginTradeLoans().then(async (loans) => {
      const ownRowsData: IOwnTokenGridRowProps[] = []

      for (const loan of loans) {
        if (!loan.loanData) continue

        const ownRowDataProps = await this.getOwnRowDataProps(loan)

        ownRowsData.push(ownRowDataProps)
      }

      this._isMounted &&
        this.setState({
          ...this.state,
          ownRowsData: ownRowsData,
          loans: loans,
        })
    })
  }

  public getInnerOwnRowsData = async () => {
    // if (
    //   !FulcrumProvider.Instance.web3Wrapper ||
    //   !FulcrumProvider.Instance.contractsSource ||
    //   !FulcrumProvider.Instance.contractsSource!.canWrite
    // ) {

    //   ;(await this._isMounted) && this.setState({ innerOwnRowsData: [], openedPositionsCount: 0 })
    //   return null
    // }
    const innerOwnRowsData: IOwnTokenGridRowProps[] = []
    let loans: IBorrowedFundsState[] | undefined

    const loansByPair = await FulcrumProvider.Instance.getUserMarginTradeLoansByPair(
      this.state.selectedMarket.baseToken,
      this.state.selectedMarket.quoteToken
    )

    loans = loansByPair.loans

    const selectMarketBaseToQuoteTokenRate = await FulcrumProvider.Instance.getKyberSwapRate(
      this.state.selectedMarket.baseToken,
      this.state.selectedMarket.quoteToken
    )
    for (const loan of loans) {
      if (!loan.loanData) continue
      const currentCollateralToPrincipalRate =
        this.state.selectedMarket.baseToken === loan.collateralAsset
          ? selectMarketBaseToQuoteTokenRate
          : new BigNumber(1).div(selectMarketBaseToQuoteTokenRate)
      const ownRowDataProps = await this.getOwnRowDataProps(loan, currentCollateralToPrincipalRate)
      innerOwnRowsData.push(ownRowDataProps)
    }
    ; (await this._isMounted) &&
      this.setState({
        ...this.state,
        openedPositionsCount: loansByPair.allUsersLoansCount,
        innerOwnRowsData,
        loans: !this.state.loans ? loans : this.state.loans,
      })
  }

  public getHistoryEvents = async () => {
    // if (
    //   !FulcrumProvider.Instance.web3Wrapper ||
    //   !FulcrumProvider.Instance.contractsSource ||
    //   !FulcrumProvider.Instance.contractsSource.canWrite
    // ) {
    //   ;(await this._isMounted) && this.setState({ historyEvents: undefined })
    //   return null
    // }
    const tradeEvents = await blockchainEventsUtils.getTradeHistory(FulcrumProvider.Instance)
    const rolloverEvents = await blockchainEventsUtils.getRolloverHistory(FulcrumProvider.Instance)
    const closeWithSwapEvents = await blockchainEventsUtils.getCloseWithSwapHistory(
      FulcrumProvider.Instance
    )
    const liquidationEvents = await blockchainEventsUtils.getLiquidationHistory(
      FulcrumProvider.Instance
    )
    const depositCollateralEvents = await blockchainEventsUtils.getDepositCollateralHistory(
      FulcrumProvider.Instance
    )
    const withdrawCollateralEvents = await blockchainEventsUtils.getWithdrawCollateralHistory(
      FulcrumProvider.Instance
    )
    const earnRewardEvents = await blockchainEventsUtils.getEarnRewardHistory(
      FulcrumProvider.Instance
    )
    const payTradingFeeEvents = await blockchainEventsUtils.getPayTradingFeeHistory(
      FulcrumProvider.Instance
    )
    // const tokens = Array.from(new Set(this.baseTokens.concat(this.quoteTokens)));

    // tokens.forEach(async (token) => {
    //   let rate = await FulcrumProvider.Instance.getSwapToUsdRate(token);
    //   tokenRates.push({ token, rate });
    // });

    const groupBy = function (
      xs: (
        | TradeEvent
        | LiquidationEvent
        | CloseWithSwapEvent
        | DepositCollateralEvent
        | WithdrawCollateralEvent
        | RolloverEvent
      )[],
      key: any
    ) {
      return xs.reduce(function (rv: any, x: any) {
        ; (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    }

    // TODO: remove ts-ignore
    // @ts-ignore
    const events = tradeEvents
      // @ts-ignore
      .concat(rolloverEvents)
      // @ts-ignore
      .concat(closeWithSwapEvents)
      // @ts-ignore
      .concat(liquidationEvents)
      // @ts-ignore
      .concat(depositCollateralEvents)
      // @ts-ignore
      .concat(withdrawCollateralEvents)
    // @ts-ignore
    const groupedEvents = groupBy(
      events.sort(
        (
          a:
            | TradeEvent
            | LiquidationEvent
            | CloseWithSwapEvent
            | DepositCollateralEvent
            | WithdrawCollateralEvent
            | RolloverEvent,
          b:
            | TradeEvent
            | LiquidationEvent
            | CloseWithSwapEvent
            | DepositCollateralEvent
            | WithdrawCollateralEvent
            | RolloverEvent
        ) => b.blockNumber.minus(a.blockNumber).toNumber()
      ),
      'loanId'
    )

    for (const loanId of Object.keys(groupedEvents)) {
      const eventsById = groupedEvents[loanId]
      const isContainTradeEvent = eventsById.some((e: any) => e instanceof TradeEvent)
      if (!isContainTradeEvent) {
        delete groupedEvents[loanId]
      }
    }
    const historyEvents = { groupedEvents, earnRewardEvents, payTradingFeeEvents }
      ; (await this._isMounted) &&
        this.setState({
          ...this.state,
          historyRowsData: [],
          historyEvents: historyEvents,
        })
  }

  public getTokenRowsData = async () => {
    const tokenRowsData: ITradeTokenGridRowProps[] = []
    tokenRowsData.push({
      baseToken: this.state.selectedMarket.baseToken,
      quoteToken: this.state.selectedMarket.quoteToken,
      positionType: PositionType.LONG,
      defaultLeverage: this.defaultLeverageLong,
      onTrade: this.onTradeRequested,
      changeLoadingTransaction: this.changeLoadingTransaction,
      onTransactionsCompleted: this.onTransactionsCompleted,
      isTxCompleted: this.state.isTxCompleted,
      changeGridPositionType: this.changeGridPositionType,
      isMobileMedia: this.props.isMobileMedia,
      maintenanceMargin: await FulcrumProvider.Instance.getMaintenanceMargin(
        this.state.selectedMarket.baseToken,
        this.state.selectedMarket.quoteToken
      ),
    })
    tokenRowsData.push({
      baseToken: this.state.selectedMarket.baseToken,
      quoteToken: this.state.selectedMarket.quoteToken,
      positionType: PositionType.SHORT,
      defaultLeverage: this.defaultLeverageShort,
      onTrade: this.onTradeRequested,
      changeLoadingTransaction: this.changeLoadingTransaction,
      onTransactionsCompleted: this.onTransactionsCompleted,
      isTxCompleted: this.state.isTxCompleted,
      changeGridPositionType: this.changeGridPositionType,
      isMobileMedia: this.props.isMobileMedia,
      maintenanceMargin: await FulcrumProvider.Instance.getMaintenanceMargin(
        this.state.selectedMarket.quoteToken,
        this.state.selectedMarket.baseToken
      ),
    })
      ; (await this._isMounted) && this.setState({ ...this.state, tokenRowsData: tokenRowsData })
  }

  public updateHistoryRowsData = async (historyRowsData: IHistoryTokenGridRowProps[]) => {
    ; (await this._isMounted) && this.setState({ ...this.state, historyRowsData: historyRowsData })
  }

  public changeLoadingTransaction = async (
    isLoadingTransaction: boolean,
    request: TradeRequest | ManageCollateralRequest | RolloverRequest | RolloverRequest | undefined
  ) => {
    ; (await this._isMounted) &&
      this.setState({
        ...this.state,
        isLoadingTransaction,
        request,
      })
  }

  private onTransactionsCompleted = async () => {
    ; (await this._isMounted) &&
      this.setState({
        ...this.state,
        isTxCompleted: !this.state.isTxCompleted,
      })
  }

  private changeGridPositionType = async (positionType: PositionType) => {
    ; (await this._isMounted) && this.setState({ ...this.state, activePositionType: positionType })
  }
}
