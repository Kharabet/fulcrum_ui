import { BigNumber } from '@0x/utils'
import { Web3Wrapper } from '@0x/web3-wrapper'
import { EventEmitter } from 'events'

import Web3Utils from 'web3-utils'

import constantAddress from '../config/constant.json'

import { IWeb3ProviderSettings } from '../domain/IWeb3ProviderSettings'
import { ProviderType } from '../domain/ProviderType'
import Web3ConnectionFactory from 'bzx-common/src/services/Web3ConnectionFactory'
import ContractsSource from 'bzx-common/src/contracts/ContractsSource'
import { ExplorerProviderEvents } from './events/ExplorerProviderEvents'

import { AbstractConnector } from '@web3-react/abstract-connector'
import {
  BorrowEvent,
  BurnEvent,
  CloseWithDepositEvent,
  CloseWithSwapEvent,
  LiquidationEvent,
  MintEvent,
  RolloverEvent,
  TradeEvent,
} from 'bzx-common/src/domain/events'
import {
  getBorrowHistory,
  getBurnHistory,
  getCloseWithDepositHistory,
  getCloseWithSwapHistory,
  getLiquidationHistory,
  getLogsFromEtherscan,
  getMintHistory,
  getRolloverHistory,
  getTradeHistory,
} from 'bzx-common/src/utils'

import ProviderTypeDictionary from 'bzx-common/src/domain/ProviderTypeDictionary'

import { IParamRowProps } from '../components/ParamRow'
import { ITxRowProps } from '../components/TxRow'
import configProviders from 'bzx-common/src/config/providers.ts'
import Asset from 'bzx-common/src/assets/Asset'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { IActiveLoanData } from '../domain/IActiveLoanData'
import { IRolloverData } from '../domain/IRolloverData'
import { LiquidationRequest } from '../domain/LiquidationRequest'
import { Platform } from '../domain/Platform'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { RolloverRequest } from '../domain/RolloverRequest'
import { TasksQueue } from '../services/TasksQueue'
import { TasksQueueEvents } from './events/TasksQueueEvents'

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

let configAddress: any
if (process.env.REACT_APP_ETH_NETWORK === 'mainnet') {
  configAddress = constantAddress.mainnet
} else {
  configAddress = constantAddress.kovan
}

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

export class ExplorerProvider {
  public static Instance: ExplorerProvider

