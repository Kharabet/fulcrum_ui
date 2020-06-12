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
  tradeAsset: Asset;
  unitOfAccount: Asset;
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
  tradeRequestId: number;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined,
  resultTx: boolean,
  isTxCompleted: boolean
}

export default class TradePage extends PureComponent<ITradePageProps, ITradePageState> {
  constructor(props: any) {
    super(props);
    if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      this.tradeAssets = [
        Asset.ETH
      ];
      this.stablecoinAssets = [
        Asset.DAI,
        Asset.SAI,
      ]
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      // this.tradeAssets = [
      // ];
    } else {
      this.tradeAssets = [
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
      this.stablecoinAssets = [
        Asset.DAI,
        Asset.SAI,
        Asset.USDC,
        Asset.SUSD,
        Asset.USDT
      ]
    }
    this.state = {
      selectedMarket: {
        tradeAsset: this.tradeAssets[0],
        unitOfAccount: this.stablecoinAssets[0],
      },
      loans: undefined,
      showMyTokensOnly: false,
      isTradeModalOpen: false,
      tradeType: TradeType.BUY,
      // defaultUnitOfAccount: process.env.REACT_APP_ETH_NETWORK === "kovan" ? Asset.SAI : Asset.DAI,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 0,
      isManageCollateralModalOpen: false,
      openedPositionsCount: 0,
      tokenRowsData: [],
      ownRowsData: [],
      tradeRequestId: 0,
      isLoadingTransaction: false,
      resultTx: true,
      isTxCompleted: false,
      request: undefined
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);

  }
  private readonly defaultLeverageLong: number = 2;
  private readonly defaultLeverageShort: number = 1;
  private readonly tradeAssets: Asset[] = [];
  private readonly stablecoinAssets: Asset[] = [];

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
    if (prevState.selectedMarket !== this.state.selectedMarket || prevState.isTxCompleted !== this.state.isTxCompleted) {
      this.derivedUpdate();
    }
  }


  private async derivedUpdate() {
    const tokenRowsData = this.getTokenRowsData(this.state);
    const ownRowsData = await this.getOwnRowsData(this.state);
    await this.setState({ ...this.state, ownRowsData: ownRowsData, tokenRowsData: tokenRowsData });
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
            tradeAssets={this.tradeAssets}
            stablecoinAssets={this.stablecoinAssets}
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
            />
          ) : (
              <React.Fragment>
                <div className="chart-wrapper">
                  <TVChartContainer symbol={this.state.selectedMarket.tradeAsset} preset={this.props.isMobileMedia ? "mobile" : undefined} />
                </div>
                <TradeTokenGrid
                  isMobileMedia={this.props.isMobileMedia}
                  tokenRowsData={this.state.tokenRowsData.filter(e => e.asset === this.state.selectedMarket.tradeAsset)}
                  ownRowsData={this.state.ownRowsData.filter(e => e.tradeAsset === this.state.selectedMarket.tradeAsset && e.collateralAsset === this.state.selectedMarket.unitOfAccount)}
                  //changeLoadingTransaction={this.changeLoadingTransaction}
                  request={this.state.request}
                  isLoadingTransaction={this.state.isLoadingTransaction}
                  resultTx={this.state.resultTx}
                  isTxCompleted={this.state.isTxCompleted}
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
              stablecoins={this.stablecoinAssets}
              loan={this.state.loans?.find(e => e.loanId === this.state.loanId)}
              isMobileMedia={this.props.isMobileMedia}
              tradeType={this.state.tradeType}
              tradeAsset={this.state.selectedMarket.tradeAsset}
              positionType={this.state.tradePositionType}
              leverage={this.state.tradeLeverage}
              quoteAsset={this.state.selectedMarket.unitOfAccount}
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

            />
          </Modal>
        </main>
      </div>
    );
  }

  public onTabSelect = async (tradeAsset: Asset, unitOfAccount: Asset) => {
    const marketPair = {
      tradeAsset,
      unitOfAccount
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
      this.setState({
        ...this.state,
        isManageCollateralModalOpen: true,
        // collateralToken: request.collateralAsset,
        loanId: request.loanId,
        // tradeAsset: request.asset,
        tradeRequestId: request.id
      });
    }
  };

  public onManageCollateralConfirmed = (request: ManageCollateralRequest) => {
    request.id = this.state.tradeRequestId;
    FulcrumProvider.Instance.onManageCollateralConfirmed(request);
    this.setState({
      ...this.state,
      // collateralToken: request.collateralAsset,
      loanId: request.loanId,
      // tradeAsset: request.asset,
      tradeRequestId: request.id,
      isManageCollateralModalOpen: false
    });
  };

  // public onManageCollateralRequestOpen = (request: ManageCollateralRequest) => {
  //   this.setState({
  //     ...this.state,
  //     collateralToken: request.collateralAsset,
  //     loanId: request.loanId,
  //     tradeAsset: request.asset,
  //     tradeRequestId: request.id,
  //     tradePositionType: request.positionType,
  //     tradeLeverage: request.leverage,
  //     isManageCollateralModalOpen: true
  //   });
  // };

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

    /*let unit = request.unitOfAccount;
    if (request.asset === Asset.ETH && request.positionType === PositionType.LONG && request.leverage === 2) {
      unit = Asset.DAI;
    }*/

    if (request) {
      this.setState({
        ...this.state,
        isTradeModalOpen: true,
        // collateralToken: request.collateral,
        tradeType: request.tradeType,
        // tradeAsset: request.asset,
        // tradeUnitOfAccount: request.collateral,
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
       

        const positionType = this.tradeAssets.includes(loan.collateralAsset)
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
          tradeAsset: baseAsset,
          collateralAsset: quoteAsset,
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

  public getTokenRowsData = (state: ITradePageState): ITradeTokenGridRowProps[] => {
    const tokenRowsData: ITradeTokenGridRowProps[] = [];
    tokenRowsData.push({
      asset: state.selectedMarket.tradeAsset,
      unitOfAccount: state.selectedMarket.unitOfAccount,
      positionType: PositionType.LONG,
      defaultLeverage: this.defaultLeverageLong,
      onTrade: this.onTradeRequested,
      changeLoadingTransaction: this.changeLoadingTransaction,
      isTxCompleted: this.state.isTxCompleted
    });
    tokenRowsData.push({
      asset: state.selectedMarket.tradeAsset,
      unitOfAccount: state.selectedMarket.unitOfAccount,
      positionType: PositionType.SHORT,
      defaultLeverage: this.defaultLeverageShort,
      onTrade: this.onTradeRequested,
      changeLoadingTransaction: this.changeLoadingTransaction,
      isTxCompleted: this.state.isTxCompleted
    });
    return tokenRowsData;
  };

  public changeLoadingTransaction = (isLoadingTransaction: boolean, request: TradeRequest | undefined, isTxCompleted: boolean, resultTx: boolean) => {
    this.setState({ ...this.state, isLoadingTransaction: isLoadingTransaction, request: request, isTxCompleted: isTxCompleted, resultTx: resultTx })
  }
}
