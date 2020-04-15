import React, { PureComponent, Component } from "react";
import Modal from "react-modal";
import { ManageCollateralForm } from "../components/ManageCollateralForm";
import { OwnTokenGrid } from "../components/OwnTokenGrid";
import { TokenAddressForm } from "../components/TokenAddressForm";
import { TradeForm } from "../components/TradeForm";
import { TradeTokenGrid } from "../components/TradeTokenGrid";

import { Asset } from "../domain/Asset";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

import { TokenGridTabs } from "../components/TokenGridTabs";


import { TVChartContainer } from '../components/TVChartContainer';
import { InfoBlock } from "../components/InfoBlock";
import { ITradeTokenGridRowProps } from "../components/TradeTokenGridRow";
import { IOwnTokenGridRowProps } from "../components/OwnTokenGridRow";



export interface ITradePageProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

interface ITradePageState {
  assets: Asset[];
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;
  selectedTab: Asset;
  isTradeModalOpen: boolean;
  tradeDataType: string,
  tradeType: TradeType;
  tradeAsset: Asset;
  tradeUnitOfAccount: Asset;
  defaultUnitOfAccount: Asset;
  tradePositionType: PositionType;
  tradeLeverage: number;
  tradeVersion: number;

  collateralToken: Asset;

  isTokenAddressFormOpen: boolean;
  tradeTokenKey: TradeTokenKey;

  isManageCollateralModalOpen: boolean;

  priceGraphData: IPriceDataPoint[];
  isLong: boolean;
  isShort: boolean;
  defaultTokenizeNeeded: boolean;
  defaultLeverageShort: number;
  defaultLeverageLong: number;
  openedPositionsCount: number;
  tokenRowsData: ITradeTokenGridRowProps[];
  ownRowsData: IOwnTokenGridRowProps[];
}

