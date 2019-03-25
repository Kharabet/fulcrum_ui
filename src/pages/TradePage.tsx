import BigNumber from "bignumber.js";
import React, { Component } from "react";
import Modal from "react-modal";
import Web3 from "web3";
import { IPriceGraphDataPoint, PriceGraph } from "../components/PriceGraph";
import { TradeForm } from "../components/TradeForm";
import { TradeTokenGrid } from "../components/TradeTokenGrid";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import Footer from "../layout/Footer";
import HeaderOps from "../layout/HeaderOps";

interface ITradePageParams {
  web3: Web3 | null;
  onNetworkConnect: () => void;
}

interface ITradePageState {
  selectedKey: string;
  isTradeModalOpen: boolean;
  tradeType: TradeType;
  tradeAsset: Asset;
  tradePositionType: PositionType;
  tradeLeverage: number;
  graphData: IPriceGraphDataPoint[];
}

export class TradePage extends Component<ITradePageParams, ITradePageState> {
  constructor(props: ITradePageParams) {
    super(props);

    const graphData = TradePage.getGraphData("", 15);
    this.state = {
      selectedKey: "",
      graphData: graphData,
      isTradeModalOpen: false,
      tradeType: TradeType.BUY,
      tradeAsset: Asset.UNKNOWN,
      tradePositionType: PositionType.SHORT,
      tradeLeverage: 2
    };
  }

  private static getGraphData(selectedKey: string, samples: number): IPriceGraphDataPoint[] {
    const result: IPriceGraphDataPoint[] = [];

    const priceBase = 40;
    let priceDiff = Math.round(Math.random() * 2000) / 100;
    let change24h = 0;
    for(let i = 0; i < samples + 1; i++) {
      const priceDiffNew = Math.round(Math.random() * 2000) / 100;
      change24h = ((priceDiffNew - priceDiff) / (priceBase + priceDiff)) * 100;
      priceDiff = priceDiffNew;

      result.push({ price: priceBase + priceDiff, change24h: change24h });
    }

    return result;
  }

  public render() {
    return (
      <div className="trade-page">
        <HeaderOps web3={this.props.web3} onNetworkConnect={this.props.onNetworkConnect} />
        <main>
          <PriceGraph data={this.state.graphData} />
          <TradeTokenGrid
            selectedKey={this.state.selectedKey}
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
              price={new BigNumber("91.68")}
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
    const graphData = TradePage.getGraphData("", 15);
    this.setState({ ...this.state, selectedKey: key, graphData: graphData });
  };

  public onTradeRequested = (tradeType: TradeType, request: TradeRequest) => {
    if (request) {
      this.setState({
        ...this.state,
        isTradeModalOpen: true,
        tradeType: tradeType,
        tradeAsset: request.asset,
        tradePositionType: request.positionType,
        tradeLeverage: request.leverage
      });
    }
  };

  public onTradeConfirmed = (tradeType: TradeType, request: TradeRequest) => {
    if (request) {
      alert(
        `${tradeType} ${request.positionType} ${request.amount} of ${request.asset} with ${request.leverage}x leverage`
      );
    }
  };

  public onRequestClose = () => {
    this.setState({ isTradeModalOpen: false });
  };
}

export default TradePage;
