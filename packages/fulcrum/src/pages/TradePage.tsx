import React, { PureComponent, Component } from "react";
import Modal from "react-modal";
import { ManageCollateralForm } from "../components/ManageCollateralForm";
import { OwnTokenGrid } from "../components/OwnTokenGrid";
import { PriceGraph } from "../components/PriceGraph";
import { TokenAddressForm } from "../components/TokenAddressForm";
import { TradeForm } from "../components/TradeForm";
import { TradeTokenGrid, ITradeTokenGridProps } from "../components/TradeTokenGrid";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "../components/TradeTokenGridRow";

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
import { AssetDetails } from "../domain/AssetDetails";



export interface ITradePageProps {
  doNetworkConnect: () => void;
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
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 0,
      tradeVersion: 1,
      collateralToken: Asset.UNKNOWN,
      isTokenAddressFormOpen: false,
      tradeTokenKey: TradeTokenKey.empty(),
      isManageCollateralModalOpen: false,
      isLong: true,
      isShort: false,
      assets: this.getAssets()
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

  public componentDidMount(): void {
    const provider = FulcrumProvider.getLocalstorageItem('providerType');
    if (!FulcrumProvider.Instance.web3Wrapper && (!provider || provider === "None")) {
      this.props.doNetworkConnect();
    }
  }

  public componentDidUpdate(prevProps: Readonly<ITradePageProps>, prevState: Readonly<ITradePageState>, snapshot?: any): void {
    if (prevState.selectedKey !== this.state.selectedKey) {
      this.derivedUpdate();
    }
  }

  private async derivedUpdate() {
    // const priceGraphData = await FulcrumProvider.Instance.getPriceDataPoints(this.state.selectedKey);
    // this.setState({ ...this.state, selectedKey: this.state.selectedKey, priceGraphData: priceGraphData });
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
        <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} />
        <main>
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
          />

          {!this.state.showMyTokensOnly ? (
            <div className="chart-wrapper">
              <TVChartContainer symbol={this.state.selectedKey.asset} preset={this.props.isMobileMedia ? "mobile" : undefined} />
            </div>) : null}

          {this.state.showMyTokensOnly ? (
            <OwnTokenGrid
              showMyTokensOnly={this.state.showMyTokensOnly}
              selectedKey={this.state.selectedKey}
              onShowMyTokensOnlyChange={this.onShowMyTokensOnlyChange}
              onDetails={this.onDetails}
              onManageCollateral={this.onManageCollateralRequested}
              onSelect={this.onSelect}
              isMobileMedia={this.props.isMobileMedia}
              onTrade={this.onTradeRequested}
            />
          ) : (
              <TradeTokenGrid
                assets={this.state.assets}
                changeActiveBtn={this.changeActiveBtn.bind(this)}
                isMobileMedia={this.props.isMobileMedia}
                showMyTokensOnly={this.state.showMyTokensOnly}
                selectedKey={this.state.selectedKey}
                defaultLeverageShort={1}
                defaultLeverageLong={2}
                onShowMyTokensOnlyChange={this.onShowMyTokensOnlyChange}
                onSelect={this.onSelect}
                onTrade={this.onTradeRequested}
                isLong={this.state.isLong}
                isShort={this.state.isShort}
              />
            )}
          <Modal
            isOpen={this.state.isTradeModalOpen}
            onRequestClose={this.onTradeRequestClose}
            className="modal-content-div"
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
              asset={Asset.ETH}
              onSubmit={this.onManageCollateralConfirmed}
              onCancel={this.onManageCollateralRequestClose}
            />
          </Modal>
        </main>
        {!this.props.isMobileMedia ? <Footer isMobileMedia={this.props.isMobileMedia}/> : null}
      </div>
    );
  }

  public onSelect = async (key: TradeTokenKey) => {
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
      this.setState({ ...this.state, isManageCollateralModalOpen: true });
    }
  };

  public onManageCollateralConfirmed = (request: ManageCollateralRequest) => {
    FulcrumProvider.Instance.onManageCollateralConfirmed(request);
    this.setState({
      ...this.state,
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
}