  public readonly gasLimit = '4500000'
  public readonly gasBufferCoeff = new BigNumber('1.06')
  public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1)
  // 5000ms
  public readonly successDisplayTimeout = 5000

  public readonly gasBufferForTrade = new BigNumber(5 * 10 ** 16) // 0.05 ETH

  public readonly eventEmitter: EventEmitter
  public providerType: ProviderType = ProviderType.None
  public providerEngine: any = null
  public web3Wrapper: Web3Wrapper | null = null
  public web3ProviderSettings: IWeb3ProviderSettings
  public contractsSource: ContractsSource | null = null
  public accounts: string[] = []
  public isLoading: boolean = false
  public unsupportedNetwork: boolean = false
  private isProcessing: boolean = false
  private isChecking: boolean = false

  public static readonly MAX_UINT = new BigNumber(2).pow(256).minus(1)
  public readonly assetsShown: Asset[]

  constructor() {
    // init
    this.eventEmitter = new EventEmitter()
    this.eventEmitter.setMaxListeners(1000)

    if (process.env.REACT_APP_ETH_NETWORK === 'mainnet') {
      this.assetsShown = [
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
        Asset.COMP,
      ]
    } else if (process.env.REACT_APP_ETH_NETWORK === 'kovan') {
      this.assetsShown = [Asset.USDC, Asset.fWETH, Asset.WBTC]
    } else if (process.env.REACT_APP_ETH_NETWORK === 'ropsten') {
      this.assetsShown = [Asset.DAI, Asset.ETH]
    } else {
      this.assetsShown = []
    }

    TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued)

    // singleton
    if (!ExplorerProvider.Instance) {
      ExplorerProvider.Instance = this
    }

    const storedProvider: any = ExplorerProvider.getLocalstorageItem('providerType')
    const providerType: ProviderType | null = (storedProvider as ProviderType) || null

    this.web3ProviderSettings = ExplorerProvider.getWeb3ProviderSettings(initialNetworkId)
    // ExplorerProvider.Instance.isLoading = true;
    // setting up readonly provider
    this.web3ProviderSettings = ExplorerProvider.getWeb3ProviderSettings(initialNetworkId)
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
          this.eventEmitter.emit(ExplorerProviderEvents.ProviderAvailable)
        })
      }
    })

    return ExplorerProvider.Instance
  }

  public static getLocalstorageItem(item: string): string {
    let response = ''
    response = localStorage.getItem(item) || ''
    return response
  }

  public static setLocalstorageItem(item: string, val: string) {
    localStorage.setItem(item, val)
  }

  public async setWeb3Provider(connector: AbstractConnector, account?: string) {
    const providerType = await ProviderTypeDictionary.getProviderTypeByConnector(connector)
    try {
      this.isLoading = true
      this.unsupportedNetwork = false
      await Web3ConnectionFactory.setWalletProvider(connector, providerType, account)
    } catch (e) {
      console.error(e)
      this.isLoading = false

      return
    }

    await this.setWeb3ProviderFinalize(providerType)
    this.isLoading = false
  }

  public async setReadonlyWeb3Provider() {
    await Web3ConnectionFactory.setReadonlyProvider()
    await this.setWeb3ProviderFinalize(ProviderType.None)
    this.isLoading = false
  }

  public async setWeb3ProviderFinalize(providerType: ProviderType) {
    // : Promise<boolean> {
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
      if (web3EngineAccounts.length > 0 && this.accounts.length === 0)
        this.accounts = web3EngineAccounts
      if (this.accounts.length === 0) {
        canWrite = false // revert back to read-only
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      const newContractsSource = await new ContractsSource(
        this.providerEngine,
        this.web3ProviderSettings.networkId,
        canWrite
      )
      await newContractsSource.Init()
      this.contractsSource = newContractsSource
    } else {
      this.contractsSource = null
    }

    this.providerType = canWrite ? providerType : ProviderType.None

    ExplorerProvider.setLocalstorageItem('providerType', this.providerType)
  }

  public static getWeb3ProviderSettings(networkId: number | null): IWeb3ProviderSettings {
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
      etherscanURL,
    }
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

    const account =
      this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null
    const tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address)

    if (!account || !tokenErc20Contract) {
      return result
    }

    if (resetRequiredAssets.includes(asset)) {
      const allowance = await tokenErc20Contract.allowance(account, spender).callAsync()
      if (allowance.gt(0) && amountInBaseUnits.gt(allowance)) {
        const zeroApprovHash = await tokenErc20Contract
          .approve(spender, new BigNumber(0))
          .sendTransactionAsync({ from: account })
        await this.waitForTransactionMined(zeroApprovHash)
      }
    }

    result = await tokenErc20Contract.approve(spender, amountInBaseUnits).sendTransactionAsync({
      from: account,
    })

    return result
  }

  public onLiquidationConfirmed = async (request: LiquidationRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onRolloverConfirmed = async (request: RolloverRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public getLiquidationHistoryWithTimestamps = async (): Promise<LiquidationEvent[]> => {
    let result: LiquidationEvent[] = []
    if (!this.contractsSource) return result
    const bzxContractAddress = this.contractsSource.getiBZxAddress()

    const eventsBatch0 =
      (await getLogsFromEtherscan(
        '10500001',
        '11000000',
        bzxContractAddress,
        [LiquidationEvent.topic0],
        networkName!,
        configProviders.Etherscan_Api
      )) || []
    const eventsBatch1 =
      (await getLogsFromEtherscan(
        '11000001',
        '11500000',
        bzxContractAddress,
        [LiquidationEvent.topic0],
        networkName!,
        configProviders.Etherscan_Api
      )) || []
    const eventsBatch2 =
      (await getLogsFromEtherscan(
        '11500001',
        'latest',
        bzxContractAddress,
        [LiquidationEvent.topic0],
        networkName!,
        configProviders.Etherscan_Api
      )) || []
    const events = eventsBatch0.concat(eventsBatch1).concat(eventsBatch2)
    result = events
      .reverse()
      .map((event: any) => {
        const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
        const liquidatorAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
        const loanId = event.topics[3]
        const data = event.data.replace('0x', '')
        const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
        if (!dataSegments) return null
        const lender = dataSegments[0].replace('000000000000000000000000', '0x')

        const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
        const collateralTokenAddress = dataSegments[2].replace('000000000000000000000000', '0x')
        const loanToken = this.contractsSource!.getAssetFromAddress(loanTokenAddress)
        const collateralToken = this.contractsSource!.getAssetFromAddress(collateralTokenAddress)
        if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) return null
        const repayAmount = new BigNumber(parseInt(dataSegments[3], 16))
        const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16))
        const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16))
        const currentMargin = new BigNumber(parseInt(dataSegments[6], 16))
        const blockNumber = new BigNumber(event.blockNumber)
        const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000)
        const txHash = event.transactionHash
        return new LiquidationEvent(
          userAddress,
          liquidatorAddress,
          loanId,
          lender,
          loanToken,
          collateralToken,
          repayAmount,
          collateralWithdrawAmount,
          collateralToLoanRate,
          currentMargin,
          blockNumber,
          txHash,
          timeStamp
        )
      })
      .filter((e: any) => e)
    return result
  }

  public getLiquidationHistory = async (): Promise<LiquidationEvent[]> => {
    let result: LiquidationEvent[] = []
    if (!this.contractsSource || !this.web3Wrapper) return result
    return getLiquidationHistory(this.web3Wrapper, this.contractsSource)
  }

  public getTradeHistory = async (): Promise<TradeEvent[]> => {
    let result: TradeEvent[] = []
    if (!this.contractsSource || !this.web3Wrapper) return result
    return getTradeHistory(this.web3Wrapper, this.contractsSource)
  }

  public getRolloverHistory = async (): Promise<RolloverEvent[]> => {
    let result: RolloverEvent[] = []
    if (!this.contractsSource || !this.web3Wrapper) return result
    return getRolloverHistory(this.web3Wrapper, this.contractsSource)
  }

  public getCloseWithSwapHistory = async (): Promise<CloseWithSwapEvent[]> => {
    let result: CloseWithSwapEvent[] = []
    if (!this.contractsSource || !this.web3Wrapper) return result
    return getCloseWithSwapHistory(this.web3Wrapper, this.contractsSource)
  }

  public getCloseWithDepositHistory = async (): Promise<CloseWithDepositEvent[]> => {
    let result: CloseWithDepositEvent[] = []
    if (!this.contractsSource || !this.web3Wrapper) return result
    return getCloseWithDepositHistory(this.web3Wrapper, this.contractsSource)
  }

  public getBorrowHistory = async (): Promise<BorrowEvent[]> => {
    let result: BorrowEvent[] = []
    if (!this.contractsSource || !this.web3Wrapper) return result
    return getBorrowHistory(this.web3Wrapper, this.contractsSource)
  }

  public getBzxLoans = async (
    start: number,
    count: number,
    isUnhealthy: boolean
  ): Promise<IActiveLoanData[]> => {
    let result: IActiveLoanData[] = []
    if (!this.contractsSource) return result
    const iBZxContract = await this.contractsSource.getiBZxContract()

    if (!iBZxContract) return result
    const loansData = await iBZxContract
      .getActiveLoans(new BigNumber(start), new BigNumber(count), isUnhealthy)
      .callAsync()

    const mappedAssetsShown = this.assetsShown.map((asset) => this.wethToEth(asset))
    const usdPrices = await this.getSwapToUsdRatesOffChain(mappedAssetsShown)
    loansData.forEach(async (e) => {
      const loanAsset = this.contractsSource!.getAssetFromAddress(e.loanToken)
      const collateralAsset = this.contractsSource!.getAssetFromAddress(e.collateralToken)
      if (loanAsset === Asset.UNKNOWN || collateralAsset === Asset.UNKNOWN) {
        return null
      }
      const loanAssetIndex = mappedAssetsShown.indexOf(this.wethToEth(loanAsset))
      const loanAssetUsdRate = usdPrices[loanAssetIndex]
      const loanPrecision = AssetsDictionary.assets.get(loanAsset)!.decimals || 18
      const collateralAssetIndex = mappedAssetsShown.indexOf(this.wethToEth(collateralAsset))
      const collateralAssetUsdRate = usdPrices[collateralAssetIndex]
      const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18
      let amountOwned = e.principal.minus(e.interestDepositRemaining)
      if (amountOwned.lte(0)) {
        amountOwned = new BigNumber(0)
      } else {
        amountOwned = amountOwned.dividedBy(10 ** loanPrecision).dp(5, BigNumber.ROUND_CEIL)
      }
      const maxSeizableUsd = e.maxSeizable
        .dividedBy(10 ** collateralPrecision)
        .times(collateralAssetUsdRate)
      const maxLiquidatableUsd = e.maxLiquidatable
        .dividedBy(10 ** loanPrecision)
        .times(loanAssetUsdRate)
      if (isUnhealthy && (e.maxSeizable.isZero() || maxSeizableUsd.lte(maxLiquidatableUsd))) {
        return null
      }
      result.push({
        loanId: e.loanId,
        loanAsset: loanAsset,
        collateralAsset: collateralAsset,
        amountOwedUsd: amountOwned.times(loanAssetUsdRate),
        maxLiquidatable: e.maxLiquidatable.dividedBy(10 ** loanPrecision),
        maxLiquidatableUsd: maxLiquidatableUsd,
        maxSeizable: e.maxSeizable.dividedBy(10 ** collateralPrecision),
        loanData: e,
      })
    })

    return result
  }

  public getRollovers = async (start: number, count: number): Promise<IRolloverData[]> => {
    const rollovers: IRolloverData[] = []
    if (!this.contractsSource) return rollovers
    const iBZxContract = await this.contractsSource.getiBZxContract()

    if (!iBZxContract) return rollovers

    const activeLoans = await this.getBzxLoans(start, count, false)
    const rolloverPendingLoans = activeLoans.filter(
      (loan) => loan && loan.loanData && loan.loanData.interestDepositRemaining.eq(0)
    )
    for (const i in rolloverPendingLoans) {
      if (!rolloverPendingLoans[i]) {
        continue
      }
      const loan = rolloverPendingLoans[i]
      try {
        const rolloverEstimate = await iBZxContract.rollover(loan.loanId, '0x').callAsync()
        const rebateAsset = this.contractsSource.getAssetFromAddress(rolloverEstimate[0])
        const decimals = AssetsDictionary.assets.get(rebateAsset)?.decimals || 18
        if (rebateAsset === Asset.UNKNOWN) {
          continue
        }
        const gasRebate = rolloverEstimate[1].div(10 ** decimals)
        const rollover = { ...loan, rebateAsset, gasRebate }
        rollovers.push(rollover)
      } catch (e) {
        console.error(e)
      }
    }
    return rollovers
  }

  public getBurnHistory = async (asset: Asset): Promise<BurnEvent[]> => {
    let result: BurnEvent[] = []
    if (!this.contractsSource || !this.web3Wrapper) return result
    return getBurnHistory(asset, this.web3Wrapper, this.contractsSource)
  }

  public getMintHistory = async (asset: Asset): Promise<MintEvent[]> => {
    let result: MintEvent[] = []
    if (!this.contractsSource || !this.web3Wrapper) return result
    return getMintHistory(asset, this.web3Wrapper, this.contractsSource)
  }

  public getGridItems = (
    events: (
      | LiquidationEvent
      | TradeEvent
      | CloseWithSwapEvent
      | BorrowEvent
      | BurnEvent
      | MintEvent
      | CloseWithDepositEvent
      | RolloverEvent
    )[]
  ): ITxRowProps[] => {
    if (events.length === 0) return []
    if (!ExplorerProvider.Instance.contractsSource) return []
    let initialNetworkId = ExplorerProvider.Instance.contractsSource.networkId
    const etherscanUrl = ExplorerProvider.getWeb3ProviderSettings(initialNetworkId).etherscanURL
    return events.map((e) => {
      if (e instanceof TradeEvent) {
        const decimals = AssetsDictionary.assets.get(e.loanToken)!.decimals! || 18
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          blockNumber: e.blockNumber,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
          quantity: e.borrowedAmount.div(10 ** decimals),
          action: 'Open Fulcrum Loan',
          asset: e.loanToken,
        } as ITxRowProps
      } else if (e instanceof RolloverEvent) {
        const decimals = AssetsDictionary.assets.get(e.collateralToken)!.decimals! || 18
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          blockNumber: e.blockNumber,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
          quantity: e.collateralAmountUsed.div(10 ** decimals),
          action: 'Rollover Fulcrum Loan',
          asset: e.loanToken,
        } as ITxRowProps
      } else if (e instanceof CloseWithSwapEvent) {
        const decimals = AssetsDictionary.assets.get(e.loanToken)!.decimals! || 18
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          blockNumber: e.blockNumber,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
          quantity: e.loanCloseAmount.div(10 ** decimals),
          action: 'Close Fulcrum Loan',
          asset: e.loanToken,
        } as ITxRowProps
      } else if (e instanceof LiquidationEvent) {
        const decimals = AssetsDictionary.assets.get(e.loanToken)!.decimals! || 18
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          blockNumber: e.blockNumber,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
          quantity: e.repayAmount.div(10 ** decimals),
          action: 'Liquidate Fulcrum Loan',
          asset: e.loanToken,
        } as ITxRowProps
      } else if (e instanceof CloseWithDepositEvent) {
        const decimals = AssetsDictionary.assets.get(e.loanToken)!.decimals! || 18
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          blockNumber: e.blockNumber,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
          quantity: e.repayAmount.div(10 ** decimals),
          action: 'Close Torque Loan',
          asset: e.loanToken,
        } as ITxRowProps
      } else if (e instanceof BorrowEvent) {
        const decimals = AssetsDictionary.assets.get(e.loanToken)!.decimals! || 18
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          blockNumber: e.blockNumber,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
          quantity: e.newPrincipal.div(10 ** decimals),
          action: 'Open Torque Loan',
          asset: e.loanToken,
        } as ITxRowProps
      } else if (e instanceof BurnEvent) {
        const decimals = AssetsDictionary.assets.get(e.asset)!.decimals! || 18
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          blockNumber: e.blockNumber,
          account: e.burner,
          etherscanAddressUrl: `${etherscanUrl}address/${e.burner}`,
          quantity: e.assetAmount.div(10 ** decimals),
          action: 'Burn Token',
          asset: e.asset,
        } as ITxRowProps
      } else {
        //MintEvent
        const decimals = AssetsDictionary.assets.get(e.asset)!.decimals! || 18
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          blockNumber: e.blockNumber,
          account: e.minter,
          etherscanAddressUrl: `${etherscanUrl}address/${e.minter}`,
          quantity: e.assetAmount.div(10 ** decimals),
          action: 'Mint iToken',
          asset: e.asset,
        }
      }
    })
  }

  public gasPrice = async (): Promise<BigNumber> => {
    let result = new BigNumber(500).multipliedBy(10 ** 9) // upper limit 500 gwei
    const lowerLimit = new BigNumber(3).multipliedBy(10 ** 9) // lower limit 3 gwei

    const url = `https://ethgasstation.info/json/ethgasAPI.json`
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
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
      result = new BigNumber(12).multipliedBy(10 ** 9) // error default 8 gwei
    }

    if (result.lt(lowerLimit)) {
      result = lowerLimit
    }

    return result
  }
  public getErc20AddressOfAsset(asset: Asset): string | null {
    let result: string | null = null

    const assetDetails = AssetsDictionary.assets.get(asset)
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || ''
    }
    return result
  }

  public getLargeApprovalAmount = (
    asset: Asset,
    neededAmount: BigNumber = new BigNumber(0)
  ): BigNumber => {
    return ExplorerProvider.MAX_UINT
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
        result = await helperContract.assetRates(usdTokenAddress, underlyings, amounts).callAsync()
      }
    }

    return result
  }

  public async getSwapToUsdRate(asset: Asset, offChain = false): Promise<BigNumber> {
    if (
      asset === Asset.SAI ||
      asset === Asset.DAI ||
      asset === Asset.USDC ||
      asset === Asset.SUSD ||
      asset === Asset.USDT
    ) {
      return new BigNumber(1)
    }

    if (offChain) {
      return this.getSwapToUsdRateOffChain(asset)
    }

    return this.getSwapRate(asset, isMainnetProd ? Asset.DAI : Asset.USDC)
  }

  public async getSwapRate(
    srcAsset: Asset,
    destAsset: Asset,
    srcAmount?: BigNumber
  ): Promise<BigNumber> {
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
    if (!srcAmount) {
      srcAmount = ExplorerProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS
    } else {
      srcAmount = new BigNumber(srcAmount.toFixed(1, 1))
    }

    if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
      const oracleContract = await this.contractsSource.getOracleContract()

      const srcAssetDecimals = AssetsDictionary.assets.get(srcAsset)!.decimals || 18
      const srcAssetPrecision = new BigNumber(10 ** (18 - srcAssetDecimals))
      const destAssetDecimals = AssetsDictionary.assets.get(destAsset)!.decimals || 18
      const destAssetPrecision = new BigNumber(10 ** (18 - destAssetDecimals))

      try {
        const swapPriceData: BigNumber[] = await oracleContract
          .queryRate(srcAssetErc20Address, destAssetErc20Address)
          .callAsync()
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

  public getSwapToUsdRateOffChain = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)
    const token = this.isETHAsset(asset) ? Asset.ETH : asset
    const swapToUsdHistoryRateRequest = await fetch('https://api.bzx.network/v1/oracle-rates-usd')
    const swapToUsdHistoryRateResponse = await swapToUsdHistoryRateRequest.json()
    if (
      swapToUsdHistoryRateResponse.success &&
      swapToUsdHistoryRateResponse.data[token.toLowerCase()]
    ) {
      result = new BigNumber(swapToUsdHistoryRateResponse.data[token.toLowerCase()])
    }
    return result
  }

  public getSwapToUsdRatesOffChain = async (assets: Asset[]): Promise<BigNumber[]> => {
    let result = Array<BigNumber>(assets.length).fill(new BigNumber(0))
    const swapToUsdHistoryRateRequest = await fetch('https://api.bzx.network/v1/oracle-rates-usd')
    const swapToUsdHistoryRateResponse = await swapToUsdHistoryRateRequest.json()
    if (swapToUsdHistoryRateResponse.success) {
      result = assets.map((asset) => {
        const token = this.isETHAsset(asset) ? Asset.ETH : asset
        return swapToUsdHistoryRateResponse.data[token.toLowerCase()]
          ? new BigNumber(swapToUsdHistoryRateResponse.data[token.toLowerCase()])
          : new BigNumber(0)
      })
    }
    return result
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
      this.isChecking = false
    }
  }

  private processRequestTask = async (task: RequestTask, skipGas: boolean) => {
    if (task.request instanceof LiquidationRequest) {
      await this.processLiquidationRequestTask(task, skipGas)
    } else if (task.request instanceof RolloverRequest) {
      await this.processRolloverRequestTask(task, skipGas)
    }

    return false
  }

  private processLiquidationRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      this.eventEmitter.emit(ExplorerProviderEvents.AskToOpenProgressDlg, task.request.loanId)
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account =
        this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null
      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      // Initializing loan
      const taskRequest: LiquidationRequest = task.request as LiquidationRequest

      const { LiquidationProcessor } = await import('./processors/LiquidationProcessor')
      const processor = new LiquidationProcessor()
      await processor.run(task, account, skipGas)

      task.processingEnd(true, false, null)
    } catch (e) {
      console.error(e)
      task.processingEnd(false, false, e)
    } finally {
      this.eventEmitter.emit(ExplorerProviderEvents.AskToCloseProgressDlg, task)
    }
  }

  private processRolloverRequestTask = async (task: RequestTask, skipGas: boolean) => {
    try {
      this.eventEmitter.emit(ExplorerProviderEvents.AskToOpenProgressDlg, task.request.loanId)
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account =
        this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null
      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      // Initializing loan
      const taskRequest: RolloverRequest = task.request as RolloverRequest

      const { RolloverProcessor } = await import('./processors/RolloverProcessor')
      const processor = new RolloverProcessor()
      await processor.run(task, account, skipGas)

      task.processingEnd(true, false, null)
    } catch (e) {
      console.error(e)
      task.processingEnd(false, false, e)
    } finally {
      this.eventEmitter.emit(ExplorerProviderEvents.AskToCloseProgressDlg, task)
    }
  }

  public waitForTransactionMined = async (
    txHash: string,
    request?: LiquidationRequest | RolloverRequest
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
    request: LiquidationRequest | RolloverRequest | undefined,
    resolve: (value: any) => void,
    reject: (value: any) => void
  ) => {
    try {
      const receipt = await web3Wrapper.getTransactionReceiptIfExistsAsync(txHash)
      if (receipt) {
        resolve(receipt)
      } else {
        window.setTimeout(() => {
          this.waitForTransactionMinedRecursive(txHash, web3Wrapper, request, resolve, reject)
        }, 5000)
      }
    } catch (e) {
      reject(e)
    }
  }

  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async getGasTokenAllowance(): Promise<BigNumber> {
    let result = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account =
        this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null

      if (account) {
        const assetAddress = this.getErc20AddressOfAsset(Asset.CHI)
        if (assetAddress) {
          const tokenContract = await this.contractsSource.getErc20Contract(assetAddress)
          if (tokenContract) {
            result = await tokenContract
              .allowance(account, this.contractsSource.getTokenHolderAddress())
              .callAsync()
          }
        }
      }
    }

    return result
  }

  private async getErc20BalanceOfUser(addressErc20: string, account?: string): Promise<BigNumber> {
    let result = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource) {
      if (!account && this.contractsSource.canWrite) {
        account =
          this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : undefined
      }

      if (account) {
        const tokenContract = await this.contractsSource.getErc20Contract(addressErc20)
        if (tokenContract) {
          result = await tokenContract.balanceOf(account).callAsync()
        }
      }
    }

    return result
  }

  public async getEthBalance(): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account =
        this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null
      if (account) {
        const balance = await this.web3Wrapper.getBalanceInWeiAsync(account)
        result = new BigNumber(balance)
      }
    }

    return result
  }

  public async getAssetTokenBalanceOfUser(asset: Asset, account?: string): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0)
    if (asset === Asset.UNKNOWN) {
      // always 0
      result = new BigNumber(0)
    } else if (asset === Asset.ETH) {
      // get eth (wallet) balance
      result = (await this.getEthBalance()).div(10 ** 18)
    } else {
      // get erc20 token balance
      const decimals = AssetsDictionary.assets.get(asset)!.decimals || 18
      const assetErc20Address = this.getErc20AddressOfAsset(asset)
      if (assetErc20Address) {
        result = await this.getErc20BalanceOfUser(assetErc20Address, account)
        result = result.div(10 ** decimals)
      }
    }

    return result
  }

  private getLoanParams = async (
    asset: Asset,
    collateralAsset: Asset,
    platform: Platform
  ): Promise<IParamRowProps | null> => {
    if (!this.contractsSource) {
      return null
    }
    const iToken = await this.contractsSource.getITokenContract(asset)
    const iBZxContract = await this.contractsSource.getiBZxContract()
    const collateralTokenAddress =
      AssetsDictionary.assets
        .get(collateralAsset)!
        .addressErc20.get(this.web3ProviderSettings.networkId) || ''
    if (!iToken || !collateralTokenAddress || !iBZxContract) return null
    // @ts-ignore
    const id = new BigNumber(
      Web3Utils.soliditySha3(collateralTokenAddress, platform === Platform.Torque) || 0
    )
    const loanId = await iToken.loanParamsIds(id).callAsync()
    const loanParams = await iBZxContract.loanParams(loanId).callAsync()
    const result = {
      loanId: loanParams[0],
      principal: loanParams[3],
      collateral: loanParams[4],
      platform: platform,
      initialMargin: loanParams[5].div(10 ** 18),
      maintenanceMargin: loanParams[6].div(10 ** 18),
      liquidationPenalty: new BigNumber(0),
    } as IParamRowProps
    return result
  }
  public getFulcrumParams = async (): Promise<IParamRowProps[] | undefined> => {
    const params: IParamRowProps[] = []
    const assets = Object.values(Asset).filter((key) => key !== Asset.UNKNOWN)
    const pairs: any[] = []
    assets.forEach((asset) => {
      assets.forEach((collateralAsset) => {
        if (asset !== collateralAsset) {
          pairs.push({
            asset,
            collateralAsset,
          })
        }
      })
    })

    pairs.forEach(async (pair) => {
      const param = await this.getLoanParams(pair.asset, pair.collateralAsset, Platform.Fulcrum)
      if (param) params.push(param)
    })
    //  const param = await this.getLoanParams(Asset.ETH, Asset.DAI, Platform.Fulcrum)
    // param && params.push(param)
    return Promise.all(params)
  }

  public isETHAsset = (asset: Asset): boolean => {
    return asset === Asset.ETH || asset === Asset.WETH || asset === Asset.fWETH
  }
  public wethToEth = (asset: Asset): Asset => {
    return asset === Asset.ETH || asset === Asset.WETH ? Asset.ETH : asset
  }
}

new ExplorerProvider()
