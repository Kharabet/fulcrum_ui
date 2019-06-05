import { Web3ProviderEngine } from "@0x/subproviders";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from '@0x/web3-wrapper';
import { EventEmitter } from "events";
import moment from "moment";
import fetch from "node-fetch";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { PositionType } from "../domain/PositionType";
import { ProviderType } from "../domain/ProviderType";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { ReserveDetails } from "../domain/ReserveDetails";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { ContractsSource } from "./ContractsSource";
import { FulcrumProviderEvents } from "./events/FulcrumProviderEvents";
import { LendTransactionMinedEvent } from "./events/LendTransactionMinedEvent";
import { TasksQueueEvents } from "./events/TasksQueueEvents";
import { TradeTransactionMinedEvent } from "./events/TradeTransactionMinedEvent";
import { TasksQueue } from "./TasksQueue";

import configProviders from "../config/providers.json";
import { LendErcProcessor } from "./processors/LendErcProcessor";
import { LendEthProcessor } from "./processors/LendEthProcessor";
import { TradeBuyErcProcessor } from "./processors/TradeBuyErcProcessor";
import { TradeBuyEthProcessor } from "./processors/TradeBuyEthProcessor";
import { TradeSellErcProcessor } from "./processors/TradeSellErcProcessor";
import { TradeSellEthProcessor } from "./processors/TradeSellEthProcessor";
import { UnlendErcProcessor } from "./processors/UnlendErcProcessor";
import { UnlendEthProcessor } from "./processors/UnlendEthProcessor";

export class FulcrumProvider {
  private static readonly priceGraphQueryFunction = new Map<Asset, string>([
    [Asset.ETH, "kyber-eth-dai"],
    [Asset.WBTC, "kyber-wbtc-dai"],
    [Asset.MKR, "kyber-mkr-dai"],
    [Asset.ZRX, "kyber-zrx-dai"],
    [Asset.BAT, "kyber-bat-dai"],
    [Asset.REP, "kyber-rep-dai"],
    [Asset.KNC, "kyber-knc-dai"]
  ]);

  public static Instance: FulcrumProvider;

  public readonly gasLimit = "3000000";
  // gasPrice equal to 6 gwei
  public readonly gasPrice = new BigNumber(8).multipliedBy(10 ** 9);
  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber("1.1");
  // 5000ms
  public readonly successDisplayTimeout = 5000;

  public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
    .pow(256)
    .minus(1);

  private isProcessing: boolean = false;
  private isChecking: boolean = false;

