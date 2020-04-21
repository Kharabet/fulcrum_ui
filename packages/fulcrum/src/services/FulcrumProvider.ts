import { Web3ProviderEngine } from "@0x/subproviders";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from '@0x/web3-wrapper';
import { EventEmitter } from "events";
import Web3Utils from "web3-utils";
import moment from "moment";
import fetch from "node-fetch";
import request from "request-promise";
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
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { ContractsSource } from "./ContractsSource";
import { FulcrumProviderEvents } from "./events/FulcrumProviderEvents";
import { LendTransactionMinedEvent } from "./events/LendTransactionMinedEvent";
import { TasksQueueEvents } from "./events/TasksQueueEvents";
import { TradeTransactionMinedEvent } from "./events/TradeTransactionMinedEvent";
import { TasksQueue } from "./TasksQueue";

import TagManager from "react-gtm-module";
import configProviders from "../config/providers.json";
import { LendChaiProcessor } from "./processors/LendChaiProcessor";
import { LendErcProcessor } from "./processors/LendErcProcessor";
import { LendEthProcessor } from "./processors/LendEthProcessor";
import { TradeBuyErcProcessor } from "./processors/TradeBuyErcProcessor";
import { TradeBuyEthProcessor } from "./processors/TradeBuyEthProcessor";
import { TradeSellErcProcessor } from "./processors/TradeSellErcProcessor";
import { TradeSellEthProcessor } from "./processors/TradeSellEthProcessor";
import { UnlendChaiProcessor } from "./processors/UnlendChaiProcessor";
import { UnlendErcProcessor } from "./processors/UnlendErcProcessor";
import { UnlendEthProcessor } from "./processors/UnlendEthProcessor";

import siteConfig from "./../config/SiteConfig.json";

export class FulcrumProvider {
  private static readonly priceGraphQueryFunction = new Map<Asset, string>([
    [Asset.ETH, "kyber-eth-dai"],
    [Asset.WBTC, "kyber-wbtc-dai"],
    [Asset.LINK, "kyber-link-dai"],
    [Asset.MKR, "kyber-mkr-dai"],
    [Asset.ZRX, "kyber-zrx-dai"],
    [Asset.BAT, "kyber-bat-dai"],
    [Asset.REP, "kyber-rep-dai"],
    [Asset.KNC, "kyber-knc-dai"]
  ]);

  public static Instance: FulcrumProvider;

  public readonly gasLimit = "4500000";

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber("1.06");
  // 5000ms
  public readonly successDisplayTimeout = 5000;

  public readonly gasBufferForLend = new BigNumber(10 ** 16); // 0.01 ETH
  public readonly gasBufferForTrade = new BigNumber(5 * 10 ** 16); // 0.05 ETH

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

    const storedProvider: any = FulcrumProvider.getLocalstorageItem('providerType');
    // const providerType: ProviderType | null = ProviderType[storedProvider] as ProviderType || null;
    const providerType: ProviderType | null = storedProvider as ProviderType || null;

    // singleton
    if (!FulcrumProvider.Instance) {
      FulcrumProvider.Instance = this;
    }

    if (providerType) {
      FulcrumProvider.Instance.setWeb3Provider(providerType).then(() => {
        this.eventEmitter.emit(FulcrumProviderEvents.ProviderAvailable);
        FulcrumProvider.Instance.eventEmitter.emit(
          FulcrumProviderEvents.ProviderChanged,
          new ProviderChangedEvent(FulcrumProvider.Instance.providerType, FulcrumProvider.Instance.web3Wrapper)
        );
      });
    } else {
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
    }

