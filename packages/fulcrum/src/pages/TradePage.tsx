import React, { PureComponent } from "react";
import Modal from "react-modal";

import { Asset } from "../domain/Asset";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

import { InfoBlock } from "../components/InfoBlock";
import { TradeTokenGrid } from "../components/TradeTokenGrid";
import { TVChartContainer } from '../components/TVChartContainer';
import { TokenGridTabs } from "../components/TokenGridTabs";

import { ITradeTokenGridRowProps } from "../components/TradeTokenGridRow";
import { IOwnTokenGridRowProps } from "../components/OwnTokenGridRow";

import "../styles/pages/_trade-page.scss";
import { BigNumber } from "@0x/utils";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";

import { IHistoryEvents } from "../domain/IHistoryEvents";
import { TradeEvent } from "../domain/TradeEvent";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";

import  ManageTokenGrid  from '../components/ManageTokenGrid';
// const ManageTokenGrid = React.lazy(() => import('../components/ManageTokenGrid'));
const TradeForm = React.lazy(() => import('../components/TradeForm'));
const ManageCollateralForm = React.lazy(() => import('../components/ManageCollateralForm'));

export interface ITradePageProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

export interface IMarketPair {
  baseToken: Asset;
  quoteToken: Asset;
}

interface ITradePageState {
  selectedMarket: IMarketPair;
  showMyTokensOnly: boolean;
  isTradeModalOpen: boolean;
  tradeType: TradeType;
  tradePositionType: PositionType;
  tradeLeverage: number;
  loanId?: string;
  loans: IBorrowedFundsState[] | undefined;

  isManageCollateralModalOpen: boolean;

  openedPositionsCount: number;
  tokenRowsData: ITradeTokenGridRowProps[];
  ownRowsData: IOwnTokenGridRowProps[];
  historyEvents: IHistoryEvents | undefined;
  tradeRequestId: number;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined,
  resultTx: boolean,
  isTxCompleted: boolean,
  activePositionType: PositionType
}

export default class TradePage extends PureComponent<ITradePageProps, ITradePageState> {
  private _isMounted: boolean = false;
  constructor(props: any) {
    super(props);
    if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      this.baseTokens = [
        Asset.ETH,
        Asset.KNC
      ];
      this.quoteTokens = [
        Asset.DAI,
        Asset.KNC
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      // this.baseTokens = [
      // ];
    } else {
      this.baseTokens = [
        Asset.ETH,
        // Asset.DAI,
        // Asset.USDC,
        // Asset.SUSD,
        Asset.WBTC,
        Asset.LINK,
        // Asset.MKR,
        Asset.ZRX,
        // Asset.BAT,
        // Asset.REP,
        Asset.KNC
      ];
      this.quoteTokens = [
        Asset.DAI,
        Asset.SAI,
        Asset.USDC,
        Asset.SUSD,
        Asset.USDT
      ]
    }
    this.stablecoins = [
      Asset.DAI,
      Asset.SAI,
      Asset.USDC,
      Asset.SUSD,
      Asset.USDT
    ]

    this.state = {
      selectedMarket: {
        baseToken: this.baseTokens[0],
        quoteToken: this.quoteTokens[0],
      },
      loans: undefined,
      showMyTokensOnly: false,
      isTradeModalOpen: false,
      tradeType: TradeType.BUY,
      // defaultquoteToken: process.env.REACT_APP_ETH_NETWORK === "kovan" ? Asset.SAI : Asset.DAI,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 0,
      isManageCollateralModalOpen: false,
      openedPositionsCount: 0,
      tokenRowsData: [],
      ownRowsData: [],
      historyEvents: undefined,
      tradeRequestId: 0,
      isLoadingTransaction: false,
      resultTx: true,
      isTxCompleted: false,
      request: undefined,
      activePositionType: PositionType.LONG
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);

  }
  private readonly defaultLeverageLong: number = 2;
  private readonly defaultLeverageShort: number = 1;
  private readonly baseTokens: Asset[] = [];
  private readonly quoteTokens: Asset[] = [];
  private readonly stablecoins: Asset[] = [];

