import { Web3ProviderEngine } from '@0x/subproviders'
import { BigNumber } from '@0x/utils'
import { Web3Wrapper } from '@0x/web3-wrapper'
import { EventEmitter } from 'events'
import Asset from 'bzx-common/src/assets/Asset'

import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'

import { IPriceDataPoint } from '../domain/IPriceDataPoint'
import { IWeb3ProviderSettings } from '../domain/IWeb3ProviderSettings'
import { ICollateralChangeEstimate } from '../domain/ICollateralChangeEstimate'
import { ICollateralManagementParams } from '../domain/ICollateralManagementParams'
import { LendRequest } from '../domain/LendRequest'
import { LendType } from '../domain/LendType'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { PositionType } from '../domain/PositionType'
import { ProviderType } from '../domain/ProviderType'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { ReserveDetails } from '../domain/ReserveDetails'
import { TradeRequest } from '../domain/TradeRequest'
import { TradeTokenKey } from '../domain/TradeTokenKey'
import { TradeType } from '../domain/TradeType'
import { Web3ConnectionFactory } from '../domain/Web3ConnectionFactory'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'
import ContractsSource from 'bzx-common/src/contracts/ContractsSource'
import { FulcrumProviderEvents } from './events/FulcrumProviderEvents'
import { LendTransactionMinedEvent } from './events/LendTransactionMinedEvent'
import { TasksQueueEvents } from './events/TasksQueueEvents'
import { TasksQueue } from './TasksQueue'

import TagManager from 'react-gtm-module'
import configProviders from '../config/providers.json'

import { AbstractConnector } from '@web3-react/abstract-connector'

import Web3Utils from 'web3-utils'

import {
  CloseWithSwapEvent,
  DepositCollateralEvent,
  EarnRewardEvent,
  EarnRewardEventNew,
  LiquidationEvent,
  PayTradingFeeEvent,
  RolloverEvent,
  TradeEvent,
  WithdrawCollateralEvent
} from 'bzx-common/src/domain/events'
import {
  getCloseWithSwapHistory,
  getDepositCollateralHistory,
  getEarnRewardHistory,
  getLiquidationHistory,
  getLogsFromEtherscan,
  getPayTradingFeeHistory,
  getRolloverHistory,
  getTradeHistory,
  getWithdrawCollateralHistory
} from 'bzx-common/src/utils'

import { ProviderTypeDictionary } from '../domain/ProviderTypeDictionary'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { ILoanParams } from '../domain/ILoanParams'
import { RolloverRequest } from '../domain/RolloverRequest'
import { IExtendState } from '../domain/IExtendState'
import { IExtendEstimate } from '../domain/IExtendEstimate'

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

const getNetworkIdByString = (networkName: string | undefined) => {
  switch (networkName) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    default:
      return 0
  }
}
const networkName = process.env.REACT_APP_ETH_NETWORK
const initialNetworkId = getNetworkIdByString(networkName)

export class FulcrumProvider {
  public static Instance: FulcrumProvider
  public impersonateAddress = ''
  public readonly gasLimit = '4500000'
  public static readonly ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber('1.06')
  public readonly gasBufferCoeffForTrade = new BigNumber('1.1')
  // 5000ms
  public readonly successDisplayTimeout = 5000

  public readonly gasBufferForLend = new BigNumber(10 ** 16) // 0.01 ETH
  public readonly gasBufferForTrade = new BigNumber(5 * 10 ** 16) // 0.05 ETH

  public static readonly MAX_UINT = new BigNumber(2).pow(256).minus(1)

