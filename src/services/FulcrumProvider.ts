import { EventEmitter } from "events";
import Web3 from "web3";
import { IPriceGraphDataPoint } from "../components/PriceGraph";
import { LendRequest } from "../domain/LendRequest";
import { ProviderType } from "../domain/ProviderType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { ProviderChangedEvent } from "./events/ProviderChangedEvent";
import { FulcrumProviderEvents } from "./FulcrumProviderEvents";

class FulcrumProvider {
  public static Instance: FulcrumProvider;

  public eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public web3: Web3 | null = null;

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();

    // singleton
    if (!FulcrumProvider.Instance) {
      FulcrumProvider.Instance = this;
    }

    return FulcrumProvider.Instance;
  }

  public async setWeb3Provider(providerType: ProviderType) {
    this.web3 = await Web3ConnectionFactory.getWeb3Connection(providerType);
    this.providerType = this.web3 ? providerType : ProviderType.None;

    this.eventEmitter.emit(
      FulcrumProviderEvents.ProviderChanged,
      new ProviderChangedEvent(this.providerType, this.web3)
    );
  }

  public onLendConfirmed = (request: LendRequest) => {
    if (request) {
      alert(`loan ${request.amount} of ${request.asset}`);
    }
  };

  public onTradeConfirmed = (tradeType: TradeType, request: TradeRequest) => {
    if (request) {
      alert(
        `${tradeType} ${request.positionType} ${request.amount} of ${request.asset} with ${request.leverage}x leverage`
      );
    }
  };

  public getPriceGraphData = (selectedKey: string, samplesCount: number): IPriceGraphDataPoint[] => {
    const result: IPriceGraphDataPoint[] = [];

    const priceBase = 40;
    let priceDiff = Math.round(Math.random() * 2000) / 100;
    let change24h = 0;
    for (let i = 0; i < samplesCount + 1; i++) {
      const priceDiffNew = Math.round(Math.random() * 2000) / 100;
      change24h = ((priceDiffNew - priceDiff) / (priceBase + priceDiff)) * 100;
      priceDiff = priceDiffNew;

      result.push({ price: priceBase + priceDiff, change24h: change24h });
    }

    return result;
  };
}

// singleton
const instance = new FulcrumProvider();
export default instance;
