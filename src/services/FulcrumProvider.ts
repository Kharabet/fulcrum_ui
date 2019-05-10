import { BigNumber } from "@0x/utils";
import { EventEmitter } from "events";
import moment from "moment";
import Web3 from "web3";
import { TransactionReceipt } from "web3/types";
import { erc20Contract } from "../contracts/erc20";
import { iTokenContract } from "../contracts/iTokenContract";
import { pTokenContract } from "../contracts/pTokenContract";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
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
import { ProviderChangedEvent } from "./events/ProviderChangedEvent";
import { TasksQueueEvents } from "./events/TasksQueueEvents";
import { TasksQueue } from "./TasksQueue";

export class FulcrumProvider {
  public static Instance: FulcrumProvider;

  private readonly gasLimit = 3000000;
  // gasPrice equal to 6 gwei
  private readonly gasPrice = new BigNumber(6).multipliedBy(10 ** 9);
  // gasBufferCoeff equal 110% gas reserve
  private readonly gasBufferCoeff = new BigNumber("1.1");

  private isProcessing: boolean = false;
  private isChecking: boolean = false;

  public readonly eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public web3ProviderSettings: IWeb3ProviderSettings | null = null;
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
    this.web3ProviderSettings = await FulcrumProvider.getWeb3ProviderSettings(this.web3);

