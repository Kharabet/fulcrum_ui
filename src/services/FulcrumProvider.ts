import { BigNumber } from "@0x/utils";
import { EventEmitter } from "events";
import moment from "moment";
import fetch from "node-fetch";
import { AlchemyWeb3 } from "@alch/alchemy-web3";
import { erc20Contract } from "../contracts/erc20";
import { iTokenContract } from "../contracts/iTokenContract";
import { pTokenContract } from "../contracts/pTokenContract";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ReserveDetails } from "../domain/ReserveDetails";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { ProviderType } from "../domain/ProviderType";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { ContractsSource } from "./ContractsSource";
import { FulcrumProviderEvents } from "./events/FulcrumProviderEvents";
import { LendTransactionMinedEvent } from "./events/LendTransactionMinedEvent";
import { ProviderChangedEvent } from "./events/ProviderChangedEvent";
import { TasksQueueEvents } from "./events/TasksQueueEvents";
import { TradeTransactionMinedEvent } from "./events/TradeTransactionMinedEvent";
import { TasksQueue } from "./TasksQueue";

import configProviders from "../config/providers.json";

export class FulcrumProvider {
  private static readonly priceGraphQueryFunction = new Map<Asset, string>([
    [Asset.ETH, "kyber-eth-dai"],
    [Asset.wBTC, "kyber-wbtc-dai"],
    [Asset.MKR, "kyber-mkr-dai"],
    [Asset.ZRX, "kyber-zrx-dai"],
    [Asset.BAT, "kyber-bat-dai"],
    [Asset.REP, "kyber-rep-dai"],
    [Asset.KNC, "kyber-knc-dai"]
  ]);

  public static Instance: FulcrumProvider;

  private readonly gasLimit = 3000000;
  // gasPrice equal to 6 gwei
  private readonly gasPrice = new BigNumber(6).multipliedBy(10 ** 9);
  // gasBufferCoeff equal 110% gas reserve
  private readonly gasBufferCoeff = new BigNumber("1.1");

  private static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
    .pow(256)
    .minus(1);

  private isProcessing: boolean = false;
  private isChecking: boolean = false;

