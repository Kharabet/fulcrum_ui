import React, { Component } from "react";
import Modal from "react-modal";
import { OwnTokenGrid } from "../components/OwnTokenGrid";
import { PriceGraph } from "../components/PriceGraph";
import { TokenAddressForm } from "../components/TokenAddressForm";
import { TradeForm } from "../components/TradeForm";
import { TradeTokenGrid } from "../components/TradeTokenGrid";
import { Asset } from "../domain/Asset";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface ITradePageProps {
  doNetworkConnect: () => void;
  isLoading: boolean;
}

interface ITradePageState {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;

  isTradeModalOpen: boolean;
  tradeType: TradeType;
  tradeAsset: Asset;
  tradePositionType: PositionType;
  tradeLeverage: number;

  collateralToken: Asset;

  isTokenAddressFormOpen: boolean;
  tradeTokenKey: TradeTokenKey;

  priceGraphData: IPriceDataPoint[];
}

export class TradePage extends Component<ITradePageProps, ITradePageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      showMyTokensOnly: false,
      selectedKey: TradeTokenKey.empty(),
      priceGraphData: [],
      isTradeModalOpen: false,
      tradeType: TradeType.BUY,
      tradeAsset: Asset.UNKNOWN,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 0,
      collateralToken: Asset.UNKNOWN,
      isTokenAddressFormOpen: false,
      tradeTokenKey: TradeTokenKey.empty()
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    if (!FulcrumProvider.Instance.web3Wrapper) {
      this.props.doNetworkConnect();
    }
  }

  public componentDidUpdate(prevProps: Readonly<ITradePageProps>, prevState: Readonly<ITradePageState>, snapshot?: any): void {
    if (prevState.selectedKey !== this.state.selectedKey) {
      this.derivedUpdate();
    }
  }

  private async derivedUpdate() {
    const priceGraphData = await FulcrumProvider.Instance.getPriceDataPoints(this.state.selectedKey);
    this.setState({ ...this.state, selectedKey: this.state.selectedKey, priceGraphData: priceGraphData });
  }

  public render() {
    return (
      <div className="trade-page">
        <HeaderOps isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} />
        <main>
          <PriceGraph 
            data={this.state.priceGraphData}
            selectedKey={this.state.selectedKey}
          />
          {this.state.showMyTokensOnly ? (
            <OwnTokenGrid
              showMyTokensOnly={this.state.showMyTokensOnly}
              selectedKey={this.state.selectedKey}
              onShowMyTokensOnlyChange={this.onShowMyTokensOnlyChange}
              onSelect={this.onSelect}
              onDetails={this.onDetails}
              onTrade={this.onTradeRequested}
            />
          ) : (
            <TradeTokenGrid
              showMyTokensOnly={this.state.showMyTokensOnly}
              selectedKey={this.state.selectedKey}
              defaultLeverageShort={1}
              defaultLeverageLong={2}
              onShowMyTokensOnlyChange={this.onShowMyTokensOnlyChange}
              onSelect={this.onSelect}
              onTrade={this.onTradeRequested}
            />
          )}
          <Modal
            isOpen={this.state.isTradeModalOpen}
            onRequestClose={this.onRequestClose}
            className="modal-content-div"
            overlayClassName="modal-overlay-div"
          >
            <TradeForm
              tradeType={this.state.tradeType}
              asset={this.state.tradeAsset}
              positionType={this.state.tradePositionType}
              leverage={this.state.tradeLeverage}
              defaultCollateral={this.state.collateralToken}
              defaultUnitOfAccount={Asset.DAI}
              defaultTokenizeNeeded={true}
              onSubmit={this.onTradeConfirmed}
              onCancel={this.onRequestClose}
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
        </main>
        <Footer />
      </div>
    );
  }

  public onSelect = async (key: TradeTokenKey) => {
    this.setState({ ...this.state, selectedKey: key });
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

  public onTradeRequested = (request: TradeRequest) => {
    if (!FulcrumProvider.Instance.contractsSource || !FulcrumProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      return;
    }

    if (request) {
      this.setState({
        ...this.state,
        isTradeModalOpen: true,
        collateralToken: request.collateral,
        tradeType: request.tradeType,
        tradeAsset: request.asset,
        tradePositionType: request.positionType,
        tradeLeverage: request.leverage
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

  public onRequestClose = () => {
    this.setState({ 
      ...this.state,
      isTradeModalOpen: false
    });
  };

  public onShowMyTokensOnlyChange = (value: boolean) => {
    this.setState({ 
      ...this.state,
      showMyTokensOnly: value
    });
  };
}