  public readonly eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public providerEngine: Web3ProviderEngine | null = null;
  public web3Wrapper: Web3Wrapper | null = null;
  public web3ProviderSettings: IWeb3ProviderSettings | null = null;
  public contractsSource: ContractsSource | null = null;
  public accounts: string[] = [];
  public isLoading: boolean = false;
  public unsupportedNetwork: boolean = false;

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(1000);
    TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued);

    // setting up readonly provider
    Web3ConnectionFactory.getWeb3Provider(null, this.eventEmitter).then((providerData) => {
      // @ts-ignore
      const web3Wrapper = providerData[0];
      FulcrumProvider.getWeb3ProviderSettings(providerData[3]).then((web3ProviderSettings) => {
        if (web3Wrapper && web3ProviderSettings) {
          const contractsSource = new ContractsSource(providerData[1], web3ProviderSettings.networkId, providerData[2]);
          contractsSource.Init().then(() => {
            this.web3Wrapper = web3Wrapper;
            this.providerEngine = providerData[1];
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
    this.unsupportedNetwork = false;
    await this.setWeb3ProviderFinalize(providerType, await Web3ConnectionFactory.getWeb3Provider(providerType, this.eventEmitter));
  }

  public async setWeb3ProviderFinalize(providerType: ProviderType, providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number]) {
    this.web3Wrapper = providerData[0];
    this.providerEngine = providerData[1];
    let canWrite = providerData[2];
    let networkId = providerData[3];

    this.web3ProviderSettings = await FulcrumProvider.getWeb3ProviderSettings(networkId);
    if (this.web3Wrapper) {
      if (this.web3ProviderSettings.networkName !== process.env.REACT_APP_ETH_NETWORK) {
        // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)

        this.unsupportedNetwork = true;
        canWrite = false; // revert back to read-only
        networkId = await this.web3Wrapper.getNetworkIdAsync();
        this.web3ProviderSettings = await FulcrumProvider.getWeb3ProviderSettings(networkId);
      }
    }

    if (this.web3Wrapper && canWrite) {
      this.accounts = await this.web3Wrapper.getAvailableAddressesAsync();
    } else {
      // this.accounts = [];
      if (providerType === ProviderType.Bitski) {
        this.unsupportedNetwork = true;
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      this.contractsSource = await new ContractsSource(this.providerEngine, this.web3ProviderSettings.networkId, canWrite);
      this.providerType = providerType;
    } else {
      this.contractsSource = null;
      // this.providerType = ProviderType.None;
    }

    if (this.contractsSource) {
      await this.contractsSource.Init();
    }
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

  public onManageCollateralConfirmed = async (request: ManageCollateralRequest) => {
    if (request) {
      // console.dir(request);
    }
  };

  public getLendTokenInterestRate = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);
    if (this.contractsSource) {
      const assetContract = await this.contractsSource.getITokenContract(asset);
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

    if (this.web3Wrapper) {
      let queriedBlocks = 0;
      const currentBlock = await this.web3Wrapper.getBlockNumberAsync();
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

          // add nearestHour if not yet available from API
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
    try {
      const swapPrice = await this.getSwapToUsdRate(selectedKey.asset);
      const priceLatestDataPoint = await this.getPriceLatestDataPoint(selectedKey);
      priceLatestDataPoint.liquidationPrice = swapPrice
        .multipliedBy(priceLatestDataPoint.liquidationPrice)
        .div(priceLatestDataPoint.price)
        .toNumber();
      priceLatestDataPoint.price = swapPrice.toNumber();
      return priceLatestDataPoint;
    } catch(e) {
      return this.getPriceDefaultDataPoint();
    }
  };

  public getPriceLatestDataPoint = async (selectedKey: TradeTokenKey): Promise<IPriceDataPoint> => {
    const result = this.getPriceDefaultDataPoint();
    // we are using this function only for trade prices
    if (this.contractsSource) {
      const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
      if (assetContract) {
        const tokenPrice = await assetContract.tokenPrice.callAsync();
        const liquidationPrice = await assetContract.liquidationPrice.callAsync();
        const swapPrice = await this.getSwapToUsdRate(selectedKey.loanAsset);

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
      const assetContract = await this.contractsSource.getITokenContract(asset);
      if (assetContract) {

        let symbol: string = "";
        const name: string = "";
        // let tokenPrice: BigNumber | null;
        let marketLiquidity: BigNumber | null;
        let liquidityReserved: BigNumber | null;
        let totalAssetSupply: BigNumber | null;
        let totalAssetBorrow: BigNumber | null;
        let supplyInterestRate: BigNumber | null;
        // let borrowInterestRate: BigNumber | null;
        let nextInterestRate: BigNumber | null;

        await Promise.all([
          (symbol = await assetContract.symbol.callAsync()),
          // (name = await assetContract.name.callAsync()),
          // (tokenPrice = await assetContract.tokenPrice.callAsync()),
          (marketLiquidity = await assetContract.marketLiquidity.callAsync()),
          (liquidityReserved = await assetContract.totalReservedSupply.callAsync()),
          (totalAssetSupply = await assetContract.totalAssetSupply.callAsync()),
          (totalAssetBorrow = await assetContract.totalAssetBorrow.callAsync()),
          (supplyInterestRate = await assetContract.supplyInterestRate.callAsync()),
          // (borrowInterestRate = await assetContract.borrowInterestRate.callAsync()),
          (nextInterestRate = await assetContract.nextLoanInterestRate.callAsync(new BigNumber("100000")))
        ]);

        result = new ReserveDetails(
          assetContract.address,
          symbol,
          name,
          null,// tokenPrice.dividedBy(10 ** 18),
          marketLiquidity.dividedBy(10 ** 18),
          liquidityReserved.dividedBy(10 ** 18),
          totalAssetSupply.dividedBy(10 ** 18),
          totalAssetBorrow.dividedBy(10 ** 18),
          supplyInterestRate.dividedBy(10 ** 18),
          new BigNumber(1),// borrowInterestRate.dividedBy(10 ** 18),
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

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    }

    if (account && this.contractsSource && this.contractsSource.canWrite) {
      const balance = await this.getITokenBalanceOfUser(asset);
      if (balance.gt(0)) {
        result = new BigNumber(0);
        const assetContract = await this.contractsSource.getITokenContract(asset);
        if (assetContract) {
          const swapPrice = await this.getSwapToUsdRate(asset);
          const tokenPrice = await assetContract.tokenPrice.callAsync();
          const checkpointPrice = await assetContract.checkpointPrice.callAsync(account);

          result = tokenPrice
            .minus(checkpointPrice)
            .multipliedBy(balance)
            .multipliedBy(swapPrice)
            .dividedBy(10**36);
        }
      }
    }

    return result;
  };

  public getTradeProfit = async (selectedKey: TradeTokenKey): Promise<BigNumber | null> => {
    // should return null if no data (not traded asset), new BigNumber(0) if no profit
    let result: BigNumber | null = null;
    let account: string | null = null;

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    }

    if (account && this.contractsSource && this.contractsSource.canWrite) {
      const balance = await this.getPTokenBalanceOfUser(selectedKey);
      if (balance.gt(0)) {
        result = new BigNumber(0);
        const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
        if (assetContract) {
          const swapPrice = await this.getSwapToUsdRate(selectedKey.loanAsset);
          const tokenPrice = await assetContract.tokenPrice.callAsync();
          const checkpointPrice = await assetContract.checkpointPrice.callAsync(account);

          result = tokenPrice
            .minus(checkpointPrice)
            .multipliedBy(balance)
            .multipliedBy(swapPrice)
            .dividedBy(10**36);
        }
      }
    }

    return result;
  };

  public getMaxTradeValue = async (tradeType: TradeType, selectedKey: TradeTokenKey, collateral: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (tradeType === TradeType.BUY) {
      if (this.contractsSource) {
        const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
        if (assetContract) {
          const precision = AssetsDictionary.assets.get(selectedKey.loanAsset)!.decimals || 18;
          let marketLiquidity = await assetContract.marketLiquidityForAsset.callAsync();
          marketLiquidity = marketLiquidity.multipliedBy(10 ** (18 - precision));

          if (collateral !== selectedKey.loanAsset) {
            const swapPrice = await this.getSwapRate(selectedKey.loanAsset, collateral);
            marketLiquidity = marketLiquidity.multipliedBy(swapPrice);
          }

          const balance = await this.getAssetTokenBalanceOfUser(collateral);

          result = BigNumber.min(marketLiquidity, balance);

          if (collateral === Asset.ETH) {
            const gasBuffer = new BigNumber(5 * 10 ** 16); // 0.05 ETH
            result = result.gt(gasBuffer) ? result.minus(gasBuffer) : new BigNumber(0);
          }
        } else {
          result = new BigNumber(0);
        }
      }
    } else {
      result = await this.getPTokenBalanceOfUser(selectedKey);
    }

    result = result.dividedBy(10 ** 18);

    return result;
  };
  
  public getMaxLendValue = async (request: LendRequest): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (request.lendType === LendType.LEND) {
      result = await this.getAssetTokenBalanceOfUser(request.asset);
      if (request.asset === Asset.ETH) {
        const gasBuffer = new BigNumber(10 ** 16); // 0.01 ETH

        result = result.gt(gasBuffer) ? result.minus(gasBuffer) : new BigNumber(0);
      }
    } else {
      result = await this.getITokenBalanceOfUser(request.asset);
      /*if (this.contractsSource) {
        const assetContract = await this.contractsSource.getITokenContract(request.asset);
        if (assetContract) {
          const tokenPrice = await assetContract.tokenPrice.callAsync();
          const amount = await this.getITokenBalanceOfUser(request.asset);
          result = amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);
        }
      }*/
    }

    result = result.dividedBy(10 ** 18);

    return result;
  };

  public getTradedAmountEstimate = async (request: TradeRequest): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const key = new TradeTokenKey(
        request.asset,
        request.unitOfAccount,
        request.positionType,
        request.leverage,
        request.isTokenized
      );
      const assetContract = await this.contractsSource.getPTokenContract(key);
      if (assetContract) {
        const tokenPrice = await assetContract.tokenPrice.callAsync();
        // console.log(assetContract);
        let amount = request.amount;
        // console.log(amount.toString());
        if (request.tradeType === TradeType.SELL) {
          amount = amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);
        }
        // console.log(amount.toString());
        if (request.collateral !== key.loanAsset) {
          const swapPrice = await this.getSwapRate(request.collateral, key.loanAsset);
          amount = request.tradeType === TradeType.BUY
            ? amount.multipliedBy(swapPrice)
            : amount.dividedBy(swapPrice);
        }
        // console.log(amount.toString());
        if (request.tradeType === TradeType.BUY) {
          amount = amount.multipliedBy(10 ** 18).dividedBy(tokenPrice);
        }
        // console.log(amount.toString(), tokenPrice.toString());
        result = amount;
      }
    }

    return result;
  };

  public getLendedAmountEstimate = async (request: LendRequest): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const assetContract = await this.contractsSource.getITokenContract(request.asset);
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

  public getTradeSlippageRate = async (request: TradeRequest): Promise<BigNumber> => {
    const result = new BigNumber(0);
    return result;
  }

  public static async getWeb3ProviderSettings(networkId: number| null): Promise<IWeb3ProviderSettings> {
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
        networkId = 0;
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

  public async getAssetTokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);
    if (asset === Asset.UNKNOWN) {
      // always 0
      result = new BigNumber(0);
    } else if (asset === Asset.ETH) {
      // get eth (wallet) balance
      result = await this.getEthBalance()
    } else {
      // get erc20 token balance
      const precision = AssetsDictionary.assets.get(asset)!.decimals || 18;
      const assetErc20Address = this.getErc20AddressOfAsset(asset);
      if (assetErc20Address) {
        result = await this.getErc20BalanceOfUser(assetErc20Address);
        result = result.multipliedBy(10 ** (18 - precision));
      }
    }

    return result;
  }

  public async getITokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const precision = AssetsDictionary.assets.get(asset)!.decimals || 18;
      const address = await this.contractsSource.getITokenErc20Address(asset);
      if (address) {
        result = await this.getErc20BalanceOfUser(address);
        result = result.multipliedBy(10 ** (18 - precision));
      }
    }

    return result;
  }

  public async getITokenAssetBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;

      if (account) {
        const assetContract = await this.contractsSource.getITokenContract(asset);
        if (assetContract) {
          const precision = AssetsDictionary.assets.get(asset)!.decimals || 18;
          const swapPrice = await this.getSwapToUsdRate(asset);
          result = await assetContract.assetBalanceOf.callAsync(account);
          result = result
            .multipliedBy(swapPrice)
            .div(10 ** precision);
        }
      }
    }

    return result;
  }

  public async getPTokenBalanceOfUser(selectedKey: TradeTokenKey): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const precision = AssetsDictionary.assets.get(selectedKey.loanAsset)!.decimals || 18;
      const address = await this.contractsSource.getPTokenErc20Address(selectedKey);
      if (address) {
        result = await this.getErc20BalanceOfUser(address);
        result = result.multipliedBy(10 ** (18 - precision));
      }
    }

    return result;
  }

  public getPTokensAvailable(): TradeTokenKey[] {
    return this.contractsSource
        ? this.contractsSource.getPTokensAvailable()
        : [];
  }

  public getPTokenErc20AddressList(): string[] {
    return this.contractsSource
        ? this.contractsSource.getPTokenAddresses()
        : [];
  }

  public getPTokenErc20Address(key: TradeTokenKey): string | null {
    return this.contractsSource
      ? this.contractsSource.getPTokenErc20Address(key)
      : null;
  }

  public getErc20AddressOfAsset(asset: Asset): string | null {
    let result: string | null = null;

    const assetDetails = AssetsDictionary.assets.get(asset);
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || "";
    }
    return result;
  }

  private async getEthBalance(): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (account) {
        const balance = await this.web3Wrapper.getBalanceInWeiAsync(account);
        result = new BigNumber(balance);
      }
    }

    return result;
  }

  private async getErc20BalanceOfUser(addressErc20: string): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;

      if (account) {
        const tokenContract = await this.contractsSource.getErc20Contract(addressErc20);
        if (tokenContract) {
          result = await tokenContract.balanceOf.callAsync(account);
        }
      }
    }

    return result;
  }

  public async getErc20BalancesOfUser(addressesErc20: string[]): Promise<Map<string, BigNumber>> {
    let result: Map<string, BigNumber> = new Map<string, BigNumber>();
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (account) {
        // @ts-ignore
        const resp = await Web3ConnectionFactory.alchemyProvider!.alchemy!.getTokenBalances(account, addressesErc20);
        if (resp) {
          // @ts-ignore
          result = resp.tokenBalances.filter(t => !t.error && t.tokenBalance !== "0").reduce((map, obj) => (map.set(obj.contractAddress, new BigNumber(obj.tokenBalance!)), map), new Map<string, BigNumber>());
        }
      }
    }
    return result;
  }

  public async getSwapToUsdRate(asset: Asset): Promise<BigNumber> {
    if (asset === Asset.DAI || asset === Asset.USDC) {
      return new BigNumber(1);
    }

    return this.getSwapRate(
      asset,
      Asset.DAI
    );
  }

  private getGoodSourceAmountOfAsset(asset: Asset): BigNumber {
    switch (asset) {
      case Asset.WBTC:
        return new BigNumber(10**4);
      case Asset.USDC:
        return new BigNumber(10**8);
      default:
        return new BigNumber(10**18);
    }
  }

  public async getSwapRate(srcAsset: Asset, destAsset: Asset, srcAmount?: BigNumber): Promise<BigNumber> {
    if (srcAsset === destAsset) {
      return new BigNumber(1);
    }

    if (!srcAmount) {
      srcAmount = this.getGoodSourceAmountOfAsset(srcAsset);
    }

    let result: BigNumber = new BigNumber(0);
    const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset);
    const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset);
    if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
      const kyberContract = await this.contractsSource.getKyberContract();
      // result is always base 18, looks like srcQty too, see https://developer.kyber.network/docs/KyberNetworkProxy/#getexpectedrate
      const swapPriceData: BigNumber[] = await kyberContract.getExpectedRate.callAsync(
        srcAssetErc20Address,
        destAssetErc20Address,
        srcAmount
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
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error("No provider available!");
      }

      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (!account) {
        throw new Error("Unable to get wallet address!");
      }

      // Initializing loan
      const taskRequest: LendRequest = (task.request as LendRequest);
      if (taskRequest.lendType === LendType.LEND) {
        if (taskRequest.asset !== Asset.ETH) {
          const processor = new LendErcProcessor();
          await processor.run(task, account, skipGas);
        } else {
          const processor = new LendEthProcessor();
          await processor.run(task, account, skipGas);
        }
      } else {
        if (taskRequest.asset !== Asset.ETH) {
          const processor = new UnlendErcProcessor();
          await processor.run(task, account, skipGas);
        } else {
          const processor = new UnlendEthProcessor();
          await processor.run(task, account, skipGas);
        }
      }

      task.processingEnd(true, false, null);
    } catch (e) {
      if (!e.message.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)) {
        // tslint:disable-next-line:no-console
        console.log(e);
      }
      task.processingEnd(false, false, e);
    }
  };

  private processTradeRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error("No provider available!");
      }

      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (!account) {
        throw new Error("Unable to get wallet address!");
      }

      // Initializing loan
      const taskRequest: TradeRequest = (task.request as TradeRequest);
      if (taskRequest.tradeType === TradeType.BUY) {
        if (taskRequest.collateral !== Asset.ETH) {
          const processor = new TradeBuyErcProcessor();
          await processor.run(task, account, skipGas);
        } else {
          const processor = new TradeBuyEthProcessor();
          await processor.run(task, account, skipGas);
        }
      } else {
        if (taskRequest.collateral !== Asset.ETH) {
          const processor = new TradeSellErcProcessor();
          await processor.run(task, account, skipGas);
        } else {
          const processor = new TradeSellEthProcessor();
          await processor.run(task, account, skipGas);
        }
      }

      task.processingEnd(true, false, null);
    } catch (e) {
      if (!e.message.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)) {
        // tslint:disable-next-line:no-console
        console.log(e);
      }
      task.processingEnd(false, false, e);
    }
  };

  public waitForTransactionMined = async (
    txHash: string, 
    request: LendRequest | TradeRequest): Promise<any> => {

    return new Promise((resolve, reject) => {
      try {
        if (!this.web3Wrapper) {
          throw new Error("web3 is not available");
        }

        this.waitForTransactionMinedRecursive(txHash, this.web3Wrapper, request, resolve, reject);
      } catch (e) {
        throw e;
      }
    });
  };

  private waitForTransactionMinedRecursive = async (
    txHash: string,
    web3Wrapper: Web3Wrapper,
    request: LendRequest | TradeRequest,
    resolve: (value: any) => void,
    reject: (value: any) => void) => {

    try {
      const receipt = await web3Wrapper.getTransactionReceiptIfExistsAsync(txHash);
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
              request.unitOfAccount,
              request.positionType,
              request.leverage,
              request.isTokenized
            ), txHash)
          );
        }
      } else {
        window.setTimeout(() => {
          this.waitForTransactionMinedRecursive(txHash, web3Wrapper, request, resolve, reject);
        }, 5000);
      }
    }
    catch (e) {
      reject(e);
    }
  };

  public sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// tslint:disable-next-line
new FulcrumProvider();
