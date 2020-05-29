import React, { PureComponent, Component } from "react";
import Modal from "react-modal";

import { Asset } from "../domain/Asset";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
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

const ManageTokenGrid = React.lazy(() => import('../components/ManageTokenGrid'));
const TokenAddressForm = React.lazy(() => import('../components/TokenAddressForm'));
const TradeForm = React.lazy(() => import('../components/TradeForm'));
const ManageCollateralForm = React.lazy(() => import('../components/ManageCollateralForm'));

export interface ITradePageProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

interface ITradePageState {
  assets: Asset[];
  showMyTokensOnly: boolean;
  selectedTabAsset: Asset;
  isTradeModalOpen: boolean;
  tradeType: TradeType;
  tradeAsset: Asset;
  tradeUnitOfAccount: Asset;
  defaultUnitOfAccount: Asset;
  tradePositionType: PositionType;
  tradeLeverage: number;
  tradeVersion: number;
  loanId?: string;

  collateralToken: Asset;

  isTokenAddressFormOpen: boolean;
  tradeTokenKey: TradeTokenKey;

  isManageCollateralModalOpen: boolean;

  defaultTokenizeNeeded: boolean;
  defaultLeverageShort: number;
  defaultLeverageLong: number;
  openedPositionsCount: number;
  tokenRowsData: ITradeTokenGridRowProps[];
  ownRowsData: IOwnTokenGridRowProps[];
  tradeRequestId: number;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined,
  resultTx: boolean
}

