import React, { Component } from "react";
import Modal from "react-modal";
import { PriceGraph } from "../components/PriceGraph";
import { TradeForm } from "../components/TradeForm";
import { TradeTokenGrid } from "../components/TradeTokenGrid";
import { Asset } from "../domain/Asset";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import FulcrumProvider from "../services/FulcrumProvider";

interface ITradePageState {
  selectedKey: string;
  isTradeModalOpen: boolean;
  tradeType: TradeType;
  tradeAsset: Asset;
  tradePositionType: PositionType;
  tradeLeverage: number;
  priceGraphData: IPriceDataPoint[];
}

export class TradePage extends Component<any, ITradePageState> {
  constructor(props: any) {
    super(props);

    const graphData = FulcrumProvider.getPriceDataPoints("", 15);
    this.state = {
      selectedKey: "",
      priceGraphData: graphData,
      isTradeModalOpen: false,
      tradeType: TradeType.BUY,
      tradeAsset: Asset.UNKNOWN,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 2
    };
  }

  public render() {
    return (
      <div className="trade-page">
        <HeaderOps />
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

  public onSelect = (key: string) => {
    const graphData = FulcrumProvider.getPriceDataPoints("", 15);
    this.setState({ ...this.state, selectedKey: key, priceGraphData: graphData });
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
      tradeLeverage: 2
    });
  };

  public onRequestClose = () => {
    this.setState({ isTradeModalOpen: false });
  };
}