  public componentWillUnmount(): void {
    this._isMounted = false;
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public async componentDidMount() {
    this._isMounted = true;
    const tokenRowsData = this.getTokenRowsData(this.state);
    this._isMounted && this.setState({ ...this.state, tokenRowsData: tokenRowsData });

    const provider = FulcrumProvider.getLocalstorageItem('providerType');
    if (!FulcrumProvider.Instance.web3Wrapper && (!provider || provider === "None")) {
      this.props.doNetworkConnect();
    }
    this.derivedUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<ITradePageProps>, prevState: Readonly<ITradePageState>, snapshot?: any): void {
    if (prevState.selectedMarket !== this.state.selectedMarket ||
      prevState.isTxCompleted !== this.state.isTxCompleted ||
      prevProps.isMobileMedia !== this.props.isMobileMedia ||
      prevState.showMyTokensOnly !== this.state.showMyTokensOnly) {
      this.derivedUpdate();
    }
  }


  private async derivedUpdate() {
    const tokenRowsData = this.getTokenRowsData(this.state);
    await this._isMounted && this.setState({ ...this.state, tokenRowsData });

    const ownRowsData = await this.getOwnRowsData(this.state);
    let historyEvents = undefined;
    if (this.state.showMyTokensOnly) {
      historyEvents = await this.getHistoryEvents(this.state);
    }
    await this._isMounted && this.setState({ ...this.state, ownRowsData, historyEvents });
  }

  public render() {
    return (
      <div className="trade-page">
        <main>
          <InfoBlock localstorageItemProp="defi-risk-notice" onAccept={() => { this.forceUpdate() }}>
            For your safety, please ensure the URL in your browser starts with: https://app.fulcrum.trade/. <br />
            Fulcrum is a non-custodial platform for tokenized lending and margin trading. <br />
            "Non-custodial" means YOU are responsible for the security of your digital assets. <br />
            To learn more about how to stay safe when using Fulcrum and other bZx products, please read our <button className="disclosure-link" onClick={this.props.isRiskDisclosureModalOpen}>DeFi Risk Disclosure</button>.
          </InfoBlock>
          {localStorage.getItem("defi-risk-notice") ?
            <InfoBlock localstorageItemProp="trade-page-info">
              Currently only our lending, unlending, and closing of position functions are enabled. <br />
              Full functionality will return after a thorough audit of our newly implemented and preexisting smart contracts.
          </InfoBlock>
            : null}
          <TokenGridTabs
            baseTokens={this.baseTokens}
            quoteTokens={this.quoteTokens}
            selectedMarket={this.state.selectedMarket}
            onShowMyTokensOnlyChange={this.onShowMyTokensOnlyChange}
            onMarketSelect={this.onTabSelect}
            isMobile={this.props.isMobileMedia}
            isShowMyTokensOnly={this.state.showMyTokensOnly}
            openedPositionsCount={this.state.openedPositionsCount}
          />
          {/* <ManageButton 
            openedPositionsCount={this.state.openedPositionsCount}
            onShowMyTokensOnlyChange={this.onShowMyTokensOnlyChange}
            /> */}

          {this.state.showMyTokensOnly ? (
            <ManageTokenGrid
              isMobileMedia={this.props.isMobileMedia}
              ownRowsData={this.state.ownRowsData}
              historyEvents={this.state.historyEvents}
              stablecoins={this.stablecoins}
              baseTokens={this.baseTokens}
              quoteTokens={this.quoteTokens}
            />
          ) : (
              <React.Fragment>
                <div className="chart-wrapper">
                  <TVChartContainer symbol={`${this.state.selectedMarket.baseToken}_${this.state.selectedMarket.quoteToken}`} preset={this.props.isMobileMedia ? "mobile" : undefined} />
                </div>
                <TradeTokenGrid
                  isMobileMedia={this.props.isMobileMedia}
                  tokenRowsData={this.state.tokenRowsData.filter(e => e.baseToken === this.state.selectedMarket.baseToken)}
                  ownRowsData={this.state.ownRowsData.filter(e => (e.baseToken === this.state.selectedMarket.baseToken && e.quoteToken === this.state.selectedMarket.quoteToken))}
                  changeLoadingTransaction={this.changeLoadingTransaction}
                  request={this.state.request}
                  isLoadingTransaction={this.state.isLoadingTransaction}
                  resultTx={this.state.resultTx}
                  isTxCompleted={this.state.isTxCompleted}
                  changeGridPositionType={this.changeGridPositionType}
                  activePositionType={this.state.activePositionType}
                />
              </React.Fragment>
            )}
          <Modal
            isOpen={this.state.isTradeModalOpen}
            onRequestClose={this.onTradeRequestClose}
            className="modal-content-div modal-content-div-form"
            overlayClassName="modal-overlay-div"
          >
            <TradeForm
              stablecoins={this.quoteTokens}
              loan={this.state.loans?.find(e => e.loanId === this.state.loanId)}
              isMobileMedia={this.props.isMobileMedia}
              tradeType={this.state.tradeType}
              baseToken={this.state.selectedMarket.baseToken}
              positionType={this.state.tradePositionType}
              leverage={this.state.tradeLeverage}
              quoteAsset={this.state.selectedMarket.quoteToken}
              onSubmit={this.onTradeConfirmed}
              onCancel={this.onTradeRequestClose}
            />
          </Modal>
          <Modal
            isOpen={this.state.isManageCollateralModalOpen}
            onRequestClose={this.onManageCollateralRequestClose}
            className="modal-content-div"
            overlayClassName="modal-overlay-div"
          >
            <ManageCollateralForm
              loan={this.state.loans?.find(e => e.loanId === this.state.loanId)}
              onSubmit={this.onManageCollateralConfirmed}
              onCancel={this.onManageCollateralRequestClose}
              isOpenModal={this.state.isManageCollateralModalOpen}
              isMobileMedia={this.props.isMobileMedia}
              changeLoadingTransaction={this.changeLoadingTransaction}
            />
          </Modal>
        </main>
      </div>
    );
  }

  public onTabSelect = async (baseToken: Asset, quoteToken: Asset) => {
    const marketPair = {
      baseToken,
      quoteToken
    }
    await this._isMounted && this.setState({ ...this.state, selectedMarket: marketPair });
  };

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public onManageCollateralRequested = (request: ManageCollateralRequest) => {
    if (!FulcrumProvider.Instance.contractsSource || !FulcrumProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      return;
    }

    if (request) {
      this.onTabSelect(request.asset, request.collateralAsset);
      this._isMounted && this.setState({
        ...this.state,
        isManageCollateralModalOpen: true,
        loanId: request.loanId,
        tradeRequestId: request.id
      });
    }
  };

  public onManageCollateralConfirmed = (request: ManageCollateralRequest) => {
    FulcrumProvider.Instance.onManageCollateralConfirmed(request);
    this._isMounted && this.setState({
      ...this.state,
      loanId: request.loanId,
      isManageCollateralModalOpen: false
    });
  };


  public onManageCollateralRequestClose = () => {
    this._isMounted && this.setState({
      ...this.state,
      isManageCollateralModalOpen: false
    });
  };

  public onTradeRequested = async (request: TradeRequest) => {
    if (!FulcrumProvider.Instance.contractsSource || !FulcrumProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      return;
    }

    if (request) {

      await this.onTabSelect(request.asset, request.quoteToken);
      await this._isMounted && this.setState({
        ...this.state,
        isTradeModalOpen: true,
        tradeType: request.tradeType,
        tradePositionType: request.positionType,
        tradeLeverage: request.leverage,
        loanId: request.loanId,
        tradeRequestId: request.id
      });
    }
  };

  public onTradeConfirmed = (request: TradeRequest) => {
    request.id = this.state.tradeRequestId;
    FulcrumProvider.Instance.onTradeConfirmed(request);
    this._isMounted && this.setState({
      ...this.state,
      isTradeModalOpen: false
    });
  };

  public onTradeRequestClose = () => {
    this._isMounted && this.setState({
      ...this.state,
      isTradeModalOpen: false
    });
  };

  public onShowMyTokensOnlyChange = async (value: boolean) => {
    await this._isMounted && this.setState({
      ...this.state,
      showMyTokensOnly: value
    });
  };

  public getOwnRowsData = async (state: ITradePageState): Promise<IOwnTokenGridRowProps[]> => {
    const ownRowsData: IOwnTokenGridRowProps[] = [];
    if (FulcrumProvider.Instance.web3Wrapper && FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite) {
      const loans = await FulcrumProvider.Instance.getUserMarginTradeLoans();
      this._isMounted && this.setState({ ...this.state, loans })
      for (const loan of loans) {

        const isLoanTokenOnlyInQuoteTokens = !this.baseTokens.includes(loan.loanAsset) && this.quoteTokens.includes(loan.loanAsset)
        const isCollateralTokenNotInQuoteTokens = this.baseTokens.includes(loan.collateralAsset) && !this.quoteTokens.includes(loan.collateralAsset)
        const positionType = isCollateralTokenNotInQuoteTokens || isLoanTokenOnlyInQuoteTokens
          ? PositionType.LONG
          : PositionType.SHORT;

        const baseAsset = positionType === PositionType.LONG
          ? loan.collateralAsset
          : loan.loanAsset;

        const quoteAsset = positionType === PositionType.LONG
          ? loan.loanAsset
          : loan.collateralAsset;

        let leverage = new BigNumber(10 ** 38).div(loan.loanData!.startMargin.times(10 ** 18));
        if (positionType === PositionType.LONG)
          leverage = leverage.plus(1);


        const currentCollateralToPrincipalRate = await FulcrumProvider.Instance.getSwapRate(loan.collateralAsset, loan.loanAsset);
        let positionValue = new BigNumber(0);
        let value = new BigNumber(0);
        let collateral = new BigNumber(0);
        let openPrice = new BigNumber(0);
        let startingValue = new BigNumber(0);
        let currentValue = new BigNumber(0);
        //liquidation_collateralToLoanRate = ((15000000000000000000 * principal / 10^20) + principal) / collateral * 10^18
        //If SHORT -> 10^36 / liquidation_collateralToLoanRate
        const liquidation_collateralToLoanRate = (new BigNumber("15000000000000000000").times(loan.loanData!.principal).div(10 ** 20)).plus(loan.loanData!.principal).div(loan.loanData!.collateral).times(10 ** 18);
        let liquidationPrice = new BigNumber(0);
        let profit = new BigNumber(0);
        if (positionType === PositionType.LONG) {
          positionValue = loan.loanData!.collateral.div(10 ** 18);
          value = loan.loanData!.collateral.div(10 ** 18).times(currentCollateralToPrincipalRate);
          collateral = ((loan.loanData!.collateral.times(currentCollateralToPrincipalRate).div(10 ** 18)).minus(loan.loanData!.principal.div(10 ** 18)));
          openPrice = loan.loanData!.startRate.div(10 ** 18);
          liquidationPrice = liquidation_collateralToLoanRate.div(10 ** 18);
          startingValue = ((loan.loanData!.collateral.times(openPrice.times(10 ** 18)).div(10 ** 18)).minus(loan.loanData!.principal)).div(10 ** 18);
          currentValue = ((loan.loanData!.collateral.times(currentCollateralToPrincipalRate.times(10 ** 18)).div(10 ** 18)).minus(loan.loanData!.principal)).div(10 ** 18);
          profit = currentValue.minus(startingValue);

          //in case of exotic pairs like ETH-KNC all values should be denominated in USD
          if (!this.stablecoins.includes(loan.loanAsset)) {
            const tradeEvents = await FulcrumProvider.Instance.getTradeHistory();
            const openTimeStamp = tradeEvents.find((e: TradeEvent) => e.loanId === loan.loanId)!.timeStamp;
            const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${loan.loanAsset.toLowerCase()}&date=${openTimeStamp.getTime()}`);
            const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
            const loanAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
            openPrice = openPrice.times(loanAssetUSDStartRate)
            const collateralToUSDCurrentRate = await FulcrumProvider.Instance.getSwapToUsdRate(loan.loanAsset);
            startingValue = startingValue.times(collateralToUSDCurrentRate);
            currentValue = currentValue.times(collateralToUSDCurrentRate);
            profit = profit.times(collateralToUSDCurrentRate);
            value = value.times(collateralToUSDCurrentRate);
            collateral = collateral.times(collateralToUSDCurrentRate);
            liquidationPrice = liquidationPrice.times(collateralToUSDCurrentRate);
          }
        }
        else {
          positionValue = loan.loanData!.principal.div(10 ** 18);
          value = loan.loanData!.collateral.div(10 ** 18);
          collateral = ((loan.loanData!.collateral.div(10 ** 18)).minus(loan.loanData!.principal.div(currentCollateralToPrincipalRate).div(10 ** 18)));
          openPrice = new BigNumber(10 ** 36).div(loan.loanData!.startRate).div(10 ** 18);
          liquidationPrice = new BigNumber(10 ** 36).div(liquidation_collateralToLoanRate).div(10 ** 18);
          startingValue = (loan.loanData!.collateral.minus(loan.loanData!.principal.div(loan.loanData!.startRate).times(10 ** 18))).div(10 ** 18);
          currentValue = (loan.loanData!.collateral.minus(loan.loanData!.principal.div(currentCollateralToPrincipalRate.times(10 ** 18)).times(10 ** 18))).div(10 ** 18);
          profit = startingValue.minus(currentValue);

          //in case of exotic pairs like ETH-KNC all values should be denominated in USD
          if (!this.stablecoins.includes(loan.collateralAsset)) {
            const tradeEvents = await FulcrumProvider.Instance.getTradeHistory();
            const openTimeStamp = tradeEvents.find((e: TradeEvent) => e.loanId === loan.loanId)!.timeStamp;
            const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${loan.collateralAsset.toLowerCase()}&date=${openTimeStamp.getTime()}`);
            const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
            const loanAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
            openPrice = openPrice.times(loanAssetUSDStartRate)
            const collateralToUSDCurrentRate = await FulcrumProvider.Instance.getSwapToUsdRate(loan.collateralAsset);
            startingValue = startingValue.times(collateralToUSDCurrentRate);
            currentValue = currentValue.times(collateralToUSDCurrentRate);
            profit = profit.times(collateralToUSDCurrentRate);
            value = value.times(collateralToUSDCurrentRate);
            collateral = collateral.times(collateralToUSDCurrentRate);
            liquidationPrice = liquidationPrice.times(collateralToUSDCurrentRate);
          }
        }

        ownRowsData.push({
          loan: loan,
          baseToken: baseAsset,
          quoteToken: quoteAsset,
          leverage: leverage.toNumber(),
          positionType,
          positionValue,
          value,
          collateral,
          openPrice,
          liquidationPrice,
          profit,
          onTrade: this.onTradeRequested,
          onManageCollateralOpen: this.onManageCollateralRequested,
          changeLoadingTransaction: this.changeLoadingTransaction,
          isTxCompleted: this.state.isTxCompleted
        });
      }
    }
    this._isMounted && this.setState({ ...this.state, openedPositionsCount: ownRowsData.length });
    return ownRowsData;
  };