export default class TradePage extends PureComponent<ITradePageProps, ITradePageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showMyTokensOnly: false,
      selectedTabAsset: Asset.ETH,
      isTradeModalOpen: false,
      tradeType: TradeType.BUY,
      tradeAsset: Asset.UNKNOWN,
      tradeUnitOfAccount: Asset.UNKNOWN,
      defaultUnitOfAccount: process.env.REACT_APP_ETH_NETWORK === "kovan" ? Asset.SAI : Asset.DAI,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 0,
      tradeVersion: 1,
      collateralToken: Asset.UNKNOWN,
      isTokenAddressFormOpen: false,
      tradeTokenKey: TradeTokenKey.empty(),
      isManageCollateralModalOpen: false,
      assets: this.getAssets(),
      defaultTokenizeNeeded: true,
      defaultLeverageShort: 1,
      defaultLeverageLong: 2,
      openedPositionsCount: 0,
      tokenRowsData: [],
      ownRowsData: [],
      tradeRequestId: 0,
      isLoadingTransaction: false,
      resultTx: true,
      request: undefined
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private getAssets(): Asset[] {
    var assets: Asset[];
    if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      assets = [
        Asset.ETH
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      assets = [
      ];
    } else {
      assets = [
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
    }
    return assets;
  }


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
    if (prevState.selectedTabAsset !== this.state.selectedTabAsset) {
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
            assets={this.state.assets}
            selectedTabAsset={this.state.selectedTabAsset}
            onShowMyTokensOnlyChange={this.onShowMyTokensOnlyChange}
            onTabSelect={this.onTabSelect}
            isMobile={this.props.isMobileMedia}
            isShowMyTokensOnly={this.state.showMyTokensOnly}
            openedPositionsCount={this.state.openedPositionsCount}
          />

          {this.state.showMyTokensOnly ? (
            <ManageTokenGrid
              isMobileMedia={this.props.isMobileMedia}
              ownRowsData={this.state.ownRowsData}
            />
          ) : (
              <React.Fragment>
                <div className="chart-wrapper">
                  <TVChartContainer symbol={this.state.selectedTabAsset} preset={this.props.isMobileMedia ? "mobile" : undefined} />
                </div>
                <TradeTokenGrid
                  selectedTabAsset={this.state.selectedTabAsset}
                  isMobileMedia={this.props.isMobileMedia}
                  tokenRowsData={this.state.tokenRowsData.filter(e => e.asset === this.state.selectedTabAsset)}
                  ownRowsData={this.state.ownRowsData}
                  changeLoadingTransaction={this.changeLoadingTransaction}
                  request={this.state.request}
                  isLoadingTransaction={this.state.isLoadingTransaction}
                  tradePosition = {this.state.tradePositionType}
                  tradeLeverage = {this.state.tradeLeverage}
                  resultTx={this.state.resultTx}
                  tradeType={this.state.tradeType}
                  loanId={this.state.loanId}
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
              loanId={this.state.loanId}
              isMobileMedia={this.props.isMobileMedia}
              tradeType={this.state.tradeType}
              asset={this.state.tradeAsset}
              positionType={this.state.tradePositionType}
              leverage={this.state.tradeLeverage}
              bestCollateral={
                this.state.tradeAsset === Asset.ETH ?
                  Asset.ETH :
                  this.state.tradePositionType === PositionType.SHORT ?
                    this.state.tradeAsset :
                    this.state.tradeUnitOfAccount}
              defaultCollateral={this.state.collateralToken}
              defaultUnitOfAccount={this.state.tradeUnitOfAccount}
              defaultTokenizeNeeded={true}
              onSubmit={this.onTradeConfirmed}
              onCancel={this.onTradeRequestClose}
              onTrade={this.onTradeRequested}
              version={this.state.tradeVersion}
              isOpenModal={this.state.isTradeModalOpen}
            />
          </Modal>
          <Modal
            isOpen={this.state.isTokenAddressFormOpen}

            onRequestClose={this.onTokenAddressFormRequestClose}
            className="modal-content-div"
            overlayClassName="modal-overlay-div"
          >
            <TokenAddressForm
              tradeTokenKey={this.state.tradeTokenKey}
              onCancel={this.onTokenAddressFormRequestClose}
            />
          </Modal>
          <Modal
            isOpen={this.state.isManageCollateralModalOpen}
            onRequestClose={this.onManageCollateralRequestClose}
            className="modal-content-div"
            overlayClassName="modal-overlay-div"
          >
            <ManageCollateralForm
              isMobileMedia={this.props.isMobileMedia}
              asset={this.state.tradeAsset}
              tradeType={TradeType.BUY}
              leverage={this.state.tradeLeverage}
              positionType={this.state.tradePositionType}
              bestCollateral={
                this.state.tradeAsset === Asset.ETH ?
                  Asset.ETH :
                  this.state.tradePositionType === PositionType.SHORT ?
                    this.state.tradeAsset :
                    this.state.tradeUnitOfAccount}
              defaultCollateral={this.state.collateralToken}
              defaultUnitOfAccount={this.state.tradeUnitOfAccount}
              defaultTokenizeNeeded={true}
              onSubmit={this.onManageCollateralConfirmed}
              onCancel={this.onManageCollateralRequestClose}
              onManage={this.onManageCollateralRequested}
              version={this.state.tradeVersion}
              isOpenModal={this.state.isManageCollateralModalOpen}

            />
          </Modal>
        </main>
      </div>
    );
  }

  public onTabSelect = async (asset: Asset) => {
    await this.setState({ ...this.state, selectedTabAsset: asset });
  };

  public onDetails = async (key: TradeTokenKey) => {
    this.setState({ ...this.state, tradeTokenKey: key, isTokenAddressFormOpen: true });
  };

  private onTokenAddressFormRequestClose = () => {
    this.setState({ ...this.state, isTokenAddressFormOpen: false });
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
        collateralToken: request.collateral,
        tradeType: request.tradeType,
        tradeAsset: request.asset,
        tradeUnitOfAccount: request.unitOfAccount,
        tradePositionType: request.positionType,
        tradeLeverage: request.leverage,
        tradeVersion: request.version,
        tradeRequestId: request.id,
      });
    }
  };

  public onManageCollateralConfirmed = (request: ManageCollateralRequest) => {
    request.id = this.state.tradeRequestId;
    FulcrumProvider.Instance.onManageCollateralConfirmed(request);
    this.setState({
      ...this.state,
      isManageCollateralModalOpen: false
    });
  };

  public onManageCollateralRequestOpen = (request: ManageCollateralRequest) => {
    this.setState({
      ...this.state,
      collateralToken: request.collateral,
      tradeType: request.tradeType,
      tradeAsset: request.asset,
      tradeUnitOfAccount: request.unitOfAccount,
      tradePositionType: request.positionType,
      tradeLeverage: request.leverage,
      tradeVersion: request.version,
      isManageCollateralModalOpen: true
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

    /*let unit = request.unitOfAccount;
    if (request.asset === Asset.ETH && request.positionType === PositionType.LONG && request.leverage === 2) {
      unit = Asset.DAI;
    }*/

    if (request) {
      this.setState({
        ...this.state,
        isTradeModalOpen: true,
        collateralToken: request.collateral,
        tradeType: request.tradeType,
        tradeAsset: request.asset,
        tradeUnitOfAccount: request.unitOfAccount,
        tradePositionType: request.positionType,
        tradeLeverage: request.leverage,
        tradeVersion: request.version,
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
      //const pTokens = state.assets && state.tradePositionType
      //  ? FulcrumProvider.Instance.getPTokensAvailable().filter(tradeToken => tradeToken.asset == state.selectedKey.asset && tradeToken.positionType == state.tradePositionType)
      //  : FulcrumProvider.Instance.getPTokensAvailable();
      const loans = await FulcrumProvider.Instance.getUserMarginTradeLoans();
      // const pTokens = FulcrumProvider.Instance.getPTokensAvailable();
      // const pTokenAddreses: string[] = FulcrumProvider.Instance.getPTokenErc20AddressList();
      // const pTokenBalances = await FulcrumProvider.Instance.getErc20BalancesOfUser(pTokenAddreses);
      for (const loan of loans) {
        // const balance = pTokenBalances.get(pToken.erc20Address);
        // if (!balance)
        //   continue;

        const positionType = loan.collateralAsset === Asset.ETH
          ? PositionType.LONG
          : PositionType.SHORT;
        const asset = loan.collateralAsset === Asset.ETH
          ? loan.collateralAsset
          : loan.loanAsset;
        const unitOfAccount = loan.collateralAsset === Asset.ETH
          ? loan.loanAsset
          : loan.collateralAsset;

        let leverage = 0;
        if (positionType === PositionType.LONG) {
          if (loan.loanData!.startMargin.eq(new BigNumber(100).times(10 ** 18))) {
            leverage = 2;
          }
          if (loan.loanData!.startMargin.eq(new BigNumber(50).times(10 ** 18))) {
            leverage = 3;
          }
          if (loan.loanData!.startMargin.eq(new BigNumber("33333333333333333333"))) {
            leverage = 4;
          }
          if (loan.loanData!.startMargin.eq(new BigNumber(25).times(10 ** 18))) {
            leverage = 5;
          }

        } else {
          if (loan.loanData!.startMargin.eq(new BigNumber(50).times(10 ** 18))) {
            leverage = 2;
          }
          if (loan.loanData!.startMargin.eq(new BigNumber("33333333333333333333"))) {
            leverage = 3;
          }
          if (loan.loanData!.startMargin.eq(new BigNumber(25).times(10 ** 18))) {
            leverage = 4;
          }
          if (loan.loanData!.startMargin.eq(new BigNumber(20).times(10 ** 18))) {
            leverage = 5;
          }
        }
        ownRowsData.push({
          loanId: loan.loanId,
          currentKey: new TradeTokenKey(asset, unitOfAccount, positionType, leverage, true),
          pTokenAddress: loan.loanData!.loanToken,
          onTrade: this.onTradeRequested,
          onManageCollateralOpen: this.onManageCollateralRequested,
          changeLoadingTransaction: this.changeLoadingTransaction,
        });
      }
    }
    this.setState({ ...this.state, openedPositionsCount: ownRowsData.length });
    return ownRowsData;
  };

  public getTokenRowsData = (state: ITradePageState): ITradeTokenGridRowProps[] => {
    const tokenRowsData: ITradeTokenGridRowProps[] = [];
    state.assets.forEach(e => {
      tokenRowsData.push({
        asset: e,
        defaultUnitOfAccount: state.defaultUnitOfAccount,
        defaultTokenizeNeeded: true,
        positionType: PositionType.LONG,
        defaultLeverage: state.defaultLeverageLong,
        onTrade: this.onTradeRequested,
        changeLoadingTransaction: this.changeLoadingTransaction,
      });
      tokenRowsData.push({
        asset: e,
        defaultUnitOfAccount: state.defaultUnitOfAccount,
        defaultTokenizeNeeded: true,
        positionType: PositionType.SHORT,
        defaultLeverage: state.defaultLeverageShort,
        onTrade: this.onTradeRequested,
        changeLoadingTransaction: this.changeLoadingTransaction,
      });
    });
    return tokenRowsData;
  };

  public changeLoadingTransaction = (isLoadingTransaction: boolean, request: TradeRequest | undefined, resultTx: boolean) => {
    this.setState({ ...this.state, isLoadingTransaction: isLoadingTransaction, request: request, resultTx: resultTx })
  }
}
