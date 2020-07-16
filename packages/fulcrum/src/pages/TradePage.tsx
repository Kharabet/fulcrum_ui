import React, { PureComponent, Component } from "react";
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
import { IHistoryTokenGridProps } from "../components/HistoryTokenGrid";
import { TradeEvent } from "../domain/TradeEvent";
import { IHistoryTokenGridRowProps } from "../components/HistoryTokenGridRow";
import { PositionEventsGroup } from "../domain/PositionEventsGroup";
import { PositionHistoryData } from "../domain/PositionHistoryData";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";

const ManageTokenGrid = React.lazy(() => import('../components/ManageTokenGrid'));
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
  historyRowsData: IHistoryTokenGridRowProps[];
  tradeRequestId: number;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined,
  resultTx: boolean,
  isTxCompleted: boolean,
  activePositionType: PositionType
}

export default class TradePage extends PureComponent<ITradePageProps, ITradePageState> {
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
      historyRowsData: [],
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

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentWillMount() {

    const tokenRowsData = this.getTokenRowsData(this.state);
    this.setState({ ...this.state, tokenRowsData: tokenRowsData });
  }

  public async componentDidMount() {
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
    await this.setState({ ...this.state, tokenRowsData});

    const ownRowsData = await this.getOwnRowsData(this.state);
    let historyRowsData: IHistoryTokenGridRowProps[] = [];
    if (this.state.showMyTokensOnly)
       historyRowsData = await this.getHistoryRowsData(this.state);
    await this.setState({ ...this.state, ownRowsData: ownRowsData, historyRowsData });
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
              historyRowsData={this.state.historyRowsData}
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
    await this.setState({ ...this.state, selectedMarket: marketPair });
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
      this.setState({
        ...this.state,
        isManageCollateralModalOpen: true,
        loanId: request.loanId,
        tradeRequestId: request.id
      });
    }
  };

  public onManageCollateralConfirmed = (request: ManageCollateralRequest) => {
    FulcrumProvider.Instance.onManageCollateralConfirmed(request);
    this.setState({
      ...this.state,
      loanId: request.loanId,
      isManageCollateralModalOpen: false
    });
  };


  public onManageCollateralRequestClose = () => {
    this.setState({
      ...this.state,
      isManageCollateralModalOpen: false
    });
  };

  public onTradeRequested = (request: TradeRequest) => {
    if (!FulcrumProvider.Instance.contractsSource || !FulcrumProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      return;
    }

    if (request) {

      this.onTabSelect(request.asset, request.quoteToken);
      this.setState({
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
    this.setState({
      ...this.state,
      isTradeModalOpen: false
    });
  };

  public onTradeRequestClose = () => {
    this.setState({
      ...this.state,
      isTradeModalOpen: false
    });
  };

  public onShowMyTokensOnlyChange = async (value: boolean) => {
    await this.setState({
      ...this.state,
      showMyTokensOnly: value
    });
  };

  public getOwnRowsData = async (state: ITradePageState): Promise<IOwnTokenGridRowProps[]> => {
    const ownRowsData: IOwnTokenGridRowProps[] = [];
    if (FulcrumProvider.Instance.web3Wrapper && FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite) {
      const loans = await FulcrumProvider.Instance.getUserMarginTradeLoans();
      this.setState({ ...this.state, loans })
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


        const collateralToPrincipalRate = await FulcrumProvider.Instance.getSwapRate(loan.collateralAsset, loan.loanAsset);
        let positionValue = new BigNumber(0);
        let value = new BigNumber(0);
        let collateral = new BigNumber(0);
        let openPrice = new BigNumber(0);
        //liquidation_collateralToLoanRate = ((15000000000000000000 * principal / 10^20) + principal) / collateral * 10^18
        //If SHORT -> 10^36 / liquidation_collateralToLoanRate
        const liquidation_collateralToLoanRate = (new BigNumber("15000000000000000000").times(loan.loanData!.principal).div(10 ** 20)).plus(loan.loanData!.principal).div(loan.loanData!.collateral).times(10 ** 18);
        let liquidationPrice = new BigNumber(0);
        let profit = new BigNumber(0);
        if (positionType === PositionType.LONG) {
          positionValue = loan.loanData!.collateral.div(10 ** 18);
          value = loan.loanData!.collateral.div(10 ** 18).times(collateralToPrincipalRate);
          collateral = ((loan.loanData!.collateral.times(collateralToPrincipalRate).div(10 ** 18)).minus(loan.loanData!.principal.div(10 ** 18)));
          openPrice = loan.loanData!.startRate.div(10 ** 18);
          liquidationPrice = liquidation_collateralToLoanRate.div(10 ** 18);

          const startingValue = ((loan.loanData!.collateral.times(openPrice.times(10 ** 18)).div(10 ** 18)).minus(loan.loanData!.principal)).div(10 ** 18);
          const currentValue = ((loan.loanData!.collateral.times(collateralToPrincipalRate.times(10 ** 18)).div(10 ** 18)).minus(loan.loanData!.principal)).div(10 ** 18);
          profit = currentValue.minus(startingValue);
        }
        else {
          positionValue = loan.loanData!.principal.div(10 ** 18);
          value = loan.loanData!.collateral.div(10 ** 18);
          collateral = ((loan.loanData!.collateral.div(10 ** 18)).minus(loan.loanData!.principal.div(collateralToPrincipalRate).div(10 ** 18)));
          openPrice = new BigNumber(10 ** 36).div(loan.loanData!.startRate).div(10 ** 18);
          liquidationPrice = new BigNumber(10 ** 36).div(liquidation_collateralToLoanRate).div(10 ** 18);
          const startingValue = (loan.loanData!.collateral.minus(loan.loanData!.principal.div(loan.loanData!.startRate).times(10 ** 18))).div(10 ** 18);
          const currentValue = (loan.loanData!.collateral.minus(loan.loanData!.principal.div(collateralToPrincipalRate.times(10 ** 18)).times(10 ** 18))).div(10 ** 18);
          profit = startingValue.minus(currentValue);
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
    this.setState({ ...this.state, openedPositionsCount: ownRowsData.length });
    return ownRowsData;
  };

  public getHistoryRowsData = async (state: ITradePageState): Promise<IHistoryTokenGridRowProps[]> => {
    const historyRowsData: IHistoryTokenGridRowProps[] = [];
    const tradeEvents = await FulcrumProvider.Instance.getTradeHistory();
    const closeWithSwapEvents = await FulcrumProvider.Instance.getCloseWithSwapHistory();
    const liquidationEvents = await FulcrumProvider.Instance.getLiquidationHistory();
    const earnRewardEvents = await FulcrumProvider.Instance.getEarnRewardHistory();
    const payTradingFeeEvents = await FulcrumProvider.Instance.getPayTradingFeeHistory();
    const groupBy = function (xs: (TradeEvent | LiquidationEvent | CloseWithSwapEvent)[], key: any) {
      return xs.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    //@ts-ignore
    const grouped = groupBy(tradeEvents.concat(closeWithSwapEvents).concat(liquidationEvents), "loanId");
    const loanIds = Object.keys(grouped);
    for (const loanId of loanIds) {
      //@ts-ignore
      const events = grouped[loanId].sort((a, b) => a.date < b.date ? -1 : 1);
      const tradeEvent = events[0] as TradeEvent
      const positionType = this.baseTokens.includes(tradeEvent.baseToken)
        ? PositionType.LONG
        : PositionType.SHORT;



      const baseToken = positionType === PositionType.LONG
        ? tradeEvent.baseToken
        : tradeEvent.quoteToken;

      const quoteAsset = positionType === PositionType.LONG
        ? tradeEvent.quoteToken
        : tradeEvent.baseToken;


      let leverage = new BigNumber(tradeEvent.entryLeverage.div(10 ** 18));

      if (positionType === PositionType.LONG)
        leverage = leverage.plus(1);

      const openPrice = positionType === PositionType.LONG
        ? new BigNumber(10 ** 36).div(tradeEvent.entryPrice).div(10 ** 18)
        : tradeEvent.entryPrice.div(10 ** 18);

      const positionEventsGroup = new PositionEventsGroup(
        loanId,
        baseToken,
        quoteAsset,
        positionType,
        leverage.toNumber()
      )
      for (const event of events) {

        let positionValue = new BigNumber(0);
        let tradePrice = new BigNumber(0);
        let value = new BigNumber(0);
        let profit: BigNumber | string = "-";
        const timeStamp = event.timeStamp;
        const txHash = event.txHash;
        const payTradingFeeEvent = payTradingFeeEvents.find(e => e.timeStamp.getTime() === timeStamp.getTime());
        let feeAssetUsdRate = new BigNumber(1)
        if (payTradingFeeEvent) {
          feeAssetUsdRate = await FulcrumProvider.Instance.getSwapToUsdRate(payTradingFeeEvent.token);
          payTradingFeeEvent.amount = payTradingFeeEvent.amount.times(feeAssetUsdRate);
        }
        const earnRewardEvent = earnRewardEvents.find(e => e.timeStamp.getTime() === timeStamp.getTime());
        if (event instanceof TradeEvent) {
          const action = "Opened";
          if (positionType === PositionType.LONG) {
            positionValue = event.positionSize.div(10 ** 18);
            value = event.positionSize.div(event.entryPrice);
            tradePrice = new BigNumber(10 ** 36).div(event.entryPrice).div(10 ** 18);

          }
          else {
            positionValue = event.positionSize.div(event.entryPrice);
            value = event.positionSize.div(10 ** 18);
            tradePrice = event.entryPrice.div(10 ** 18);
          }


          positionEventsGroup.events.push(new PositionHistoryData(
            loanId,
            timeStamp,
            action,
            positionValue,
            tradePrice,
            value,
            profit,
            txHash,
            payTradingFeeEvent,
            earnRewardEvent
          ))

        }
        else if (event instanceof CloseWithSwapEvent) {
          const action = "Closed";
          if (positionType === PositionType.LONG) {
            positionValue = event.positionCloseSize.div(10 ** 18);
            value = event.positionCloseSize.div(event.exitPrice);
            tradePrice = new BigNumber(10 ** 36).div(event.exitPrice).div(10 ** 18);
            profit = (tradePrice.minus(openPrice)).times(positionValue);

          }
          else {
            positionValue = event.positionCloseSize.div(event.exitPrice);
            value = event.positionCloseSize.div(10 ** 18);
            tradePrice = event.exitPrice.div(10 ** 18);
            profit = (openPrice.minus(tradePrice)).times(positionValue);

          }

          positionEventsGroup.events.push(new PositionHistoryData(
            loanId,
            timeStamp,
            action,
            positionValue,
            tradePrice,
            value,
            profit,
            txHash,
            payTradingFeeEvent,
            earnRewardEvent
          ))

        } else if (event instanceof LiquidationEvent) {
          const action = "Liquidated";
          if (positionType === PositionType.LONG) {
            positionValue = event.collateralWithdrawAmount.div(10 ** 18);
            tradePrice = event.collateralToLoanRate.div(10 ** 18);
            value = positionValue.times(tradePrice);
            profit = (tradePrice.minus(openPrice)).times(positionValue);
          }
          else {
            positionValue = event.repayAmount.div(10 ** 18);
            tradePrice = new BigNumber(10 ** 36).div(event.collateralToLoanRate).div(10 ** 18);
            value = positionValue.times(tradePrice);
            profit = (openPrice.minus(tradePrice)).times(positionValue);
          }

          positionEventsGroup.events.push(new PositionHistoryData(
            loanId,
            timeStamp,
            action,
            positionValue,
            tradePrice,
            value,
            profit,
            txHash,
            payTradingFeeEvent,
            earnRewardEvent
          ))

        }
      }

      historyRowsData.push({
        eventsGroup: positionEventsGroup
      });

    }
    // for (const tradeEvent of tradeEvents) {


    // const positionType = this.baseTokens.includes(tradeEvent.baseToken)
    //   ? PositionType.LONG
    //   : PositionType.SHORT;

    // const baseToken = positionType === PositionType.LONG
    //   ? tradeEvent.baseToken
    //   : tradeEvent.quoteToken;

    // const quoteAsset = positionType === PositionType.LONG
    //   ? tradeEvent.quoteToken
    //   : tradeEvent.baseToken;

    // let leverage = new BigNumber(tradeEvent.entryLeverage.div(10 ** 18));
    // if (positionType === PositionType.LONG)
    //   leverage = leverage.plus(1);


    // // const collateralToPrincipalRate = await FulcrumProvider.Instance.getSwapRate(loan.collateralAsset, loan.loanAsset);
    // let positionValue = tradeEvent.positionSize;
    // let collateral = new BigNumber(0);
    // let openPrice = tradeEvent.entryPrice;
    // let value = positionValue.times(openPrice);
    // let result = tradeEvent instanceof TradeEvent
    //   ? "Opened"
    //   : "Unknown";

    // let profit = new BigNumber(0);
    // if (positionType === PositionType.LONG) {
    //   positionValue = tradeEvent.positionSize.div(10 ** 18);
    //   value = tradeEvent.positionSize.div(tradeEvent.entryPrice);
    //   openPrice = new BigNumber(10 ** 36).div(tradeEvent.entryPrice).div(10 ** 18);
    // }
    // else {
    //   positionValue = tradeEvent.positionSize.div(tradeEvent.entryPrice);
    //   value = tradeEvent.positionSize.div(10 ** 18);
    //   openPrice = tradeEvent.entryPrice.div(10 ** 18);
    // }

    // }
    this.setState({ ...this.state, historyRowsData })
    return historyRowsData;
  };

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
    this.setState({ ...this.state, isLoadingTransaction: isLoadingTransaction, request: request, isTxCompleted: isTxCompleted, resultTx: resultTx })
  }

  private changeGridPositionType = async (positionType: PositionType) => {
    await this.setState({ ...this.state, activePositionType: positionType })
  }
}