  public getHistoryEvents = async (state: ITradePageState): Promise<IHistoryEvents> => {
    const tradeEvents = await FulcrumProvider.Instance.getTradeHistory();
    const closeWithSwapEvents = await FulcrumProvider.Instance.getCloseWithSwapHistory();
    const liquidationEvents = await FulcrumProvider.Instance.getLiquidationHistory();
    const earnRewardEvents = await FulcrumProvider.Instance.getEarnRewardHistory();
    const payTradingFeeEvents = await FulcrumProvider.Instance.getPayTradingFeeHistory();
    // const tokens = Array.from(new Set(this.baseTokens.concat(this.quoteTokens)));

    // tokens.forEach(async (token) => {
    //   let rate = await FulcrumProvider.Instance.getSwapToUsdRate(token);
    //   tokenRates.push({ token, rate });
    // });

    const groupBy = function (xs: (TradeEvent | LiquidationEvent | CloseWithSwapEvent)[], key: any) {
      return xs.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };

    //@ts-ignore
    const events = tradeEvents.concat(closeWithSwapEvents).concat(liquidationEvents);
    //@ts-ignore
    const groupedEvents = groupBy(events.sort((a, b) => b.timeStamp.getTime() - a.timeStamp.getTime()), "loanId");

    return { groupedEvents, earnRewardEvents, payTradingFeeEvents };
  }

