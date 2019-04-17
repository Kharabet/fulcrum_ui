import { BigNumber } from "@0x/utils";
import { EventEmitter } from "events";
import moment from "moment";
import Web3 from "web3";
import { Asset } from "../domain/Asset";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { ProviderType } from "../domain/ProviderType";
import { RequestTask } from "../domain/RequestTask";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { ContractsSource } from "./ContractsSource";
import { FulcrumProviderEvents } from "./events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "./events/ProviderChangedEvent";
import { TasksQueueEvents } from "./events/TasksQueueEvents";
import { TasksQueue } from "./TasksQueue";

export class FulcrumProvider {
  public static Instance: FulcrumProvider;

  private isProcessing: boolean = false;
  private isChecking: boolean = false;

  public readonly eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public web3: Web3 | null = null;

  public contractsSource: ContractsSource | null = null;

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(1000);
    TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued);

    // singleton
    if (!FulcrumProvider.Instance) {
      FulcrumProvider.Instance = this;
    }

    return FulcrumProvider.Instance;
  }

  public async setWeb3Provider(providerType: ProviderType) {
    this.web3 = await Web3ConnectionFactory.getWeb3Connection(providerType);
    this.providerType = this.web3 ? providerType : ProviderType.None;

    const web3ProviderSettings = await FulcrumProvider.getWeb3ProviderSettings(this.web3);
    this.contractsSource =
      this.web3 && web3ProviderSettings.networkName
        ? new ContractsSource(this.web3.currentProvider, web3ProviderSettings.networkName)
        : null;
    if (this.contractsSource) {
      this.contractsSource.Init();
    }

    if (this.web3) {
      // MetaMask-only code
      if (this.providerType === ProviderType.MetaMask) {
        // @ts-ignore
        this.web3.currentProvider.publicConfigStore.on("update", result =>
          this.eventEmitter.emit(
            FulcrumProviderEvents.ProviderChanged,
            new ProviderChangedEvent(this.providerType, this.web3)
          )
        );
      }
    }
    this.eventEmitter.emit(
      FulcrumProviderEvents.ProviderChanged,
      new ProviderChangedEvent(this.providerType, this.web3)
    );
  }

  public onLendConfirmed = async (request: LendRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request));
    }
  };

  public onTradeConfirmed = async (request: TradeRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request));
    }
  };

  // For Lend tokens (iTokens), call supplyInterestRate()
  // For Trade tokens (pTokens), don't get interest rate and don't display it
  public getTokenInterestRate = async (asset: Asset): Promise<BigNumber> => {
    const interestRate = Math.round(Math.random() * 1000) / 100;
    return new BigNumber(interestRate);
  };

  // will figure this out later
  public getPriceDataPoints = async (selectedKey: TradeTokenKey, samplesCount: number): Promise<IPriceDataPoint[]> => {
    const result: IPriceDataPoint[] = [];

    const timeUnit = "hour";
    const beginningTime = moment()
      .startOf(timeUnit)
      .subtract(samplesCount, timeUnit);
    const priceBase = 40;
    let priceDiff = Math.round(Math.random() * 2000) / 100;
    let change24h = 0;
    for (let i = 0; i < samplesCount + 1; i++) {
      const priceDiffNew = Math.round(Math.random() * 2000) / 100;
      change24h = ((priceDiffNew - priceDiff) / (priceBase + priceDiff)) * 100;
      priceDiff = priceDiffNew;

      result.push({ timeStamp: beginningTime.unix(), price: priceBase + priceDiff, change24h: change24h });

      // add mutates beginningTime
      beginningTime.add(1, timeUnit);
    }

    return result;
  };

  /*
    both iTokens and pTokens, call tokenPrice()
    prices are returned as a BigNumber -> 10120000000000000000 = 10.12
    prices are in the underlying (borrowed) asset
    Long pTokens borrow the asset in the name (psETH borrows ETH)
    Short pTokens borrow DAI (plETH borrows DAI):
      ex: 
          iTokens:
          iETH price -> 10.12 ETH per iETH
          iDAI price -> 12.12 DAI per iDAI

          pTokens:
          plETH2x (ETH Long 2x leverage) -> 10.12 DAI per plETH2x
          pswBTC4x (wBTC Short 4x leverage) -> 10.12 wBTC per pswBTC4x
  */
  public getPriceLatestDataPoint = async (selectedKey: TradeTokenKey): Promise<IPriceDataPoint> => {
    const timeUnit = "hour";
    const timeStamp = moment().startOf(timeUnit);
    const priceBase = 40;
    const priceDiff = Math.round(Math.random() * 2000) / 100;
    const change24h = Math.round(Math.random() * 1000) / 100 - 5;
    return {
      timeStamp: timeStamp.unix(),
      price: priceBase + priceDiff,
      change24h: change24h
    };
  };

  public getPriceDefaultDataPoint = (): IPriceDataPoint => {
    return {
      timeStamp: moment().unix(),
      price: 0,
      change24h: 0
    };
  };

  // both iTokens and pTokens have tokenPrice() (current price)  and checkpointPrice() (price at last checkpoint)
  // profit = (tokenPrice - checkpointPrice) * tokenBalance / 10**36
  public getLendProfit = async (asset: Asset): Promise<BigNumber | null> => {
    // should return null if no data (not traded asset), new BigNumber(0) if no profit
    return Math.random() >= 0.5 ? new BigNumber(Math.round(Math.random() * 1000) / 100) : null;
  };

  public getTradeProfit = async (selectedKey: TradeTokenKey): Promise<BigNumber | null> => {
    // should return null if no data (not traded asset), new BigNumber(0) if no profit
    return Math.random() >= 0.5 ? new BigNumber(Math.round(Math.random() * 1000) / 100) : null;
  };

  // when buying a pToken (trade screen), you need to check "liquidity" to ensure there is enough to buy the pToken
  /*  some notes:
      "Short" tokens borrow from the iToken for the underlying asset (ex: psETH2x borrows from iETH) 
      "Long" tokens all borrow from the iDAI token (ex: plETH4x borrows from iDAI)
  
      You need to check the associated iToken liquidity when the user wants to buy to ensure there is enough:
        marketLiquidityForAsset(): max amount of asset (ETH, DAI, etc) that can be deposited to buy marketLiquidityForToken()
        marketLiquidityForToken(): max amount of pToken that can be bought

      pTokens pay interest and earn profits in the "borrowed" asset, so psETH in ETH, 
      psMKR in MKR, but for long tokens, plETH in DAI and plMKR in DAI. pTokens have mintWithToken and 
      burnToToken funtions though. So you can buy or cash out with any supported Kyber asset
  */

  public getMaxTradeValue = async (tradeType: TradeType, selectedKey: TradeTokenKey): Promise<BigNumber> => {
    return new BigNumber(10);
  };

  public getMaxLendValue = async (lendType: LendType, asset: Asset): Promise<BigNumber> => {
    return new BigNumber(15);
  };

  public getTradedAmountEstimate = async (request: TradeRequest): Promise<BigNumber> => {
    return request.amount.div(2);
  };

  public getLendedAmountEstimate = async (request: LendRequest): Promise<BigNumber> => {
    return request.amount.div(3);
  };

  public static async getWeb3ProviderSettings(web3: Web3 | null) {
    if (web3) {
      const networkId = await web3.eth.net.getId();
      // tslint:disable-next-line:one-variable-per-declaration
      let networkName, etherscanURL;
      switch (networkId) {
        case 1:
          networkName = "mainnet";
          etherscanURL = "https://etherscan.io/";
          break;
        case 3:
          networkName = "ropsten";
          etherscanURL = "https://ropsten.etherscan.io/";
          break;
        case 4:
          networkName = "rinkeby";
          etherscanURL = "https://rinkeby.etherscan.io/";
          break;
        case 42:
          networkName = "kovan";
          etherscanURL = "https://kovan.etherscan.io/";
          break;
        default:
          networkName = "local";
          etherscanURL = "";
          break;
      }
      return {
        networkId,
        networkName,
        etherscanURL
      };
    }

    return {
      networkId: null,
      networkName: null,
      etherscanURL: null
    };
  }

  private onTaskEnqueued = async (latestTask: RequestTask) => {
    if (!(this.isProcessing || this.isChecking)) {
      do {
        this.isProcessing = true;
        this.isChecking = false;

        try {
          const task = TasksQueue.Instance.peek();

          if (task) {
            if (task.request instanceof LendRequest) {
              await this.processLendRequestTask(task);
            }

            if (task.request instanceof TradeRequest) {
              await this.processTradeRequestTask(task);
            }
          }
        } finally {
          TasksQueue.Instance.dequeue();
        }

        this.isChecking = true;
        this.isProcessing = false;
      } while (TasksQueue.Instance.any());
      this.isChecking = false;
    }
  };

  private processLendRequestTask = async (task: RequestTask) => {
    try {
      task.processingStart([
        "Initializing loan",
        "Detecting token allowance",
        "Prompting token allowance",
        "Waiting for token allowance",
        "Submitting loan"
      ]);
      await this.sleep(1000);

      task.processingStepNext();
      await this.sleep(1000);

      task.processingStepNext();
      await this.sleep(1000);

      task.processingStepNext();
      await this.sleep(1000);

      task.processingStepNext();
      await this.sleep(1000);

      task.processingEnd(true);
    } catch (e) {
      task.processingEnd(false);
    }
  };

  private processTradeRequestTask = async (task: RequestTask) => {
    try {
      task.processingStart([
        "Initializing trade",
        "Detecting token allowance",
        "Prompting token allowance",
        "Waiting for token allowance",
        "Submitting loan"
      ]);
      await this.sleep(1000);

      task.processingStepNext();
      await this.sleep(1000);

      task.processingStepNext();
      await this.sleep(1000);

      task.processingStepNext();
      await this.sleep(1000);

      task.processingStepNext();
      await this.sleep(1000);

      task.processingEnd(true);
    } catch (e) {
      task.processingEnd(false);
    }
  };

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// tslint:disable-next-line
new FulcrumProvider();