export class TradePage extends PureComponent<ITradePageProps, ITradePageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showMyTokensOnly: false,
      selectedKey: TradeTokenKey.empty(),
      selectedTab: Asset.ETH,
      priceGraphData: [],
      isTradeModalOpen: false,
      tradeDataType: 'long',
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
      isLong: true,
      isShort: false,
      assets: this.getAssets(),
      defaultTokenizeNeeded: true,
      defaultLeverageShort: 1,
      defaultLeverageLong: 2,
      openedPositionsCount: 0,
      tokenRowsData: [],
      ownRowsData: []
    };
    // let changeActiveBtn  = this.changeActiveBtn.bind(this);

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
        // Asset.SAI,
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
    if (prevState.selectedKey !== this.state.selectedKey) {
      this.derivedUpdate();
    }
    /*if (prevState.tokenRowsData !== this.state.tokenRowsData || prevState.ownRowsData !== this.state.ownRowsData) {
      this.derivedUpdate();
    }*/
  }

  private async derivedUpdate() {
    const tokenRowsData = this.getTokenRowsData(this.state);
    const ownRowsData = await this.getOwnRowsData(this.state);
    await this.setState({ ...this.state, ownRowsData: ownRowsData, tokenRowsData: tokenRowsData });
  }

  public changeActiveBtn(activeType: string) {
    if (activeType == 'long') {
      this.setState({ ...this.state, isLong: true, isShort: false });
    } else {
      this.setState({ ...this.state, isLong: false, isShort: true });
    }
  }

  public render() {
    return (
      <div className="trade-page">
        <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
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
            selectedKey={this.state.selectedKey}
            onShowMyTokensOnlyChange={this.onShowMyTokensOnlyChange}
            onTabSelect={this.onTabSelect}
            isMobile={this.props.isMobileMedia}
            onSelect={this.onSelect}
            isShowMyTokensOnly={this.state.showMyTokensOnly}
            defaultUnitOfAccount={this.state.tradeUnitOfAccount}
            defaultLeverageShort={1}
            defaultLeverageLong={2}
            isLong={this.state.isLong}
            openedPositionsCount={this.state.openedPositionsCount}
          />

          {!this.state.showMyTokensOnly
            ? <React.Fragment>
              <div className="chart-wrapper">
                <TVChartContainer symbol={this.state.selectedKey.asset} preset={this.props.isMobileMedia ? "mobile" : undefined} />
              </div>
            </React.Fragment>
            : null
          }
          {this.state.showMyTokensOnly ? (
            <OwnTokenGrid
              showMyTokensOnly={this.state.showMyTokensOnly}
              selectedKey={this.state.selectedKey}
              isMobileMedia={this.props.isMobileMedia}
              // onDetails={this.onDetails}
              // onManageCollateral={this.onManageCollateralRequested}
              onSelect={this.onSelect}
              onTrade={this.onTradeRequested}
              onManageCollateralOpen={this.onManageCollateralRequestOpen}
              ownRowsData={this.state.ownRowsData}
            />
          ) : (

              <TradeTokenGrid
                assets={this.state.assets}
                changeActiveBtn={this.changeActiveBtn.bind(this)}
                isMobileMedia={this.props.isMobileMedia}
                isLong={this.state.isLong}
                isShort={this.state.isShort}
                showMyTokensOnly={this.state.showMyTokensOnly}
                selectedKey={this.state.selectedKey}
                onSelect={this.onSelect}
                onTrade={this.onTradeRequested}
                defaultLeverage={this.state.tradeLeverage}
                onManageCollateralOpen={this.onManageCollateralRequestOpen}
                tokenRowsData={this.state.tokenRowsData}
                ownRowsData={this.state.ownRowsData}
              />
            )}
          <Modal
            isOpen={this.state.isTradeModalOpen}
            onRequestClose={this.onTradeRequestClose}
            className="modal-content-div modal-content-div-form"
            overlayClassName="modal-overlay-div"
          >
            <TradeForm
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

            />
          </Modal>
        </main>
        {!this.props.isMobileMedia ? <Footer isMobileMedia={this.props.isMobileMedia} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} /> : null}
      </div>
    );
  }

  public onSelect = async (key: TradeTokenKey) => {
    this.derivedUpdate();
    await this.setState({ ...this.state, selectedKey: key });
  };
  public onTabSelect = async (asset: Asset) => {
    this.setState({ ...this.state, selectedTab: asset });
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
        tradeVersion: request.version
      });
    }
  };

  public onManageCollateralConfirmed = (request: ManageCollateralRequest) => {
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
        tradeVersion: request.version
      });
    }
  };

  public onTradeConfirmed = (request: TradeRequest) => {
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
      const pTokens = FulcrumProvider.Instance.getPTokensAvailable();
      const pTokenAddreses: string[] = FulcrumProvider.Instance.getPTokenErc20AddressList();
      const pTokenBalances = await FulcrumProvider.Instance.getErc20BalancesOfUser(pTokenAddreses);
      for (const pToken of pTokens) {
        const balance = pTokenBalances.get(pToken.erc20Address);
        if (!balance)
          continue;

        ownRowsData.push({
          selectedKey: state.selectedKey,
          currentKey: pToken,
          showMyTokensOnly: state.showMyTokensOnly,
          onSelect: this.onSelect,
          onTrade: this.onTradeRequested,
          onManageCollateralOpen: this.onManageCollateralRequested,
        });
      }
    }
    this.setState({ ...this.state, openedPositionsCount: ownRowsData.length });
    return ownRowsData;
  };

  public getTokenRowsData = (state: ITradePageState): ITradeTokenGridRowProps[] => {
    const tokenRowsData: ITradeTokenGridRowProps[] = [];
    state.assets.forEach(e => {
      if (state.selectedKey.asset === Asset.UNKNOWN || e == state.selectedKey.asset) {
        tokenRowsData.push({
          selectedKey: state.selectedKey,
          asset: e,
          defaultUnitOfAccount: state.defaultUnitOfAccount,
          defaultTokenizeNeeded: true,
          positionType: PositionType.LONG,
          defaultLeverage: state.defaultLeverageLong,
          changeActiveBtn: this.changeActiveBtn,
          onSelect: this.onSelect,
          onTrade: this.onTradeRequested
        });
        tokenRowsData.push({
          selectedKey: state.selectedKey,
          asset: e,
          defaultUnitOfAccount: state.defaultUnitOfAccount,
          defaultTokenizeNeeded: true,
          positionType: PositionType.SHORT,
          defaultLeverage: state.defaultLeverageShort,
          changeActiveBtn: this.changeActiveBtn,
          onSelect: this.onSelect,
          onTrade: this.onTradeRequested
        });
      }
    });
    return tokenRowsData;
  };
}