    this.contractsSource =
      this.web3 && this.web3ProviderSettings
        ? new ContractsSource(this.web3.currentProvider, this.web3ProviderSettings.networkId)
        : null;
    if (this.contractsSource) {
      await this.contractsSource.Init();
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

  public getPriceDataPoints = async (selectedKey: TradeTokenKey, samplesCount: number, intervalSeconds: number = 21600): Promise<IPriceDataPoint[]> => {
    const result: IPriceDataPoint[] = [];

    if (this.contractsSource) {
      // getting on-chain data
      const assetErc20Address = this.getErc20Address(selectedKey.asset);
      if (assetErc20Address) {
        const referencePriceFeedContract = this.contractsSource.getReferencePriceFeedContract();
        let priceFeed = await referencePriceFeedContract.getPricesForAsset.callAsync(
          assetErc20Address,
          new BigNumber(0),
          new BigNumber(intervalSeconds),
          new BigNumber(samplesCount)
        );
        priceFeed = priceFeed.reverse();
        const latestSwapPrice = await this.getSwapToUsdPrice(selectedKey.asset);
        priceFeed.push({rate: latestSwapPrice.multipliedBy(10 ** 18), timestamp: new BigNumber(moment().unix()) });
        if (priceFeed.length > 1) {
          let rate = priceFeed[0].rate;
          priceFeed.forEach((value, index) => {
            if (index !== 0) {
              result.push({
                timeStamp: value.timestamp.toNumber(),
                price: value.rate.dividedBy(10 ** 18).toNumber(),
                liquidationPrice: 0,
                change24h:
                  rate.isZero()
                    ? value.rate.isZero()
                      ? 0
                      : rate.gte(0)
                        ? 100
                        : -100
                    : rate.minus(value.rate).dividedBy(rate).toNumber()
              });
              rate = value.rate;
            }
          });
        }
      }
    } else {
      // getting empty data
      const beginningTime = moment()
        .startOf("hour")
        .subtract(intervalSeconds, "second");
      for (let i = 0; i < samplesCount + 1; i++) {
        result.push({ timeStamp: beginningTime.unix(), price: 1, liquidationPrice: 0, change24h: 0 });

        // add mutates beginningTime
        beginningTime.add(intervalSeconds, "second");
      }
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

  // both iTokens and pTokens have tokenPrice() (current price)  and checkpointPrice() (price at last checkpoint)
  // profit = (tokenPrice - checkpointPrice) * tokenBalance / 10**36
  public getLendProfit = async (asset: Asset): Promise<BigNumber | null> => {
    // should return null if no data (not traded asset), new BigNumber(0) if no profit
    let result: BigNumber | null = null;
    let account: string | null = null;

    if (this.web3) {
      const accounts = await this.web3.eth.getAccounts();
      account = accounts ? accounts[0].toLowerCase() : null;
    }

    if (account && this.contractsSource) {
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

    if (this.web3) {
      const accounts = await this.web3.eth.getAccounts();
      account = accounts ? accounts[0].toLowerCase() : null;
    }

    if (account && this.contractsSource) {
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

        /*result =
          request.lendType === LendType.LEND
            ? request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice)
            : request.amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);*/
        result = request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice);
      }
    }

    return result;
  };

  public static async getWeb3ProviderSettings(web3: Web3 | null): Promise<IWeb3ProviderSettings | null> {
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

    if (this.web3) {
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

    if (this.web3 && this.contractsSource) {
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
    await this.processQueue(false);
  };

  public onTaskRetry = async (requestTask: RequestTask) => {
    await this.processQueue(true);
  };

  public onTaskCancel = async (requestTask: RequestTask)  => {
    await this.cancelRequestTask(requestTask);
    await this.processQueue(false);
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

  private processQueue = async (force: boolean) => {
    if (!(this.isProcessing || this.isChecking)) {
      let forceOnce = force;
      do {
        this.isProcessing = true;
        this.isChecking = false;

        try {
          const task = TasksQueue.Instance.peek();

          if (task) {
            if (task.status === RequestStatus.AWAITING || (task.status === RequestStatus.FAILED && forceOnce)) {
              await this.processRequestTask(task);
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

  private processRequestTask = async (task: RequestTask) => {
    if (task.request instanceof LendRequest) {
      await this.processLendRequestTask(task);
    }

    if (task.request instanceof TradeRequest) {
      await this.processTradeRequestTask(task);
    }

    return false;
  };

  private processLendRequestTask = async (task: RequestTask) => {
    try {
      if (!(this.web3 && this.contractsSource)) {
        throw new Error("No provider available!");
      }

      const accounts = await this.web3.eth.getAccounts();
      const account = accounts ? accounts[0].toLowerCase() : null;
      if (!account) {
        throw new Error("Unable to get wallet address!");
      }

      // Initializing loan
      const taskRequest: LendRequest = (task.request as LendRequest);
      const amountInBaseUnits = taskRequest.amount.multipliedBy(10 ** 18);
      const tokenContract: iTokenContract | null = await this.contractsSource.getITokenContract(taskRequest.asset);
      if (!tokenContract) {
        throw new Error("No iToken contract available!");
      }

      if (taskRequest.lendType === LendType.LEND) {
        task.processingStart([
          "Initializing loan",
          "Detecting token allowance",
          "Prompting token allowance",
          "Waiting for token allowance",
          "Submitting loan"
        ]);

        if (taskRequest.asset !== Asset.ETH) {
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
            approvePromise = tokenErc20Contract.approve.sendTransactionAsync(tokenContract.address, amountInBaseUnits, { from: account });
          }
          task.processingStepNext();

          // Waiting for token allowance
          if (approvePromise) {
            await approvePromise;
          }
          task.processingStepNext();

          // estimating gas amount
          const gasAmount = await tokenContract.mint.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: this.gasLimit });
          let gasAmountBN = new BigNumber(gasAmount);
          gasAmountBN = gasAmountBN.multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          // Submitting loan
          const txHash = await tokenContract.mint.sendTransactionAsync(account, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        } else {
          // no additional inits or checks
          task.processingStepNext();
          // skip allowance check-prompt-wait for ETH as it's not a token
          task.processingStepNext();
          task.processingStepNext();
          task.processingStepNext();

          // estimating gas amount
          const gasAmount = await tokenContract.mintWithEther.estimateGasAsync(account, { from: account, value: amountInBaseUnits, gas: this.gasLimit });
          // calculating gas cost
          let gasAmountBN = new BigNumber(gasAmount);
          gasAmountBN = gasAmountBN.multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          const gasCost = gasAmountBN.multipliedBy(this.gasPrice).integerValue(BigNumber.ROUND_UP);
          // Submitting loan
          const txHash = await tokenContract.mintWithEther.sendTransactionAsync(account, { from: account, value: amountInBaseUnits.minus(gasCost), gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        }
      } else {
        task.processingStart([
          "Initializing loan",
          /*"Detecting token allowance",
          "Prompting token allowance",
          "Waiting for token allowance",*/
          "Closing loan"
        ]);

        // no additional inits or checks
        task.processingStepNext();
        // skip allowance check-prompt-wait for ETH as it's not a token
        // task.processingStepNext();
        // task.processingStepNext();
        // task.processingStepNext();

        if (taskRequest.asset !== Asset.ETH) {
          // estimating gas amount
          const gasAmount = await tokenContract.burn.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: this.gasLimit });
          let gasAmountBN = new BigNumber(gasAmount);
          gasAmountBN = gasAmountBN.multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          // Submitting unloan
          const txHash = await tokenContract.burn.sendTransactionAsync(account, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        } else {
          // estimating gas amount
          const gasAmount = await tokenContract.burnToEther.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: this.gasLimit });
          let gasAmountBN = new BigNumber(gasAmount);
          gasAmountBN = gasAmountBN.multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          // Submitting unloan
          const txHash = await tokenContract.burnToEther.sendTransactionAsync(account, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        }
      }

      task.processingEnd(true, null);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
      task.processingEnd(false, e);
    }
  };

  private processTradeRequestTask = async (task: RequestTask) => {
    try {
      if (!(this.web3 && this.contractsSource)) {
        throw new Error("No provider available!");
      }

      const accounts = await this.web3.eth.getAccounts();
      const account = accounts ? accounts[0].toLowerCase() : null;
      if (!account) {
        throw new Error("Unable to get wallet address!");
      }

      // Initializing loan
      const taskRequest: TradeRequest = (task.request as TradeRequest);
      const amountInBaseUnits = taskRequest.amount.multipliedBy(10 ** 18);
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
        task.processingStart([
          "Initializing trade",
          "Detecting token allowance",
          "Prompting token allowance",
          "Waiting for token allowance",
          "Submitting trade"
        ]);

        if (taskRequest.collateral !== Asset.ETH) {
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
            approvePromise = tokenErc20Contract.approve.sendTransactionAsync(tokenContract.address, amountInBaseUnits, { from: account });
          }
          task.processingStepNext();

          // Waiting for token allowance
          if (approvePromise) {
            await approvePromise;
          }
          task.processingStepNext();

          // estimating gas amount
          const gasAmount = await tokenContract.mintWithToken.estimateGasAsync(account, assetErc20Address, amountInBaseUnits, { from: account, value: amountInBaseUnits, gas: this.gasLimit });
          let gasAmountBN = new BigNumber(gasAmount);
          gasAmountBN = gasAmountBN.multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          // Submitting trade
          const txHash = await tokenContract.mintWithToken.sendTransactionAsync(account, assetErc20Address, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        } else {
          // no additional inits or checks
          task.processingStepNext();
          // skip allowance check-prompt-wait for ETH as it's not a token
          task.processingStepNext();
          task.processingStepNext();
          task.processingStepNext();

          // estimating gas amount
          const gasAmount = await tokenContract.mintWithEther.estimateGasAsync(account, { from: account, value: amountInBaseUnits, gas: this.gasLimit });
          // calculating gas cost
          let gasAmountBN = new BigNumber(gasAmount);
          gasAmountBN = gasAmountBN.multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          const gasCost = gasAmountBN.multipliedBy(this.gasPrice).integerValue(BigNumber.ROUND_UP);
          // Submitting trade
          const txHash = await tokenContract.mintWithEther.sendTransactionAsync(account, { from: account, value: amountInBaseUnits.minus(gasCost), gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        }
      } else {
        task.processingStart([
          "Initializing trade",
          /*"Detecting token allowance",
          "Prompting token allowance",
          "Waiting for token allowance",*/
          "Closing trade"
        ]);

        // no additional inits or checks
        task.processingStepNext();
        // skip allowance check-prompt-wait for ETH as it's not a token
        // task.processingStepNext();
        // task.processingStepNext();
        // task.processingStepNext();

        if (taskRequest.collateral !== Asset.ETH) {
          // Submitting unloan
          const assetErc20Address = this.getErc20Address(taskRequest.collateral);
          if (assetErc20Address) {
            // estimating gas amount
            const gasAmount = await tokenContract.burnToToken.estimateGasAsync(
              account,
              assetErc20Address,
              amountInBaseUnits,
              { from: account, gas: this.gasLimit }
            );
            let gasAmountBN = new BigNumber(gasAmount);
            gasAmountBN = gasAmountBN.multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
            // Closing trade
            const txHash = await tokenContract.burnToToken.sendTransactionAsync(
              account,
              assetErc20Address,
              amountInBaseUnits,
              { from: account, gas: gasAmountBN }
            );
            task.setTxHash(txHash);
            const txReceipt = await this.waitForTransactionMined(txHash);
            if (!txReceipt.status) {
              throw new Error("Reverted by EVM");
            }
          }
        } else {
          // estimating gas amount
          const gasAmount = await tokenContract.burnToEther.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: this.gasLimit });
          let gasAmountBN = new BigNumber(gasAmount);
          gasAmountBN = gasAmountBN.multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          // Closing trade
          const txHash = await tokenContract.burnToEther.sendTransactionAsync(account, amountInBaseUnits, { from: account, gas: gasAmountBN });
          task.setTxHash(txHash);
          const txReceipt = await this.waitForTransactionMined(txHash);
          if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
          }
        }
      }

      task.processingEnd(true, null);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
      task.processingEnd(false, e);
    }
  };

  private waitForTransactionMined = async (txHash: string): Promise<TransactionReceipt> => {
    return new Promise((resolve, reject) => {
      try {
        if (!this.web3) {
          throw new Error("web3 is not available");
        }

        this.waitForTransactionMinedRecursive(txHash, this.web3, resolve, reject);
      } catch (e) {
        throw e;
      }
    });
  };

  private waitForTransactionMinedRecursive = async (
    txHash: string,
    web3: Web3,
    resolve: (value: any) => void,
    reject: (value: any) => void) => {

    try {
      web3.eth.getTransactionReceipt(txHash, (error: Error, receipt: TransactionReceipt) => {
        if (error) {
          throw error;
        }

        if (receipt) {
          resolve(receipt);
        } else {
          window.setTimeout(() => {
            this.waitForTransactionMinedRecursive(txHash, web3, resolve, reject);
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