    return FulcrumProvider.Instance;
  }

  public static getLocalstorageItem(item: string): string {
    let response = "";
    try {
      response = localStorage.getItem(item) || "";
    } catch (e) {
      // console.log(e);
    }
    return response;
  }

  public static setLocalstorageItem(item: string, val: string) {
    try {
      localStorage.setItem(item, val);
    } catch (e) {
      // console.log(e);
    }
  }

  public async setWeb3Provider(providerType: ProviderType) {
    this.unsupportedNetwork = false;
    await this.setWeb3ProviderFinalize(providerType, await Web3ConnectionFactory.getWeb3Provider(providerType, this.eventEmitter));
  }

  public async setWeb3ProviderFinalize(providerType: ProviderType, providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number]) { // : Promise<boolean> {
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
      try {
        this.accounts = await this.web3Wrapper.getAvailableAddressesAsync() || [];
      } catch (e) {
        // console.log(e);
        this.accounts = [];
      }
      if (this.accounts.length === 0) {
        canWrite = false; // revert back to read-only
      }
    } else {
      // this.accounts = [];
      if (providerType === ProviderType.Bitski && networkId !== 1) {
        this.unsupportedNetwork = true;
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      this.contractsSource = await new ContractsSource(this.providerEngine, this.web3ProviderSettings.networkId, canWrite);
      if (canWrite) {
        this.providerType = providerType;
      } else {
        this.providerType = ProviderType.None;
      }
      FulcrumProvider.setLocalstorageItem('providerType', this.providerType);
    } else {
      this.contractsSource = null;
    }

    if (this.contractsSource) {
      await this.contractsSource.Init();
    }
  }

  public async setWeb3ProviderMobileFinalize(providerType: ProviderType, providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number, string]) { // : Promise<boolean> {
    this.web3Wrapper = providerData[0];
    this.providerEngine = providerData[1];
    let canWrite = providerData[2];
    let networkId = providerData[3];
    const sellectedAccount = providerData[4];

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
      try {
        this.accounts = [sellectedAccount] // await this.web3Wrapper.getAvailableAddressesAsync() || [];
      } catch (e) {
        // console.log(e);
        this.accounts = [];
      }
      if (this.accounts.length === 0) {
        canWrite = false; // revert back to read-only
      }
    } else {
      // this.accounts = [];
      if (providerType === ProviderType.Bitski && networkId !== 1) {
        this.unsupportedNetwork = true;
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      this.contractsSource = await new ContractsSource(this.providerEngine, this.web3ProviderSettings.networkId, canWrite);
      if (canWrite) {
        this.providerType = providerType;
      } else {
        this.providerType = ProviderType.None;
      }
      FulcrumProvider.setLocalstorageItem('providerType', this.providerType);
    } else {
      this.contractsSource = null;
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

  public getTradeTokenInterestRate = async (selectedKey: TradeTokenKey): Promise<BigNumber> => {
    let result = new BigNumber(0);
    if (this.contractsSource) {
      const assetContract = await this.contractsSource.getITokenContract(selectedKey.loanAsset);
      if (assetContract) {
        result = await assetContract.avgBorrowInterestRate.callAsync();
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
      const earliestBlock = currentBlock - 17280; // ~5760 blocks per day
      let fetchFromBlock = earliestBlock;
      const nearestHour = new Date().setMinutes(0, 0, 0) / 1000;

      const priceData = FulcrumProvider.getLocalstorageItem(`priceData${selectedKey.asset}`);
      if (priceData) {
        // console.log(`priceData`,priceData);
        priceDataObj = JSON.parse(priceData);
        if (priceDataObj.length > 0) {
          // console.log(`priceDataObj`,priceDataObj);
          const lastItem = priceDataObj[priceDataObj.length - 1];
          // console.log(`lastItem`,lastItem);
          // console.log(`nearestHour`,nearestHour);
          if (lastItem && lastItem.timeStamp) {
            // console.log(`lastItem.timeStamp`,lastItem.timeStamp);
            if (lastItem.timeStamp < nearestHour) {
              fetchFromBlock = currentBlock - (nearestHour - lastItem.timeStamp) / 15 - 240; // ~240 blocks per hour; 15 second blocks
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

          queriedBlocks = currentBlock - fetchFromBlock;
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
          if (priceData && priceDataObj[priceDataObj.length - 1].timeStamp !== nearestHour) {
            priceDataObj.push({
              timeStamp: nearestHour,
              price: priceDataObj[priceDataObj.length - 1].price,
              liquidationPrice: 0,
              change24h: 0
            });
          }

          // keep no more than 72
          if (priceDataObj.length > 72) {
            priceDataObj = priceDataObj.splice(-72);
          }

          // console.log(priceDataObj.length);
          FulcrumProvider.setLocalstorageItem(`priceData${selectedKey.asset}`, JSON.stringify(priceDataObj));
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

  public getTradeTokenAssetLatestDataPoint = async (selectedKey: TradeTokenKey): Promise<IPriceDataPoint> => {
    try {
      const currentPrice = await this.getSwapToUsdRate(selectedKey.asset);
      const priceLatestDataPoint = await this.getPriceDefaultDataPoint();

      priceLatestDataPoint.price = currentPrice.toNumber();

      if (this.contractsSource) {
        const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
        if (assetContract) {

          const currentLeverage = (await assetContract.currentLeverage.callAsync()).div(10 ** 18);
          const currentMargin = currentLeverage.gt(0) ?
            new BigNumber(1).div(currentLeverage) :
            new BigNumber(1).div(selectedKey.leverage);

          const maintenanceMargin = new BigNumber(0.15);

          if (currentMargin.lte(maintenanceMargin)) {
            priceLatestDataPoint.liquidationPrice = priceLatestDataPoint.price;
          } else {
            const initialLeverage = new BigNumber(selectedKey.leverage);
            const initialMargin = new BigNumber(1).div(initialLeverage);

            // initial_price = current_price - (current_price / initial_leverage * (current_margin - initial_margin))
            const offset = currentPrice
              .dividedBy(initialLeverage)
              .multipliedBy(
                currentMargin
                  .minus(initialMargin)
              );

            const initialPrice = selectedKey.positionType === PositionType.SHORT ?
              currentPrice.plus(offset) :
              currentPrice.minus(offset);

            // liquidation_price = initial_price * (maintenance_margin * current_leverage + initial_leverage) / (initial_leverage + 1)
            let liquidationPrice = initialPrice
              .multipliedBy(maintenanceMargin.times(currentLeverage).plus(initialLeverage))
              .div(initialLeverage.plus(1));

            if (selectedKey.positionType === PositionType.SHORT) {
              liquidationPrice = initialPrice
                .plus(initialPrice)
                .minus(liquidationPrice);
            }

            /*console.log(`offset`,offset.toString());
            console.log(`maintenanceMargin`,maintenanceMargin.toString());
            console.log(`initialLeverage`,initialLeverage.toString());
            console.log(`initialMargin`,initialMargin.toString())
            console.log(`currentPrice`,currentPrice.toString());
            console.log(`currentLeverage`,currentLeverage.toString());
            console.log(`currentMargin`,currentMargin.toString());
            console.log(`initialPrice`,initialPrice.toString());
            console.log(`liquidationPrice`,liquidationPrice.toString());*/

            priceLatestDataPoint.liquidationPrice = liquidationPrice
              .toNumber();
          }
        }
      }
      return priceLatestDataPoint;
    } catch (e) {
      return this.getPriceDefaultDataPoint();
    }
  };

  /*
  public getTradeTokenAssetLatestDataPoint = async (selectedKey: TradeTokenKey): Promise<IPriceDataPoint> => {
    try {
      const swapPrice = await this.getSwapToUsdRate(selectedKey.asset);
      const priceLatestDataPoint = await this.getPriceLatestDataPoint(selectedKey);

      if (priceLatestDataPoint.price > 0 && priceLatestDataPoint.liquidationPrice > 0) {
        let multiplier = new BigNumber(1);
        if (selectedKey.positionType === PositionType.SHORT) {
          multiplier = multiplier.multipliedBy(priceLatestDataPoint.price).div(priceLatestDataPoint.liquidationPrice);
        } else {
          multiplier = multiplier.multipliedBy(priceLatestDataPoint.liquidationPrice).div(priceLatestDataPoint.price);
        }
        priceLatestDataPoint.liquidationPrice = swapPrice
          .multipliedBy(multiplier)
          .toNumber();
      } else {
        priceLatestDataPoint.liquidationPrice = 0;
      }

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
  };*/

  public getPriceDefaultDataPoint = (): IPriceDataPoint => {
    return {
      timeStamp: moment().unix(),
      price: 0,
      liquidationPrice: 0,
      change24h: 0
    };
  };

  public getReserveDetails = async (assets: Asset[]): Promise<ReserveDetails[]> => {
    let result: ReserveDetails[] = [];

    if (this.contractsSource) {
      const addressLookup = await this.contractsSource.getITokenAddressesAndReduce(assets);
      assets = addressLookup[0];
      const tokens = addressLookup[1];
      const helperContract = await this.contractsSource.getDAppHelperContract();
      if (tokens && helperContract) {
        let swapRates;
        try {
          swapRates = await this.getSwapToUsdRateBatch(
            assets,
            process.env.REACT_APP_ETH_NETWORK === "mainnet" || process.env.REACT_APP_ETH_NETWORK === "ropsten" ?
              Asset.DAI :
              Asset.SAI
          );
        } catch (e) {
          //console.log(e);
        }
        const reserveData = await helperContract.reserveDetails.callAsync(tokens);
        let usdSupplyAll = new BigNumber(0);
        let usdTotalLockedAll = new BigNumber(0);
        if (reserveData && reserveData[0].length > 0) {
          for (let i = 0; i < reserveData[0].length; i++) {
            let asset = assets[i];
            let symbol: string = "";
            let name: string = "";
            let assetAddress: string = tokens[i];

            let totalAssetSupply = new BigNumber(reserveData[0][i]);
            let totalAssetBorrow = new BigNumber(reserveData[1][i]);
            let supplyInterestRate = new BigNumber(reserveData[2][i]);
            let borrowInterestRate = new BigNumber(reserveData[3][i]);
            let torqueBorrowInterestRate = new BigNumber(reserveData[4][i]);
            let vaultBalance = new BigNumber(reserveData[5][i]);
            let marketLiquidity = totalAssetSupply.minus(totalAssetBorrow);

            const decimals = AssetsDictionary.assets.get(asset)!.decimals || 18;
            let usdSupply = new BigNumber(0);
            let usdTotalLocked = new BigNumber(0);

            const precision = new BigNumber(10 ** (18 - decimals));
            totalAssetSupply = totalAssetSupply.times(precision);
            totalAssetBorrow = totalAssetBorrow.times(precision);
            marketLiquidity = marketLiquidity.times(precision);
            //liquidityReserved = liquidityReserved.times(precision);
            vaultBalance = vaultBalance.times(precision);
            if (swapRates && swapRates[i]) {
              usdSupply = totalAssetSupply!.times(swapRates[i]).dividedBy(10 ** 18);
              usdSupplyAll = usdSupplyAll.plus(usdSupply);

              usdTotalLocked = marketLiquidity.plus(vaultBalance).times(swapRates[i]).dividedBy(10 ** 18);
              usdTotalLockedAll = usdTotalLockedAll.plus(usdTotalLocked);
            }

            result.push(new ReserveDetails(
              asset,
              assetAddress,
              symbol,
              name,
              decimals,
              null,// tokenPrice.dividedBy(10 ** 18),
              marketLiquidity.dividedBy(10 ** 18),
              // liquidityReserved.dividedBy(10 ** 18),
              new BigNumber(0),
              totalAssetSupply.dividedBy(10 ** 18),
              totalAssetBorrow.dividedBy(10 ** 18),
              supplyInterestRate.dividedBy(10 ** 18),
              borrowInterestRate.dividedBy(10 ** 18),
              torqueBorrowInterestRate.dividedBy(10 ** 18),
              // avgBorrowInterestRate.dividedBy(10 ** 18),
              new BigNumber(0),
              vaultBalance.dividedBy(10 ** 18),
              swapRates ? swapRates[i] : new BigNumber(0),
              usdSupply.dividedBy(10 ** 18),
              usdTotalLocked.dividedBy(10 ** 18)
            ));
          }

          result.push(new ReserveDetails(
            Asset.UNKNOWN,
            "",
            "",
            "",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            usdSupplyAll.dividedBy(10 ** 18),
            usdTotalLockedAll.dividedBy(10 ** 18)
          ));
        }
      }
    }

    return result;
  };

  /*public getReserveDetails = async (asset: Asset): Promise<ReserveDetails | null> => {
    let result: ReserveDetails | null = null;

    if (this.contractsSource) {
      const assetContract = await this.contractsSource.getITokenContract(asset);
      if (assetContract) {

        let symbol: string = "";
        const name: string = "";
        // let tokenPrice: BigNumber | null;
        let marketLiquidity: BigNumber | null;
        // let liquidityReserved: BigNumber | null;
        let totalAssetSupply: BigNumber | null;
        let totalAssetBorrow: BigNumber | null;
        let supplyInterestRate: BigNumber | null;
        let borrowInterestRate: BigNumber | null;
        let torqueBorrowInterestRate: BigNumber | null;
        // let avgBorrowInterestRate: BigNumber | null;
        let lockedAssets: BigNumber | null = new BigNumber(0);

        await Promise.all([
          (symbol = await assetContract.symbol.callAsync()),
          // (name = await assetContract.name.callAsync()),
          // (tokenPrice = await assetContract.tokenPrice.callAsync()),
          (marketLiquidity = await assetContract.marketLiquidity.callAsync()),
          // (liquidityReserved reserveDetails= await assetContract.totalReservedSupply.callAsync()),
          (totalAssetSupply = await assetContract.totalAssetSupply.callAsync()),
          (totalAssetBorrow = await assetContract.totalAssetBorrow.callAsync()),
          (supplyInterestRate = await assetContract.supplyInterestRate.callAsync()),
          // avgBorrowInterestRate = await assetContract.avgBorrowInterestRate.callAsync()),
          (borrowInterestRate = await assetContract.avgBorrowInterestRate.callAsync()), // borrowInterestRate
          (torqueBorrowInterestRate = await assetContract.nextBorrowInterestRateWithOption.callAsync(new BigNumber(0), true)), // nextBorrowInterestRateWithOption
        ]);

        const assetErc20Address = this.getErc20AddressOfAsset(asset);
        if (assetErc20Address) {
          lockedAssets = await this.getErc20BalanceOfUser(assetErc20Address, this.contractsSource.getBZxVaultAddress());
        }

        result = new ReserveDetails(
          Asset.UNKNOWN,
          assetContract.address,
          symbol,
          name,
          null,// tokenPrice.dividedBy(10 ** 18),
          marketLiquidity.dividedBy(10 ** 18),
          // liquidityReserved.dividedBy(10 ** 18),
          new BigNumber(0),
          totalAssetSupply.dividedBy(10 ** 18),
          totalAssetBorrow.dividedBy(10 ** 18),
          supplyInterestRate.dividedBy(10 ** 18),
          borrowInterestRate.dividedBy(10 ** 18),
          torqueBorrowInterestRate.dividedBy(10 ** 18),
          // avgBorrowInterestRate.dividedBy(10 ** 18),
          new BigNumber(0),
          lockedAssets.dividedBy(10 ** 18),
          null
        );
      }
    }

    return result;
  };*/

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
          /*let swapPrice;
          try {
            swapPrice = await this.getSwapToUsdRate(asset);
          } catch(e) {
            // console.log(e);
          }*/

          const tokenPrice = await assetContract.tokenPrice.callAsync();
          const checkpointPrice = await assetContract.checkpointPrice.callAsync(account);

          result = tokenPrice
            .minus(checkpointPrice)
            .multipliedBy(balance)
            .dividedBy(10 ** 36);

          /*if (swapPrice && swapPrice.gt(0)) {
            result = result
              .multipliedBy(swapPrice);
          }*/
        }
      }
    }

    return result;
  };

  public getBaseAsset = (key: TradeTokenKey): Asset => {
    if (key.positionType === PositionType.SHORT) {
      return key.version === 2 ? key.unitOfAccount : key.loanAsset;
    } else {
      return key.version === 2 ? key.asset : key.loanAsset;
    }
  }

  public getTradeBalanceAndProfit = async (selectedKey: TradeTokenKey): Promise<[BigNumber | null, BigNumber | null]> => {
    // should return null if no data (not traded asset), new BigNumber(0) if no profit
    let assetBalance: BigNumber | null = new BigNumber(0);
    let profit: BigNumber | null = new BigNumber(0);
    let account: string | null = null;

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    }

    if (account && this.contractsSource && this.contractsSource.canWrite) {
      const balance = await this.getPTokenBalanceOfUser(selectedKey);
      if (balance.gt(0)) {
        const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
        if (assetContract) {
          const baseAsset = this.getBaseAsset(selectedKey);
          const swapPrice = await this.getSwapToUsdRate(baseAsset);
          const tokenPrice = await assetContract.tokenPrice.callAsync();
          const checkpointPrice = await assetContract.checkpointPrice.callAsync(account);

          let decimalOffset = 0;
          if (baseAsset === Asset.WBTC && selectedKey.positionType === PositionType.LONG) {
            decimalOffset = -10;
          }

          assetBalance = tokenPrice
            .multipliedBy(balance)
            .multipliedBy(swapPrice)
            .dividedBy(10 ** (36 - decimalOffset));

          profit = tokenPrice
            .minus(checkpointPrice)
            .multipliedBy(balance)
            .multipliedBy(swapPrice)
            .dividedBy(10 ** (36 - decimalOffset));
        }
      }
    }

    return [assetBalance, profit];
  };

  public getMaxTradeValue = async (tradeType: TradeType, selectedKey: TradeTokenKey, collateral: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (tradeType === TradeType.BUY) {
      if (this.contractsSource) {
        const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
        if (assetContract) {

          const precision = AssetsDictionary.assets.get(selectedKey.loanAsset)!.decimals || 18;
          let marketLiquidity = await assetContract.marketLiquidityForLoan.callAsync();
          marketLiquidity = marketLiquidity.multipliedBy(10 ** (18 - precision));

          if (collateral !== selectedKey.loanAsset) {
            const swapPrice = await this.getSwapRate(selectedKey.loanAsset, collateral);
            marketLiquidity = marketLiquidity.multipliedBy(swapPrice);
          }

          const balance = await this.getAssetTokenBalanceOfUser(collateral);

          result = BigNumber.min(marketLiquidity, balance);

          if (collateral === Asset.ETH) {
            result = result.gt(this.gasBufferForTrade) ? result.minus(this.gasBufferForTrade) : new BigNumber(0);
          }

          /*if (collateral === Asset.ETH && selectedKey.asset === Asset.ETH && selectedKey.positionType === PositionType.LONG) {
            const tempLongCap = new BigNumber(7 * 10**18);
            if (result.gt(tempLongCap)) {
              result = tempLongCap;
            }
          }*/

        } else {
          result = new BigNumber(0);
        }
      }
    } else {
      result = await this.getPTokenBalanceOfUser(selectedKey);
    }

    const baseAsset = this.getBaseAsset(selectedKey);

    // console.log(baseAsset, selectedKey.positionType, selectedKey.unitOfAccount, result.toString());


    let decimalOffset = 0;
    if (baseAsset === Asset.WBTC) {
      if (selectedKey.positionType === PositionType.SHORT) {
        if (selectedKey.version !== 1 && selectedKey.unitOfAccount !== Asset.USDC) {
          decimalOffset = 10;
        }
      } else {
        if (tradeType === TradeType.SELL) {
          decimalOffset = -10;
        }
      }
    }

    result = result.dividedBy(10 ** (18 - decimalOffset));

    return result;
  };


  public getMaxLendValue = async (request: LendRequest): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, string]> => {
    let maxLendAmount = new BigNumber(0);
    let maxTokenAmount = new BigNumber(0);
    let tokenPrice = new BigNumber(0);
    let chaiPrice = new BigNumber(0);
    let infoMessage: string = "";
    if (request.lendType === LendType.LEND) {
      maxLendAmount = await this.getAssetTokenBalanceOfUser(request.asset);
      if (request.asset === Asset.ETH) {
        maxLendAmount = maxLendAmount.gt(this.gasBufferForLend) ? maxLendAmount.minus(this.gasBufferForLend) : new BigNumber(0);
      }
    } else {
      /*maxLendAmount =
        request.lendType === LendType.LEND
          ? request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice)
          : request.amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);*/
      if (this.contractsSource) {
        const assetContract = await this.contractsSource.getITokenContract(request.asset);
        if (assetContract) {
          const precision = AssetsDictionary.assets.get(request.asset)!.decimals || 18;
          if (request.asset === Asset.CHAI) {
            chaiPrice = await assetContract.chaiPrice.callAsync();
          }
          tokenPrice = await assetContract.tokenPrice.callAsync();
          maxTokenAmount = await this.getITokenBalanceOfUser(request.asset);
          let freeSupply = (await assetContract.marketLiquidity.callAsync());// .multipliedBy(0.95);
          let userBalance = maxTokenAmount.multipliedBy(tokenPrice).dividedBy(10 ** (36 - precision));

          if (request.asset === Asset.CHAI) {
            freeSupply = freeSupply.multipliedBy(10 ** 18).dividedBy(chaiPrice);
            userBalance = userBalance.multipliedBy(10 ** 18).dividedBy(chaiPrice);
          }

          if (freeSupply.lt(userBalance)) {
            maxLendAmount = freeSupply;
            maxTokenAmount = maxTokenAmount.multipliedBy(freeSupply).dividedBy(userBalance);
            if (request.lendType === LendType.UNLEND)
              infoMessage = "Insufficient liquidity for unlend. Please try again later.";
          } else {
            maxLendAmount = userBalance;
          }

          maxLendAmount = maxLendAmount.multipliedBy(10 ** (18 - precision));

        }
      }
    }

    maxLendAmount = maxLendAmount.dividedBy(10 ** 18);
    maxTokenAmount = maxTokenAmount.dividedBy(10 ** 18);

    return [maxLendAmount, maxTokenAmount, tokenPrice, chaiPrice, infoMessage];
  };

  public getPTokenPrice = async (selectedKey: TradeTokenKey): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
      if (assetContract) {
        result = await assetContract.tokenPrice.callAsync();
      }
    }

    return result.dividedBy(10 ** 18);
  };

  public getPTokenValueOfUser = async (selectedKey: TradeTokenKey, account?: string): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource) {
      if (!account && this.contractsSource.canWrite) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : undefined;
      }

      if (account) {
        const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
        if (assetContract) {
          result = await assetContract.positionValue.callAsync(account);
        }
      }
    }

    return result.dividedBy(10 ** 18);
  };

  public getTradedAmountEstimate = async (request: TradeRequest): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (request.amount.eq(0)) {
      return result;
    }

    if (this.contractsSource) {
      const key = new TradeTokenKey(
        request.asset,
        request.unitOfAccount,
        request.positionType,
        request.leverage,
        request.isTokenized,
        request.version
      );
      const assetContract = await this.contractsSource.getPTokenContract(key);
      if (assetContract) {
        const tokenPrice = await assetContract.tokenPrice.callAsync();
        let amount = request.amount;
        if (request.tradeType === TradeType.SELL) {
          amount = amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);
        }
        const baseAsset = this.getBaseAsset(key);
        if (request.collateral !== baseAsset) {
          const srcToken = request.tradeType === TradeType.BUY ? request.collateral : baseAsset;
          const destToken = request.tradeType === TradeType.BUY ? baseAsset : request.collateral;
          const srcDecimals: number = AssetsDictionary.assets.get(srcToken)!.decimals || 18;
          const swapPrice = await this.getSwapRate(
            srcToken,
            destToken,
            amount.multipliedBy(10 ** srcDecimals)
          );
          amount = amount.multipliedBy(swapPrice);
        }
        if (request.tradeType === TradeType.BUY) {
          amount = amount.multipliedBy(10 ** 18).dividedBy(tokenPrice);
        }
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

        /*result =
          request.lendType === LendType.LEND
            ? request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice)
            : request.amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);*/
        result = request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice);
      }
    }

    return result;
  };

  public gasPrice = async (): Promise<BigNumber> => {
    let result = new BigNumber(30).multipliedBy(10 ** 9); // upper limit 30 gwei
    const lowerLimit = new BigNumber(3).multipliedBy(10 ** 9); // lower limit 3 gwei

    const url = `https://ethgasstation.info/json/ethgasAPI.json`;
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      // console.log(jsonData);
      if (jsonData.average) {
        // ethgasstation values need divide by 10 to get gwei
        const gasPriceAvg = new BigNumber(jsonData.average).multipliedBy(10 ** 8);
        const gasPriceSafeLow = new BigNumber(jsonData.safeLow).multipliedBy(10 ** 8);
        if (gasPriceAvg.lt(result)) {
          result = gasPriceAvg;
        } else if (gasPriceSafeLow.lt(result)) {
          result = gasPriceSafeLow;
        }
      }
    } catch (error) {
      // console.log(error);
      result = new BigNumber(12).multipliedBy(10 ** 9); // error default 8 gwei
    }

    if (result.lt(lowerLimit)) {
      result = lowerLimit;
    }

    return result;
  }

  public checkCollateralApprovalForLend = async (asset: Asset): Promise<boolean> => {
    let maybeNeedsApproval = false;
    let account: string | null = null;

    if (asset === Asset.ETH) {
      return false;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      if (!account) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      }

      if (account) {
        const assetAddress = this.getErc20AddressOfAsset(asset);
        if (assetAddress) {
          const iTokenAddress = await this.contractsSource.getITokenErc20Address(asset);
          const tokenContract = await this.contractsSource.getErc20Contract(assetAddress);
          if (iTokenAddress && tokenContract) {
            const allowance = await tokenContract.allowance.callAsync(account, iTokenAddress)
            maybeNeedsApproval = allowance.lt(10 ** 50)
          }
        }
      }
    }

    return maybeNeedsApproval;
  }

  public checkCollateralApprovalForTrade = async (request: TradeRequest): Promise<boolean> => {
    let maybeNeedsApproval = false;
    let account: string | null = null;

    if (request.collateral === Asset.ETH) {
      return false;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      if (!account) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      }

      if (account) {
        const collateralErc20Address = this.getErc20AddressOfAsset(request.collateral);
        if (collateralErc20Address) {
          const key = new TradeTokenKey(
            request.asset,
            request.unitOfAccount,
            request.positionType,
            request.leverage,
            request.isTokenized,
            request.version
          );
          const pTokenAddress = await this.contractsSource.getPTokenErc20Address(key);
          const tokenContract = await this.contractsSource.getErc20Contract(collateralErc20Address);
          if (pTokenAddress && tokenContract) {
            const allowance = await tokenContract.allowance.callAsync(account, pTokenAddress)
            maybeNeedsApproval = allowance.lt(10 ** 50)
          }
        }
      }
    }

    return maybeNeedsApproval;
  }

  public getTradeSlippageRate = async (request: TradeRequest, tradedAmountEstimate: BigNumber): Promise<BigNumber | null> => {

    if (request.amount.eq(0) || tradedAmountEstimate.eq(0)) {
      return new BigNumber(0);
    }

    let tradeAmountActual = new BigNumber(0);
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;

      if (account) {
        const key = new TradeTokenKey(
          request.asset,
          request.unitOfAccount,
          request.positionType,
          request.leverage,
          request.isTokenized,
          request.version
        );

        const assetContract = await this.contractsSource.getPTokenContract(key);
        if (assetContract) {
          const baseAsset = this.getBaseAsset(key);
          if (request.tradeType === TradeType.BUY) {
            if (request.collateral !== Asset.ETH) {
              try {
                const assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(request.collateral);
                if (assetErc20Address) {
                  const srcDecimals: number = AssetsDictionary.assets.get(request.collateral)!.decimals || 18;
                  tradeAmountActual = await assetContract.mintWithToken.callAsync(
                    account,
                    assetErc20Address,
                    new BigNumber(request.amount.multipliedBy(10 ** srcDecimals).toFixed(0, 1)),
                    new BigNumber(0),
                    "0x",
                    {
                      from: account,
                      gas: "5000000",
                      gasPrice: new BigNumber(0)
                    }
                  );
                  let destDecimals: number = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
                  if (baseAsset === Asset.WBTC && key.positionType === PositionType.LONG) {
                    destDecimals = destDecimals + 10;
                  }
                  tradeAmountActual = tradeAmountActual.multipliedBy(10 ** (18 - destDecimals));
                } else {
                  return null;
                }
              } catch (e) {
                // console.log(e);
                return null;
              }
            } else {
              try {
                tradeAmountActual = await assetContract.mintWithEther.callAsync(
                  account,
                  {
                    from: account,
                    value: new BigNumber(request.amount.multipliedBy(10 ** 18).toFixed(0, 1)), // ETH -> 18 decimals,
                    gas: "5000000",
                    gasPrice: new BigNumber(0)
                  }
                );
                let destDecimals: number = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
                if (baseAsset === Asset.WBTC && key.positionType === PositionType.LONG) {
                  destDecimals = destDecimals + 10;
                }
                tradeAmountActual = tradeAmountActual.multipliedBy(10 ** (18 - destDecimals));
              } catch (e) {
                // console.log(e);
                return null;
              }
            }
          } else {
            if (request.collateral !== Asset.ETH) {
              try {
                const assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(request.collateral);
                if (assetErc20Address) {
                  const srcDecimals: number = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
                  if (baseAsset === Asset.WBTC && key.positionType === PositionType.SHORT) {
                    // srcDecimals = srcDecimals + 10;
                  }
                  tradeAmountActual = await assetContract.burnToToken.callAsync(
                    account,
                    assetErc20Address,
                    new BigNumber(request.amount.multipliedBy(10 ** srcDecimals).toFixed(0, 1)),
                    new BigNumber(0),
                    "0x",
                    {
                      from: account,
                      gas: "5000000",
                      gasPrice: new BigNumber(0)
                    }
                  );
                  const destDecimals: number = AssetsDictionary.assets.get(request.collateral)!.decimals || 18;
                  tradeAmountActual = tradeAmountActual.multipliedBy(10 ** (18 - destDecimals));
                } else {
                  return null;
                }
              } catch (e) {
                // console.log(e);
                return null;
              }
            } else {
              try {
                const srcDecimals: number = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
                if (baseAsset === Asset.WBTC && key.positionType === PositionType.SHORT) {
                  // srcDecimals = srcDecimals + 10;
                }
                tradeAmountActual = await assetContract.burnToEther.callAsync(
                  account,
                  new BigNumber(request.amount.multipliedBy(10 ** srcDecimals).toFixed(0, 1)),
                  new BigNumber(0),
                  "0x",
                  {
                    from: account,
                    gas: "5000000",
                    gasPrice: new BigNumber(0)
                  }
                );
              } catch (e) {
                // console.log(e);
                return null;
              }
            }
          }
        }
      }
    }

    tradeAmountActual = tradeAmountActual.dividedBy(10 ** 18);
    const slippage = tradeAmountActual.minus(tradedAmountEstimate).div(tradedAmountEstimate).multipliedBy(-100);

    /*console.log(`---------`);
    console.log(`tradedAmountEstimate`,tradedAmountEstimate.toString());
    console.log(`tradeAmountActual`,tradeAmountActual.toString());
    console.log(`slippage`,slippage.toString());*/

    return slippage;
  }

  public getTradeFormExposure = async (request: TradeRequest): Promise<BigNumber> => {

    if (request.amount.eq(0)) {
      return new BigNumber(0);
    }

    let requestAmount;
    if (request.tradeType === TradeType.BUY) {
      if (request.collateral !== request.asset) {
        const decimals: number = AssetsDictionary.assets.get(request.collateral)!.decimals || 18;
        const swapPrice = await this.getSwapRate(
          request.collateral,
          request.asset,
          request.amount.multipliedBy(10 ** decimals)
        );
        requestAmount = request.amount.multipliedBy(swapPrice);
      } else {
        requestAmount = request.amount;
      }
    } else {
      const tradeTokenKey = new TradeTokenKey(
        request.asset,
        request.unitOfAccount,
        request.positionType,
        request.leverage,
        request.isTokenized,
        request.version
      );
      const pTokenBaseAsset = this.getBaseAsset(tradeTokenKey);
      const pTokenPrice = await this.getPTokenPrice(tradeTokenKey);
      const pTokenBaseAssetAmount = request.amount.multipliedBy(pTokenPrice);
      const swapRate = await this.getSwapRate(pTokenBaseAsset, request.asset);

      requestAmount = pTokenBaseAssetAmount.multipliedBy(swapRate);
    }

    return requestAmount.multipliedBy(request.leverage);
  }

  public static async getWeb3ProviderSettings(networkId: number | null): Promise<IWeb3ProviderSettings> {
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
          //const swapPrice = await this.getSwapToUsdRate(asset);
          result = (await assetContract.assetBalanceOf.callAsync(account))
            .div(10 ** precision);
          /*result = result
            .multipliedBy(swapPrice)
            .div(10 ** precision);*/
        }
      }
    }

    return result;
  }

  public async getPTokenBalanceOfUser(selectedKey: TradeTokenKey): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const baseAsset = this.getBaseAsset(selectedKey);
      const precision = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
      const address = await this.contractsSource.getPTokenErc20Address(selectedKey);
      if (address) {
        result = await this.getErc20BalanceOfUser(address);
        result = result.multipliedBy(10 ** (18 - precision));
        if (baseAsset === Asset.WBTC && selectedKey.positionType === PositionType.SHORT) {
          result = result.div(10 ** 10);
        }
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

  public async getEthBalance(): Promise<BigNumber> {
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

  private async getErc20BalanceOfUser(addressErc20: string, account?: string): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource) {
      if (!account && this.contractsSource.canWrite) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : undefined;
      }

      if (account) {
        const tokenContract = await this.contractsSource.getErc20Contract(addressErc20);
        if (tokenContract) {
          result = await tokenContract.balanceOf.callAsync(account);
        }
      }
    }

    return result;
  }

  public async getErc20BalancesOfUser(addressesErc20: string[], account?: string): Promise<Map<string, BigNumber>> {
    let result: Map<string, BigNumber> = new Map<string, BigNumber>();
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      if (!account && this.contractsSource.canWrite) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : undefined;
      }
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

  public async getSwapToUsdRateBatch(assets: Asset[], usdToken: Asset): Promise<BigNumber[]> {
    let result: BigNumber[] = [];

    if (this.contractsSource) {
      const oracleAddress = this.contractsSource.getOracleAddress();
      const usdTokenAddress = this.getErc20AddressOfAsset(usdToken)!;
      const underlyings: string[] = assets.map(e => this.getErc20AddressOfAsset(e)!);
      const amounts: BigNumber[] = assets.map(e => this.getGoodSourceAmountOfAsset(e));

      const helperContract = await this.contractsSource.getDAppHelperContract();
      if (helperContract) {
        result = await helperContract.assetRates.callAsync(
          oracleAddress,
          usdTokenAddress,
          underlyings,
          amounts
        );
      }
    }

    return result;
  }

  public async getSwapToUsdRate(asset: Asset): Promise<BigNumber> {
    if (asset === Asset.SAI || asset === Asset.DAI || asset === Asset.USDC || asset === Asset.SUSD || asset === Asset.USDT) {
      return new BigNumber(1);
    }

    /*const swapRates = await this.getSwapToUsdRateBatch(
      [asset],
      process.env.REACT_APP_ETH_NETWORK === "mainnet" ?
        Asset.DAI :
        Asset.SAI
    );

    return swapRates[0];*/
    return this.getSwapRate(
      asset,
      process.env.REACT_APP_ETH_NETWORK === "mainnet" ?
        Asset.DAI :
        Asset.SAI
    );
  }

  private getGoodSourceAmountOfAsset(asset: Asset): BigNumber {
    switch (asset) {
      case Asset.WBTC:
        return new BigNumber(10 ** 6);
      case Asset.USDC:
      case Asset.USDT:
        return new BigNumber(10 ** 4);
      default:
        return new BigNumber(10 ** 16);
    }
  }

  public async getSwapRate(srcAsset: Asset, destAsset: Asset, srcAmount?: BigNumber): Promise<BigNumber> {
    if (srcAsset === destAsset) {
      return new BigNumber(1);
    }

    let result: BigNumber = new BigNumber(0);

    if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
      if (!srcAmount) {
        srcAmount = FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
      } else {
        srcAmount = new BigNumber(srcAmount.toFixed(0, 1));
      }

      const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset);
      const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset);
      if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
        const oracleContract = await this.contractsSource.getOracleContract();
        try {
          const swapPriceData: BigNumber[] = await oracleContract.getTradeData.callAsync(
            srcAssetErc20Address,
            destAssetErc20Address,
            srcAmount
          );
          result = swapPriceData[0].dividedBy(10 ** 18);
        } catch (e) {
          result = new BigNumber(0);
        }
      }
    } else {
      if (!srcAmount) {
        srcAmount = this.getGoodSourceAmountOfAsset(srcAsset);
      }

      const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset);
      const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset);
      if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
        const oracleContract = await this.contractsSource.getOracleContract();
        try {
          const swapPriceData: BigNumber[] = await oracleContract.getExpectedRate.callAsync(
            srcAssetErc20Address,
            destAssetErc20Address,
            new BigNumber(srcAmount.toFixed(0, 1))
          );
          result = swapPriceData[0].dividedBy(10 ** 18);
        } catch (e) {
          // console.log(e);
          result = new BigNumber(0);
        }
      }
    }

    return result;
  }

  private onTaskEnqueued = async (requestTask: RequestTask) => {
    await this.processQueue(false, false);
  };

  public onTaskRetry = async (requestTask: RequestTask, skipGas: boolean) => {
    await this.processQueue(true, skipGas);
  };

  public onTaskCancel = async (requestTask: RequestTask) => {
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

  public addTokenToMetaMask = async (task: RequestTask) => {
    return;
    /*if (this.providerType === ProviderType.MetaMask && this.contractsSource) {
      try {
        // @ts-ignore
        if (window.web3) {
          const assetContract = await this.contractsSource.getITokenContract(task.request.asset);
          if (assetContract) {
            const details = AssetsDictionary.assets.get(task.request.asset);
            if (details) {
              // @ts-ignore
              const provider = window.web3.currentProvider;
              const id = new BigNumber(new BigNumber(assetContract.address).toString().substr(0, 5)).toNumber();
              provider.sendAsync({
                method: 'metamask_watchAsset',
                params: {
                  "type":"ERC20",
                  "options":{
                    "address": assetContract.address,
                    "symbol": details.iTokenSymbol,
                    "decimals": details.decimals,
                    "image": details.iTokenLogoUrl,
                  },
                },
                id: id,
              }*//*, (err: any, added: any) => {
// console.log('provider returned', err, added)
if (err || 'error' in added) {
console.log(err, added);
}
}*//*);
  }
}
}
} catch(e) {
// console.log(e);
}
}*/
  }

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
        await this.addTokenToMetaMask(task);

        if (taskRequest.asset === Asset.ETH) {
          const processor = new LendEthProcessor();
          await processor.run(task, account, skipGas);
        } else if (taskRequest.asset === Asset.CHAI) {
          const processor = new LendChaiProcessor();
          await processor.run(task, account, skipGas);
        } else {
          const processor = new LendErcProcessor();
          await processor.run(task, account, skipGas);
        }
      } else {
        if (taskRequest.asset === Asset.ETH) {
          const processor = new UnlendEthProcessor();
          await processor.run(task, account, skipGas);
        } else if (taskRequest.asset === Asset.CHAI) {
          const processor = new UnlendChaiProcessor();
          await processor.run(task, account, skipGas);
        } else {
          const processor = new UnlendErcProcessor();
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

      // 0x api processing
      let taskAmount = new BigNumber(0);
      let zeroXTargetAmount = new BigNumber(0);
      let zeroXTargetAmountInBaseUnits = new BigNumber(0);
      let zeroXTargetType = "";
      let srcTokenAddress = ""
      let destTokenAddress = "";

      if (taskRequest.version === 2) {
        if (siteConfig.ZeroXAPIEnabledForBuys && taskRequest.tradeType === TradeType.BUY) {
          taskAmount = taskRequest.amount;
          zeroXTargetType = "sellAmount";

          let decimals: number;
          if (taskRequest.positionType === PositionType.LONG) {
            decimals = AssetsDictionary.assets.get(taskRequest.unitOfAccount)!.decimals;

            if (taskRequest.collateral === taskRequest.unitOfAccount) {
              zeroXTargetAmount = taskAmount.times(taskRequest.leverage);
            } else {
              zeroXTargetAmount = taskAmount.times(taskRequest.leverage - 1);
              const swapPrice = await this.getSwapRate(
                taskRequest.collateral,
                taskRequest.unitOfAccount
              );
              zeroXTargetAmount = zeroXTargetAmount.multipliedBy(swapPrice);
            }
            srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.unitOfAccount)!;
            destTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!;
          } else {
            decimals = AssetsDictionary.assets.get(taskRequest.asset)!.decimals;

            if (taskRequest.collateral === taskRequest.asset) {
              zeroXTargetAmount = taskAmount.times(taskRequest.leverage + 1);
            } else {
              zeroXTargetAmount = taskAmount.times(taskRequest.leverage);
              const swapPrice = await this.getSwapRate(
                taskRequest.collateral,
                taskRequest.asset
              );
              zeroXTargetAmount = zeroXTargetAmount.multipliedBy(swapPrice);
            }
            srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!;
            destTokenAddress = this.getErc20AddressOfAsset(taskRequest.unitOfAccount)!;
          }

          if (decimals) {
            zeroXTargetAmountInBaseUnits = new BigNumber(zeroXTargetAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
          }
        } else if (siteConfig.ZeroXAPIEnabledForSells && taskRequest.tradeType === TradeType.SELL) {
          taskAmount = taskRequest.inputAmountValue;
          zeroXTargetType = "buyAmount";

          const assetContract = await this.contractsSource.getPTokenContract(new TradeTokenKey(
            taskRequest.asset,
            taskRequest.unitOfAccount,
            taskRequest.positionType,
            taskRequest.leverage,
            taskRequest.isTokenized,
            taskRequest.version
          ));
          if (!assetContract) {
            throw new Error("pToken access error");
          }

          const currentLeverage = (await assetContract.currentLeverage.callAsync()).div(10 ** 18);

          let decimals: number;
          if (taskRequest.positionType === PositionType.LONG) {
            decimals = AssetsDictionary.assets.get(taskRequest.unitOfAccount)!.decimals;

            zeroXTargetAmount = taskAmount.times(currentLeverage);
            if (taskRequest.collateral !== taskRequest.unitOfAccount) {
              const swapPrice = await this.getSwapRate(
                taskRequest.collateral,
                taskRequest.unitOfAccount
              );
              zeroXTargetAmount = zeroXTargetAmount.multipliedBy(swapPrice);
            }
            srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!;
            destTokenAddress = this.getErc20AddressOfAsset(taskRequest.unitOfAccount)!;
          } else {
            decimals = AssetsDictionary.assets.get(taskRequest.asset)!.decimals;
            zeroXTargetAmount = taskAmount.times(currentLeverage);

            if (taskRequest.collateral !== taskRequest.asset) {
              const swapPrice = await this.getSwapRate(
                taskRequest.collateral,
                taskRequest.asset
              );
              zeroXTargetAmount = zeroXTargetAmount.multipliedBy(swapPrice);
            }
            srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.unitOfAccount)!;
            destTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!;
          }

          if (decimals) {
            zeroXTargetAmountInBaseUnits = new BigNumber(zeroXTargetAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
          }
        }
      }

      if (zeroXTargetAmountInBaseUnits.gt(0) && zeroXTargetType !== "") {
        /*console.log(srcTokenAddress);
        console.log(destTokenAddress);
        console.log(new BigNumber(taskRequest.amount.multipliedBy(10 ** 18).toFixed(0, 1)).toString());*/

        //zeroXTargetAmountInBaseUnits = new BigNumber(zeroXTargetAmountInBaseUnits.dividedBy(2).toFixed(0, 1));

        try {

          let urlPrefix = "";
          if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
            urlPrefix = "kovan.";
          } else if (process.env.REACT_APP_ETH_NETWORK !== "mainnet") {
            throw new Error("0x api not supported on this network");
          }


          const responseString = await request("https://" + urlPrefix + "api.0x.org/swap/v0/quote?sellToken=" + srcTokenAddress + "&buyToken=" + destTokenAddress + "&" + zeroXTargetType + "=" + zeroXTargetAmountInBaseUnits.toString());
          const response = JSON.parse(responseString);
          if (!response.protocolFee || !response.data) {
            throw new Error(JSON.stringify(response));
          }
          //console.log(response);
          //console.log(srcTokenAddress, destTokenAddress, zeroXTargetAmountInBaseUnits.toString());

          if (response.protocolFee) { // && response.buyAmount && response.sellAmount) {
            /*const SwapRate0x = new BigNumber(
              new BigNumber(response.buyAmount)
              .times(10**20)
              .dividedBy(response.sellAmount)
              .toFixed(0, 1)
            ).toString();
            console.log(`swapRate`, SwapRate0x);*/

            taskRequest.zeroXFee = new BigNumber(response.protocolFee);

            taskRequest.loanDataBytes = response.data +
              //Web3Utils.padLeft(Web3Utils.numberToHex(SwapRate0x).substr(2), 64) +  
              Web3Utils.padLeft(Web3Utils.numberToHex(response.protocolFee).substr(2), 64) +
              Web3Utils.padLeft("0", 64);


            // swap marketBuyOrdersFillOrKill for marketBuyOrdersNoThrow if found
            taskRequest.loanDataBytes = taskRequest.loanDataBytes.replace("0x8bc8efb3", "0x78d29ac1");
          } else {
            throw new Error("0x payload has missing params");
          }
        } catch (e) {
          console.log(e);

          taskRequest.zeroXFee = new BigNumber(0);
          taskRequest.loanDataBytes = "";
        }

        //console.log(taskRequest.zeroXFee.toString());
        //console.log(taskRequest.loanDataBytes)
      }

      if (taskRequest.tradeType === TradeType.BUY) {
        if (taskRequest.collateral !== Asset.ETH) {
          const processor = new TradeBuyErcProcessor();
          await processor.run(task, account, skipGas);
        } else {
          let processor;
          if (taskRequest.loanDataBytes && taskRequest.zeroXFee) {
            processor = new TradeBuyErcProcessor();
          } else {
            processor = new TradeBuyEthProcessor();
          }
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
          const randomNumber = Math.floor(Math.random() * 100000) + 1;
          const tagManagerArgs = {
            dataLayer: {
              transactionId: randomNumber,
              transactionProducts: [{
                name: "Transaction-Lend-" + request.asset,
                sku: request.asset,
                category: 'Lend'
              }],
            }
          }
          TagManager.dataLayer(tagManagerArgs)
          this.eventEmitter.emit(
            FulcrumProviderEvents.LendTransactionMined,
            new LendTransactionMinedEvent(request.asset, txHash)
          );
        } else {
          const randomNumber = Math.floor(Math.random() * 100000) + 1;
          const tagManagerArgs = {
            dataLayer: {
              transactionId: randomNumber,
              transactionProducts: [{
                name: "Transaction-Trade" + request.asset,
                sku: request.asset,
                category: 'Trade'
              }],
            }
          }
          TagManager.dataLayer(tagManagerArgs)
          this.eventEmitter.emit(
            FulcrumProviderEvents.TradeTransactionMined,
            new TradeTransactionMinedEvent(new TradeTokenKey(
              request.asset,
              request.unitOfAccount,
              request.positionType,
              request.leverage,
              request.isTokenized,
              request.version
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