  public getTokenRowsData = (state: ITradePageState): ITradeTokenGridRowProps[] => {
    const tokenRowsData: ITradeTokenGridRowProps[] = [];
    tokenRowsData.push({
      baseToken: state.selectedMarket.baseToken,
      quoteToken: state.selectedMarket.quoteToken,
      positionType: PositionType.LONG,
      defaultLeverage: this.defaultLeverageLong,
      onTrade: this.onTradeRequested,
      changeLoadingTransaction: this.changeLoadingTransaction,
      isTxCompleted: this.state.isTxCompleted,
      changeGridPositionType: this.changeGridPositionType,
      isMobileMedia: this.props.isMobileMedia
    });
    tokenRowsData.push({
      baseToken: state.selectedMarket.baseToken,
      quoteToken: state.selectedMarket.quoteToken,
      positionType: PositionType.SHORT,
      defaultLeverage: this.defaultLeverageShort,
      onTrade: this.onTradeRequested,
      changeLoadingTransaction: this.changeLoadingTransaction,
      isTxCompleted: this.state.isTxCompleted,
      changeGridPositionType: this.changeGridPositionType,
      isMobileMedia: this.props.isMobileMedia
    });
    return tokenRowsData;
  };

  public changeLoadingTransaction = (isLoadingTransaction: boolean, request: TradeRequest | undefined, isTxCompleted: boolean, resultTx: boolean) => {
    this._isMounted && this.setState({ ...this.state, isLoadingTransaction: isLoadingTransaction, request: request, isTxCompleted: isTxCompleted, resultTx: resultTx })
  }

  private changeGridPositionType = async (positionType: PositionType) => {
    await this._isMounted && this.setState({ ...this.state, activePositionType: positionType })
  }
}
