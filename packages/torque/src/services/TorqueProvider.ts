import { BigNumber } from '@0x/utils'
import { Web3Wrapper } from '@0x/web3-wrapper'
import { EventEmitter } from 'events'

import Web3Utils from 'web3-utils'

import constantAddress from '../config/constant.json'
import { cdpManagerContract } from 'bzx-common/src/contracts/typescript-wrappers/cdpManager'
import { CompoundBridgeContract } from 'bzx-common/src/contracts/typescript-wrappers/CompoundBridge'
import { CompoundComptrollerContract } from 'bzx-common/src/contracts/typescript-wrappers/CompoundComptroller'
import { dsProxyJsonContract } from 'bzx-common/src/contracts/typescript-wrappers/dsProxyJson'
// import rawEncode  from "ethereumjs-abi";
import { erc20Contract } from 'bzx-common/src/contracts/typescript-wrappers/erc20'
import { GetCdpsContract } from 'bzx-common/src/contracts/typescript-wrappers/getCdps'
import { instaRegistryContract } from 'bzx-common/src/contracts/typescript-wrappers/instaRegistry'
import { makerBridgeContract } from 'bzx-common/src/contracts/typescript-wrappers/makerBridge'
import { proxyRegistryContract } from 'bzx-common/src/contracts/typescript-wrappers/proxyRegistry'
import { saiToDAIBridgeContract } from 'bzx-common/src/contracts/typescript-wrappers/saiToDaiBridge'
import { SoloContract } from 'bzx-common/src/contracts/typescript-wrappers/solo'
import { SoloBridgeContract } from 'bzx-common/src/contracts/typescript-wrappers/SoloBridge'

import { vatContract } from 'bzx-common/src/contracts/typescript-wrappers/vat'
import Asset from 'bzx-common/src/assets/Asset'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { BorrowRequest } from '../domain/BorrowRequest'
import { BorrowRequestAwaiting } from '../domain/BorrowRequestAwaiting'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { IDepositEstimate } from '../domain/IDepositEstimate'
import { IBorrowEstimate } from '../domain/IBorrowEstimate'
import { ICollateralChangeEstimate } from '../domain/ICollateralChangeEstimate'
import { ICollateralManagementParams } from '../domain/ICollateralManagementParams'
import { IExtendEstimate } from '../domain/IExtendEstimate'
import { IExtendState } from '../domain/IExtendState'
import { ILoanParams } from '../domain/ILoanParams'
import { IRepayEstimate } from '../domain/IRepayEstimate'
import { IRepayState } from '../domain/IRepayState'
import { IWeb3ProviderSettings } from '../domain/IWeb3ProviderSettings'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { ProviderType } from '../domain/ProviderType'
import {
  IRefinanceLoan,
  IRefinanceToken,
  RefinanceCdpData,
  RefinanceData,
} from '../domain/RefinanceData'
import { RepayLoanRequest } from '../domain/RepayLoanRequest'
import { RolloverRequest } from '../domain/RolloverRequest'
import Web3ConnectionFactory from 'bzx-common/src/services/Web3ConnectionFactory'
import { BorrowRequestAwaitingStore } from './BorrowRequestAwaitingStore'
import ContractsSource from 'bzx-common/src/contracts/ContractsSource'
import { TorqueProviderEvents } from './events/TorqueProviderEvents'

import { AbstractConnector } from '@web3-react/abstract-connector'
import { ProviderTypeDictionary } from '../domain/ProviderTypeDictionary'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { TasksQueueEvents } from './events/TasksQueueEvents'
import { TasksQueue } from './TasksQueue'
import configProviders from 'bzx-common/src/config/providers'
import { LiquidationEvent } from '../domain/events/LiquidationEvent'
import {
  getErc20AddressOfAsset,
  getEthBalance,
  getErc20BalanceOfUser,
  getGoodSourceAmountOfAsset,
  getLocalstorageItem,
  setLocalstorageItem,
  getCurrentAccount
} from 'bzx-common/src/utils'

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
    case 'bsc':
      return 56
    default:
      return 0
  }
}
const networkName = process.env.REACT_APP_ETH_NETWORK
const initialNetworkId = getNetworkIdByString(networkName)

export class TorqueProvider {
  public static Instance: TorqueProvider
  public impersonateAddress = ''

  public readonly gasLimit = '4000000'

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber('1.03')
  // 5000ms
  public readonly successDisplayTimeout = 5000

  public readonly gasBufferForTxn = new BigNumber(5 * 10 ** 16) // 0.05 ETH

  public static readonly MAX_UINT = new BigNumber(2).pow(256).minus(1)

  public static readonly ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

  private isProcessing: boolean = false
  private isChecking: boolean = false

