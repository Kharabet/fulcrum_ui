import React, { Component } from "react";
import Modal from "react-modal";
import { PriceGraph } from "../components/PriceGraph";
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
import FulcrumProvider from "../services/FulcrumProvider";

export interface ITradePageProps {
  doNetworkConnect: () => void;
}

interface ITradePageState {
  selectedKey: TradeTokenKey;
  isTradeModalOpen: boolean;
  tradeType: TradeType;
  tradeAsset: Asset;
  tradePositionType: PositionType;
  tradeLeverage: number;
  priceGraphData: IPriceDataPoint[];
}

export class TradePage extends Component<ITradePageProps, ITradePageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectedKey: TradeTokenKey.empty(),
      priceGraphData: [],
      isTradeModalOpen: false,
      tradeType: TradeType.BUY,
      tradeAsset: Asset.UNKNOWN,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 0
    };
  }

  public componentDidMount(): void {
    if (!FulcrumProvider.web3) {
      this.props.doNetworkConnect();
    }
  }

  public render() {
    return (
      <div className="trade-page">
        <HeaderOps doNetworkConnect={this.props.doNetworkConnect} />
        <main>
          <PriceGraph data={this.state.priceGraphData} />
          <TradeTokenGrid
            selectedKey={this.state.selectedKey}
            defaultLeverageShort={1}
            defaultLeverageLong={2}
            onSelect={this.onSelect}
            onTrade={this.onTradeRequested}
          />
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
              onSubmit={this.onTradeConfirmed}
              onCancel={this.onRequestClose}
            />
          </Modal>
        </main>
        <Footer />
      </div>
    );
  }

  public onSelect = async (key: TradeTokenKey) => {
    const priceGraphData = await FulcrumProvider.getPriceDataPoints(key, 15);
    this.setState({ ...this.state, selectedKey: key, priceGraphData: priceGraphData });
  };

  public onTradeRequested = (request: TradeRequest) => {
    if (request) {
      this.setState({
        ...this.state,
        isTradeModalOpen: true,
        tradeType: request.tradeType,
        tradeAsset: request.asset,
        tradePositionType: request.positionType,
        tradeLeverage: request.leverage
      });
    }
  };

  public onTradeConfirmed = (request: TradeRequest) => {
    FulcrumProvider.onTradeConfirmed(request);
    this.setState({
      ...this.state,
      isTradeModalOpen: false,
      tradeType: TradeType.BUY,
      tradeAsset: Asset.UNKNOWN,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 0
    });
  };

  public onRequestClose = () => {
    this.setState({ ...this.state, isTradeModalOpen: false });
  };
}