  public readonly eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public web3: AlchemyWeb3 | null = null;
  public web3ProviderSettings: IWeb3ProviderSettings | null = null;
  public contractsSource: ContractsSource | null = null;

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(1000);
    TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued);

    // setting up readonly provider
    Web3ConnectionFactory.getWeb3Connection(null).then((web3) => {
      FulcrumProvider.getWeb3ProviderSettings(web3).then((web3ProviderSettings) => {
        if (web3 && web3ProviderSettings) {
          const contractsSource = new ContractsSource(web3.givenProvider, web3ProviderSettings.networkId, false);
          contractsSource.Init().then(() => {
            this.web3 = web3;
            this.web3ProviderSettings = web3ProviderSettings;
            this.contractsSource = contractsSource;
            this.eventEmitter.emit(FulcrumProviderEvents.ProviderAvailable);
          });
        }
      });
    });

    // singleton
    if (!FulcrumProvider.Instance) {
      FulcrumProvider.Instance = this;
    }

    return FulcrumProvider.Instance;
  }

  public async setWeb3Provider(providerType: ProviderType) {
    this.web3 = await Web3ConnectionFactory.getWeb3Connection(providerType);

    if (this.web3) {
      const networkId = await this.web3.eth.net.getId();
      if (networkId === 3) { // ropsten only
        this.providerType = providerType;
      } else {
        this.web3 = null;
        this.providerType = ProviderType.None;
      }
    } else {
      this.providerType = ProviderType.None;
    }

    this.web3ProviderSettings = await FulcrumProvider.getWeb3ProviderSettings(this.web3);

    if (this.web3) {
      const networkId = await this.web3.eth.net.getId();
      if (networkId !== 3) {
        //
      }
    }

    this.contractsSource =
      this.web3 && this.web3ProviderSettings
        ? new ContractsSource(this.web3.givenProvider, this.web3ProviderSettings.networkId, this.providerType !== ProviderType.None)
        : null;
    if (this.contractsSource) {
      await this.contractsSource.Init();
    }

    if (this.web3) {
      // MetaMask-only code
      if (this.providerType === ProviderType.MetaMask) {
        // @ts-ignore
        this.web3.givenProvider.publicConfigStore.on("update", result =>
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

  public getLendTokenInterestRate = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);
    if (this.contractsSource) {
      const assetContract = this.contractsSource.getITokenContract(asset);
      if (assetContract) {
        result = await assetContract.supplyInterestRate.callAsync();
        result = result.dividedBy(10 ** 18);
      }
    }

    return result;
  };

  public getPriceDataPoints = async (selectedKey: TradeTokenKey): Promise<IPriceDataPoint[]> => {
    let priceDataObj: IPriceDataPoint[] = [];
    // localStorage.removeItem(`priceData${selectedKey.asset}`);

    if (this.web3) {
      let queriedBlocks = 0;
      const currentBlock = await this.web3.eth.getBlockNumber();
      const earliestBlock = currentBlock-17280; // ~5760 blocks per day
      let fetchFromBlock = earliestBlock;
      const nearestHour = new Date().setMinutes(0,0,0)/1000;
  
      const priceData = localStorage.getItem(`priceData${selectedKey.asset}`);
      if (priceData) {
        // console.log(`priceData`,priceData);
        priceDataObj = JSON.parse(priceData);
        if (priceDataObj.length > 0) {
          // console.log(`priceDataObj`,priceDataObj);
          const lastItem = priceDataObj[priceDataObj.length-1];
          // console.log(`lastItem`,lastItem);
          // console.log(`nearestHour`,nearestHour);
          if (lastItem && lastItem.timeStamp) {
            // console.log(`lastItem.timeStamp`,lastItem.timeStamp);
            if (lastItem.timeStamp < nearestHour) {
              fetchFromBlock = currentBlock - (nearestHour-lastItem.timeStamp)/15 - 240; // ~240 blocks per hour; 15 second blocks
            } else {
              fetchFromBlock = currentBlock;
            }
          }
        }
      }

      fetchFromBlock = Math.max(fetchFromBlock, earliestBlock);
      if (fetchFromBlock < currentBlock) {
        let jsonData: any = {};
        // const functionName = `${this.web3ProviderSettings.networkName}-${FulcrumProvider.priceGraphQueryFunction.get(selectedKey.asset)}`;
        const functionName = `mainnet-${FulcrumProvider.priceGraphQueryFunction.get(selectedKey.asset)}`;
        const url = `https://api.covalenthq.com/v1/function/${functionName}/?aggregate[Avg]&group_by[block_signed_at__hour]&starting-block=${fetchFromBlock}&key=${configProviders.Covalent_ApiKey}`;
        try {
          const response = await fetch(url);
          jsonData = await response.json();

          queriedBlocks = currentBlock-fetchFromBlock;
          // console.log(jsonData);
        } catch (error) {
          // tslint:disable-next-line
          console.log(error);
        }

        if (jsonData && jsonData.data) {
          const dataArray = jsonData.data;
          dataArray.map((value: any) => {
            if (value && value.block_signed_at__hour && value.avg_value_0) {
              priceDataObj.push({
                timeStamp: Math.round(new Date(value.block_signed_at__hour).getTime() / 1000),
                price: Math.round(value.avg_value_0) / (10 ** 18),
                liquidationPrice: 0,
                change24h: 0
              });
            }
          });
          // console.log(result);

          // remove duplicates
          priceDataObj = priceDataObj
            .map(e => e.timeStamp)
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter((e, index) => priceDataObj[index]).map((e, i) => priceDataObj[i]);

          // add nearestHour is not yet available from API
          if (priceData && priceDataObj[priceDataObj.length-1].timeStamp !== nearestHour) {
            priceDataObj.push({
              timeStamp: nearestHour,
              price: priceDataObj[priceDataObj.length-1].price,
              liquidationPrice: 0,
              change24h: 0
            });
          }

          // keep no more than 72
          if (priceDataObj.length > 72) {
            priceDataObj = priceDataObj.splice(-72);
          }

          // console.log(priceDataObj.length);
          localStorage.setItem(`priceData${selectedKey.asset}`, JSON.stringify(priceDataObj));
        }
      }

      // console.log(`queriedBlocks`, queriedBlocks);
    } else {
      // getting empty data
      const samplesCount = 72;
      const intervalSeconds = 3600;

      const beginningTime = moment()
        .startOf("hour")
        .subtract(intervalSeconds, "second");
      for (let i = 0; i < samplesCount; i++) {
        priceDataObj.push({ timeStamp: beginningTime.unix(), price: 1, liquidationPrice: 0, change24h: 0 });

        // add mutates beginningTime
        beginningTime.add(intervalSeconds, "second");
      }
    }
    // console.log(priceDataObj);

    return priceDataObj;
  };

  public getChartLatestDataPoint = async (selectedKey: TradeTokenKey): Promise<IPriceDataPoint> => {
    const latestSwapPrice = await this.getSwapToUsdPrice(selectedKey.asset);
    const priceLatestDataPoint = await this.getPriceLatestDataPoint(selectedKey);
    priceLatestDataPoint.liquidationPrice = latestSwapPrice
      .multipliedBy(priceLatestDataPoint.liquidationPrice)
      .div(priceLatestDataPoint.price)
      .toNumber();
    priceLatestDataPoint.price = latestSwapPrice.toNumber();
    
    return priceLatestDataPoint;
  };

  public getPriceLatestDataPoint = async (selectedKey: TradeTokenKey): Promise<IPriceDataPoint> => {
    const result = this.getPriceDefaultDataPoint();
    // we are using this function only for trade prices
    if (this.contractsSource) {
      const assetContract = this.contractsSource.getPTokenContract(selectedKey);
      if (assetContract) {
        const tokenPrice = await assetContract.tokenPrice.callAsync();
        const liquidationPrice = await assetContract.liquidationPrice.callAsync();
        const swapPrice = await this.getSwapToUsdPrice(selectedKey.loanAsset);

        const timeStamp = moment();
        result.timeStamp = timeStamp.unix();
        result.price = tokenPrice.multipliedBy(swapPrice).dividedBy(10 ** 18).toNumber();
        result.liquidationPrice = liquidationPrice.multipliedBy(swapPrice).dividedBy(10 ** 18).toNumber();
        result.change24h = 0;
      }
    }

    return result;
  };

  public getPriceDefaultDataPoint = (): IPriceDataPoint => {
    return {
      timeStamp: moment().unix(),
      price: 0,
      liquidationPrice: 0,
      change24h: 0
    };
  };

  public getReserveDetails = async (asset: Asset): Promise<ReserveDetails | null> => {
    let result: ReserveDetails | null = null;

    if (this.contractsSource) {
      const assetContract = this.contractsSource.getITokenContract(asset);
      if (assetContract) {

        let symbol: string = "";
        let name: string = "";
        //let tokenPrice: BigNumber | null;
        let marketLiquidity: BigNumber | null;
        let liquidityReserved: BigNumber | null;
        let totalAssetSupply: BigNumber | null;
        let totalAssetBorrow: BigNumber | null;
        let supplyInterestRate: BigNumber | null;
        let borrowInterestRate: BigNumber | null;
        let nextInterestRate: BigNumber | null;

        await Promise.all([
          (symbol = await assetContract.symbol.callAsync()),
          //(name = await assetContract.name.callAsync()),
          //(tokenPrice = await assetContract.tokenPrice.callAsync()),
          (marketLiquidity = await assetContract.marketLiquidity.callAsync()),
          (liquidityReserved = await assetContract.totalReservedSupply.callAsync()),
          (totalAssetSupply = await assetContract.totalAssetSupply.callAsync()),
          (totalAssetBorrow = await assetContract.totalAssetBorrow.callAsync()),
          (supplyInterestRate = await assetContract.supplyInterestRate.callAsync()),
          (borrowInterestRate = await assetContract.borrowInterestRate.callAsync()),
          (nextInterestRate = await assetContract.nextLoanInterestRate.callAsync(new BigNumber("0")))
        ]);

        result = new ReserveDetails(
          assetContract.address,
          symbol,
          name,
          null,//tokenPrice.dividedBy(10 ** 18),
          marketLiquidity.dividedBy(10 ** 18),
          liquidityReserved.dividedBy(10 ** 18),
          totalAssetSupply.dividedBy(10 ** 18),
          totalAssetBorrow.dividedBy(10 ** 18),
          supplyInterestRate.dividedBy(10 ** 18),
          borrowInterestRate.dividedBy(10 ** 18),
          nextInterestRate.dividedBy(10 ** 18)
        );
      }
    }

    return result;
  };

  public getLendProfit = async (asset: Asset): Promise<BigNumber | null> => {
    // should return null if no data (not traded asset), new BigNumber(0) if no profit
    let result: BigNumber | null = null;
    let account: string | null = null;

    if (this.web3 && this.contractsSource && this.contractsSource.canWrite) {
      const accounts = await this.web3.eth.getAccounts();
      account = accounts ? accounts[0].toLowerCase() : null;
    }

    if (account && this.contractsSource && this.contractsSource.canWrite) {
      const balance = await this.getLendTokenBalance(asset);
      if (balance.gt(0)) {
        result = new BigNumber(0);
        const assetContract = this.contractsSource.getITokenContract(asset);
        if (assetContract) {
          const swapPrice = await this.getSwapToUsdPrice(asset);
          const tokenPrice = await assetContract.tokenPrice.callAsync();
          const checkpointPrice = await assetContract.checkpointPrice.callAsync(account);
          result = tokenPrice
            .minus(checkpointPrice)
            .multipliedBy(balance)
            .multipliedBy(swapPrice)
            .dividedBy(10 ** 36);
        }
      }
    }

    return result;
  };

  public getTradeProfit = async (selectedKey: TradeTokenKey): Promise<BigNumber | null> => {
    // should return null if no data (not traded asset), new BigNumber(0) if no profit
    let result: BigNumber | null = null;
    let account: string | null = null;

    if (this.web3 && this.contractsSource && this.contractsSource.canWrite) {
      const accounts = await this.web3.eth.getAccounts();
      account = accounts ? accounts[0].toLowerCase() : null;
    }

    if (account && this.contractsSource && this.contractsSource.canWrite) {
      const balance = await this.getTradeTokenBalance(selectedKey);
      if (balance.gt(0)) {
        result = new BigNumber(0);
        const assetContract = this.contractsSource.getPTokenContract(selectedKey);
        if (assetContract) {
          const swapPrice = await this.getSwapToUsdPrice(selectedKey.loanAsset);
          const tokenPrice = await assetContract.tokenPrice.callAsync();
          const checkpointPrice = await assetContract.checkpointPrice.callAsync(account);
          result = tokenPrice
            .minus(checkpointPrice)
            .multipliedBy(balance)
            .multipliedBy(swapPrice)
            .dividedBy(10 ** 36);
        }
      }
    }

    return result;
  };

  public getMaxTradeValue = async (tradeType: TradeType, selectedKey: TradeTokenKey, collateral: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);

    const balance =
      tradeType === TradeType.BUY
        ? await this.getBaseTokenBalance(collateral)
        : await this.getTradeTokenBalance(selectedKey);

    if (tradeType === TradeType.BUY) {
      if (this.contractsSource) {
        const assetContract = this.contractsSource.getPTokenContract(selectedKey);
        if (assetContract) {
          let marketLiquidity = await assetContract.marketLiquidityForAsset.callAsync();

          if (collateral !== selectedKey.loanAsset) {
            const swapPrice = await this.getSwapPrice(selectedKey.loanAsset, collateral);
            marketLiquidity = marketLiquidity.multipliedBy(swapPrice);
          }

          result = BigNumber.min(marketLiquidity, balance);
        } else {
          result = new BigNumber(0);
        }
      }
    } else {
      result = balance;
    }

    result = result.dividedBy(10 ** 18);

    return result;
  };

  public getMaxLendValue = async (request: LendRequest): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (request.lendType === LendType.LEND) {
      result = await this.getBaseTokenBalance(request.asset);
    } else {
      if (this.contractsSource) {
        const assetContract = this.contractsSource.getITokenContract(request.asset);
        if (assetContract) {
          const tokenPrice = await assetContract.tokenPrice.callAsync();
          const amount = await this.getLendTokenBalance(request.asset);
          result = amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);
        }
      }
    }

    result = result.dividedBy(10 ** 18);

    return result;
  };

  public getTradedAmountEstimate = async (request: TradeRequest): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const key = new TradeTokenKey(
        request.asset,
        request.positionType,
        request.leverage
      );
      const assetContract = this.contractsSource.getPTokenContract(key);
      if (assetContract) {
        const tokenPrice = await assetContract.tokenPrice.callAsync();
        let amount = request.amount;

        if (request.collateral !== key.loanAsset) {
          const swapPrice = await this.getSwapPrice(request.collateral, key.loanAsset);
          amount = request.tradeType === TradeType.BUY
            ? amount.multipliedBy(swapPrice)
            : amount.dividedBy(swapPrice);
        }

        result =
          request.tradeType === TradeType.BUY
            ? amount.multipliedBy(10 ** 18).dividedBy(tokenPrice)
            : amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);
      }
    }

    return result;
  };

  public getLendedAmountEstimate = async (request: LendRequest): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const assetContract = this.contractsSource.getITokenContract(request.asset);
      if (assetContract) {
        const tokenPrice = await assetContract.tokenPrice.callAsync();

        result =
          request.lendType === LendType.LEND
            ? request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice)
            : request.amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);
      }
    }

    return result;
  };

  public static async getWeb3ProviderSettings(web3: AlchemyWeb3 | null): Promise<IWeb3ProviderSettings | null> {
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

    return null;
  }

  public async getBaseTokenBalance(asset: Asset): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);
    if (asset === Asset.UNKNOWN) {
      // always 0
      result = new BigNumber(0);
    } else if (asset === Asset.ETH) {
      // get eth (wallet) balance
      result = await this.getEthBalance()
    } else {
      // get erc20 token balance
      const assetErc20Address = this.getErc20Address(asset);
      if (assetErc20Address) {
        result = await this.getErc20Balance(assetErc20Address);
      }
    }

    return result;
  }

  public async getLendTokenBalance(asset: Asset): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const address = await this.contractsSource.getITokenErc20Address(asset);
      if (address) {
        result = await this.getErc20Balance(address);
      }
    }

    return result;
  }

  public async getTradeTokenBalance(selectedKey: TradeTokenKey): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const address = await this.contractsSource.getPTokenErc20Address(selectedKey);
      if (address) {
        result = await this.getErc20Balance(address);
      }
    }

    return result;
  }

  public getPTokensAvailable(): TradeTokenKey[] {
    return this.contractsSource
        ? this.contractsSource.getPTokensAvailable()
        : [];
  }

  public getPTokenErc20Address(key: TradeTokenKey): string | null {
    return this.contractsSource
      ? this.contractsSource.getPTokenErc20Address(key)
      : null;
  }

  private getErc20Address(asset: Asset): string | null {
    let result: string | null = null;

    const assetDetails = AssetsDictionary.assets.get(asset);
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || "";
    }
    return result;
  }

  private async getEthBalance(): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);

    if (this.web3 && this.contractsSource && this.contractsSource.canWrite) {
      const accounts = await this.web3.eth.getAccounts();
      const account = accounts ? accounts[0].toLowerCase() : null;
      if (account) {
        const balance = await this.web3.eth.getBalance(account);
        result = new BigNumber(balance);
      }
    }

    return result;
  }

  private async getErc20Balance(addressErc20: string): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.web3 && this.contractsSource && this.contractsSource.canWrite) {
      const accounts = await this.web3.eth.getAccounts();
      const account = accounts ? accounts[0].toLowerCase() : null;

      if (account) {
        const tokenContract = await this.contractsSource.getErc20Contract(addressErc20);
        if (tokenContract) {
          result = await tokenContract.balanceOf.callAsync(account);
        }
      }
    }

    return result;
  }

  private async getSwapToUsdPrice(asset: Asset): Promise<BigNumber> {
    return this.getSwapPrice(
      asset,
      Asset.DAI
    );
  }

  private async getSwapPrice(srcAsset: Asset, destAsset: Asset): Promise<BigNumber> {
    if (srcAsset === destAsset) {
      return new BigNumber(1);
    }
    
    let result: BigNumber = new BigNumber(0);
    const srcAssetErc20Address = this.getErc20Address(srcAsset);
    const destAssetErc20Address = this.getErc20Address(destAsset);
    if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
      const referencePriceFeedContract = this.contractsSource.getReferencePriceFeedContract();
      const swapPriceData: BigNumber[] = await referencePriceFeedContract.getSwapPrice.callAsync(
        srcAssetErc20Address,
        destAssetErc20Address,
        new BigNumber(10 ** 18)
      );
      result = swapPriceData[0].dividedBy(10 ** 18);
    }
    return result;
  }

  private onTaskEnqueued = async (requestTask: RequestTask) => {
    await this.processQueue(false, false);
  };

  public onTaskRetry = async (requestTask: RequestTask, skipGas: boolean) => {
    await this.processQueue(true, skipGas);
  };

  public onTaskCancel = async (requestTask: RequestTask)  => {
    await this.cancelRequestTask(requestTask);
    await this.processQueue(false, false);
  };

  private cancelRequestTask = async (requestTask: RequestTask) => {
    if (!(this.isProcessing || this.isChecking)) {
      this.isProcessing = true;

      try {
        const task = TasksQueue.Instance.peek();

        if (task) {
          if (task.request.id === requestTask.request.id) {
            TasksQueue.Instance.dequeue();
          }
        }
      } finally {
        this.isProcessing = false;
      }
    }
  };

  private processQueue = async (force: boolean, skipGas: boolean) => {
    if (!(this.isProcessing || this.isChecking)) {
      let forceOnce = force;
      do {
        this.isProcessing = true;
        this.isChecking = false;

        try {
          const task = TasksQueue.Instance.peek();

          if (task) {
            if (task.status === RequestStatus.FAILED_SKIPGAS) {
              task.status = RequestStatus.FAILED;
            }
            if (task.status === RequestStatus.AWAITING || (task.status === RequestStatus.FAILED && forceOnce)) {
              await this.processRequestTask(task, skipGas);
              // @ts-ignore
              if (task.status === RequestStatus.DONE) {
                TasksQueue.Instance.dequeue();
              }
            } else {
              if (task.status === RequestStatus.FAILED && !forceOnce) {
                this.isProcessing = false;
                this.isChecking = false;
                break;
              }
            }
          }
        } finally {
          forceOnce = false;
          this.isChecking = true;
          this.isProcessing = false;
        }
      } while (TasksQueue.Instance.any());
      this.isChecking = false;
    }
  };

  private processRequestTask = async (task: RequestTask, skipGas: boolean) => {
    if (task.request instanceof LendRequest) {
      await this.processLendRequestTask(task, skipGas);
    }

    if (task.request instanceof TradeRequest) {
      await this.processTradeRequestTask(task, skipGas);
    }

    return false;
  };

  private processLendRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      if (!(this.web3 && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error("No provider available!");
      }

      const accounts = await this.web3.eth.getAccounts();
      const account = accounts ? accounts[0].toLowerCase() : null;
      if (!account) {
        throw new Error("Unable to get wallet address!");
      }

      // Initializing loan
      const taskRequest: LendRequest = (task.request as LendRequest);
      const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** 18).toFixed(0, 1));
      const tokenContract: iTokenContract | null = await this.contractsSource.getITokenContract(taskRequest.asset);
      if (!tokenContract) {
        throw new Error("No iToken contract available!");
      }

      if (taskRequest.lendType === LendType.LEND) {
        if (taskRequest.asset !== Asset.ETH) {
          task.processingStart([
            "Initializing loan",
            "Detecting token allowance",
            "Prompting token allowance",
            "Waiting for token allowance",
            "Submitting loan"
          ]);

          // init erc20 contract for base token
          let tokenErc20Contract: erc20Contract | null = null;
          const assetErc20Address = this.getErc20Address(taskRequest.asset);
          if (assetErc20Address) {
            tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address);
          }

          if (!tokenErc20Contract) {
            throw new Error("No ERC20 contract available!");
          }
          task.processingStepNext();

          // Detecting token allowance
          let approvePromise: Promise<string> | null = null;
          const erc20allowance = await tokenErc20Contract.allowance.callAsync(account, tokenContract.address);
          task.processingStepNext();

          // Prompting token allowance
          if (amountInBaseUnits.gt(erc20allowance)) {
            approvePromise = tokenErc20Contract.approve.sendTransactionAsync(tokenContract.address, FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS, { from: account });
          }
          task.processingStepNext();
          task.processingStepNext();

          let gasAmountBN;
          
          // Waiting for token allowance
          if (approvePromise || skipGas) {
            await approvePromise;
            gasAmountBN = new BigNumber(2300000);
          } else {
            // estimating gas amount
            const gasAmount = await tokenContract.mint.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: this.gasLimit });
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          }

          // Submitting loan
          const txHash = await tokenContract.mint.sendTransactionAsync(account, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash, task.request);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        } else {
          task.processingStart([
            "Initializing loan",
            "Submitting loan"
          ]);

          // no additional inits or checks
          task.processingStepNext();

          let gasAmountBN;
          
          // Waiting for token allowance
          if (skipGas) {
            gasAmountBN = new BigNumber(2300000);
          } else {
            // estimating gas amount
            const gasAmount = await tokenContract.mintWithEther.estimateGasAsync(account, { from: account, value: amountInBaseUnits, gas: this.gasLimit });
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          }

          const gasCost = gasAmountBN.multipliedBy(this.gasPrice).integerValue(BigNumber.ROUND_UP);
          // Submitting loan
          const txHash = await tokenContract.mintWithEther.sendTransactionAsync(account, { from: account, value: amountInBaseUnits.minus(gasCost), gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash, task.request);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        }
      } else {
        task.processingStart([
          "Initializing loan",
          "Closing loan"
        ]);

        // no additional inits or checks
        task.processingStepNext();

        let gasAmountBN;
        if (taskRequest.asset !== Asset.ETH) {
          // Waiting for token allowance
          if (skipGas) {
            gasAmountBN = new BigNumber(2300000);
          } else {
            // estimating gas amount
            const gasAmount = await tokenContract.burn.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: this.gasLimit });
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          }

          // Submitting unloan
          const txHash = await tokenContract.burn.sendTransactionAsync(account, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash, task.request);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        } else {
          // Waiting for token allowance
          if (skipGas) {
            gasAmountBN = new BigNumber(2300000);
          } else {
            // estimating gas amount
            const gasAmount = await tokenContract.burnToEther.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: this.gasLimit });
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          }
          
          // Submitting unloan
          const txHash = await tokenContract.burnToEther.sendTransactionAsync(account, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash, task.request);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        }
      }

      task.processingEnd(true, false, null);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
      task.processingEnd(false, false, e);
    }
  };

  private processTradeRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      if (!(this.web3 && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error("No provider available!");
      }

      const accounts = await this.web3.eth.getAccounts();
      const account = accounts ? accounts[0].toLowerCase() : null;
      if (!account) {
        throw new Error("Unable to get wallet address!");
      }

      // Initializing loan
      const taskRequest: TradeRequest = (task.request as TradeRequest);
      const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** 18).toFixed(0, 1));
      const tokenContract: pTokenContract | null =
        await this.contractsSource.getPTokenContract(
          new TradeTokenKey(taskRequest.asset,
            taskRequest.positionType,
            taskRequest.leverage
          )
        );
      if (!tokenContract) {
        throw new Error("No pToken contract available!");
      }

      if (taskRequest.tradeType === TradeType.BUY) {
        if (taskRequest.collateral !== Asset.ETH) {
          task.processingStart([
            "Initializing trade",
            "Detecting token allowance",
            "Prompting token allowance",
            "Waiting for token allowance",
            "Submitting trade"
          ]);

          // init erc20 contract for base token
          let tokenErc20Contract: erc20Contract | null = null;
          const assetErc20Address = this.getErc20Address(taskRequest.collateral);
          if (assetErc20Address) {
            tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address);
          } else {
            throw new Error("No ERC20 contract available!");
          }

          if (!tokenErc20Contract) {
            throw new Error("No ERC20 contract available!");
          }
          task.processingStepNext();

          // Detecting token allowance
          let approvePromise: Promise<string> | null = null;
          const erc20allowance = await tokenErc20Contract.allowance.callAsync(account, tokenContract.address);
          task.processingStepNext();

          // Prompting token allowance
          if (amountInBaseUnits.gt(erc20allowance)) {
            approvePromise = tokenErc20Contract.approve.sendTransactionAsync(tokenContract.address, FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS, { from: account });
          }
          task.processingStepNext();
          task.processingStepNext();

          let gasAmountBN;

          // Waiting for token allowance
          if (approvePromise || skipGas) {
            await approvePromise;
            gasAmountBN = new BigNumber(2300000);
          } else {
            // estimating gas amount
            const gasAmount = await tokenContract.mintWithToken.estimateGasAsync(account, assetErc20Address, amountInBaseUnits, { from: account, gas: this.gasLimit });
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          }

          // Submitting trade
          const txHash = await tokenContract.mintWithToken.sendTransactionAsync(account, assetErc20Address, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash, task.request);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        } else {
          task.processingStart([
            "Initializing trade",
            "Submitting trade"
          ]);

          // no additional inits or checks
          task.processingStepNext();

          let gasAmountBN;

          // Waiting for token allowance
          if (skipGas) {
            gasAmountBN = new BigNumber(2300000);
          } else {
            // estimating gas amount
            const gasAmount = await tokenContract.mintWithEther.estimateGasAsync(account, { from: account, value: amountInBaseUnits, gas: this.gasLimit });
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          }

          const gasCost = gasAmountBN.multipliedBy(this.gasPrice).integerValue(BigNumber.ROUND_UP);
          // Submitting trade
          const txHash = await tokenContract.mintWithEther.sendTransactionAsync(account, { from: account, value: amountInBaseUnits.minus(gasCost), gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash, task.request);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        }
      } else {
        task.processingStart([
          "Initializing trade",
          "Closing trade"
        ]);

        // no additional inits or checks
        task.processingStepNext();

        let gasAmountBN;
        if (taskRequest.collateral !== Asset.ETH) {
          // Submitting unloan
          const assetErc20Address = this.getErc20Address(taskRequest.collateral);
          if (assetErc20Address) {
            // Waiting for token allowance
            if (skipGas) {
              gasAmountBN = new BigNumber(2300000);
            } else {
              // estimating gas amount
              const gasAmount = await tokenContract.burnToToken.estimateGasAsync(
                account,
                assetErc20Address,
                amountInBaseUnits,
                { from: account, gas: this.gasLimit }
              );
              gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
            }
            
            // Closing trade
            const txHash = await tokenContract.burnToToken.sendTransactionAsync(
              account,
              assetErc20Address,
              amountInBaseUnits,
              { from: account, gas: gasAmountBN }
            );
            task.setTxHash(txHash);
            const txReceipt = await this.waitForTransactionMined(txHash, task.request);
            if (!txReceipt.status) {
              throw new Error("Reverted by EVM");
            }
          }
        } else {
          if (skipGas) {
            gasAmountBN = new BigNumber(2300000);
          } else {
            // estimating gas amount
            const gasAmount = await tokenContract.burnToEther.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: this.gasLimit });
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          }

          // Closing trade
          const txHash = await tokenContract.burnToEther.sendTransactionAsync(account, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash, task.request);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        }
      }

      task.processingEnd(true, false, null);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
      task.processingEnd(false, false, e);
    }
  };

  private waitForTransactionMined = async (
    txHash: string, 
    request: LendRequest | TradeRequest): Promise<any> => {

    return new Promise((resolve, reject) => {
      try {
        if (!this.web3) {
          throw new Error("web3 is not available");
        }

        this.waitForTransactionMinedRecursive(txHash, this.web3, request, resolve, reject);
      } catch (e) {
        throw e;
      }
    });
  };

  private waitForTransactionMinedRecursive = async (
    txHash: string,
    web3: AlchemyWeb3,
    request: LendRequest | TradeRequest,
    resolve: (value: any) => void,
    reject: (value: any) => void) => {

    try {
      web3.eth.getTransactionReceipt(txHash, (error: Error, receipt: any) => {
        if (error) {
          throw error;
        }

        if (receipt) {
          resolve(receipt);
          if (request instanceof LendRequest) {
            this.eventEmitter.emit(
              FulcrumProviderEvents.LendTransactionMined,
              new LendTransactionMinedEvent(request.asset, txHash)
            );
          } else {
            this.eventEmitter.emit(
              FulcrumProviderEvents.TradeTransactionMined,
              new TradeTransactionMinedEvent(new TradeTokenKey(
                request.asset,
                request.positionType,
                request.leverage
              ), txHash)
            );
          }
        } else {
          window.setTimeout(() => {
            this.waitForTransactionMinedRecursive(txHash, web3, request, resolve, reject);
          }, 5000);
        }
      });
    }
    catch (e) {
      reject(e);
    }
  };

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// tslint:disable-next-line
new FulcrumProvider();