  public readonly eventEmitter: EventEmitter
  public providerType: ProviderType = ProviderType.None
  public providerEngine: any = null
  public web3Wrapper: Web3Wrapper | null = null
  public web3ProviderSettings: IWeb3ProviderSettings
  public contractsSource: ContractsSource | null = null
  public borrowRequestAwaitingStore: BorrowRequestAwaitingStore | null = null
  public accounts: string[] = []
  public compoundDeposits: IRefinanceLoan[] = []
  public soloDeposits: IRefinanceLoan[] = []
  public isLoading: boolean = false
  public unsupportedNetwork: boolean = false
  public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1)

  public destinationAbbr: string = ''

  constructor() {
    // init
    this.eventEmitter = new EventEmitter()
    this.eventEmitter.setMaxListeners(1000)

    TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued)

    // singleton
    if (!TorqueProvider.Instance) {
      TorqueProvider.Instance = this
    }

    const storedProvider: any = getLocalstorageItem('providerType')
    const providerType: ProviderType | null = (storedProvider as ProviderType) || null

    this.web3ProviderSettings = TorqueProvider.getWeb3ProviderSettings(initialNetworkId)
    if (!providerType || providerType === ProviderType.None) {
      // TorqueProvider.Instance.isLoading = true;
      // setting up readonly provider
      this.web3ProviderSettings = TorqueProvider.getWeb3ProviderSettings(initialNetworkId)
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
            this.borrowRequestAwaitingStore = new BorrowRequestAwaitingStore(
              this.web3ProviderSettings.networkId,
              web3Wrapper
            )
            this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable)
          })
        }
      })
    }

    return TorqueProvider.Instance
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

    setLocalstorageItem('providerType', this.providerType)
  }

  public async setWeb3ProviderMobileFinalize(
    providerType: ProviderType,
    providerData: [Web3Wrapper | null, any, boolean, number, string]
  ) {
    // : Promise<boolean> {
    this.web3Wrapper = providerData[0]
    this.providerEngine = providerData[1]
    let canWrite = providerData[2]
    let networkId = providerData[3]
    const selectedAccount = providerData[4]

    this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(networkId)
    if (this.web3Wrapper) {
      if (this.web3ProviderSettings.networkName !== process.env.REACT_APP_ETH_NETWORK) {
        // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)

        this.unsupportedNetwork = true
        canWrite = false // revert back to read-only
        networkId = await this.web3Wrapper.getNetworkIdAsync()
        this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(networkId)
      } else {
        this.unsupportedNetwork = false
      }
    }

    if (this.web3Wrapper && canWrite) {
      try {
        this.accounts = [selectedAccount] // await this.web3Wrapper.getAvailableAddressesAsync() || [];
      } catch (e) {
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
      this.borrowRequestAwaitingStore = new BorrowRequestAwaitingStore(
        this.web3ProviderSettings.networkId,
        this.web3Wrapper
      )
      if (canWrite) {
        this.providerType = providerType
      } else {
        this.providerType = ProviderType.None
      }

      setLocalstorageItem('providerType', providerType)
    } else {
      this.contractsSource = null
    }

    if (this.contractsSource) {
      await this.contractsSource.Init()
    }
    TorqueProvider.Instance.isLoading = false
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
      case 56:
        networkName = 'bsc'
        etherscanURL = 'https://bscscan.com/'
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

  public async getAssetTokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0)
    const account = getCurrentAccount(this.accounts)
    if (asset === Asset.UNKNOWN || !this.contractsSource || !this.web3Wrapper || !account) {
      // always 0
      result = new BigNumber(0)
    } else if (this.isETHAsset(asset)) {
      // get eth (wallet) balance
      result = await getEthBalance(this.web3Wrapper, account)
    } else {
      // get erc20 token balance
      // const precision = AssetsDictionary.assets.get(asset)!.decimals || 18;
      const assetErc20Address = getErc20AddressOfAsset(asset)

      if (account && assetErc20Address) {
        result = await getErc20BalanceOfUser(this.contractsSource, assetErc20Address, account)
        // result = result.multipliedBy(10 ** (18 - precision));
      }
    }
    // to get human-readable amount result should be divided by asset decimals
    return result
  }

  public async getBalanceOf(asset: Asset): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0)

    if (this.contractsSource && this.web3Wrapper) {
      const assetAddress = getErc20AddressOfAsset(asset)
      if (assetAddress) {
        const tokenContract = await this.contractsSource.getErc20Contract(assetAddress)
        const iBZxAddress = this.contractsSource.getiBZxAddress()
        if (tokenContract) {
          const precision = AssetsDictionary.assets.get(asset)!.decimals || 18
          result = (await tokenContract.balanceOf(iBZxAddress).callAsync()).dividedBy(
            10 ** precision
          )
        }
      }
    }
    return result
  }

  public async getGasTokenAllowance(): Promise<BigNumber> {
    let result = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = getCurrentAccount(this.accounts)

      if (account) {
        const assetAddress = getErc20AddressOfAsset(Asset.CHI)
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

  public getDepositAmountEstimate = async (
    borrowAsset: Asset,
    collateralAsset: Asset,
    amount: BigNumber,
    collaterizationPercent: BigNumber
  ): Promise<IDepositEstimate> => {
    const result = { depositAmount: new BigNumber(0), gasEstimate: new BigNumber(0) }

    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getITokenContract(borrowAsset)
      const iBZxContract = await this.contractsSource.getiBZxContract()
      const collateralAssetErc20Address = getErc20AddressOfAsset(collateralAsset) || ''
      if (amount.gt(0) && iTokenContract && iBZxContract && collateralAssetErc20Address) {
        const loanPrecision = AssetsDictionary.assets.get(borrowAsset)!.decimals || 18
        const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18

        const borrowEstimate = await iTokenContract
          .getDepositAmountForBorrow(
            amount.multipliedBy(10 ** loanPrecision),
            new BigNumber(7884000), // approximately 3 months
            collateralAssetErc20Address
          )
          .callAsync()

        result.depositAmount = borrowEstimate.dividedBy(10 ** collateralPrecision)
      }
    }

    return result
  }

  public getBorrowAmountEstimate = async (
    borrowAsset: Asset,
    collateralAsset: Asset,
    depositAmount: BigNumber,
    collaterizationPercent: BigNumber
  ): Promise<IBorrowEstimate> => {
    const result = {
      borrowAmount: new BigNumber(0),
      gasEstimate: new BigNumber(0),
      exceedsLiquidity: false,
    }

    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getITokenContract(borrowAsset)
      const iBZxContract = await this.contractsSource.getiBZxContract()
      const collateralAssetErc20Address = getErc20AddressOfAsset(collateralAsset) || ''
      if (depositAmount.gt(0) && iTokenContract && iBZxContract && collateralAssetErc20Address) {
        const collateralToLoanRate = await this.getSwapRate(collateralAsset, borrowAsset)
        const liquidity = await this.getAvailableLiquidity(borrowAsset)
        if (depositAmount.times(collateralToLoanRate).gte(liquidity)) {
          result.borrowAmount = liquidity.times(0.8)
          result.exceedsLiquidity = true
          return result
        }
        const loanPrecision = AssetsDictionary.assets.get(borrowAsset)!.decimals || 18
        const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18

        const borrowEstimate = await iTokenContract
          .getBorrowAmountForDeposit(
            depositAmount.multipliedBy(10 ** collateralPrecision),
            new BigNumber(7884000), // approximately 3 months
            collateralAssetErc20Address
          )
          .callAsync()
        const minInitialMargin = await this.getMinInitialMargin(borrowAsset, collateralAsset)
        // getBorrowAmountForDeposit estimates borrow amount for 20% less collaterization than getDepositAmountForBorrow
        // example: borrow 52USDC for 1ETH (1eth = 100USDC) with desired collaterization 200%
        // by default, it will create a loan with borrowed 52USDC, 1ETH collateral and 180% collaterization
        // so we need to compensate this 20%
        const realBorrowAmount = borrowEstimate
          .div(collaterizationPercent.plus(20))
          .times(minInitialMargin)
        result.borrowAmount = realBorrowAmount.dividedBy(10 ** loanPrecision)
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
    const srcAssetErc20Address = getErc20AddressOfAsset(srcAsset)
    const destAssetErc20Address = getErc20AddressOfAsset(destAsset)
    if (!srcAmount) {
      srcAmount = TorqueProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS
    } else {
      srcAmount = new BigNumber(srcAmount.toFixed(1, 1))
    }

    if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
      const oracleContract = await this.contractsSource.getOracleContract()
      try {
        const swapPriceData: BigNumber[] = await oracleContract
          .queryRate(srcAssetErc20Address, destAssetErc20Address)
          .callAsync()
        result = swapPriceData[0].dividedBy(10 ** 18)
      } catch (e) {
        console.error(e)
        result = new BigNumber(0)
      }
    }
    return result
  }

  public getLargeApprovalAmount = (
    asset: Asset,
    neededAmount: BigNumber = new BigNumber(0)
  ): BigNumber => {
    return TorqueProvider.MAX_UINT

  }

  public setApproval = async (
    spender: string,
    asset: Asset,
    amountInBaseUnits: BigNumber
  ): Promise<string> => {
    const resetRequiredAssets = [Asset.USDT, Asset.KNC] // these assets require to set approve to 0 before approve larger amount than the current spend limit
    let result = ''
    const assetErc20Address = getErc20AddressOfAsset(asset)

    if (
      !this.web3Wrapper ||
      !this.contractsSource ||
      !this.contractsSource.canWrite ||
      !assetErc20Address
    ) {
      return result
    }

    const account = getCurrentAccount(this.accounts)
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

  public checkAndSetApproval = async (
    asset: Asset,
    spender: string,
    amountInBaseUnits: BigNumber
  ): Promise<boolean> => {
    let result = false

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      let tokenErc20Contract: erc20Contract | null = null
      const assetErc20Address = getErc20AddressOfAsset(asset)
      if (assetErc20Address) {
        tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address)
      } else {
        throw new Error('No ERC20 contract available!')
      }
      const account = getCurrentAccount(this.accounts)
      if (account && tokenErc20Contract) {
        const erc20allowance = await tokenErc20Contract.allowance(account, spender).callAsync()
        if (amountInBaseUnits.gt(erc20allowance)) {
          await tokenErc20Contract
            .approve(spender, this.getLargeApprovalAmount(asset, amountInBaseUnits))
            .sendTransactionAsync({ from: account })
        }
        result = true
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

  public getMinInitialMargin = async (asset: Asset, collateralAsset: Asset): Promise<BigNumber> => {
    const loanParam = await this.getLoanParams(asset, collateralAsset)
    if (!loanParam) {
      return new BigNumber(120) // fallback percent
    }
    const percents = loanParam.minInitialMargin.div(10 ** 18).plus(100)
    return percents
  }

  private getLoanParams = async (
    asset: Asset,
    collateralAsset: Asset
  ): Promise<ILoanParams | null> => {
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
    const id = new BigNumber(Web3Utils.soliditySha3(collateralTokenAddress, true))
    const loanId = await iToken.loanParamsIds(id).callAsync()
    const loanParams = await iBZxContract.loanParams(loanId).callAsync()
    const result = {
      loanId: loanParams[0],
      active: loanParams[1],
      owner: loanParams[2],
      loanToken: loanParams[3],
      collateralToken: loanParams[4],
      minInitialMargin: loanParams[5],
      maintenanceMargin: loanParams[6],
      maxLoanTerm: loanParams[7],
    } as ILoanParams
    return result
  }

  public assignCollateral = async (
    loans: IRefinanceLoan[],
    deposits: IRefinanceToken[],
    inRatio?: BigNumber
  ) => {
    for (const loan of loans) {
      loan.collateral = []
      if (inRatio) {
        loan.ratio = inRatio
      } else {
        inRatio = loan.ratio
      }
      let goal = loan.usdValue.times(inRatio).dp(18, BigNumber.ROUND_FLOOR)
      let current = new BigNumber(0)
      for (const deposit of deposits) {
        let take = deposit.usdValue
        if (current.plus(take).gt(goal)) {
          take = take.minus(current.plus(take).minus(goal))
        }
        if (current.plus(take).lt(goal)) {
          goal = goal.minus(goal.minus(current.plus(take)))
        }
        const maintenanceMargin = (await this.getMaintenanceMargin(loan.asset, deposit.asset))
          .div(10 ** 18)
          .plus(100)
        loan.maintenanceMargin = maintenanceMargin
        loan.collateral.push({
          ...deposit,
          amount: take.div(deposit.rate),
          borrowAmount: loan.balance.div(goal.div(take)),
          collaterizationPercent: BigNumber.minimum(inRatio, goal.div(loan.usdValue)).multipliedBy(
            100
          ),
        })

        // @ts-ignore
        loan.isDisabled = inRatio.lte(maintenanceMargin.div(100))

        current = current.plus(take).dp(18, BigNumber.ROUND_FLOOR)
        if (current.toString(10) === goal.toString(10)) {
          loan.isHealthy = true
          break
        }
      }
    }
  }

  public getCompoundLoans = async (): Promise<IRefinanceLoan[]> => {
    const account = getCurrentAccount(this.accounts)
    if (!this.contractsSource || !account) {
      return []
    }

    // TODO @bshevchenko: instadapp

    const comptroller: CompoundComptrollerContract = await this.contractsSource.getCompoundComptrollerContract()
    const cTokens = await comptroller.getAssetsIn(account).callAsync()

    let blockTime
    // try {
    //   const response = await fetch(`https://ethgasstation.info/json/ethgasAPI.json`);
    //   const jsonData = await response.json();
    //   blockTime = jsonData.block_time;
    // } catch (e) {
    //   // tslint:disable-next-line:no-console
    //   console.log("ethgasstation block_time error", e.message);
    //   blockTime = 15;
    // }
    blockTime = 15

    const deposits: IRefinanceToken[] = []
    const loans: IRefinanceLoan[] = []
    let inSupplied = new BigNumber(0)
    let inBorrowed = new BigNumber(0)
    // tslint:disable-next-line
    for (let i = 0; i < cTokens.length; i++) {
      const cToken = await this.contractsSource.getCTokenContract(cTokens[i])
      let asset
      let underlying = await cToken.underlying().callAsync()
      if (underlying === '0x0000000000000000000000000000000000000000') {
        underlying = this.contractsSource.getAddressFromAsset(Asset.ETH)
        asset = Asset.ETH
      } else {
        asset = this.contractsSource.getAssetFromAddress(underlying)
      }
      if (asset === Asset.UNKNOWN) {
        continue
      }
      const decimals = AssetsDictionary.assets.get(asset)!.decimals || 18
      let balance = await cToken.balanceOfUnderlying(account).callAsync()
      let isDeposit = true
      if (!balance.gt(0)) {
        isDeposit = false
        balance = await cToken.borrowBalanceCurrent(account).callAsync()
        if (
          !balance
            .div(10 ** decimals)
            .dp(3, BigNumber.ROUND_FLOOR)
            .gt(0)
        ) {
          continue
        }
      }
      balance = balance.div(10 ** decimals)
      const rate = await this.getSwapToUsdRate(asset)
      const usdValue = balance.times(rate)
      const token: IRefinanceToken = {
        asset,
        rate,
        balance,
        usdValue,
        market: cToken.address,
        contract: cToken,
        decimals,
        underlying,
      }
      if (isDeposit) {
        deposits.push(token)
        inSupplied = inSupplied.plus(token.usdValue)
      } else {
        const borrowRate = await cToken.borrowRatePerBlock().callAsync()
        loans.push({
          ...token,
          isHealthy: false,
          isDisabled: false,
          collateral: [],
          apr: borrowRate
            .times(60 * 60 * 24 * 365)
            .div(10 ** 16)
            .div(blockTime),
          ratio: new BigNumber(0),
          type: 'Compound',
        })
        inBorrowed = inBorrowed.plus(token.usdValue)
      }
    }

    await this.assignCollateral(loans, deposits, inSupplied.div(inBorrowed))

    // @ts-ignore
    this.compoundDeposits = deposits

    return loans
  }

  public getSoloLoans = async (): Promise<IRefinanceLoan[]> => {
    const account = getCurrentAccount(this.accounts)
    if (!this.contractsSource || !account) {
      return []
    }
    const solo: SoloContract = await this.contractsSource.getSoloContract()
    const [tokens, , balances] = await solo
      .getAccountBalances({
        owner: account,
        number: new BigNumber(0),
      })
      .callAsync()

    const deposits: IRefinanceToken[] = []
    const loans: IRefinanceLoan[] = []
    let inSupplied = new BigNumber(0)
    let inBorrowed = new BigNumber(0)
    for (let i = 0; i < tokens.length; i++) {
      const asset = this.contractsSource.getAssetFromAddress(tokens[i])
      if (asset === Asset.UNKNOWN) {
        continue
      }
      const market = this.contractsSource.getSoloMarket(asset)
      if (market < 0) {
        continue
      }
      const decimals = AssetsDictionary.assets.get(asset)!.decimals || 18
      const balance = balances[i].value.div(10 ** decimals)
      if (!balance.dp(3, BigNumber.ROUND_CEIL).gt(0)) {
        continue
      }
      if (!balances[i].sign && !balance.dp(3, BigNumber.ROUND_CEIL).gt(0)) {
        continue
      }
      const rate = await this.getSwapToUsdRate(asset)
      const usdValue = balance.times(rate)
      const token: IRefinanceToken = {
        asset,
        rate,
        balance,
        usdValue,
        market,
        decimals,
        underlying: tokens[i],
      }
      if (balances[i].sign) {
        deposits.push(token)
        inSupplied = inSupplied.plus(token.usdValue)
      } else {
        const interestRate = await solo.getMarketInterestRate(new BigNumber(market)).callAsync()
        loans.push({
          ...token,
          isHealthy: false,
          isDisabled: false,
          collateral: [],
          apr: interestRate.value.times(60 * 60 * 24 * 365).div(10 ** 16),
          ratio: new BigNumber(0),
          type: 'dydx',
        })
        inBorrowed = inBorrowed.plus(token.usdValue)
      }
    }

    await this.assignCollateral(loans, deposits, inSupplied.div(inBorrowed))

    // @ts-ignore
    this.soloDeposits = deposits

    return loans
  }

  public migrateCompoundLoan = async (loan: IRefinanceLoan, amount: BigNumber) => {
    const account = getCurrentAccount(this.accounts)
    if (!this.web3Wrapper || !this.contractsSource || !account) {
      return
    }

    const compoundBridge: CompoundBridgeContract = await this.contractsSource.getCompoundBridgeContract()
    const promises = []
    for (const token of loan.collateral) {
      // @ts-ignore
      const allowance = await token.contract.allowance(account, compoundBridge.address).callAsync()
      const allowedTokenAmount = allowance.div(10 ** token.decimals)
      if (allowedTokenAmount.lt(token.amount)) {
        try {
          // @ts-ignore
          const txHash = await token.contract
            .approve(
              compoundBridge.address,
              new BigNumber(100000000000).times(10 ** token.decimals)
            )
            .sendTransactionAsync({ from: account })
          promises.push(this.waitForTransactionMined(txHash))
        } catch (e) {
          if (!e.code) {
            alert('approve for ' + token.asset + ' failed: ' + e.message)
          }
          return null
        }
      }
    }
    await Promise.all(promises)
    window.setTimeout(() => {
      // do nothing
    }, 3000)

    const divider = loan.balance.div(amount)
    loan.usdValue = loan.usdValue.div(divider)
    loan.balance = loan.balance.div(divider)

    // @ts-ignore
    await this.assignCollateral([loan], this.compoundDeposits)

    const assets: string[] = []
    const amounts: BigNumber[] = []
    const borrowAmounts: BigNumber[] = []

    let borrowAmountsSum = new BigNumber(0)
    for (const token of loan.collateral) {
      // @ts-ignore
      assets.push(token.market)
      amounts.push(token.amount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN))
      const borrowAmount = token.borrowAmount
        .times(10 ** loan.decimals)
        .integerValue(BigNumber.ROUND_DOWN)
      borrowAmounts.push(borrowAmount)
      borrowAmountsSum = borrowAmountsSum.plus(borrowAmount)
    }

    amount = amount.times(10 ** loan.decimals).integerValue(BigNumber.ROUND_DOWN)

    borrowAmounts[0] = borrowAmounts[0].plus(amount.minus(borrowAmountsSum))

    try {
      const txHash = await compoundBridge
        .migrateLoan(String(loan.market), amount, assets, amounts, amounts, borrowAmounts)
        .sendTransactionAsync({ from: account })
      return await this.waitForTransactionMined(txHash)
    } catch (e) {
      if (!e.code) {
        alert('migrateLoan failed: ' + e.message)
      }
      return null
    }
  }

  public migrateSoloLoan = async (loan: IRefinanceLoan, amount: BigNumber) => {
    const account = getCurrentAccount(this.accounts)
    if (!this.web3Wrapper || !this.contractsSource || !account) {
      return
    }

    const solo: SoloContract = await this.contractsSource.getSoloContract()
    const soloBridge: SoloBridgeContract = await this.contractsSource.getSoloBridgeContract()
    const isOperator = await solo.getIsLocalOperator(account, soloBridge.address).callAsync()

    if (!isOperator) {
      try {
        const txHash = await solo
          .setOperators([{ operator: soloBridge.address, trusted: true }])
          .sendTransactionAsync({ from: account })
        const receipt = await this.waitForTransactionMined(txHash)
        if (receipt && receipt.status) {
          window.setTimeout(() => {
            // do nothing
          }, 3000)
        }
      } catch (e) {
        if (!e.code) {
          alert('setOperators failed: ' + e.message)
        }
        return null
      }
    }

    const markets: BigNumber[] = []
    const amounts: BigNumber[] = []

    const borrowAmounts: BigNumber[] = []

    const divider = loan.balance.div(amount)

    if (amount.isEqualTo(loan.balance)) {
      amount = new BigNumber(0)
    }

    loan.usdValue = loan.usdValue.div(divider)
    loan.balance = loan.balance.div(divider)
    // @ts-ignore
    await this.assignCollateral([loan], this.soloDeposits)

    for (const token of loan.collateral) {
      markets.push(new BigNumber(token.market))
      amounts.push(token.amount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN))
      borrowAmounts.push(
        token.borrowAmount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN)
      )
    }

    amount = amount.times(10 ** loan.decimals).integerValue(BigNumber.ROUND_DOWN)

    try {
      const txHash = await soloBridge
        .migrateLoan(
          { owner: account, number: new BigNumber(0) },
          new BigNumber(loan.market),
          amount,
          markets,
          amounts,
          amounts,
          borrowAmounts
        )
        .sendTransactionAsync({ from: account })
      return await this.waitForTransactionMined(txHash)
    } catch (e) {
      if (!e.code) {
        alert('migrateLoan failed: ' + e.message)
      }
      return null
    }
  }

  public getMakerLoans = async (): Promise<RefinanceCdpData[]> => {
    let result: RefinanceCdpData[] = []

    const account = getCurrentAccount(this.accounts)

    if (this.web3Wrapper && this.contractsSource && account) {
      const cdps: GetCdpsContract = await this.contractsSource.getCdpContract(
        configAddress.Get_CDPS
      )
      if (account && cdps) {
        const cdpsResult = await cdps.getCdpsAsc(configAddress.CDP_MANAGER, account).callAsync()
        const cdpId = cdpsResult[0]
        const urn = cdpsResult[1]
        const ilk = cdpsResult[2]

        for (let i = 0; i < cdpId.length; i++) {
          result.push({
            cdpId: cdpId[i],
            urn: urn[i],
            ilk: ilk[i],
            accountAddress: account,
            isProxy: false,
            isInstaProxy: false,
            proxyAddress: '',
          })
        }
      }

      // get Meta account proxies
      const proxyRegistry: proxyRegistryContract = await this.contractsSource.getProxyRegistry(
        configAddress.proxy_Contract_Address
      )
      let proxyAddress = await proxyRegistry.proxies(account).callAsync()

      if (proxyAddress !== configAddress.Empty_Proxy_Address) {
        // tslint:disable-next-line
        const cdps: GetCdpsContract = await this.contractsSource.getCdpContract(
          configAddress.Get_CDPS
        )
        if (account && cdps) {
          const cdpsResult = await cdps
            .getCdpsAsc(configAddress.CDP_MANAGER, proxyAddress)
            .callAsync()
          const cdpId = cdpsResult[0]
          const urn = cdpsResult[1]
          const ilk = cdpsResult[2]
          for (let i = 0; i < cdpId.length; i++) {
            result.push({
              cdpId: cdpId[i],
              urn: urn[i],
              ilk: ilk[i],
              accountAddress: account,
              isProxy: true,
              isInstaProxy: false,
              proxyAddress,
            })
          }
        }
      }

      // get InstaRegistry proxies
      const instaRegistry: instaRegistryContract = await this.contractsSource.getInstaRegistry(
        configAddress.Insta_Registry_Address
      )
      proxyAddress = await instaRegistry.proxies(account).callAsync()

      if (proxyAddress !== configAddress.Empty_Proxy_Address) {
        // tslint:disable-next-line
        const cdps: GetCdpsContract = await this.contractsSource.getCdpContract(
          configAddress.Get_CDPS
        )
        if (account && cdps) {
          const cdpsResult = await cdps
            .getCdpsAsc(configAddress.CDP_MANAGER, proxyAddress)
            .callAsync()
          const cdpId = cdpsResult[0]
          const urn = cdpsResult[1]
          const ilk = cdpsResult[2]
          for (let i = 0; i < cdpId.length; i++) {
            result.push({
              cdpId: cdpId[i],
              urn: urn[i],
              ilk: ilk[i],
              accountAddress: account,
              isProxy: true,
              isInstaProxy: true,
              proxyAddress,
            })
          }
        }
      }
    }
    return result
  }

  public getCdpsVat = async (
    cdpId: BigNumber,
    urn: string,
    ilk: string,
    accountAddress: string,
    isProxy: boolean,
    isInstaProxy: boolean,
    proxyAddress: string,
    asset: Asset
  ): Promise<RefinanceData> => {
    let result: RefinanceData = {
      collateralAmount: new BigNumber(0),
      collaterizationPercent: new BigNumber(0),
      debt: new BigNumber(0),
      collateralType: '',
      cdpId: new BigNumber(0),
      accountAddress,
      proxyAddress,
      isProxy,
      isInstaProxy,
      isDisabled: false,
      dust: new BigNumber(0),
      isShowCard: false,
      variableAPR: new BigNumber(0),
      maintenanceMargin: new BigNumber(0),
    }
    if (this.web3Wrapper && this.contractsSource) {
      const vat: vatContract = await this.contractsSource.getVatContract(
        configAddress.MCD_VAT_Address
      )

      const urnData = await vat.urns(ilk, urn).callAsync()
      const ilkData = await vat.ilks(ilk).callAsync()

      const rateIlk = ilkData[1].dividedBy(10 ** 27)
      let ratio = new BigNumber(0)
      let maintenanceMargin = new BigNumber(1)
      const collateralAmount = urnData[0].dividedBy(10 ** 18)
      let debtAmount = urnData[1].dividedBy(10 ** 18)
      const rateAmountIlkPerSecond = ilkData[1].dividedBy(10 ** 26)
      const rateAmountIlkYr = rateAmountIlkPerSecond
        .multipliedBy(60 * 60 * 24 * 365)
        .dividedBy(10 ** 8)

      const collateralAsset: Asset = this.contractsSource.getAssetFromIlk(ilk)
      if (collateralAsset === Asset.UNKNOWN) {
        return result
      }

      debtAmount = debtAmount.multipliedBy(rateIlk)
      let isShowCard = false
      if (parseFloat(collateralAmount.toString()) > 0 && parseFloat(debtAmount.toString()) > 0) {
        isShowCard = true

        const rate = await this.getSwapRate(collateralAsset, asset)

        ratio = rate.times(collateralAmount).div(debtAmount)

        maintenanceMargin = (
          await this.getMaintenanceMargin(
            // @ts-ignore
            asset,
            collateralAsset
          )
        )
          .div(10 ** 18)
          .plus(100)
      }

      let isDisabled = true
      if (ratio.times(100).gte(maintenanceMargin)) {
        isDisabled = false
      }

      let isDust = false
      if (urnData[1].times(ilkData[1]).lt(ilkData[4])) {
        // isDisabled = true;
        isDust = true
      }

      result = {
        collateralAmount: urnData[0].dividedBy(10 ** 18),
        collaterizationPercent: ratio.times(100),
        debt: debtAmount,
        collateralType: collateralAsset,
        cdpId,
        accountAddress,
        proxyAddress,
        isProxy,
        isInstaProxy,
        isDisabled,
        dust: ilkData[4].div(10 ** 27).div(10 ** 18),
        isShowCard,
        variableAPR: rateAmountIlkYr,
        maintenanceMargin: maintenanceMargin,
      }
    }

    return result
  }

  public migrateMakerLoan = async (refRequest: RefinanceData, loanAmount: BigNumber) => {
    /*const left = refRequest.debt.minus(loanAmount);
    const isDust = !(
      loanAmount.dp(3, BigNumber.ROUND_DOWN)
        .isEqualTo(refRequest.debt.dp(3, BigNumber.ROUND_DOWN))
      ||
      left.gt(refRequest.dust)
    );

    if (isDust) {
      if (!window.confirm("Remaining debt should be zero or more than " + refRequest.dust.toString(10) + " DAI. Do you want to continue with total amount?")) {
        return null;
      }
      loanAmount = refRequest.debt;
    }*/

    const cdpManagerAddress = configAddress.CDP_MANAGER
    if (this.web3Wrapper && this.contractsSource) {
      const cdpManager: cdpManagerContract = await this.contractsSource.getCdpManager(
        cdpManagerAddress
      )

      const collateralAmount = refRequest.collateralAmount //.dividedBy(refRequest.debt.dividedBy(loanAmount));
      // @ts-ignore
      const dart = new BigNumber(Web3Utils.toWei(loanAmount.dp(18, BigNumber.ROUND_UP)))
      // @ts-ignore
      const dink = new BigNumber(Web3Utils.toWei(collateralAmount.dp(18, BigNumber.ROUND_FLOOR)))

      if (refRequest.isProxy) {
        const proxy: dsProxyJsonContract = await this.contractsSource.getDsProxy(
          refRequest.proxyAddress
        )
        const isCdpCan = await cdpManager
          .cdpCan(refRequest.proxyAddress, refRequest.cdpId, configAddress.Maker_Bridge_Address)
          .callAsync()
        if (!isCdpCan.gt(0)) {
          const dsProxyAllowABI = await this.contractsSource.dsProxyAllowJson()
          // @ts-ignore
          const allowData = web3.eth.abi.encodeFunctionCall(dsProxyAllowABI.default, [
            cdpManagerAddress,
            refRequest.cdpId.toString(),
            configAddress.Maker_Bridge_Address,
            1,
          ])
          const proxyActionsAddress = refRequest.isInstaProxy
            ? configAddress.Insta_Proxy_Actions
            : configAddress.proxy_Actions_Address

          try {
            // if proxy use then use this function for cdpAllow
            const txHash = await proxy
              .execute(proxyActionsAddress, allowData, refRequest.isInstaProxy)
              .sendTransactionAsync({
                from: refRequest.accountAddress,
              })
            const receipt = await this.waitForTransactionMined(txHash)
            if (receipt != null) {
              if (receipt.status) {
                window.setTimeout(() => {
                  // do nothing
                }, 5000)
              }
            }
          } catch (e) {
            if (!e.code) {
              alert('Dry run failed')
            }
            return null
          }
        }

        const proxyMigrationABI = await this.contractsSource.getProxyMigration()
        const params = [
          configAddress.Maker_Bridge_Address,
          [refRequest.cdpId.toString()],
          [dart],
          [dink],
          [dink],
          [dart],
        ]

        // @ts-ignore
        const data = web3.eth.abi.encodeFunctionCall(proxyMigrationABI.default, params)
        const bridgeActionsAddress = configAddress.Bridge_Action_Address
        try {
          let txHash
          if (refRequest.isInstaProxy) {
            const makerBridge: makerBridgeContract = await this.contractsSource.getMakerBridge(
              configAddress.Maker_Bridge_Address
            )
            txHash = await makerBridge
              .migrateLoan(params[1], params[2], params[3], params[4], params[5])
              .sendTransactionAsync({ from: refRequest.accountAddress })
          } else {
            txHash = await proxy.execute(bridgeActionsAddress, data, false).sendTransactionAsync({
              from: refRequest.accountAddress,
            })
          }
          const receipt = await this.waitForTransactionMined(txHash)
          if (receipt.status === 1) {
            return receipt
          } else {
            return null
          }
        } catch (e) {
          console.error(e)
          if (!e.code) {
            alert('Dry run failed')
          }
          return null
        }
      } else {
        const isCdpCan = await cdpManager
          .cdpCan(refRequest.accountAddress, refRequest.cdpId, configAddress.Maker_Bridge_Address)
          .callAsync()
        if (!isCdpCan.gt(0)) {
          const cdpsResp = await cdpManager
            .cdpAllow(refRequest.cdpId, configAddress.Maker_Bridge_Address, new BigNumber(1))
            .sendTransactionAsync({ from: refRequest.accountAddress }) // 0x2252d3b2c12455d564abc21e328a1122679f8352
          let receipt = await this.waitForTransactionMined(cdpsResp)
          const makerBridge: makerBridgeContract = await this.contractsSource.getMakerBridge(
            configAddress.Maker_Bridge_Address
          )

          try {
            if (receipt.status) {
              const result = await makerBridge
                .migrateLoan(
                  [refRequest.cdpId],
                  [new BigNumber(dart)],
                  [new BigNumber(dink)],
                  [new BigNumber(dink)],
                  [new BigNumber(dart)]
                )
                .sendTransactionAsync({ from: refRequest.accountAddress })
              receipt = await this.waitForTransactionMined(result)
              if (receipt.status === 1) {
                return receipt
              } else {
                return null
              }
            }
          } catch (e) {
            if (!e.code) {
              alert('Dry run failed')
            }
            return null
          }
        } else {
          const makerBridge: makerBridgeContract = await this.contractsSource.getMakerBridge(
            configAddress.Maker_Bridge_Address
          )
          try {
            const cdpsMakerResult = await makerBridge
              .migrateLoan([refRequest.cdpId], [dart], [dink], [dink], [dart])
              .sendTransactionAsync({ from: refRequest.accountAddress })
            const receipt = await this.waitForTransactionMined(cdpsMakerResult)
            if (receipt.status === 1) {
              return receipt
            } else {
              return null
            }
          } catch (e) {
            if (!e.code) {
              alert('Dry run failed')
            }
            return null
          }
        }
      }
    }
  }

  public migrateSaiToDai = async (loanId: string) => {
    if (this.web3Wrapper && this.contractsSource) {
      const bridge: saiToDAIBridgeContract = await this.contractsSource.getSaiToDaiBridge(
        configAddress.SAI_TO_DAI_BRIDGE
      )
      const account = getCurrentAccount(this.accounts)
      try {
        return await bridge.migrateLoan(loanId, new BigNumber(0)).sendTransactionAsync({
          from: account,
        })
      } catch (e) {
        if (!e.code) {
          alert('Dry run failed')
        }
        return null
      }
    }
  }

  /*public doBorrow = async (borrowRequest: BorrowRequest) => {
    // console.log(borrowRequest);
    let receipt;

    if (borrowRequest.borrowAmount.lte(0) || borrowRequest.depositAmount.lte(0)) {
      return;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = getCurrentAccount(this.accounts)
      const iTokenContract = await this.contractsSource.getITokenContract(borrowRequest.borrowAsset);
      const collateralAssetErc20Address = this.getErc20AddressOfAsset(borrowRequest.collateralAsset) || "";
      if (account && iTokenContract && collateralAssetErc20Address) {
        const loanPrecision = AssetsDictionary.assets.get(borrowRequest.borrowAsset)!.decimals || 18;
        const collateralPrecision = AssetsDictionary.assets.get(borrowRequest.collateralAsset)!.decimals || 18;
        const borrowAmountInBaseUnits = new BigNumber(borrowRequest.borrowAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1));
        const depositAmountInBaseUnits = new BigNumber(borrowRequest.depositAmount.multipliedBy(10 ** collateralPrecision).toFixed(0, 1));

        let gasAmountBN;
        if (this.isETHAsset(borrowRequest.collateralAsset)) {
          try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
              borrowRequest.loanId,
              borrowAmountInBaseUnits,
              new BigNumber(7884000), // approximately 3 months
              new BigNumber(0),
              account,
              account,
              TorqueProvider.ZERO_ADDRESS,
              "0x",
              {
                from: account,
                value: depositAmountInBaseUnits,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch (e) {
            // console.log(e);
          }

          const txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
            borrowRequest.loanId,
            borrowAmountInBaseUnits,      // borrowAmount
            new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
            new BigNumber(0),             // collateralTokenSent
            account,                      // borrower
            account,                      // receiver
            TorqueProvider.ZERO_ADDRESS,  // collateralToken
            "0x",                         // loanData
            {
              from: account,
              value: depositAmountInBaseUnits,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
          receipt = await this.waitForTransactionMined(txHash);
          if (this.borrowRequestAwaitingStore && this.web3ProviderSettings) {
            // noinspection ES6MissingAwait
            this.borrowRequestAwaitingStore.add(
              new BorrowRequestAwaiting(
                borrowRequest,
                this.web3ProviderSettings.networkId,
                account,
                txHash
              )
            );
          }
        } else {
          await this.checkAndSetApproval(
            borrowRequest.collateralAsset,
            iTokenContract.address,
            depositAmountInBaseUnits
          );

          try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
              borrowRequest.loanId,
              borrowAmountInBaseUnits,
              new BigNumber(7884000), // approximately 3 months
              depositAmountInBaseUnits,
              account,
              account,
              collateralAssetErc20Address,
              "0x",
              {
                from: account,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch (e) {
            // console.log(e);
          }

          const txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
            borrowRequest.loanId,
            borrowAmountInBaseUnits,      // borrowAmount
            new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
            depositAmountInBaseUnits,     // collateralTokenSent
            account,                      // borrower
            account,                      // receiver
            collateralAssetErc20Address,  // collateralToken
            "0x",                         // loanData
            {
              from: account,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
          receipt = await this.waitForTransactionMined(txHash);
          if (this.borrowRequestAwaitingStore && this.web3ProviderSettings) {
            // noinspection ES6MissingAwait
            this.borrowRequestAwaitingStore.add(
              new BorrowRequestAwaiting(
                borrowRequest,
                this.web3ProviderSettings.networkId,
                account,
                txHash
              )
            );
          }
          // console.log(txHash);
        }
      }
    }

    return receipt.status === 1 ? receipt : null;
  }*/

  public getLoansList = async (): Promise<IBorrowedFundsState[]> => {
    let result: IBorrowedFundsState[] = []

    if (!this.contractsSource) return result

    const iBZxContract = await this.contractsSource.getiBZxContract()
    const account = getCurrentAccount(this.accounts)

    if (!iBZxContract || !account) return result

    const loansData = await iBZxContract
      .getUserLoans(
        account,
        new BigNumber(0),
        new BigNumber(50),
        2, // Torque loans
        false,
        false
      )
      .callAsync()
    const zero = new BigNumber(0)
    const rolloverData = loansData.filter(
      (e) =>
        !e.principal.eq(zero) && !e.currentMargin.eq(zero) && e.interestDepositRemaining.eq(zero)
    )

    result = rolloverData
      .concat(
        loansData.filter(
          (e) =>
            (!e.principal.eq(zero) &&
              !e.currentMargin.eq(zero) &&
              !e.interestDepositRemaining.eq(zero)) ||
            account.toLowerCase() === '0x4abb24590606f5bf4645185e20c4e7b97596ca3b'
        )
      )
      .map((e) => {
        let loanAsset = this.contractsSource!.getAssetFromAddress(e.loanToken)
        loanAsset = this.isETHAsset(loanAsset)
          ? process.env.REACT_APP_ETH_NETWORK === 'mainnet'
            ? Asset.ETH
            : process.env.REACT_APP_ETH_NETWORK === 'bsc'
              ? Asset.BNB
              : loanAsset
          : loanAsset
        let collateralAsset = this.contractsSource!.getAssetFromAddress(e.collateralToken)
        collateralAsset = this.isETHAsset(collateralAsset)
          ? process.env.REACT_APP_ETH_NETWORK === 'mainnet'
            ? Asset.ETH
            : process.env.REACT_APP_ETH_NETWORK === 'bsc'
              ? Asset.BNB
              : collateralAsset
          : collateralAsset

        const loanPrecision = AssetsDictionary.assets.get(loanAsset)!.decimals || 18
        const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18
        let amountOwned = e.principal.minus(e.interestDepositRemaining)
        if (amountOwned.lte(0)) {
          amountOwned = new BigNumber(0)
        } else {
          amountOwned = amountOwned.dividedBy(10 ** loanPrecision).dp(3, BigNumber.ROUND_CEIL)
        }
        return {
          accountAddress: account,
          loanId: e.loanId,
          loanAsset: loanAsset,
          collateralAsset: collateralAsset,
          amount: e.principal.dividedBy(10 ** loanPrecision).dp(3, BigNumber.ROUND_CEIL),
          amountOwed: amountOwned,
          collateralAmount: e.collateral.dividedBy(10 ** collateralPrecision),
          collateralizedPercent: e.currentMargin.dividedBy(10 ** 20),
          interestRate: e.interestOwedPerDay.dividedBy(e.principal).multipliedBy(365),
          interestOwedPerDay: e.interestOwedPerDay.dividedBy(10 ** loanPrecision),
          hasManagementContract: true,
          isInProgress: false,
          loanData: e,
        }
      })
    return result
  }

  public getLoansAwaitingList = async (): Promise<ReadonlyArray<BorrowRequestAwaiting>> => {
    let result: ReadonlyArray<BorrowRequestAwaiting> = []
    const account = getCurrentAccount(this.accounts)

    if (!this.borrowRequestAwaitingStore || !account) return result

    await this.borrowRequestAwaitingStore.cleanUp(account)
    result = await this.borrowRequestAwaitingStore.list(account)
    return result
  }

  // noinspection JSUnusedGlobalSymbols
  public getLoansListTest = async (): Promise<IBorrowedFundsState[]> => {
    const account = getCurrentAccount(this.accounts)
    // noinspection SpellCheckingInspection
    return [
      {
        // TEST ORDER 01
        accountAddress: account || '0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C',
        loanId: '0x0061583F7764A09B35F5594B5AC5062E090614B7FE2B5EF96ACF16496E8B914C',
        loanAsset: Asset.ETH,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false,
      },
      {
        accountAddress: account || '0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C',
        loanId: '0x2F099560938A4831006D674082201DC31762F2C3926640D4DB3748BDB1A813BF',
        loanAsset: Asset.WBTC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false,
      },
      {
        accountAddress: account || '0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C',
        loanId: '0x0A708B339C4472EF9A348269FACAD686E18345EC1342E8C171CCB0DF7DB13A28',
        loanAsset: Asset.SAI,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false,
      },
      {
        accountAddress: account || '0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C',
        loanId: '0xAA81E9EA1EABE0EBB47A6557716839A7C149864220F10EB628E4DEA6249262DE',
        loanAsset: Asset.BAT,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false,
      },
      {
        accountAddress: account || '0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C',
        loanId: '0xD826732AC58AB77E4EE0EB80B95D8BC9053EDAB328E5E4DDEAF6DA9BF1A6FCEB',
        loanAsset: Asset.MKR,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false,
      },
      {
        accountAddress: account || '0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C',
        loanId: '0xE6F8A9C8CDF06CA7C73ACD0B1F414EDB4CE23AD8F9144D22463686A11DD53561',
        loanAsset: Asset.KNC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false,
      },
      {
        accountAddress: account || '0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C',
        loanId: '0xA4B2E54FDA03335C1EF63A939A06E2192E0661F923E7C048CDB94B842016CA61',
        loanAsset: Asset.USDC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false,
      },
    ]
  }

  public getLoanCollateralManagementManagementAddress = async (
    asset: Asset,
    borrowedFundsState: IBorrowedFundsState,
    loanValue: BigNumber,
    selectedValue: BigNumber
  ): Promise<string | null> => {
    return `${loanValue > selectedValue
      ? `withdraw.${asset.toLowerCase()}.tokenloan.eth`
      : `topup.${asset.toLowerCase()}.tokenloan.eth`
      }`
  }

  //

  public getPositionSafetyText = (borrowedFundsState: IBorrowedFundsState): string => {
    const liquidationZone = borrowedFundsState.loanData!.maintenanceMargin.div(10 ** 20).toNumber()
    const dangerZone = liquidationZone + 0.1
    /*if ((this.isStableAsset(borrowedFundsState.loanAsset) && this.isETHAsset(borrowedFundsState.collateralAsset)) ||
      (this.isStableAsset(borrowedFundsState.collateralAsset) && this.isETHAsset(borrowedFundsState.loanAsset))) {
      dangerZone = 0.25;
      liquidationZone = 0.15;
    } else if (this.isStableAsset(borrowedFundsState.collateralAsset) && this.isStableAsset(borrowedFundsState.loanAsset)) {
      dangerZone = 0.15;
      liquidationZone = 0.05;
    } else {
      dangerZone = 0.50;
      liquidationZone = 0.40;
    }*/

    if (borrowedFundsState.collateralizedPercent.gt(dangerZone)) {
      return 'Safe'
    } else if (borrowedFundsState.collateralizedPercent.gt(liquidationZone)) {
      return 'Danger'
    } else if (borrowedFundsState.collateralizedPercent.eq(0)) {
      return 'Display Error'
    } else {
      return 'Liquidation Pending'
    }
  }

  public getLoanCollateralManagementGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000)
  }

  // noinspection JSUnusedLocalSymbols TODO
  public getLoanCollateralManagementParams = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<ICollateralManagementParams> => {
    return { minValue: 0, maxValue: 1.5 * 10 ** 20, currentValue: 0 }
  }

  public getLoanCollateralChangeEstimate = async (
    borrowedFundsState: IBorrowedFundsState,
    collateralAmount: BigNumber,
    isWithdrawal: boolean
  ): Promise<ICollateralChangeEstimate> => {
    const result = {
      collateralAmount: collateralAmount,
      collateralizedPercent: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      gasEstimate: new BigNumber(0),
      isWithdrawal: isWithdrawal,
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
        const newCurrentMargin: [BigNumber, BigNumber] = await oracleContract
          .getCurrentMargin(
            borrowedFundsState.loanData.loanToken,
            borrowedFundsState.loanData.collateralToken,
            borrowedFundsState.loanData.principal,
            isWithdrawal
              ? new BigNumber(borrowedFundsState.loanData.collateral.minus(newAmount).toFixed(0, 1))
              : new BigNumber(borrowedFundsState.loanData.collateral.plus(newAmount).toFixed(0, 1))
          )
          .callAsync()
        result.collateralizedPercent = newCurrentMargin[0].dividedBy(10 ** 18).plus(100)
      } catch (e) {
        // console.log(e);
        result.collateralizedPercent = borrowedFundsState.collateralizedPercent.times(100).plus(100)
      }
    }

    return result
  }

  public getLoanRepayGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(3000000)
  }

  public getLoanRepayAddress = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<string | null> => {
    return `repay.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`
  }

  // noinspection JSUnusedLocalSymbols TODO
  public getLoanRepayParams = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<IRepayState> => {
    return { minValue: 0, maxValue: 100, currentValue: 100 }
  }

  public getLoanRepayEstimate = async (
    borrowedFundsState: IBorrowedFundsState,
    repayPercent: number
  ): Promise<IRepayEstimate> => {
    return { repayAmount: borrowedFundsState.amountOwed.multipliedBy(repayPercent).dividedBy(100) }
  }

  public getLoanRepayPercent = async (
    borrowedFundsState: IBorrowedFundsState,
    repayAmount: BigNumber
  ): Promise<IRepayEstimate> => {
    return {
      repayAmount: repayAmount,
      repayPercent: Math.round(
        repayAmount.multipliedBy(100).dividedBy(borrowedFundsState.amountOwed).toNumber()
      ),
    }
  }

  /*public doRepayLoan = async (repayLoanRequest: RepayLoanRequest) => {
    let receipt;
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = getCurrentAccount(this.accounts)
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        const loanPrecision = AssetsDictionary.assets.get(repayLoanRequest.borrowAsset)!.decimals || 18;
        let closeAmountInBaseUnits = repayLoanRequest.repayAmount.multipliedBy(10 ** loanPrecision);
        const closeAmountInBaseUnitsValue = new BigNumber(closeAmountInBaseUnits.toFixed(0, 1));
        if (repayLoanRequest.repayAmount.gte(repayLoanRequest.amountOwed)) {
          // send a large amount to close entire loan
          closeAmountInBaseUnits = closeAmountInBaseUnits.multipliedBy(10 ** 50);
          if (closeAmountInBaseUnits.eq(0)) {
            closeAmountInBaseUnits = new BigNumber(10 ** 50);
          }
        } else {
          // don't allow 0 payback if more is owed
          if (closeAmountInBaseUnits.eq(0)) {
            return;
          }
        }
        closeAmountInBaseUnits = new BigNumber(closeAmountInBaseUnits.toFixed(0, 1));

        if (repayLoanRequest.borrowAsset !== Asset.ETH) {
          try {
            await this.checkAndSetApproval(
              repayLoanRequest.borrowAsset,
              this.contractsSource.getBZxVaultAddress().toLowerCase(),
              closeAmountInBaseUnits
            );
          } catch (e) {
            // tslint:disable-next-line
            console.log(e);
          }
        }

        let gasAmountBN;
        try {
          // console.log(bZxContract.address);
          const gasAmount = await bZxContract.repayWithDeposit.estimateGasAsync(
            repayLoanRequest.loanId,
            account,
            account,
            this.isETHAsset(repayLoanRequest.collateralAsset) ?
              TorqueProvider.ZERO_ADDRESS : // will refund with ETH
              account,
            closeAmountInBaseUnits,
            {
              from: account,
              value: this.isETHAsset(repayLoanRequest.borrowAsset) ?
                closeAmountInBaseUnitsValue :
                undefined,
              gas: this.gasLimit
            }
          );
          gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
        } catch (e) {
          // tslint:disable-next-line
          console.log(e);
        }

        const txHash = await bZxContract.repayWithDeposit.sendTransactionAsync(
          repayLoanRequest.loanId,                       // loanId
          account,                                              // borrower
          account,                                              // payer
          this.isETHAsset(repayLoanRequest.collateralAsset) ?   // receiver
            TorqueProvider.ZERO_ADDRESS :                        // will refund with ETH
            account,
          closeAmountInBaseUnits,                               // closeAmount
          {
            from: account,
            value: this.isETHAsset(repayLoanRequest.borrowAsset) ?
              closeAmountInBaseUnitsValue :
              undefined,
            gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
            gasPrice: await this.gasPrice()
          }
        );
        receipt = await this.waitForTransactionMined(txHash);
      }
    }

    return receipt.status === 1 ? receipt : null;
  };*/

  /*public doManageCollateral = async (manageCollateralRequest: ManageCollateralRequest) => {
    // console.log(manageCollateralRequest);
    let receipt;
    if (manageCollateralRequest.collateralAmount.lte(0)) {
      return;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = getCurrentAccount(this.accounts)
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        const collateralPrecision = AssetsDictionary.assets.get(manageCollateralRequest.loanOrderState.collateralAsset)!.decimals || 18;
        let collateralAmountInBaseUnits = manageCollateralRequest.collateralAmount.multipliedBy(10 ** collateralPrecision);
        const collateralAmountInBaseUnitsValue = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1));
        collateralAmountInBaseUnits = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1));

        if (!manageCollateralRequest.isWithdrawal) {

          if (manageCollateralRequest.loanOrderState.collateralAsset !== Asset.ETH) {
            await this.checkAndSetApproval(
              manageCollateralRequest.loanOrderState.collateralAsset,
              this.contractsSource.getBZxVaultAddress().toLowerCase(),
              collateralAmountInBaseUnits
            );
          }

          let gasAmountBN;
          try {
            const gasAmount = await bZxContract.depositCollateral.estimateGasAsync(
              manageCollateralRequest.loanOrderState.loanData!.loanId,
              manageCollateralRequest.loanOrderState.loanData!.collateralToken,
              collateralAmountInBaseUnits,
              {
                from: account,
                value: this.isETHAsset(manageCollateralRequest.loanOrderState.collateralAsset) ?
                  collateralAmountInBaseUnitsValue :
                  undefined,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch (e) {
            // console.log(e);
          }

          await bZxContract.depositCollateral.sendTransactionAsync(
            manageCollateralRequest.loanOrderState.loanData!.loanId,           // loanId
            manageCollateralRequest.loanOrderState.loanData!.collateralToken,  // depositTokenAddress
            collateralAmountInBaseUnits,                                              // depositAmount
            {
              from: account,
              value: this.isETHAsset(manageCollateralRequest.loanOrderState.collateralAsset) ?
                collateralAmountInBaseUnitsValue :
                undefined,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
        } else { // manageCollateralRequest.isWithdrawal === true

          let gasAmountBN;
          try {
            const gasAmount = await bZxContract.withdrawCollateralForBorrower.estimateGasAsync(
              manageCollateralRequest.loanOrderState.loanData!.loanId,
              collateralAmountInBaseUnits,
              account,
              this.isETHAsset(manageCollateralRequest.loanOrderState.collateralAsset) ?
                TorqueProvider.ZERO_ADDRESS :
                account,
              {
                from: account,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(2).integerValue(BigNumber.ROUND_UP);
          } catch (e) {
            // console.log(e);
          }

          const txHash = await bZxContract.withdrawCollateralForBorrower.sendTransactionAsync(
            manageCollateralRequest.loanOrderState.loanData!.loanId,             // loanId
            collateralAmountInBaseUnits,                                                // depositAmount
            account,                                                                    // trader
            this.isETHAsset(manageCollateralRequest.loanOrderState.collateralAsset) ?   // receiver
              TorqueProvider.ZERO_ADDRESS :                                             // will receive ETH back
              account,                                                                  // will receive ERC20 back
            {
              from: account,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
          receipt = await this.waitForTransactionMined(txHash);
        }
      }
    }

    return receipt.status === 1 ? receipt : null;
  };*/

  public isETHAsset = (asset: Asset): boolean => {
    return (
      (process.env.REACT_APP_ETH_NETWORK === 'mainnet' &&
        (asset === Asset.ETH || asset === Asset.WETH)) ||
      (process.env.REACT_APP_ETH_NETWORK === 'bsc' && (asset === Asset.BNB || asset === Asset.WBNB))
    )
  }

  public isStableAsset = (asset: Asset): boolean => {
    if (
      asset === Asset.DAI ||
      asset === Asset.USDC ||
      asset === Asset.SUSD ||
      asset === Asset.USDT ||
      asset === Asset.SAI
    ) {
      return true
    } else {
      return false
    }
  }

  public getLoanExtendGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000)
  }

  public getLoanExtendManagementAddress = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<string | null> => {
    return `extend.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`
  }

  // noinspection JSUnusedLocalSymbols TODO
  public getLoanExtendParams = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<IExtendState> => {
    return { minValue: 1, maxValue: 365, currentValue: 90 }
  }

  public getLoanExtendEstimate = async (
    interestOwedPerDay: BigNumber,
    daysToAdd: number
  ): Promise<IExtendEstimate> => {
    return { depositAmount: interestOwedPerDay.multipliedBy(daysToAdd) }
  }

  /*public doExtendLoan = async (extendLoanRequest: ExtendLoanRequest) => {
    // console.log(extendLoanRequest);
    let receipt;

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = getCurrentAccount(this.accounts)
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        const loanPrecision = AssetsDictionary.assets.get(extendLoanRequest.borrowAsset)!.decimals || 18;
        const depositAmountInBaseUnits = new BigNumber(extendLoanRequest.depositAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1));

        if (extendLoanRequest.borrowAsset !== Asset.ETH) {
          await this.checkAndSetApproval(
            extendLoanRequest.borrowAsset,
            this.contractsSource.getBZxVaultAddress().toLowerCase(),
            depositAmountInBaseUnits
          );
        }

        let gasAmountBN;
        try {
          const gasAmount = await bZxContract.extendLoanDuration.estimateGasAsync(
            extendLoanRequest.loanId,
            depositAmountInBaseUnits,
            false,
            {
              from: account,
              value: this.isETHAsset(extendLoanRequest.borrowAsset) ?
                depositAmountInBaseUnits :
                undefined,
              gas: this.gasLimit
            }
          );
          gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
        } catch (e) {
          // console.log(e);
        }

        const txHash = await bZxContract.extendLoanDuration.sendTransactionAsync(
          extendLoanRequest.loanId,                      // loanId
          account,                                              // borrower
          account,                                              // payer
          depositAmountInBaseUnits,                             // depositAmount
          false,                                                // useCollateral
          {
            from: account,
            value: this.isETHAsset(extendLoanRequest.borrowAsset) ?
              depositAmountInBaseUnits :
              undefined,
            gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
            gasPrice: await this.gasPrice()
          }
        );
        receipt = await this.waitForTransactionMined(txHash);
      }
    }

    return receipt.status === 1 ? receipt : null;
  };*/

  public getCollateralExcessAmount = async (
    borrowedFundsState: IBorrowedFundsState
  ): Promise<BigNumber> => {
    let result = new BigNumber(0)

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = getCurrentAccount(this.accounts)
      const bZxContract = await this.contractsSource.getiBZxContract()
      if (account && bZxContract) {
        result = await bZxContract
          .withdrawCollateral(borrowedFundsState.loanId, account, TorqueProvider.MAX_UINT)
          .callAsync({
            from: account,
            gas: this.gasLimit,
          })
        const precision =
          AssetsDictionary.assets.get(borrowedFundsState.collateralAsset)!.decimals || 18
        result = result.dividedBy(10 ** precision)
      }
    }
    return result
  }

  public getAssetInterestRate = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)

    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getITokenContract(asset)
      if (iTokenContract) {
        let borrowRate = await iTokenContract.borrowInterestRate().callAsync()
        borrowRate = borrowRate.dividedBy(10 ** 18)

        /*if (borrowRate.gt(new BigNumber(16))) {
          result = borrowRate;
        } else {
          result = new BigNumber(16);
        }*/
        result = borrowRate
      }
    }

    return result
  }

  public getAssetBorrowInterestRate = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)

    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getITokenContract(asset)
      if (iTokenContract) {
        let borrowRate = await iTokenContract.nextBorrowInterestRate(new BigNumber(0)).callAsync()
        borrowRate = borrowRate.dividedBy(10 ** 20) // value is represented as rate, not percents
        result = borrowRate
      }
    }

    return result
  }

  public getAvailableLiquidity = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)

    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getITokenContract(asset)
      if (iTokenContract) {
        const decimals = AssetsDictionary.assets.get(asset)!.decimals || 18
        const totalAssetSupply = await iTokenContract.totalAssetSupply().callAsync()
        const totalAssetBorrow = await iTokenContract.totalAssetBorrow().callAsync()

        const marketLiquidity = totalAssetSupply.minus(totalAssetBorrow)
        result = marketLiquidity.div(10 ** decimals)
      }
    }

    return result
  }

  public onDoBorrow = async (request: BorrowRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onDoRepayLoan = async (request: RepayLoanRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onDoExtendLoan = async (request: ExtendLoanRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onDoManageCollateral = async (request: ManageCollateralRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  public onDoRollover = async (request: RolloverRequest) => {
    if (request) {
      TasksQueue.Instance.enqueue(new RequestTask(request))
    }
  }

  // public onMigrateMakerLoan = async (request: RefinanceMakerRequest) => {
  //   if (request) {
  //     TasksQueue.Instance.enqueue(new RequestTask(request));
  //   }
  // };

  // public onMigrateCompoundLoan = async (request: RefinanceCompoundRequest) => {
  //   if (request) {
  //     TasksQueue.Instance.enqueue(new RequestTask(request));
  //   }
  // };

  // public onMigrateSoloLoan = async (request: RefinanceDydxRequest) => {
  //   if (request) {
  //     TasksQueue.Instance.enqueue(new RequestTask(request));
  //   }
  // };

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
    // if (!(this.isProcessing || this.isChecking)) {
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
    // }
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
    try {
      this.eventEmitter.emit(TorqueProviderEvents.AskToOpenProgressDlg, task.request.id)

      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account = getCurrentAccount(this.accounts)
      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      // Initializing loan

      let processor
      if (task.request instanceof BorrowRequest) {
        const { BorrowProcessor } = await import('./processors/BorrowProcessor')
        processor = new BorrowProcessor()
        await processor.run(task, account, skipGas)
      }

      if (task.request instanceof ExtendLoanRequest) {
        const { ExtendLoanProcessor } = await import('./processors/ExtendLoanProcessor')
        processor = new ExtendLoanProcessor()
        await processor.run(task, account, skipGas)
      }
      if (task.request instanceof ManageCollateralRequest) {
        const { ManageCollateralProcessor } = await import('./processors/ManageCollateralProcessor')
        processor = new ManageCollateralProcessor()
        await processor.run(task, account, skipGas)
      }

      if (task.request instanceof RepayLoanRequest) {
        const { RepayLoanProcessor } = await import('./processors/RepayLoanProcessor')
        processor = new RepayLoanProcessor()
        await processor.run(task, account, skipGas)
      }

      if (task.request instanceof RolloverRequest) {
        const { RolloverProcessor } = await import('./processors/RolloverProcessor')
        processor = new RolloverProcessor()
        await processor.run(task, account, skipGas)
      }

      task.processingEnd(true, false, null)
    } catch (e) {
      console.error(e)
      task.processingEnd(false, false, e)
    } finally {
      this.eventEmitter.emit(TorqueProviderEvents.AskToCloseProgressDlg, task)
    }
  }

  public waitForTransactionMined = async (txHash: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        if (!this.web3Wrapper) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error('web3 is not available')
        }

        this.waitForTransactionMinedRecursive(txHash, this.web3Wrapper, resolve, reject)
      } catch (e) {
        throw e
      }
    })
  }

  private waitForTransactionMinedRecursive = async (
    txHash: string,
    web3Wrapper: Web3Wrapper,
    resolve: (value: any) => void,
    reject: (value: any) => void
  ) => {
    try {
      const receipt = await web3Wrapper.getTransactionReceiptIfExistsAsync(txHash)
      if (receipt) {
        resolve(receipt)
      } else {
        window.setTimeout(() => {
          this.waitForTransactionMinedRecursive(txHash, web3Wrapper, resolve, reject)
        }, 5000)
      }
    } catch (e) {
      reject(e)
    }
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
    const srcAssetErc20Address = getErc20AddressOfAsset(srcAsset)
    const destAssetErc20Address = getErc20AddressOfAsset(destAsset)

    if (srcAssetErc20Address && destAssetErc20Address) {
      const srcAssetDecimals = AssetsDictionary.assets.get(srcAsset)!.decimals || 18
      if (!srcAmount) {
        srcAmount = getGoodSourceAmountOfAsset(srcAsset)
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

  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public getLiquidationsInPastNDays = async (days: number): Promise<number> => {
    const result: number = 0
    if (!this.contractsSource) return result
    const account =
      this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null
    const blocksPerDay = 10000 // 7-8k per day with a buffer
    if (!account || !this.contractsSource || !this.web3Wrapper) return result
    const bzxContractAddress = this.contractsSource.getiBZxAddress()
    if (!bzxContractAddress) return result
    const etherscanApiKey = configProviders.Etherscan_Api
    const blockNumber = await this.web3Wrapper.getBlockNumberAsync()
    const blockExplorerUrl =
      networkName === 'bsc'
        ? 'https://bscscan.com'
        : networkName === 'kovan'
          ? 'https://api-kovan.etherscan.io'
          : 'https://api.etherscan.io'
    const blockExplorerApiUrl = `${blockExplorerUrl}/api?module=logs&action=getLogs&fromBlock=${blockNumber - days * blocksPerDay
      }&toBlock=latest&address=${bzxContractAddress}&topic0=${LiquidationEvent.topic0
      }&topic1=0x000000000000000000000000${account.replace('0x', '')}&apikey=${etherscanApiKey}`

    const liquidationEventResponse = await fetch(blockExplorerApiUrl)
    const liquidationEventResponseJson = await liquidationEventResponse.json()
    if (liquidationEventResponseJson.status !== '1') return result
    const events = liquidationEventResponseJson.result
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

  public async getBorrowEstimatedGas(request: BorrowRequest, isGasTokenEnabled: boolean) {
    let result = new BigNumber(0)
    const account = getCurrentAccount(this.accounts)

    if (!this.contractsSource || !account || !request.borrowAmount) return result

    const isETHCollateralAsset = TorqueProvider.Instance.isETHAsset(request.collateralAsset)
    const collateralAssetErc20Address =
      getErc20AddressOfAsset(request.collateralAsset) || ''
    const loanPrecision = AssetsDictionary.assets.get(request.borrowAsset)!.decimals || 18
    const collateralPrecision = AssetsDictionary.assets.get(request.collateralAsset)!.decimals || 18
    const borrowAmountInBaseUnits = new BigNumber(
      request.borrowAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1)
    )
    const depositAmountInBaseUnits = new BigNumber(
      request.depositAmount.multipliedBy(10 ** collateralPrecision).toFixed(0, 1)
    )
    let gasAmount = 0
    const ChiTokenBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(Asset.CHI)
    const iTokenContract = TorqueProvider.Instance.contractsSource!.getITokenContract(
      request.borrowAsset
    )

    if (!iTokenContract) return result

    try {
      gasAmount =
        isGasTokenEnabled && ChiTokenBalance.gt(0)
          ? await iTokenContract
            .borrowWithGasToken(
              request.loanId,
              borrowAmountInBaseUnits,
              new BigNumber(7884000), // approximately 3 months
              depositAmountInBaseUnits,
              isETHCollateralAsset ? TorqueProvider.ZERO_ADDRESS : collateralAssetErc20Address,
              account,
              account,
              account,
              '0x'
            )
            .estimateGasAsync({
              from: account,
              value: isETHCollateralAsset ? depositAmountInBaseUnits : undefined,
              gas: TorqueProvider.Instance.gasLimit,
            })
          : await iTokenContract
            .borrow(
              request.loanId,
              borrowAmountInBaseUnits,
              new BigNumber(7884000), // approximately 3 months
              depositAmountInBaseUnits,
              isETHCollateralAsset ? TorqueProvider.ZERO_ADDRESS : collateralAssetErc20Address,
              account,
              account,
              '0x'
            )
            .estimateGasAsync({
              from: account,
              value: isETHCollateralAsset ? depositAmountInBaseUnits : undefined,
              gas: TorqueProvider.Instance.gasLimit,
            })
    } catch (e) { }

    return new BigNumber(gasAmount || 0)
      .multipliedBy(TorqueProvider.Instance.gasBufferCoeff)
      .integerValue(BigNumber.ROUND_UP)
  }
}

// tslint:disable-next-line
new TorqueProvider()