  public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1)

  private isProcessing: boolean = false
  private isChecking: boolean = false

  public readonly eventEmitter: EventEmitter
  public providerType: ProviderType = ProviderType.None
  public providerEngine: Web3ProviderEngine | null = null
  public web3Wrapper: Web3Wrapper | null = null
  public web3ProviderSettings: IWeb3ProviderSettings
  public contractsSource: ContractsSource | null = null
  public accounts: string[] = []
  public isLoading: boolean = false
  public unsupportedNetwork: boolean = false

  public readonly lendAssetsShown: Asset[]
  public readonly gasBufferForTxn = new BigNumber(5 * 10 ** 16) // 0.05 ETH

  constructor() {
    // init
    this.eventEmitter = new EventEmitter()
    this.eventEmitter.setMaxListeners(1000)
    TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued)

    if (networkName === 'kovan') {
      this.lendAssetsShown = [Asset.fWETH, Asset.USDC, Asset.WBTC]
    } else if (networkName === 'ropsten') {
      this.lendAssetsShown = [Asset.ETH, Asset.DAI]
    } else {
      this.lendAssetsShown = [
        Asset.ETH,
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.WBTC,
        Asset.LINK,
        Asset.YFI,
        Asset.BZRX,
        Asset.MKR,
        Asset.KNC,
        Asset.UNI,
        Asset.AAVE,
        Asset.LRC,
        Asset.COMP
      ]
    }
    // singleton
    if (!FulcrumProvider.Instance) {
      FulcrumProvider.Instance = this
    }

    const storedProvider: any = FulcrumProvider.getLocalstorageItem('providerType')
    const providerType: ProviderType | null = (storedProvider as ProviderType) || null

    this.web3ProviderSettings = FulcrumProvider.getWeb3ProviderSettings(initialNetworkId)
    // setting up readonly provider only when user wasn't connected earlier with the wallet
    providerType === null ||
      (providerType === ProviderType.None &&
        Web3ConnectionFactory.setReadonlyProvider().then(() => {
          const web3Wrapper = Web3ConnectionFactory.currentWeb3Wrapper
          const engine = Web3ConnectionFactory.currentWeb3Engine
          const canWrite = Web3ConnectionFactory.canWrite

          if (web3Wrapper && this.web3ProviderSettings) {
            const contractsSource = new ContractsSource(
              engine,
              this.web3ProviderSettings.networkId,
              canWrite
            )
            contractsSource.Init().then(() => {
              this.web3Wrapper = web3Wrapper
              this.providerEngine = engine
              this.contractsSource = contractsSource
              this.eventEmitter.emit(FulcrumProviderEvents.ProviderAvailable)
            })
          }
        }))

    return FulcrumProvider.Instance
  }

  public getCurrentAccount(): string | undefined {
    return this.impersonateAddress
      ? this.impersonateAddress
      : this.accounts.length > 0 && this.accounts[0]
      ? this.accounts[0].toLowerCase()
      : undefined
  }
  public static getLocalstorageItem(item: string): string {
    let response = ''
    try {
      response = localStorage.getItem(item) || ''
    } catch (e) {
      console.error(e)
    }
    return response
  }

  public static setLocalstorageItem(item: string, val: string) {
    try {
      localStorage.setItem(item, val)
    } catch (e) {
      console.error(e)
    }
  }

  public async setWeb3Provider(connector: AbstractConnector, account?: string) {
    this.eventEmitter.emit(FulcrumProviderEvents.ProviderIsChanging)

    this.unsupportedNetwork = false
    const providerType = await ProviderTypeDictionary.getProviderTypeByConnector(connector)
    await Web3ConnectionFactory.setWalletProvider(connector, providerType, account)
    await this.setWeb3ProviderFinalize(providerType)
  }

  public async setReadonlyWeb3Provider() {
    await Web3ConnectionFactory.setReadonlyProvider()
    await this.setWeb3ProviderFinalize(ProviderType.None)
  }

  public async setWeb3ProviderFinalize(providerType: ProviderType) {
    // : Promise<boolean> {

    this.unsupportedNetwork = false
    this.web3Wrapper = Web3ConnectionFactory.currentWeb3Wrapper
    this.providerEngine = Web3ConnectionFactory.currentWeb3Engine
    let canWrite = Web3ConnectionFactory.canWrite
    const networkId = Web3ConnectionFactory.networkId
    this.accounts = Web3ConnectionFactory.userAccount ? [Web3ConnectionFactory.userAccount] : []

    if (this.web3Wrapper && networkId !== initialNetworkId) {
      // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)
      this.unsupportedNetwork = true
      canWrite = false // revert back to read-only
    }

    if (this.web3Wrapper && canWrite) {
      const web3EngineAccounts = await this.web3Wrapper.getAvailableAddressesAsync()
      if (web3EngineAccounts.length > 0 && this.accounts.length === 0) {
        this.accounts = web3EngineAccounts
      }
      if (this.accounts.length === 0) {
        canWrite = false // revert back to read-only
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      const newContractsSource = new ContractsSource(
        this.providerEngine,
        this.web3ProviderSettings.networkId,
        canWrite
      )
      await newContractsSource.Init()
      this.contractsSource = newContractsSource
    } else {
      this.contractsSource = null
    }

    this.providerType =
      canWrite || (!canWrite && this.unsupportedNetwork) ? providerType : ProviderType.None

    FulcrumProvider.setLocalstorageItem('providerType', this.providerType)

    this.eventEmitter.emit(
      FulcrumProviderEvents.ProviderChanged,
      new ProviderChangedEvent(this.providerType, this.web3Wrapper)
    )
  }

  public async setWeb3ProviderMobileFinalize(
    providerType: ProviderType,
    providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number, string]
  ) {
    // : Promise<boolean> {
    this.web3Wrapper = providerData[0]
    this.providerEngine = providerData[1]
    let canWrite = providerData[2]
    let networkId = providerData[3]
    const sellectedAccount = providerData[4]

    if (this.web3Wrapper) {
      if (this.web3ProviderSettings.networkName !== process.env.REACT_APP_ETH_NETWORK) {
        // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)

        this.unsupportedNetwork = true
        canWrite = false // revert back to read-only
      }
    }

    if (this.web3Wrapper && canWrite) {
      try {
        this.accounts = [sellectedAccount] // await this.web3Wrapper.getAvailableAddressesAsync() || [];
      } catch (e) {
        console.error(e)
        this.accounts = []
      }
      if (this.accounts.length === 0) {
        canWrite = false // revert back to read-only
      }
    } else {
      // this.accounts = [];
      if (providerType === ProviderType.Bitski && networkId !== 1) {
        this.unsupportedNetwork = true
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      this.contractsSource = await new ContractsSource(
        this.providerEngine,
        this.web3ProviderSettings.networkId,
        canWrite
      )
      if (canWrite) {
        this.providerType = providerType
      } else {
        this.providerType = ProviderType.None
      }
      FulcrumProvider.setLocalstorageItem('providerType', this.providerType)
    } else {
      this.contractsSource = null
    }

    if (this.contractsSource) {
      await this.contractsSource.Init()
    }
  }

  public onLendConfirmed = async (request: LendRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onTradeConfirmed = async (request: TradeRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onRolloverConfirmed = async (request: RolloverRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onManageCollateralConfirmed = async (request: ManageCollateralRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onExtendLoanConfirmed = async (request: ExtendLoanRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public getLendTokenInterestRate = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)
    if (this.contractsSource) {
      const assetContract = this.contractsSource.getITokenContract(asset)
      if (assetContract) {
        result = await assetContract.supplyInterestRate.callAsync()
        result = result.dividedBy(10 ** 18)
      }
    }

    return result
  }

  // public getTradeTokenInterestRate = async (selectedKey: TradeTokenKey): Promise<BigNumber> => {
  //   let result = new BigNumber(0)
  //   if (this.contractsSource) {
  //     const assetContract = this.contractsSource.getITokenContract(selectedKey.loanAsset)
  //     if (assetContract) {
  //       result = await assetContract.avgBorrowInterestRate.callAsync()
  //       result = result.dividedBy(10 ** 18)
  //     }
  //   }

  //   return result
  // }

  // public getTradeTokenAssetLatestDataPoint = async (
  //   selectedKey: TradeTokenKey
  // ): Promise<IPriceDataPoint> => {
  //   try {
  //     const currentPrice = await this.getSwapToUsdRate(selectedKey.asset)
  //     const priceLatestDataPoint = await this.getPriceDefaultDataPoint()

  //     priceLatestDataPoint.price = currentPrice.toNumber()

  //     if (this.contractsSource) {
  //       const assetContract = await this.contractsSource.getPTokenContract(selectedKey)
  //       if (assetContract) {
  //         const currentLeverage = (await assetContract.currentLeverage.callAsync()).div(10 ** 18)
  //         const currentMargin = currentLeverage.gt(0)
  //           ? new BigNumber(1).div(currentLeverage)
  //           : new BigNumber(1).div(selectedKey.leverage)

  //         const maintenanceMargin = new BigNumber(0.15)

  //         if (currentMargin.lte(maintenanceMargin)) {
  //           priceLatestDataPoint.liquidationPrice = priceLatestDataPoint.price
  //         } else {
  //           const initialLeverage = new BigNumber(selectedKey.leverage)
  //           const initialMargin = new BigNumber(1).div(initialLeverage)

  //           // initial_price = current_price - (current_price / initial_leverage * (current_margin - initial_margin))
  //           const offset = currentPrice
  //             .dividedBy(initialLeverage)
  //             .multipliedBy(currentMargin.minus(initialMargin))

  //           const initialPrice =
  //             selectedKey.positionType === PositionType.SHORT
  //               ? currentPrice.plus(offset)
  //               : currentPrice.minus(offset)

  //           // liquidation_price = initial_price * (maintenance_margin * current_leverage + initial_leverage) / (initial_leverage + 1)
  //           let liquidationPrice = initialPrice
  //             .multipliedBy(maintenanceMargin.times(currentLeverage).plus(initialLeverage))
  //             .div(initialLeverage.plus(1))

  //           if (selectedKey.positionType === PositionType.SHORT) {
  //             liquidationPrice = initialPrice.plus(initialPrice).minus(liquidationPrice)
  //           }

  //           /*console.log(`offset`,offset.toString());
  //           console.log(`maintenanceMargin`,maintenanceMargin.toString());
  //           console.log(`initialLeverage`,initialLeverage.toString());
  //           console.log(`initialMargin`,initialMargin.toString())
  //           console.log(`currentPrice`,currentPrice.toString());
  //           console.log(`currentLeverage`,currentLeverage.toString());
  //           console.log(`currentMargin`,currentMargin.toString());
  //           console.log(`initialPrice`,initialPrice.toString());
  //           console.log(`liquidationPrice`,liquidationPrice.toString());*/

  //           priceLatestDataPoint.liquidationPrice = liquidationPrice.toNumber()
  //         }
  //       }
  //     }
  //     return priceLatestDataPoint
  //   } catch (e) {
  //     return this.getPriceDefaultDataPoint()
  //   }
  // }

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

  public getLargeApprovalAmount = (
    asset: Asset,
    neededAmount: BigNumber = new BigNumber(0)
  ): BigNumber => {
    return FulcrumProvider.MAX_UINT
    /*let amount = new BigNumber(0);

    switch (asset) {
      case Asset.ETH:
      case Asset.WETH:
      case Asset.fWETH:
        amount = new BigNumber(10 ** 18).multipliedBy(1500);
      case Asset.WBTC:
      case Asset.YFI:
        amount = new BigNumber(10 ** 8).multipliedBy(25);
      case Asset.BZRX:
        amount = new BigNumber(10 ** 18).multipliedBy(400000);
      case Asset.LINK:
        amount = new BigNumber(10 ** 18).multipliedBy(60000);
      case Asset.ZRX:
        amount = new BigNumber(10 ** 18).multipliedBy(750000);
      case Asset.KNC:
        amount = new BigNumber(10 ** 18).multipliedBy(550000);
      case Asset.BAT:
        amount = new BigNumber(10 ** 18).multipliedBy(750000);
      case Asset.DAI:
      case Asset.SAI:
      case Asset.SUSD:
        amount = new BigNumber(10 ** 18).multipliedBy(375000);
      case Asset.USDC:
      case Asset.USDT:
        amount = new BigNumber(10 ** 6).multipliedBy(375000);
      case Asset.REP:
        amount = new BigNumber(10 ** 18).multipliedBy(15000);
      case Asset.MKR:
        amount = new BigNumber(10 ** 18).multipliedBy(1250);
      case Asset.CHI:
        amount = new BigNumber(10 ** 18);
      default:
        break;
    }

    if (amount.eq(0)) {
      throw new Error("Invalid approval asset!");
    }
    
    return amount.gt(neededAmount) ? amount : neededAmount;*/
  }

  public setApproval = async (
    spender: string,
    asset: Asset,
    amountInBaseUnits: BigNumber
  ): Promise<string> => {
    const resetRequiredAssets = [Asset.USDT, Asset.KNC] // these assets require to set approve to 0 before approve larger amount than the current spend limit
    let result = ''
    const assetErc20Address = this.getErc20AddressOfAsset(asset)

    if (
      !this.web3Wrapper ||
      !this.contractsSource ||
      !this.contractsSource.canWrite ||
      !assetErc20Address
    ) {
      return result
    }

    const account = this.getCurrentAccount()
    const tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address)

    if (!account || !tokenErc20Contract) {
      return result
    }

    if (resetRequiredAssets.includes(asset)) {
      const allowance = await tokenErc20Contract.allowance.callAsync(account, spender)
      if (allowance.gt(0) && amountInBaseUnits.gt(allowance)) {
        const zeroApprovHash = await tokenErc20Contract.approve.sendTransactionAsync(
          spender,
          new BigNumber(0),
          { from: account }
        )
        await this.waitForTransactionMined(zeroApprovHash)
      }
    }

    result = await tokenErc20Contract.approve.sendTransactionAsync(spender, amountInBaseUnits, {
      from: account
    })

    return result
  }

  public getPriceDefaultDataPoint = (): IPriceDataPoint => {
    return {
      timeStamp: Math.round(new Date().getTime() / 1000),
      price: 0,
      liquidationPrice: 0,
      change24h: 0
    }
  }

  public getReserveDetails = async (assets: Asset[]): Promise<ReserveDetails[]> => {
    let result: ReserveDetails[] = []

    if (this.contractsSource) {
      const addressLookup = await this.contractsSource.getITokenAddressesAndReduce(assets)
      assets = addressLookup[0]
      const tokens = addressLookup[1]
      const helperContract = await this.contractsSource.getDAppHelperContract()
      if (tokens && helperContract) {
        let swapRates
        try {
          swapRates = (await this.getSwapToUsdRateBatch(assets, Asset.DAI))[0]
        } catch (e) {
          //console.log(e);
        }

        //const vBZRXBalance = await this.getErc20BalanceOfUser(assetErc20Address, this.contractsSource.getBZxVaultAddress());

        const reserveData = await helperContract.reserveDetails.callAsync(tokens)
        let usdSupplyAll = new BigNumber(0)
        let usdTotalLockedAll = new BigNumber(0)
        if (reserveData && reserveData[0].length > 0) {
          for (let i = 0; i < reserveData[0].length; i++) {
            let asset = assets[i]
            let symbol: string = ''
            let name: string = ''
            let assetAddress: string = tokens[i]

            let totalAssetSupply = new BigNumber(reserveData[0][i])
            let totalAssetBorrow = new BigNumber(reserveData[1][i])
            let supplyInterestRate = new BigNumber(reserveData[2][i])
            let borrowInterestRate = new BigNumber(reserveData[4][i])
            let torqueBorrowInterestRate = new BigNumber(reserveData[4][i])
            let vaultBalance = new BigNumber(reserveData[5][i])
            let marketLiquidity = totalAssetSupply.minus(totalAssetBorrow)

            const decimals = AssetsDictionary.assets.get(asset)!.decimals || 18
            let usdSupply = new BigNumber(0)
            let usdTotalLocked = new BigNumber(0)

            if (asset === Asset.ETHv1) {
              vaultBalance = await this.getAssetTokenBalanceOfUser(
                Asset.WETH,
                '0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633'
              )
            }

            const precision = new BigNumber(10 ** (18 - decimals))
            totalAssetSupply = totalAssetSupply.times(precision)
            totalAssetBorrow = totalAssetBorrow.times(precision)
            marketLiquidity = marketLiquidity.times(precision)
            //liquidityReserved = liquidityReserved.times(precision);
            vaultBalance = vaultBalance.times(precision)

            if (asset === Asset.BZRX) {
              const vbzrxLockedAmount = await this.getErc20BalanceOfUser(
                '0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F',
                '0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f'
              )
              vaultBalance = vaultBalance.plus(vbzrxLockedAmount.times(precision))
            }

            if (swapRates && swapRates[i]) {
              usdSupply = totalAssetSupply!.times(swapRates[i]).dividedBy(10 ** 18)
              usdSupplyAll = usdSupplyAll.plus(usdSupply)

              usdTotalLocked = marketLiquidity
                .plus(vaultBalance)
                .times(swapRates[i])
                .dividedBy(10 ** 18)
              usdTotalLockedAll = usdTotalLockedAll.plus(usdTotalLocked)
            }

            result.push(
              new ReserveDetails(
                asset,
                assetAddress,
                symbol,
                name,
                decimals,
                null, // tokenPrice.dividedBy(10 ** 18),
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
              )
            )
          }

          result.push(
            new ReserveDetails(
              Asset.UNKNOWN,
              '',
              '',
              '',
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
            )
          )
        }
      }
    }

    return result
  }

  public getBorrowInterestRate = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)
    if (this.contractsSource) {
      const assetContract = this.contractsSource.getITokenContract(asset)
      if (assetContract) {
        result = await assetContract.borrowInterestRate.callAsync()
        result = result.dividedBy(10 ** 18)
      }
    }

    return result
  }

  /*public getReserveDetails = async (asset: Asset): Promise<ReserveDetails | null> => {
    let result: ReserveDetails | null = null;

    if (this.contractsSource) {
      const assetContract = this.contractsSource.getITokenContract(asset);
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

  public getLendProfit = async (asset: Asset): Promise<[BigNumber, BigNumber]> => {
    // should return null if no data (not traded asset), new BigNumber(0) if no profit
    let result: [BigNumber, BigNumber] = [new BigNumber(0), new BigNumber(0)]

    const account = this.getCurrentAccount()

    if (account && this.web3Wrapper && this.contractsSource) {
      const assetContract = this.contractsSource.getITokenContract(asset)
      if (assetContract) {
        const precision = AssetsDictionary.assets.get(asset)!.decimals || 18
        const balance = (await assetContract.assetBalanceOf.callAsync(account)).div(10 ** precision)
        result = [new BigNumber(0), balance]

        if (balance.gt(0)) {
          const profit = (await assetContract.profitOf.callAsync(account)).div(10 ** precision)
          result = [profit, balance]
        }
      }
    }
    return result
  }

  public getBaseAsset = (key: TradeTokenKey): Asset => {
    if (key.positionType === PositionType.SHORT) {
      return key.version === 2 ? key.unitOfAccount : key.loanAsset
    } else {
      return key.version === 2 ? key.asset : key.loanAsset
    }
  }

  // public getTradeBalanceAndProfit = async (selectedKey: TradeTokenKey): Promise<[BigNumber | null, BigNumber | null]> => {
  //   // should return null if no data (not traded asset), new BigNumber(0) if no profit
  //   let assetBalance: BigNumber | null = new BigNumber(0);
  //   let profit: BigNumber | null = new BigNumber(0);
  //   let account: string | null = null;

  //   if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
  //     account = this.getCurrentAccount()
  //   }

  //   if (account && this.contractsSource && this.contractsSource.canWrite) {
  //     const balance = await this.getPTokenBalanceOfUser(selectedKey);
  //     if (balance.gt(0)) {
  //       const assetContract = await this.contractsSource.getPTokenContract(selectedKey);
  //       if (assetContract) {
  //         const baseAsset = this.getBaseAsset(selectedKey);
  //         const swapPrice = await this.getSwapToUsdRate(baseAsset);
  //         const tokenPrice = await assetContract.tokenPrice.callAsync();
  //         const checkpointPrice = await assetContract.checkpointPrice.callAsync(account);

  //         let decimalOffset = 0;
  //         if (baseAsset === Asset.WBTC && selectedKey.positionType === PositionType.LONG) {
  //           decimalOffset = -10;
  //         }

  //         assetBalance = tokenPrice
  //           .multipliedBy(balance)
  //           .multipliedBy(swapPrice)
  //           .dividedBy(10 ** (36 - decimalOffset));

  //         profit = tokenPrice
  //           .minus(checkpointPrice)
  //           .multipliedBy(balance)
  //           .multipliedBy(swapPrice)
  //           .dividedBy(10 ** (36 - decimalOffset));
  //       }
  //     }
  //   }

  //   return [assetBalance, profit];
  // };

  public getMaxTradeValue = async (
    tradeType: TradeType,
    baseToken: Asset,
    quoteToken: Asset,
    depositToken: Asset,
    positionType: PositionType,
    loan?: IBorrowedFundsState
  ): Promise<BigNumber> => {
    let result = new BigNumber(0)

    if (tradeType === TradeType.BUY) {
      if (this.contractsSource) {
        const loanToken = positionType === PositionType.LONG ? quoteToken : baseToken
        const collateralToken = positionType === PositionType.LONG ? baseToken : quoteToken

        const assetContract = this.contractsSource.getITokenContract(loanToken)
        if (!assetContract) return result

        const precision = AssetsDictionary.assets.get(loanToken)!.decimals || 18
        let marketLiquidity = await assetContract.marketLiquidity.callAsync()
        marketLiquidity = marketLiquidity.multipliedBy(10 ** (18 - precision))

        if (depositToken !== loanToken) {
          const swapPrice = await this.getSwapRate(loanToken, depositToken)
          marketLiquidity = marketLiquidity.multipliedBy(swapPrice)
        }

        const balance = await this.getAssetTokenBalanceOfUser(depositToken)

        result = BigNumber.min(marketLiquidity, balance)

        if (depositToken === Asset.ETH) {
          result = result.gt(this.gasBufferForTrade)
            ? result.minus(this.gasBufferForTrade)
            : new BigNumber(0)
        }
      }
    } else {
      if (loan && loan.loanData) {
        const loanAssetDecimals = AssetsDictionary.assets.get(loan.loanAsset)!.decimals || 18
        const collateralAssetDecimals =
          AssetsDictionary.assets.get(loan.collateralAsset)!.decimals || 18

        const loanAssetPrecision = new BigNumber(10 ** (18 - loanAssetDecimals))
        const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralAssetDecimals))

        result =
          positionType === PositionType.LONG
            ? loan.loanData.collateral.times(collateralAssetPrecision)
            : loan.loanData.principal.times(loanAssetPrecision)
      }
    }

    result = result.dividedBy(10 ** 18)

    return result
  }

  public getMaxLendValue = async (
    request: LendRequest
  ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, string]> => {
    let maxLendAmount = new BigNumber(0)
    let maxTokenAmount = new BigNumber(0)
    let tokenPrice = new BigNumber(0)
    let chaiPrice = new BigNumber(0)
    let infoMessage: string = ''
    if (request.lendType === LendType.LEND) {
      maxLendAmount = await this.getAssetTokenBalanceOfUser(request.asset)
      if (request.asset === Asset.ETH) {
        maxLendAmount = maxLendAmount.gt(this.gasBufferForLend)
          ? maxLendAmount.minus(this.gasBufferForLend)
          : new BigNumber(0)
      }
    } else {
      /*maxLendAmount =
        request.lendType === LendType.LEND
          ? request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice)
          : request.amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);*/
      if (this.contractsSource) {
        const assetContract = this.contractsSource.getITokenContract(request.asset)
        if (assetContract) {
          const precision = AssetsDictionary.assets.get(request.asset)!.decimals || 18
          if (request.asset === Asset.CHAI) {
            chaiPrice = await assetContract.chaiPrice.callAsync()
          }
          tokenPrice = await assetContract.tokenPrice.callAsync()
          maxTokenAmount = await this.getITokenBalanceOfUser(request.asset)
          let freeSupply = await assetContract.marketLiquidity.callAsync() // .multipliedBy(0.95);
          let userBalance = maxTokenAmount
            .multipliedBy(tokenPrice)
            .dividedBy(10 ** (36 - precision))

          if (request.asset === Asset.CHAI) {
            freeSupply = freeSupply.multipliedBy(10 ** 18).dividedBy(chaiPrice)
            userBalance = userBalance.multipliedBy(10 ** 18).dividedBy(chaiPrice)
          }

          if (freeSupply.lt(userBalance)) {
            maxLendAmount = freeSupply
            maxTokenAmount = maxTokenAmount.multipliedBy(freeSupply).dividedBy(userBalance)
            if (request.lendType === LendType.UNLEND)
              infoMessage = 'Insufficient liquidity for unlend. Please try again later.'
          } else {
            maxLendAmount = userBalance
          }

          maxLendAmount = maxLendAmount.multipliedBy(10 ** (18 - precision))
        }
      }
    }

    maxLendAmount = maxLendAmount.dividedBy(10 ** 18)
    maxTokenAmount = maxTokenAmount.dividedBy(10 ** 18)

    return [maxLendAmount, maxTokenAmount, tokenPrice, chaiPrice, infoMessage]
  }

  // public getPTokenPrice = async (selectedKey: TradeTokenKey): Promise<BigNumber> => {
  //   let result = new BigNumber(0)

  //   if (this.contractsSource) {
  //     const assetContract = await this.contractsSource.getPTokenContract(selectedKey)
  //     if (assetContract) {
  //       result = await assetContract.tokenPrice.callAsync()
  //     }
  //   }

  //   return result.dividedBy(10 ** 18)
  // }

  // public getPTokenValueOfUser = async (
  //   selectedKey: TradeTokenKey,
  //   account?: string
  // ): Promise<BigNumber> => {
  //   let result = new BigNumber(0)

  //   if (this.web3Wrapper && this.contractsSource) {
  //     if (!account && this.contractsSource.canWrite) {
  //       account = this.getCurrentAccount()
  //     }

  //     if (account) {
  //       const assetContract = await this.contractsSource.getPTokenContract(selectedKey)
  //       if (assetContract) {
  //         result = await assetContract.positionValue.callAsync(account)
  //       }
  //     }
  //   }

  //   return result.dividedBy(10 ** 18)
  // }

  // public getTradedAmountEstimate = async (request: TradeRequest): Promise<BigNumber> => {
  //   let result = new BigNumber(0);

  //   if (request.amount.eq(0)) {
  //     return result;
  //   }

  //   if (this.contractsSource) {
  //     const key = new TradeTokenKey(
  //       request.asset,
  //       request.collateral,
  //       request.positionType,
  //       request.leverage,
  //       request.isTokenized,
  //       request.version
  //     );
  //     const assetContract = await this.contractsSource.getPTokenContract(key);
  //     if (assetContract) {
  //       const tokenPrice = await assetContract.tokenPrice.callAsync();
  //       let amount = request.amount;
  //       if (request.tradeType === TradeType.SELL) {
  //         amount = amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);
  //       }
  //       const baseAsset = this.getBaseAsset(key);
  //       if (request.collateral !== baseAsset) {
  //         const srcToken = request.tradeType === TradeType.BUY ? request.collateral : baseAsset;
  //         const destToken = request.tradeType === TradeType.BUY ? baseAsset : request.collateral;
  //         const srcDecimals: number = AssetsDictionary.assets.get(srcToken)!.decimals || 18;
  //         const swapPrice = await this.getSwapRate(
  //           srcToken,
  //           destToken,
  //           amount.multipliedBy(10 ** srcDecimals)
  //         );
  //         amount = amount.multipliedBy(swapPrice);
  //       }
  //       if (request.tradeType === TradeType.BUY) {
  //         amount = amount.multipliedBy(10 ** 18).dividedBy(tokenPrice);
  //       }
  //       result = amount;
  //     }
  //   }

  //   return result;
  // };

  public getLendedAmountEstimate = async (request: LendRequest): Promise<BigNumber> => {
    let result = new BigNumber(0)

    if (this.contractsSource) {
      const assetContract = this.contractsSource.getITokenContract(request.asset)
      if (assetContract) {
        const tokenPrice = await assetContract.tokenPrice.callAsync()

        /*result =
          request.lendType === LendType.LEND
            ? request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice)
            : request.amount.multipliedBy(tokenPrice).dividedBy(10 ** 18);*/
        result = request.amount.multipliedBy(10 ** 18).dividedBy(tokenPrice)
      }
    }

    return result
  }

  public getManageCollateralGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000)
  }

  public getManageCollateralParams = async (): Promise<ICollateralManagementParams> => {
    return { minValue: 0.9 * 10 ** 18, maxValue: 3 * 10 ** 20, currentValue: 0 }
  }

  public getManageCollateralChangeEstimate = async (
    borrowedFundsState: IBorrowedFundsState,
    collateralAmount: BigNumber,
    isWithdrawal: boolean
  ): Promise<ICollateralChangeEstimate> => {
    const result = {
      collateralAmount: collateralAmount,
      collateralizedPercent: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      gasEstimate: new BigNumber(0),
      isWithdrawal: isWithdrawal
    }

    if (this.contractsSource && this.web3Wrapper && borrowedFundsState.loanData) {
      const oracleContract = await this.contractsSource.getOracleContract()
      const collateralAsset = this.contractsSource!.getAssetFromAddress(
        borrowedFundsState.loanData.collateralToken
      )
      const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18
      let newAmount = new BigNumber(0)
      if (collateralAmount && collateralAmount.gt(0)) {
        newAmount = collateralAmount.multipliedBy(10 ** collateralPrecision)
      }
      try {
        const newCurrentMargin: [
          BigNumber,
          BigNumber
        ] = await oracleContract.getCurrentMargin.callAsync(
          borrowedFundsState.loanData.loanToken,
          borrowedFundsState.loanData.collateralToken,
          borrowedFundsState.loanData.principal,
          isWithdrawal
            ? new BigNumber(borrowedFundsState.loanData.collateral.minus(newAmount).toFixed(0, 1))
            : new BigNumber(borrowedFundsState.loanData.collateral.plus(newAmount).toFixed(0, 1))
        )
        result.collateralizedPercent = newCurrentMargin[0].dividedBy(10 ** 18)
      } catch (e) {
        // console.log(e);
        result.collateralizedPercent = borrowedFundsState.collateralizedPercent.times(100)
      }
    }

    return result
  }

  public getManageCollateralExcessAmount = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<BigNumber> => {
    let result = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.getCurrentAccount()
      const bZxContract = await this.contractsSource.getiBZxContract()
      if (account && bZxContract) {
        // console.log(bZxContract.address, borrowedFundsState.loanId, account);
        result = await bZxContract.withdrawCollateral.callAsync(
          borrowedFundsState.loanId,
          account,
          FulcrumProvider.MAX_UINT,
          {
            from: account,
            gas: this.gasLimit
          }
        )
        const precision =
          AssetsDictionary.assets.get(borrowedFundsState.collateralAsset)!.decimals || 18
        result = result.dividedBy(10 ** precision)
        // console.log(result.toString());
      }
    }
    return result
  }

  public gasPrice = async (): Promise<BigNumber> => {
    if (networkName === 'kovan') return new BigNumber(1).multipliedBy(10 ** 9) // 1 gwei
    let result = new BigNumber(1000).multipliedBy(10 ** 9) // upper limit 120 gwei
    const lowerLimit = new BigNumber(3).multipliedBy(10 ** 9) // lower limit 3 gwei

    const url = `https://ethgasstation.info/json/ethgasAPI.json`
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
      // console.log(jsonData);
      if (jsonData.average) {
        // ethgasstation values need divide by 10 to get gwei
        const gasPriceAvg = new BigNumber(jsonData.average).multipliedBy(10 ** 8)
        const gasPriceSafeLow = new BigNumber(jsonData.safeLow).multipliedBy(10 ** 8)
        if (gasPriceAvg.lt(result)) {
          result = gasPriceAvg
        } else if (gasPriceSafeLow.lt(result)) {
          result = gasPriceSafeLow
        }
      }
    } catch (error) {
      // console.log(error);
      result = new BigNumber(500).multipliedBy(10 ** 9) // error default 60 gwei
    }

    if (result.lt(lowerLimit)) {
      result = lowerLimit
    }

    return result
  }

  public checkCollateralApprovalForLend = async (asset: Asset): Promise<boolean> => {
    let maybeNeedsApproval = false
    let account: string | undefined = undefined

    if (asset === Asset.ETH) {
      return false
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      if (!account) {
        account = this.getCurrentAccount()
      }

      if (account) {
        const assetAddress = this.getErc20AddressOfAsset(asset)
        if (assetAddress) {
          const iTokenAddress = await this.contractsSource.getITokenErc20Address(asset)
          const tokenContract = await this.contractsSource.getErc20Contract(assetAddress)
          if (iTokenAddress && tokenContract) {
            const allowance = await tokenContract.allowance.callAsync(account, iTokenAddress)
            maybeNeedsApproval = allowance.lt(10 ** 50)
          }
        }
      }
    }

    return maybeNeedsApproval
  }

  public checkCollateralApprovalForTrade = async (request: TradeRequest): Promise<boolean> => {
    let maybeNeedsApproval = false
    let account: string | undefined

    if (request.depositToken === Asset.ETH) {
      return false
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      if (!account) {
        account = this.getCurrentAccount()
      }
      const iTokenContract = this.contractsSource.getITokenContract(request.depositToken)

      if (account && iTokenContract) {
        const collateralErc20Address = this.getErc20AddressOfAsset(request.depositToken)
        if (collateralErc20Address) {
          const tokenContract = await this.contractsSource.getErc20Contract(collateralErc20Address)
          if (tokenContract) {
            const allowance = await tokenContract.allowance.callAsync(
              account,
              iTokenContract.address
            )
            maybeNeedsApproval = allowance.lt(10 ** 50)
          }
        }
      }
    }

    return maybeNeedsApproval
  }

  public getTradeSlippageRate = async (
    srcToken: Asset,
    destToken: Asset,
    tradedAmountEstimate: BigNumber
  ): Promise<BigNumber> => {
    if (tradedAmountEstimate.eq(0) || srcToken === destToken) {
      return new BigNumber(0)
    }

    const srcAssetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(srcToken)
    const destAssetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(destToken)

    if (!srcAssetErc20Address || !destAssetErc20Address) {
      return new BigNumber(0)
    }

    const srcDecimals = AssetsDictionary.assets.get(srcToken)?.decimals || 18
    const amount = tradedAmountEstimate.times(10 ** srcDecimals).dp(0, BigNumber.ROUND_HALF_UP)
    if (amount.lte(10 ** srcDecimals)) {
      return new BigNumber(0)
    }
    const oneEthWorthTokenAmount = await fetch(
      `https://api.kyber.network/buy_rate?id=${srcAssetErc20Address}&qty=1`
    )
      .then((resp) => resp.json())
      .then((resp) => 1 / resp.data[0].src_qty[0])
      .catch(console.error)
    let srcOneTokenWorthAmount = new BigNumber(10 ** srcDecimals)
    if (oneEthWorthTokenAmount) {
      srcOneTokenWorthAmount = new BigNumber(oneEthWorthTokenAmount)
        .times(10 ** srcDecimals)
        .dp(0, BigNumber.ROUND_HALF_UP)
    }

    const swapPriceOneTokenWorth = await fetch(
      `https://api.kyber.network/expectedRate?source=${srcAssetErc20Address}&dest=${destAssetErc20Address}&sourceAmount=${srcOneTokenWorthAmount}`
    )
      .then((resp) => resp.json())
      .catch(console.error)

    const swapPriceTradeAmount = await fetch(
      `https://api.kyber.network/expectedRate?source=${srcAssetErc20Address}&dest=${destAssetErc20Address}&sourceAmount=${amount}`
    )
      .then((resp) => resp.json())
      .catch(console.error)

    if (!swapPriceOneTokenWorth['expectedRate'] || !swapPriceTradeAmount['expectedRate']) {
      return new BigNumber(0)
    }

    const slippage = new BigNumber(swapPriceOneTokenWorth['expectedRate'])
      .minus(new BigNumber(swapPriceTradeAmount['expectedRate']))
      .abs()
      .div(new BigNumber(swapPriceTradeAmount['expectedRate']))
      .times(100)

    return slippage
  }

  // public getTradeSlippageRate = async (request: TradeRequest, tradedAmountEstimate: BigNumber): Promise<BigNumber | null> => {

  //   if (request.amount.eq(0) || tradedAmountEstimate.eq(0)) {
  //     return new BigNumber(0);
  //   }

  //   let tradeAmountActual = new BigNumber(0);
  //   if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
  //     const account = this.getCurrentAccount()

  //     if (account) {
  //       const key = new TradeTokenKey(
  //         request.asset,
  //         request.unitOfAccount,
  //         request.positionType,
  //         request.leverage,
  //         request.isTokenized,
  //         request.version
  //       );

  //       const assetContract = await this.contractsSource.getPTokenContract(key);
  //       if (assetContract) {
  //         const baseAsset = this.getBaseAsset(key);
  //         if (request.tradeType === TradeType.BUY) {
  //           if (request.collateral !== Asset.ETH) {
  //             try {
  //               const assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(request.collateral);
  //               if (assetErc20Address) {
  //                 const srcDecimals: number = AssetsDictionary.assets.get(request.collateral)!.decimals || 18;
  //                 tradeAmountActual = await assetContract.mintWithToken.callAsync(
  //                   account,
  //                   assetErc20Address,
  //                   new BigNumber(request.amount.multipliedBy(10 ** srcDecimals).toFixed(0, 1)),
  //                   new BigNumber(0),
  //                   "0x",
  //                   {
  //                     from: account,
  //                     gas: "5000000",
  //                     gasPrice: new BigNumber(0)
  //                   }
  //                 );
  //                 let destDecimals: number = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
  //                 if (baseAsset === Asset.WBTC && key.positionType === PositionType.LONG) {
  //                   destDecimals = destDecimals + 10;
  //                 }
  //                 tradeAmountActual = tradeAmountActual.multipliedBy(10 ** (18 - destDecimals));
  //               } else {
  //                 return null;
  //               }
  //             } catch (e) {
  //               // console.log(e);
  //               return null;
  //             }
  //           } else {
  //             try {
  //               tradeAmountActual = await assetContract.mintWithEther.callAsync(
  //                 account,
  //                 {
  //                   from: account,
  //                   value: new BigNumber(request.amount.multipliedBy(10 ** 18).toFixed(0, 1)), // ETH -> 18 decimals,
  //                   gas: "5000000",
  //                   gasPrice: new BigNumber(0)
  //                 }
  //               );
  //               let destDecimals: number = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
  //               if (baseAsset === Asset.WBTC && key.positionType === PositionType.LONG) {
  //                 destDecimals = destDecimals + 10;
  //               }
  //               tradeAmountActual = tradeAmountActual.multipliedBy(10 ** (18 - destDecimals));
  //             } catch (e) {
  //               // console.log(e);
  //               return null;
  //             }
  //           }
  //         } else {
  //           if (request.collateral !== Asset.ETH) {
  //             try {
  //               const assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(request.collateral);
  //               if (assetErc20Address) {
  //                 const srcDecimals: number = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
  //                 if (baseAsset === Asset.WBTC && key.positionType === PositionType.SHORT) {
  //                   // srcDecimals = srcDecimals + 10;
  //                 }
  //                 tradeAmountActual = await assetContract.burnToToken.callAsync(
  //                   account,
  //                   assetErc20Address,
  //                   new BigNumber(request.amount.multipliedBy(10 ** srcDecimals).toFixed(0, 1)),
  //                   new BigNumber(0),
  //                   "0x",
  //                   {
  //                     from: account,
  //                     gas: "5000000",
  //                     gasPrice: new BigNumber(0)
  //                   }
  //                 );
  //                 const destDecimals: number = AssetsDictionary.assets.get(request.collateral)!.decimals || 18;
  //                 tradeAmountActual = tradeAmountActual.multipliedBy(10 ** (18 - destDecimals));
  //               } else {
  //                 return null;
  //               }
  //             } catch (e) {
  //               // console.log(e);
  //               return null;
  //             }
  //           } else {
  //             try {
  //               const srcDecimals: number = AssetsDictionary.assets.get(baseAsset)!.decimals || 18;
  //               if (baseAsset === Asset.WBTC && key.positionType === PositionType.SHORT) {
  //                 // srcDecimals = srcDecimals + 10;
  //               }
  //               tradeAmountActual = await assetContract.burnToEther.callAsync(
  //                 account,
  //                 new BigNumber(request.amount.multipliedBy(10 ** srcDecimals).toFixed(0, 1)),
  //                 new BigNumber(0),
  //                 "0x",
  //                 {
  //                   from: account,
  //                   gas: "5000000",
  //                   gasPrice: new BigNumber(0)
  //                 }
  //               );
  //             } catch (e) {
  //               // console.log(e);
  //               return null;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   tradeAmountActual = tradeAmountActual.dividedBy(10 ** 18);
  //   const slippage = tradeAmountActual.minus(tradedAmountEstimate).div(tradedAmountEstimate).multipliedBy(-100);

  //   /*console.log(`---------`);
  //   console.log(`tradedAmountEstimate`,tradedAmountEstimate.toString());
  //   console.log(`tradeAmountActual`,tradeAmountActual.toString());
  //   console.log(`slippage`,slippage.toString());*/

  //   return slippage;
  // }

  public getEstimatedMarginDetails = async (
    request: TradeRequest
  ): Promise<{
    principal: BigNumber
    collateral: BigNumber
    exposureValue: BigNumber
    interestRate: BigNumber
  }> => {
    let result = {
      principal: new BigNumber(0),
      collateral: new BigNumber(0),
      exposureValue: new BigNumber(0),
      interestRate: new BigNumber(0)
    }

    const isLong = request.positionType === PositionType.LONG

    const loanToken = isLong ? request.quoteToken : request.asset
    const depositToken = request.depositToken
    const collateralToken = isLong ? request.asset : request.quoteToken

    const decimals: number = AssetsDictionary.assets.get(depositToken)!.decimals || 18

    const amountInBaseUnits = new BigNumber(
      request.amount.multipliedBy(10 ** decimals).toFixed(0, 1)
    )

    const account = this.getCurrentAccount()

    if (account && this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const tokenContract = this.contractsSource.getITokenContract(loanToken)
      if (!tokenContract) return result
      const leverageAmount =
        request.positionType === PositionType.LONG
          ? new BigNumber(request.leverage - 1).times(10 ** 18)
          : new BigNumber(request.leverage).times(10 ** 18)

      const loanTokenSent = depositToken === loanToken ? amountInBaseUnits : new BigNumber(0)

      const collateralTokenSent =
        depositToken === collateralToken ? amountInBaseUnits : new BigNumber(0)

      //const depositTokenAddress = FulcrumProvider.Instance.getErc20AddressOfAsset(depositToken);
      const collateralTokenAddress =
        collateralToken !== Asset.ETH
          ? FulcrumProvider.Instance.getErc20AddressOfAsset(collateralToken)
          : FulcrumProvider.ZERO_ADDRESS

      const loanTokenDecimals = AssetsDictionary.assets.get(loanToken)!.decimals || 18
      const collateralTokenDecimals = AssetsDictionary.assets.get(collateralToken)!.decimals || 18

      try {
        const marginDetails = await tokenContract.getEstimatedMarginDetails.callAsync(
          leverageAmount,
          loanTokenSent,
          collateralTokenSent,
          collateralTokenAddress!
        )
        result.principal = marginDetails[0].div(10 ** loanTokenDecimals)
        result.collateral = marginDetails[1].div(10 ** collateralTokenDecimals)

        result.exposureValue =
          request.positionType === PositionType.SHORT ? result.principal : result.collateral
        result.interestRate = marginDetails[2].div(10 ** 18)
      } catch (e) {
        console.error(e)
      }
    }
    return result
  }
  // public getTradeFormExposure = async (request: TradeRequest): Promise<BigNumber> => {

  //   if (request.amount.eq(0)) {
  //     return new BigNumber(0);
  //   }

  //   let requestAmount;
  //   if (request.tradeType === TradeType.BUY) {
  //     if (request.collateral !== request.asset) {
  //       const decimals: number = AssetsDictionary.assets.get(request.collateral)!.decimals || 18;
  //       const swapPrice = await this.getSwapRate(
  //         request.collateral,
  //         request.asset,
  //         request.amount.multipliedBy(10 ** decimals)
  //       );
  //       requestAmount = request.amount.multipliedBy(swapPrice);
  //     } else {
  //       requestAmount = request.amount;
  //     }
  //   } else {
  //     const tradeTokenKey = new TradeTokenKey(
  //       request.asset,
  //       request.unitOfAccount,
  //       request.positionType,
  //       request.leverage,
  //       request.isTokenized,
  //       request.version
  //     );
  //     const pTokenBaseAsset = this.getBaseAsset(tradeTokenKey);
  //     const pTokenPrice = await this.getPTokenPrice(tradeTokenKey);
  //     const pTokenBaseAssetAmount = request.amount.multipliedBy(pTokenPrice);
  //     const swapRate = await this.getSwapRate(pTokenBaseAsset, request.asset);

  //     requestAmount = pTokenBaseAssetAmount.multipliedBy(swapRate);
  //   }

  //   return requestAmount.multipliedBy(request.leverage);
  // }

  public static getWeb3ProviderSettings(networkId: number): IWeb3ProviderSettings {
    // tslint:disable-next-line:one-variable-per-declaration
    let networkName, etherscanURL
    switch (networkId) {
      case 1:
        networkName = 'mainnet'
        etherscanURL = 'https://etherscan.io/'
        break
      case 3:
        networkName = 'ropsten'
        etherscanURL = 'https://ropsten.etherscan.io/'
        break
      case 4:
        networkName = 'rinkeby'
        etherscanURL = 'https://rinkeby.etherscan.io/'
        break
      case 42:
        networkName = 'kovan'
        etherscanURL = 'https://kovan.etherscan.io/'
        break
      default:
        networkId = 0
        networkName = 'local'
        etherscanURL = ''
        break
    }
    return {
      networkId,
      networkName,
      etherscanURL
    }
  }

  public async getAssetTokenBalanceOfUser(asset: Asset, account?: string): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0)
    if (asset === Asset.UNKNOWN) {
      // always 0
      result = new BigNumber(0)
    } else if (asset === Asset.ETH) {
      // get eth (wallet) balance
      result = await this.getEthBalance()
    } else {
      // get erc20 token balance
      const precision = AssetsDictionary.assets.get(asset)!.decimals || 18
      const assetErc20Address = this.getErc20AddressOfAsset(asset)
      if (assetErc20Address) {
        result = await this.getErc20BalanceOfUser(assetErc20Address, account)
        result = result.multipliedBy(10 ** (18 - precision))
      }
    }

    return result
  }

  public async getITokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result = new BigNumber(0)

    if (this.contractsSource) {
      const precision =
        AssetsDictionary.assets.get(
          (asset.includes('v1') ? asset.replace('v1', '') : asset) as Asset
        )!.decimals || 18
      const address = await this.contractsSource.getITokenErc20Address(asset)
      if (address) {
        result = await this.getErc20BalanceOfUser(address)
        result = result.multipliedBy(10 ** (18 - precision))
      }
    }

    return result
  }

  public async getGasTokenAllowance(): Promise<BigNumber> {
    let result = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.getCurrentAccount()

      if (account) {
        const assetAddress = this.getErc20AddressOfAsset(Asset.CHI)
        if (assetAddress) {
          const tokenContract = await this.contractsSource.getErc20Contract(assetAddress)
          if (tokenContract) {
            result = await tokenContract.allowance.callAsync(
              account,
              '0x55eb3dd3f738cfdda986b8eff3fa784477552c61'
            )
          }
        }
      }
    }

    return result
  }

  public async getITokenAssetBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.getCurrentAccount()

      if (account) {
        const assetContract = this.contractsSource.getITokenContract(asset)
        if (assetContract) {
          const precision = AssetsDictionary.assets.get(asset)!.decimals || 18
          //const swapPrice = await this.getSwapToUsdRate(asset);
          result = (await assetContract.assetBalanceOf.callAsync(account)).div(10 ** precision)
          /*result = result
            .multipliedBy(swapPrice)
            .div(10 ** precision);*/
        }
      }
    }
    return result
  }

  public async getLoanCloseAmount(request: TradeRequest): Promise<[BigNumber, BigNumber, string]> {
    let result: [BigNumber, BigNumber, string] = [new BigNumber(0), new BigNumber(0), '']

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.getCurrentAccount()
      const iBZxContract = await this.contractsSource.getiBZxContract()
      if (account && iBZxContract) {
        const loan = (await FulcrumProvider.Instance.getUserMarginTradeLoans()).find(
          (l) => l.loanId === request.loanId
        )
        if (!loan || !loan.loanData) throw new Error('No loan available!')

        let amountInBaseUnits = new BigNumber(0)
        if (request.positionType === PositionType.LONG) {
          const decimals: number = AssetsDictionary.assets.get(loan.collateralAsset)!.decimals || 18
          amountInBaseUnits = new BigNumber(
            request.amount.multipliedBy(10 ** decimals).toFixed(0, 1)
          )
        } else {
          const maxTradeValueUI = await FulcrumProvider.Instance.getMaxTradeValue(
            TradeType.SELL,
            loan.loanAsset,
            loan.collateralAsset,
            request.returnTokenIsCollateral ? loan.collateralAsset : loan.loanAsset,
            request.positionType,
            loan
          )
          amountInBaseUnits = new BigNumber(
            loan.loanData.collateral.times(request.amount.div(maxTradeValueUI)).toFixed(0, 1)
          )
        }

        let maxAmountInBaseUnits = new BigNumber(0)
        if (loan) {
          maxAmountInBaseUnits = loan.loanData.collateral
        }

        if (
          maxAmountInBaseUnits.gt(0) &&
          maxAmountInBaseUnits
            .minus(amountInBaseUnits)
            .abs()
            .div(maxAmountInBaseUnits)
            .lte(0.01)
        ) {
          amountInBaseUnits = new BigNumber(maxAmountInBaseUnits.times(10 ** 50).toFixed(0, 1))
        }

        // console.log(
        //   iBZxContract.address,
        //   await iBZxContract.closeWithSwap.getABIEncodedTransactionData(
        //     request.loanId,
        //     account,
        //     amountInBaseUnits,
        //     request.returnTokenIsCollateral, // returnTokenIsCollateral
        //     request.loanDataBytes
        //   )
        // )

        const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === 'true'

        try {
          //@ts-ignore
          result =
            isGasTokenEnabled && (await this.getAssetTokenBalanceOfUser(Asset.CHI)).gt(0)
              ? await iBZxContract.closeWithSwapWithGasToken.callAsync(
                  request.loanId,
                  account,
                  account,
                  amountInBaseUnits,
                  request.returnTokenIsCollateral, // returnTokenIsCollateral
                  request.loanDataBytes,
                  {
                    from: account,
                    gas: FulcrumProvider.Instance.gasLimit
                  }
                )
              : await iBZxContract.closeWithSwap.callAsync(
                  request.loanId,
                  account,
                  amountInBaseUnits,
                  request.returnTokenIsCollateral, // returnTokenIsCollateral
                  request.loanDataBytes,
                  {
                    from: account,
                    gas: FulcrumProvider.Instance.gasLimit
                  }
                )
        } catch (e) {
          console.error(e)
        }
      }
    }
    return result
  }

  public getMaintenanceMargin = async (
    asset: Asset,
    collateralAsset: Asset
  ): Promise<BigNumber> => {
    const loanParam = await this.getLoanParams(asset, collateralAsset)
    if (!loanParam) {
      return new BigNumber(15).times(10 ** 18) // fallback value
    }
    return loanParam.maintenanceMargin
  }

  private getLoanParams = async (
    asset: Asset,
    collateralAsset: Asset
  ): Promise<ILoanParams | null> => {
    if (!this.contractsSource) {
      return null
    }
    const iToken = this.contractsSource.getITokenContract(asset)
    const iBZxContract = await this.contractsSource.getiBZxContract()
    const collateralTokenAddress =
      AssetsDictionary.assets
        .get(collateralAsset)!
        .addressErc20.get(this.web3ProviderSettings.networkId) || ''
    if (!iToken || !collateralTokenAddress || !iBZxContract) return null
    // true for Torque, false for Fulcrum loan id
    // @ts-ignore
    const id = new BigNumber(Web3Utils.soliditySha3(collateralTokenAddress, false))
    const loanId = await iToken.loanParamsIds.callAsync(id)
    const loanParams = await iBZxContract.loanParams.callAsync(loanId)
    const result = {
      loanId: loanParams[0],
      active: loanParams[1],
      owner: loanParams[2],
      loanToken: loanParams[3],
      collateralToken: loanParams[4],
      minInitialMargin: loanParams[5],
      maintenanceMargin: loanParams[6],
      maxLoanTerm: loanParams[7]
    } as ILoanParams
    return result
  }

  public async getUserMarginTradeLoans(): Promise<IBorrowedFundsState[]> {
    let result: IBorrowedFundsState[] = []

    if (!this.contractsSource) return result

    const iBZxContract = await this.contractsSource.getiBZxContract()
    const account = this.getCurrentAccount()

    if (!iBZxContract || !account) return result

    const loansData = await iBZxContract.getUserLoans.callAsync(
      account,
      new BigNumber(0),
      new BigNumber(50),
      1, // margin trade loans
      false,
      false
    )
    // console.log(loansData);
    const zero = new BigNumber(0)
    //@ts-ignore
    result = loansData
      // .filter(
      //   (e: any) =>
      //     (!e.principal.eq(zero) && !e.currentMargin.eq(zero)) ||
      //     account.toLowerCase() === '0x4abb24590606f5bf4645185e20c4e7b97596ca3b'
      // )
      .map((e: any) => {
        const loanAsset = this.contractsSource!.getAssetFromAddress(e.loanToken)
        const collateralAsset = this.contractsSource!.getAssetFromAddress(e.collateralToken)
        if (loanAsset === Asset.UNKNOWN || collateralAsset === Asset.UNKNOWN) return
        const loanPrecision = AssetsDictionary.assets.get(loanAsset)!.decimals || 18
        const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18
        let amountOwned = e.principal.minus(e.interestDepositRemaining)
        if (amountOwned.lte(0)) {
          amountOwned = new BigNumber(0)
        } else {
          amountOwned = amountOwned.dividedBy(10 ** loanPrecision).dp(5, BigNumber.ROUND_CEIL)
        }
        return {
          accountAddress: account,
          loanId: e.loanId,
          loanAsset: loanAsset,
          collateralAsset: collateralAsset,
          amount: e.principal.dividedBy(10 ** loanPrecision).dp(5, BigNumber.ROUND_CEIL),
          amountOwed: amountOwned,
          collateralAmount: e.collateral.dividedBy(10 ** collateralPrecision),
          collateralizedPercent: e.currentMargin.dividedBy(10 ** 20),
          interestRate: e.interestOwedPerDay.dividedBy(e.principal).multipliedBy(365),
          interestOwedPerDay: e.interestOwedPerDay.dividedBy(10 ** loanPrecision),
          hasManagementContract: true,
          isInProgress: false,
          loanData: e
        } as IBorrowedFundsState
      })
      .filter((e: IBorrowedFundsState | undefined) => e)
    return result
  }

  public async getUserMarginTradeLoansByPair(
    baseToken: Asset,
    quoteToken: Asset
  ): Promise<{ loans: IBorrowedFundsState[]; allUsersLoansCount: number }> {
    const result: { loans: IBorrowedFundsState[]; allUsersLoansCount: number } = {
      loans: [],
      allUsersLoansCount: 0
    }

    if (!this.contractsSource) return result

    const iBZxContract = await this.contractsSource.getiBZxContract()
    const account = this.getCurrentAccount()

    const baseTokenAddress =
      AssetsDictionary.assets
        .get(baseToken)
        ?.addressErc20.get(this.web3ProviderSettings.networkId) || ''
    const quoteTokenAddress =
      AssetsDictionary.assets
        .get(quoteToken)
        ?.addressErc20.get(this.web3ProviderSettings.networkId) || ''

    if (!iBZxContract || !account || !baseTokenAddress || !quoteTokenAddress) return result

    const loansData = await iBZxContract.getUserLoans.callAsync(
      account,
      new BigNumber(0),
      new BigNumber(50),
      1, // margin trade loans
      false,
      false
    )

    const loansByPair: IBorrowedFundsState[] = []
    loansData
      .filter(
        (e: any) =>
          (e.loanToken.toLowerCase() === baseTokenAddress.toLowerCase() &&
            e.collateralToken.toLowerCase() === quoteTokenAddress.toLowerCase()) ||
          (e.loanToken.toLowerCase() === quoteTokenAddress.toLowerCase() &&
            e.collateralToken.toLowerCase() === baseTokenAddress.toLowerCase())
      )
      .forEach((e: any) => {
        const loanAsset = this.contractsSource!.getAssetFromAddress(e.loanToken)
        const collateralAsset = this.contractsSource!.getAssetFromAddress(e.collateralToken)
        if (loanAsset === Asset.UNKNOWN || collateralAsset === Asset.UNKNOWN) return
        const loanPrecision = AssetsDictionary.assets.get(loanAsset)!.decimals || 18
        const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18
        let amountOwned = e.principal.minus(e.interestDepositRemaining)
        if (amountOwned.lte(0)) {
          amountOwned = new BigNumber(0)
        } else {
          amountOwned = amountOwned.dividedBy(10 ** loanPrecision).dp(5, BigNumber.ROUND_CEIL)
        }
        loansByPair.push({
          accountAddress: account,
          loanId: e.loanId,
          loanAsset: loanAsset,
          collateralAsset: collateralAsset,
          amount: e.principal.dividedBy(10 ** loanPrecision).dp(5, BigNumber.ROUND_CEIL),
          amountOwed: amountOwned,
          collateralAmount: e.collateral.dividedBy(10 ** collateralPrecision),
          collateralizedPercent: e.currentMargin.dividedBy(10 ** 20),
          interestRate: e.interestOwedPerDay.dividedBy(e.principal).multipliedBy(365),
          interestOwedPerDay: e.interestOwedPerDay.dividedBy(10 ** loanPrecision),
          hasManagementContract: true,
          isInProgress: false,
          loanData: e
        } as IBorrowedFundsState)
      })

    result.allUsersLoansCount = loansData.length
    result.loans = loansByPair
    return result
  }

  // public async getPTokenBalanceOfUser(selectedKey: TradeTokenKey): Promise<BigNumber> {
  //   let result = new BigNumber(0)

  //   if (this.contractsSource) {
  //     const baseAsset = this.getBaseAsset(selectedKey)
  //     const precision = AssetsDictionary.assets.get(baseAsset)!.decimals || 18
  //     const address = await this.contractsSource.getPTokenErc20Address(selectedKey)
  //     if (address) {
  //       result = await this.getErc20BalanceOfUser(address)
  //       result = result.multipliedBy(10 ** (18 - precision))
  //       if (baseAsset === Asset.WBTC && selectedKey.positionType === PositionType.SHORT) {
  //         result = result.div(10 ** 10)
  //       }
  //     }
  //   }

  //   return result
  // }

  // public getPTokensAvailable(): TradeTokenKey[] {
  //   return this.contractsSource ? this.contractsSource.getPTokensAvailable() : []
  // }

  // public getPTokenErc20Address(key: TradeTokenKey): string | null {
  //   return this.contractsSource ? this.contractsSource.getPTokenErc20Address(key) : null
  // }

  public getErc20AddressOfAsset(asset: Asset): string | null {
    let result: string | null = null

    const assetDetails = AssetsDictionary.assets.get(asset)
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || ''
    }
    return result
  }

  public async getEthBalance(): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.getCurrentAccount()
      if (account) {
        const balance = await this.web3Wrapper.getBalanceInWeiAsync(account)
        result = new BigNumber(balance)
      }
    }

    return result
  }

  private async getErc20BalanceOfUser(addressErc20: string, account?: string): Promise<BigNumber> {
    let result = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource) {
      if (!account && this.contractsSource.canWrite) {
        account = this.getCurrentAccount()
      }

      if (account) {
        const tokenContract = await this.contractsSource.getErc20Contract(addressErc20)
        if (tokenContract) {
          result = await tokenContract.balanceOf.callAsync(account)
        }
      }
    }

    return result
  }

  public async getErc20BalancesOfUser(
    addressesErc20: string[],
    account?: string
  ): Promise<Map<string, BigNumber>> {
    let result: Map<string, BigNumber> = new Map<string, BigNumber>()
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      if (!account && this.contractsSource.canWrite) {
        account = this.getCurrentAccount()
      }
      if (account) {
        // @ts-ignore
        const alchemyProvider = await Web3ConnectionFactory.getAlchemyProvider()
        const resp = await alchemyProvider.alchemyWeb3.alchemy.getTokenBalances(
          account,
          addressesErc20
        )
        if (resp) {
          // @ts-ignore
          result = resp.tokenBalances
            .filter((t) => !t.error && t.tokenBalance !== '0')
            .reduce(
              (map, obj) => (map.set(obj.address, new BigNumber(obj.tokenBalance!)), map),
              new Map<string, BigNumber>()
            )
        }
      }
    }
    return result
  }

  public async getSwapToUsdRateBatch(
    assets: Asset[],
    usdToken: Asset
  ): Promise<[BigNumber[], BigNumber[], BigNumber[]]> {
    let result: [BigNumber[], BigNumber[], BigNumber[]] = [[], [], []]

    if (this.contractsSource) {
      const oracleAddress = this.contractsSource.getOracleAddress()
      const usdTokenAddress = this.getErc20AddressOfAsset(usdToken)!
      const underlyings: string[] = assets.map((e) => this.getErc20AddressOfAsset(e)!)
      const amounts: BigNumber[] = assets.map((e) => this.getGoodSourceAmountOfAsset(e))

      const helperContract = await this.contractsSource.getDAppHelperContract()
      if (helperContract) {
        result = await helperContract.assetRates.callAsync(usdTokenAddress, underlyings, amounts)
      }
    }

    return result
  }

  public async getSwapToUsdRate(asset: Asset): Promise<BigNumber> {
    if (
      asset === Asset.SAI ||
      asset === Asset.DAI ||
      asset === Asset.USDC ||
      asset === Asset.SUSD ||
      asset === Asset.USDT
    ) {
      return new BigNumber(1)
    }

    /*const swapRates = await this.getSwapToUsdRateBatch(
      [asset],
      Asset.DAI
    );

    return swapRates[0][0];*/
    return this.getSwapRate(asset, isMainnetProd ? Asset.DAI : Asset.USDC)
  }

  private getGoodSourceAmountOfAsset(asset: Asset): BigNumber {
    switch (asset) {
      case Asset.WBTC:
        return new BigNumber(10 ** 6)
      case Asset.USDC:
      case Asset.USDT:
        return new BigNumber(10 ** 4)
      default:
        return new BigNumber(10 ** 16)
    }
  }

  // Returns swap rate from Chainlink Oracle
  public async getSwapRate(srcAsset: Asset, destAsset: Asset): Promise<BigNumber> {
    if (
      srcAsset === destAsset ||
      (srcAsset === Asset.USDC && destAsset === Asset.DAI) ||
      (srcAsset === Asset.DAI && destAsset === Asset.USDC)
    ) {
      return new BigNumber(1)
    }
    let result: BigNumber = new BigNumber(0)
    const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset)
    const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset)

    if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
      const oracleContract = await this.contractsSource.getOracleContract()

      const srcAssetDecimals = AssetsDictionary.assets.get(srcAsset)!.decimals || 18
      const srcAssetPrecision = new BigNumber(10 ** (18 - srcAssetDecimals))
      const destAssetDecimals = AssetsDictionary.assets.get(destAsset)!.decimals || 18
      const destAssetPrecision = new BigNumber(10 ** (18 - destAssetDecimals))
      try {
        const swapPriceData: BigNumber[] = await oracleContract.queryRate.callAsync(
          srcAssetErc20Address,
          destAssetErc20Address
        )
        // console.log("swapPriceData- ",swapPriceData[0])
        result = swapPriceData[0]
          .times(srcAssetPrecision)
          .div(destAssetPrecision)
          .dividedBy(10 ** 18)
          .multipliedBy(swapPriceData[1].dividedBy(10 ** 18)) // swapPriceData[0].dividedBy(10 ** 18);
      } catch (e) {
        console.error(e)
        result = new BigNumber(0)
      }
    }
    return result
  }

  // Returns swap rate from Kyber
  public async getKyberSwapRate(
    srcAsset: Asset,
    destAsset: Asset,
    srcAmount?: BigNumber
  ): Promise<BigNumber> {
    if (networkName !== 'mainnet') {
      // Kyebr doesn't support our kovan tokens so the price for them is taken from our PriceFeed contract
      return this.getSwapRate(srcAsset, destAsset)
    }
    let result: BigNumber = new BigNumber(0)
    const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset)
    const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset)

    if (srcAssetErc20Address && destAssetErc20Address) {
      const srcAssetDecimals = AssetsDictionary.assets.get(srcAsset)!.decimals || 18
      if (!srcAmount) {
        srcAmount = this.getGoodSourceAmountOfAsset(srcAsset)
      } else {
        srcAmount = new BigNumber(srcAmount.toFixed(1, 1))
      }
      try {
        const oneEthWorthTokenAmount = await fetch(
          `https://api.kyber.network/buy_rate?id=${srcAssetErc20Address}&qty=1`
        )
          .then((resp) => resp.json())
          .then((resp) => 1 / resp.data[0].src_qty[0])
          .catch(console.error)
        if (oneEthWorthTokenAmount) {
          srcAmount = new BigNumber(oneEthWorthTokenAmount)
            .times(10 ** srcAssetDecimals)
            .dp(0, BigNumber.ROUND_HALF_UP)
        }

        const swapPriceData = await fetch(
          `https://api.kyber.network/expectedRate?source=${srcAssetErc20Address}&dest=${destAssetErc20Address}&sourceAmount=${srcAmount}`
        )
          .then((resp) => resp.json())
          .catch(console.error)

        result = new BigNumber(swapPriceData['expectedRate']).dividedBy(10 ** 18)
      } catch (e) {
        console.error(e)
        result = new BigNumber(0)
      }
    }
    return result
  }

  public getEarnRewardHistory = async (): Promise<Array<EarnRewardEvent | EarnRewardEventNew>> => {
    let result: Array<EarnRewardEvent | EarnRewardEventNew> = []
    const account = this.getCurrentAccount()

    if (!this.contractsSource || !this.web3Wrapper || !account) return result
    return getEarnRewardHistory(this.web3Wrapper, this.contractsSource, account)
  }

  public getPayTradingFeeHistory = async (): Promise<PayTradingFeeEvent[]> => {
    let result: PayTradingFeeEvent[] = []
    const account = this.getCurrentAccount()

    if (!this.contractsSource || !this.web3Wrapper || !account) return result
    return getPayTradingFeeHistory(this.web3Wrapper, this.contractsSource, account)
  }

  public getTradeHistory = async (): Promise<TradeEvent[]> => {
    let result: TradeEvent[] = []
    const account = this.getCurrentAccount()
    if (!this.contractsSource || !this.web3Wrapper || !account) return result
    return getTradeHistory(this.web3Wrapper, this.contractsSource, account)
  }

  public getRolloverHistory = async (): Promise<RolloverEvent[]> => {
    let result: RolloverEvent[] = []
    const account = this.getCurrentAccount()
    if (!this.contractsSource || !this.web3Wrapper || !account) return result
    return getRolloverHistory(this.web3Wrapper, this.contractsSource, account)
  }

  public getCloseWithSwapHistory = async (): Promise<CloseWithSwapEvent[]> => {
    let result: CloseWithSwapEvent[] = []
    const account = this.getCurrentAccount()
    if (!this.contractsSource || !this.web3Wrapper || !account) return result
    return getCloseWithSwapHistory(this.web3Wrapper, this.contractsSource, account)
  }

  public getLiquidationHistory = async (): Promise<LiquidationEvent[]> => {
    let result: LiquidationEvent[] = []
    const account = this.getCurrentAccount()
    if (!this.contractsSource || !this.web3Wrapper || !account) return result
    return getLiquidationHistory(this.web3Wrapper, this.contractsSource, account)
  }

  public getLiquidationsInPastNDays = async (days: number): Promise<number> => {
    const result: number = 0
    const account = this.getCurrentAccount()
    const blocksPerDay = 10000 // 7-8k per day with a buffer
    if (!account || !this.contractsSource || !this.web3Wrapper) return result
    const bzxContractAddress = this.contractsSource.getiBZxAddress()
    if (!bzxContractAddress) return result
    const blockNumber = await this.web3Wrapper.getBlockNumberAsync()
    const events =
      (await getLogsFromEtherscan(
        (blockNumber - days * blocksPerDay).toString(),
        'latest',
        bzxContractAddress,
        [LiquidationEvent.topic0, `0x000000000000000000000000${account.replace('0x', '')}`],
        networkName!,
        configProviders.Etherscan_Api
      )) || []
    const liquidationEvents = events.filter((event: any) => {
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return false

      const baseTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
      const quoteTokenAddress = dataSegments[2].replace('000000000000000000000000', '0x')
      const baseToken = this.contractsSource!.getAssetFromAddress(baseTokenAddress)
      const quoteToken = this.contractsSource!.getAssetFromAddress(quoteTokenAddress)
      if (baseToken === Asset.UNKNOWN || quoteToken === Asset.UNKNOWN) return false
      return true
    })
    return (liquidationEvents && liquidationEvents.length) || result
  }

  public getDepositCollateralHistory = async (): Promise<DepositCollateralEvent[]> => {
    let result: DepositCollateralEvent[] = []
    const account = this.getCurrentAccount()
    if (!this.contractsSource || !this.web3Wrapper || !account) return result
    return getDepositCollateralHistory(this.web3Wrapper, this.contractsSource, account)
  }

  public getWithdrawCollateralHistory = async (): Promise<WithdrawCollateralEvent[]> => {
    let result: WithdrawCollateralEvent[] = []
    const account = this.getCurrentAccount()
    if (!this.contractsSource || !this.web3Wrapper || !account) return result
    return getWithdrawCollateralHistory(this.web3Wrapper, this.contractsSource, account)
  }

  private onTaskEnqueued = async (requestTask: RequestTask) => {
    await this.processQueue(requestTask.request.id, false, false)
  }

  public onTaskRetry = async (requestTask: RequestTask, skipGas: boolean) => {
    await this.processQueue(requestTask.request.id, true, skipGas)
  }

  public onTaskCancel = async (requestTask: RequestTask) => {
    await this.cancelRequestTask(requestTask)
    await this.processQueue(requestTask.request.id, false, false)
  }

  private cancelRequestTask = async (requestTask: RequestTask) => {
    if (!(this.isProcessing || this.isChecking)) {
      this.isProcessing = true

      try {
        const task = TasksQueue.Instance.peek(requestTask.request.id)

        if (task) {
          if (task.request.id === requestTask.request.id) {
            TasksQueue.Instance.dequeue(task.request.id)
          }
        }
      } finally {
        this.isProcessing = false
      }
    }
  }

  private processQueue = async (taskId: number, force: boolean, skipGas: boolean) => {
    if (!this.isChecking) {
      let forceOnce = force
      this.isProcessing = true
      this.isChecking = false

      try {
        const task = TasksQueue.Instance.peek(taskId)

        if (task) {
          if (task.status === RequestStatus.FAILED_SKIPGAS) {
            task.status = RequestStatus.FAILED
          }
          if (
            task.status === RequestStatus.AWAITING ||
            (task.status === RequestStatus.FAILED && forceOnce)
          ) {
            await this.processRequestTask(task, skipGas)
            // @ts-ignore
            if (task.status === RequestStatus.DONE) {
              TasksQueue.Instance.dequeue(task.request.id)
            }
          } else {
            if (task.status === RequestStatus.FAILED && !forceOnce) {
              this.isProcessing = false
              this.isChecking = false
            }
          }
        }
      } finally {
        forceOnce = false
        this.isChecking = true
        this.isProcessing = false
      }
    }
    this.isChecking = false
  }

  private processRequestTask = async (task: RequestTask, skipGas: boolean) => {
    if (task.request instanceof LendRequest) {
      await this.processLendRequestTask(task, skipGas)
    }

    if (task.request instanceof TradeRequest) {
      await this.processTradeRequestTask(task, skipGas)
    }

    if (task.request instanceof ManageCollateralRequest) {
      await this.processManageCollateralRequestTask(task, skipGas)
    }

    if (task.request instanceof RolloverRequest) {
      await this.processRolloverRequestTask(task, skipGas)
    }

    if (task.request instanceof ExtendLoanRequest) {
      await this.processExtendLoanRequestTask(task, skipGas)
    }

    return false
  }

  public addTokenToMetaMask = async (task: RequestTask) => {
    return /*, (err: any, added: any) => {
// console.log('provider returned', err, added)
if (err || 'error' in added) {
console.log(err, added);
}
}*/ /*);
                                                    }
                                                    }
                                                    }
                                                    } catch(e) {
                                                    // console.log(e);
                                                    }
                                                    }*/
    /*if (this.providerType === ProviderType.MetaMask && this.contractsSource) {
      try {
        // @ts-ignore
        if (window.web3) {
          const assetContract = this.contractsSource.getITokenContract(task.request.asset);
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
              }*/
  }

  private processLendRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg, task.request.id)
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account = this.getCurrentAccount()
      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      // Initializing loan
      const taskRequest: LendRequest = task.request as LendRequest
      if (taskRequest.lendType === LendType.LEND) {
        await this.addTokenToMetaMask(task)

        if (taskRequest.asset === Asset.ETH) {
          const { LendEthProcessor } = await import('./processors/LendEthProcessor')
          const processor = new LendEthProcessor()
          await processor.run(task, account, skipGas)
        } else if (taskRequest.asset === Asset.CHAI) {
          const { LendChaiProcessor } = await import('./processors/LendChaiProcessor')
          const processor = new LendChaiProcessor()
          await processor.run(task, account, skipGas)
        } else {
          const { LendErcProcessor } = await import('./processors/LendErcProcessor')
          const processor = new LendErcProcessor()
          await processor.run(task, account, skipGas)
        }
      } else {
        if (taskRequest.asset === Asset.ETH) {
          const { UnlendEthProcessor } = await import('./processors/UnlendEthProcessor')
          const processor = new UnlendEthProcessor()
          await processor.run(task, account, skipGas)
        } else if (taskRequest.asset === Asset.CHAI) {
          const { UnlendChaiProcessor } = await import('./processors/UnlendChaiProcessor')
          const processor = new UnlendChaiProcessor()
          await processor.run(task, account, skipGas)
        } else {
          const { UnlendErcProcessor } = await import('./processors/UnlendErcProcessor')
          const processor = new UnlendErcProcessor()
          await processor.run(task, account, skipGas)
        }
      }

      task.processingEnd(true, false, null)
    } catch (e) {
      if (
        !e.message.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)
      ) {
        console.error(e)
      }
      task.processingEnd(false, false, e)
    } finally {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToCloseProgressDlg, task)
    }
  }

  private processManageCollateralRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg, task.request.loanId)
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account = this.getCurrentAccount()
      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      // Initializing loan
      const taskRequest: ManageCollateralRequest = task.request as ManageCollateralRequest

      await this.addTokenToMetaMask(task)
      const { ManageCollateralProcessor } = await import('./processors/ManageCollateralProcessor')
      const processor = new ManageCollateralProcessor()
      await processor.run(task, account, skipGas)

      task.processingEnd(true, false, null)
    } catch (e) {
      if (
        !e.message.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)
      ) {
        console.error(e)
      }
      task.processingEnd(false, false, e)
    } finally {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToCloseProgressDlg, task)
    }
  }

  private processTradeRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      this.eventEmitter.emit(
        FulcrumProviderEvents.AskToOpenProgressDlg,
        task.request.loanId == '0x0000000000000000000000000000000000000000000000000000000000000000'
          ? task.request.id
          : task.request.loanId
      )
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account = this.getCurrentAccount()
      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      // Initializing loan
      const taskRequest: TradeRequest = task.request as TradeRequest

      // 0x api processing
      let taskAmount = new BigNumber(0)
      let zeroXTargetAmount = new BigNumber(0)
      let zeroXTargetAmountInBaseUnits = new BigNumber(0)
      let zeroXTargetType = ''
      let srcTokenAddress = ''
      let destTokenAddress = ''

      srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.quoteToken)!
      destTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!
      // if (taskRequest.version === 2) {
      //   if (siteConfig.ZeroXAPIEnabledForBuys && taskRequest.tradeType === TradeType.BUY) {
      //     taskAmount = taskRequest.amount;
      //     zeroXTargetType = "sellAmount";

      //     let decimals: number;
      //     if (taskRequest.positionType === PositionType.LONG) {
      //       decimals = AssetsDictionary.assets.get(taskRequest.unitOfAccount)!.decimals;

      //       if (taskRequest.collateral === taskRequest.unitOfAccount) {
      //         zeroXTargetAmount = taskAmount.times(taskRequest.leverage);
      //       } else {
      //         zeroXTargetAmount = taskAmount.times(taskRequest.leverage - 1);
      //         const swapPrice = await this.getSwapRate(
      //           taskRequest.collateral,
      //           taskRequest.unitOfAccount
      //         );
      //         zeroXTargetAmount = zeroXTargetAmount.multipliedBy(swapPrice);
      //       }
      //       srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.unitOfAccount)!;
      //       destTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!;
      //     } else {
      //       decimals = AssetsDictionary.assets.get(taskRequest.asset)!.decimals;

      //       if (taskRequest.collateral === taskRequest.asset) {
      //         zeroXTargetAmount = taskAmount.times(taskRequest.leverage + 1);
      //       } else {
      //         zeroXTargetAmount = taskAmount.times(taskRequest.leverage);
      //         const swapPrice = await this.getSwapRate(
      //           taskRequest.collateral,
      //           taskRequest.asset
      //         );
      //         zeroXTargetAmount = zeroXTargetAmount.multipliedBy(swapPrice);
      //       }
      //       srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!;
      //       destTokenAddress = this.getErc20AddressOfAsset(taskRequest.unitOfAccount)!;
      //     }

      //     if (decimals) {
      //       zeroXTargetAmountInBaseUnits = new BigNumber(zeroXTargetAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
      //     }
      //   } else if (siteConfig.ZeroXAPIEnabledForSells && taskRequest.tradeType === TradeType.SELL) {
      //     taskAmount = taskRequest.inputAmountValue;
      //     zeroXTargetType = "buyAmount";

      //     const assetContract = await this.contractsSource.getPTokenContract(new TradeTokenKey(
      //       taskRequest.asset,
      //       taskRequest.unitOfAccount,
      //       taskRequest.positionType,
      //       taskRequest.leverage,
      //       taskRequest.isTokenized,
      //       taskRequest.version
      //     ));
      //     if (!assetContract) {
      //       throw new Error("pToken access error");
      //     }

      //     const currentLeverage = (await assetContract.currentLeverage.callAsync()).div(10 ** 18);

      //     let decimals: number;
      //     if (taskRequest.positionType === PositionType.LONG) {
      //       decimals = AssetsDictionary.assets.get(taskRequest.unitOfAccount)!.decimals;

      //       zeroXTargetAmount = taskAmount.times(currentLeverage);
      //       if (taskRequest.collateral !== taskRequest.unitOfAccount) {
      //         const swapPrice = await this.getSwapRate(
      //           taskRequest.collateral,
      //           taskRequest.unitOfAccount
      //         );
      //         zeroXTargetAmount = zeroXTargetAmount.multipliedBy(swapPrice);
      //       }
      //       srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!;
      //       destTokenAddress = this.getErc20AddressOfAsset(taskRequest.unitOfAccount)!;
      //     } else {
      //       decimals = AssetsDictionary.assets.get(taskRequest.asset)!.decimals;
      //       zeroXTargetAmount = taskAmount.times(currentLeverage);

      //       if (taskRequest.collateral !== taskRequest.asset) {
      //         const swapPrice = await this.getSwapRate(
      //           taskRequest.collateral,
      //           taskRequest.asset
      //         );
      //         zeroXTargetAmount = zeroXTargetAmount.multipliedBy(swapPrice);
      //       }
      //       srcTokenAddress = this.getErc20AddressOfAsset(taskRequest.unitOfAccount)!;
      //       destTokenAddress = this.getErc20AddressOfAsset(taskRequest.asset)!;
      //     }

      //     if (decimals) {
      //       zeroXTargetAmountInBaseUnits = new BigNumber(zeroXTargetAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
      //     }
      //   }
      // }

      // if (zeroXTargetAmountInBaseUnits.gt(0) && zeroXTargetType !== "") {
      //   /*console.log(srcTokenAddress);
      //   console.log(destTokenAddress);
      //   console.log(new BigNumber(taskRequest.amount.multipliedBy(10 ** 18).toFixed(0, 1)).toString());*/

      //   //zeroXTargetAmountInBaseUnits = new BigNumber(zeroXTargetAmountInBaseUnits.dividedBy(2).toFixed(0, 1));

      //   try {

      //     let urlPrefix = "";
      //     if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      //       urlPrefix = "kovan.";
      //     } else if (process.env.REACT_APP_ETH_NETWORK !== "mainnet") {
      //       throw new Error("0x api not supported on this network");
      //     }

      //     const responseString = await fetch("https://" + urlPrefix + "api.0x.org/swap/v0/quote?sellToken=" + srcTokenAddress + "&buyToken=" + destTokenAddress + "&" + zeroXTargetType + "=" + zeroXTargetAmountInBaseUnits.toString());
      //     const response = await responseString.json();
      //     if (!response.protocolFee || !response.data) {
      //       throw new Error(JSON.stringify(response));
      //     }
      //     //console.log(response);
      //     //console.log(srcTokenAddress, destTokenAddress, zeroXTargetAmountInBaseUnits.toString());

      //     if (response.protocolFee) { // && response.buyAmount && response.sellAmount) {
      //       /*const SwapRate0x = new BigNumber(
      //         new BigNumber(response.buyAmount)
      //         .times(10**20)
      //         .dividedBy(response.sellAmount)
      //         .toFixed(0, 1)
      //       ).toString();
      //       console.log(`swapRate`, SwapRate0x);*/

      //       taskRequest.zeroXFee = new BigNumber(response.protocolFee);
      //       const Web3Utils = await import("web3-utils");
      //       taskRequest.loanDataBytes = response.data +
      //         //Web3Utils.padLeft(Web3Utils.numberToHex(SwapRate0x).substr(2), 64) +
      //         Web3Utils.padLeft(Web3Utils.numberToHex(response.protocolFee).substr(2), 64) +
      //         Web3Utils.padLeft("0", 64);

      //       // swap marketBuyOrdersFillOrKill for marketBuyOrdersNoThrow if found
      //       taskRequest.loanDataBytes = taskRequest.loanDataBytes.replace("0x8bc8efb3", "0x78d29ac1");
      //     } else {
      //       throw new Error("0x payload has missing params");
      //     }
      //   } catch (e) {
      //     console.log(e);

      //     taskRequest.zeroXFee = new BigNumber(0);
      //     taskRequest.loanDataBytes = "";
      //   }

      //   //console.log(taskRequest.zeroXFee.toString());
      //   //console.log(taskRequest.loanDataBytes)
      // }

      if (taskRequest.tradeType === TradeType.BUY) {
        // if (taskRequest.collateral !== Asset.ETH) {
        //   const {TradeBuyErcProcessor} = await import("./processors/TradeBuyErcProcessor");
        //   const processor = new TradeBuyErcProcessor();
        //   await processor.run(task, account, skipGas);
        // } else {
        //   let processor;
        //   if (taskRequest.loanDataBytes && taskRequest.zeroXFee) {
        //     const {TradeBuyErcProcessor} = await import("./processors/TradeBuyErcProcessor");
        //     processor = new TradeBuyErcProcessor();
        //   } else {
        //     const {TradeBuyProcessor} = await import("./processors/TradeBuyProcessor");
        //     processor = new TradeBuyProcessor();
        //   }
        //   await processor.run(task, account, skipGas);
        // }
        const { TradeBuyProcessor } = await import('./processors/TradeBuyProcessor')
        const processor = new TradeBuyProcessor()
        await processor.run(task, account, skipGas)
      } else {
        const { TradeSellProcessor } = await import('./processors/TradeSellProcessor')
        const processor = new TradeSellProcessor()
        await processor.run(task, account, skipGas)
        // if (taskRequest.collateral !== Asset.ETH) {
        //   const { TradeSellErcProcessor } = await import("./processors/TradeSellErcProcessor");
        //   const processor = new TradeSellErcProcessor();
        //   await processor.run(task, account, skipGas);
        // } else {
        //   const { TradeSellProcessor } = await import("./processors/TradeSellProcessor");
        //   const processor = new TradeSellProcessor();
        //   await processor.run(task, account, skipGas);
        // }
      }

      task.processingEnd(true, false, null)
    } catch (e) {
      if (
        !e.message.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)
      ) {
        console.error(e)
      }
      task.processingEnd(false, false, e)
    } finally {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToCloseProgressDlg, task)
    }
  }

  private processRolloverRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg, task.request.loanId)
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account = this.getCurrentAccount()
      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      const taskRequest: RolloverRequest = task.request as RolloverRequest

      const { RolloverProcessor } = await import('./processors/RolloverProcessor')
      const processor = new RolloverProcessor()
      await processor.run(task, account, skipGas)

      task.processingEnd(true, false, null)
    } catch (e) {
      if (
        !e.message.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)
      ) {
        console.error(e)
      }
      task.processingEnd(false, false, e)
    } finally {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToCloseProgressDlg, task)
    }
  }

  private processExtendLoanRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg, task.request.loanId)
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account = this.getCurrentAccount()
      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      const taskRequest: ExtendLoanRequest = task.request as ExtendLoanRequest

      const { ExtendLoanProcessor } = await import('./processors/ExtendLoanProcessor')
      const processor = new ExtendLoanProcessor()
      await processor.run(task, account, skipGas)

      task.processingEnd(true, false, null)
    } catch (e) {
      if (
        !e.message.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)
      ) {
        // tslint:disable-next-line:no-console
        console.log(e)
      }
      task.processingEnd(false, false, e)
    } finally {
      this.eventEmitter.emit(FulcrumProviderEvents.AskToCloseProgressDlg, task)
    }
  }

  public waitForTransactionMined = async (
    txHash: string,
    request?: LendRequest | TradeRequest | ManageCollateralRequest | RolloverRequest
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        if (!this.web3Wrapper) {
          throw new Error('web3 is not available')
        }

        this.waitForTransactionMinedRecursive(txHash, this.web3Wrapper, request, resolve, reject)
      } catch (e) {
        throw e
      }
    })
  }

  private waitForTransactionMinedRecursive = async (
    txHash: string,
    web3Wrapper: Web3Wrapper,
    request: LendRequest | TradeRequest | ManageCollateralRequest | RolloverRequest | undefined,
    resolve: (value: any) => void,
    reject: (value: any) => void
  ) => {
    try {
      const receipt = await web3Wrapper.getTransactionReceiptIfExistsAsync(txHash)
      if (receipt) {
        resolve(receipt)

        const randomNumber = Math.floor(Math.random() * 100000) + 1

        if (request) {
          if (request instanceof LendRequest) {
            const tagManagerArgs = {
              dataLayer: {
                transactionId: randomNumber,
                transactionProducts: [
                  {
                    name: 'Transaction-Lend-' + request.asset,
                    sku: request.asset,
                    category: 'Lend'
                  }
                ]
              }
            }
            isMainnetProd && TagManager.dataLayer(tagManagerArgs)
            this.eventEmitter.emit(
              FulcrumProviderEvents.LendTransactionMined,
              new LendTransactionMinedEvent(request.asset, txHash)
            )
          } else if (request instanceof ManageCollateralRequest) {
            const tagManagerArgs = {
              dataLayer: {
                transactionId: randomNumber,
                transactionProducts: [
                  {
                    name: 'Transaction-Manage-Collateral-' + request.asset,
                    sku: request.asset,
                    category: 'Manage-Collateral'
                  }
                ]
              }
            }
            isMainnetProd && TagManager.dataLayer(tagManagerArgs)
          } else if (request instanceof TradeRequest) {
            const tagManagerArgs = {
              dataLayer: {
                transactionId: randomNumber,
                transactionProducts: [
                  {
                    name: 'Transaction-Trade' + request.asset,
                    sku: request.asset,
                    category: 'Trade'
                  }
                ]
              }
            }
            isMainnetProd && TagManager.dataLayer(tagManagerArgs)
          }
        }
      } else {
        window.setTimeout(() => {
          this.waitForTransactionMinedRecursive(txHash, web3Wrapper, request, resolve, reject)
        }, 5000)
      }
    } catch (e) {
      reject(e)
    }
  }

  public async getTradeEstimatedGas(request: TradeRequest, isGasTokenEnabled: boolean) {
    let result = new BigNumber(0)
    const account = this.getCurrentAccount()
    if (!this.contractsSource || !account || !request.amount) return result

    const isLong = request.positionType === PositionType.LONG

    const loanToken = isLong ? request.quoteToken : request.asset
    const collateralToken = isLong ? request.asset : request.quoteToken
    const depositToken = request.depositToken
    const leverageAmount =
      request.positionType === PositionType.LONG
        ? new BigNumber(request.leverage - 1).times(10 ** 18)
        : new BigNumber(request.leverage).times(10 ** 18)

    const decimals: number = AssetsDictionary.assets.get(depositToken)!.decimals || 18
    const amountInBaseUnits = new BigNumber(
      request.amount.multipliedBy(10 ** decimals).toFixed(0, 1)
    )

    const loanTokenSent = depositToken === loanToken ? amountInBaseUnits : new BigNumber(0)

    const collateralTokenSent =
      depositToken === collateralToken ? amountInBaseUnits : new BigNumber(0)

    const collateralTokenAddress =
      //  collateralToken !== Asset.ETH
      FulcrumProvider.Instance.getErc20AddressOfAsset(collateralToken)
    //: FulcrumProvider.ZERO_ADDRESS

    const sendAmountForValue =
      depositToken === Asset.WETH || depositToken === Asset.ETH
        ? amountInBaseUnits
        : new BigNumber(0)

    let gasAmount = Number(FulcrumProvider.Instance.gasLimit)
    //console.log('loanTokenSent: ' + loanToken + loanTokenSent.toFixed())
    //console.log('collateralTokenSent: ' + collateralToken + collateralTokenSent.toFixed())

    if (request.tradeType === TradeType.BUY) {
      const tokenContract = this.contractsSource.getITokenContract(loanToken)
      if (!tokenContract) return result
      try {
        gasAmount = isGasTokenEnabled
          ? await tokenContract.marginTradeWithGasToken.estimateGasAsync(
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              new BigNumber(leverageAmount),
              loanTokenSent,
              collateralTokenSent,
              collateralTokenAddress!,
              account,
              account,
              '0x',
              {
                from: account,
                value: sendAmountForValue,
                gas: FulcrumProvider.Instance.gasLimit
              }
            )
          : await tokenContract.marginTrade.estimateGasAsync(
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              new BigNumber(leverageAmount),
              loanTokenSent,
              collateralTokenSent,
              collateralTokenAddress!,
              account,
              '0x',
              {
                from: account,
                value: sendAmountForValue,
                gas: FulcrumProvider.Instance.gasLimit
              }
            )
      } catch (e) {}
    } else {
      const tokenContract = await this.contractsSource.getiBZxContract()
      if (!tokenContract) return result
      try {
        gasAmount = isGasTokenEnabled
          ? await tokenContract.closeWithSwapWithGasToken.estimateGasAsync(
              request.loanId,
              account,
              account,
              amountInBaseUnits,

              request.returnTokenIsCollateral,
              '0x',
              {
                from: account,
                gas: FulcrumProvider.Instance.gasLimit
              }
            )
          : await tokenContract.closeWithSwap.estimateGasAsync(
              request.loanId,
              account,
              amountInBaseUnits,
              request.returnTokenIsCollateral,
              '0x',
              {
                from: account,
                gas: FulcrumProvider.Instance.gasLimit
              }
            )
      } catch (e) {}
    }
    return new BigNumber(gasAmount || 0)
      .multipliedBy(this.gasBufferCoeffForTrade)
      .integerValue(BigNumber.ROUND_UP)
  }

  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public isETHAsset = (asset: Asset): boolean => {
    return asset === Asset.ETH // || asset === Asset.WETH;
  }

  public getLoanExtendParams = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<IExtendState> => {
    return { minValue: 1, maxValue: 28, currentValue: 14 }
  }

  public getLoanExtendManagementAddress = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<string | null> => {
    return `extend.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`
  }

  public getLoanExtendGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000)
  }
  public getLoanExtendEstimate = async (
    interestOwedPerDay: BigNumber,
    daysToAdd: number
  ): Promise<IExtendEstimate> => {
    return { depositAmount: interestOwedPerDay.multipliedBy(daysToAdd) }
  }
}

// tslint:disable-next-line
new FulcrumProvider()
