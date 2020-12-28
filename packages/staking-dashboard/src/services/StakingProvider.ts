import { BigNumber } from '@0x/utils'
import { TransactionReceipt, Web3Wrapper } from '@0x/web3-wrapper'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorEvent, ConnectorUpdate } from '@web3-react/types'
import { TypedEmitter } from 'tiny-typed-emitter'
import appConfig from '../config/appConfig'
import Asset from '../domain/Asset'
import AssetsDictionary from '../domain/AssetsDictionary'
import BecomeRepresentativeRequest from '../domain/BecomeRepresentativeRequest'
import ClaimRebateRewardsRequest from '../domain/ClaimRebateRewardsRequest'
import ClaimRequest from '../domain/ClaimRequest'
import IWeb3ProviderSettings from '../domain/IWeb3ProviderSettings'
import ProviderType from '../domain/ProviderType'
import ProviderTypeDictionary from '../domain/ProviderTypeDictionary'
import RequestTask from '../domain/RequestTask'
import StakingRequest from '../domain/StakingRequest'
import Web3ConnectionFactory from '../domain/Web3ConnectionFactory'
import { ContractsSource } from './ContractsSource'
import ProviderChangedEvent from './events/ProviderChangedEvent'

interface IStakingProviderEvents {
  ProviderAvailable: () => void
  ProviderChanged: (event: ProviderChangedEvent) => void
  ProviderIsChanging: () => void
  TaskChanged: (task: RequestTask) => void
  TransactionMined: () => void
  AskToOpenProgressDlg: (task: RequestTask) => void
  AskToCloseProgressDlg: (task: RequestTask) => void
}

export class StakingProvider extends TypedEmitter<IStakingProviderEvents> {
  public static Instance: StakingProvider

  public readonly gasLimit = '500000'

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber('1.03')
  // 5000ms
  public readonly successDisplayTimeout = 5000
  public providerType: ProviderType = ProviderType.None
  public providerEngine: any = null
  public web3Wrapper: Web3Wrapper | null = null
  public web3ProviderSettings: IWeb3ProviderSettings
  public contractsSource: ContractsSource | null = null
  public accounts: string[] = []
  public unsupportedNetwork: boolean = false
  public impersonateAddress = ''
  private requestTask: RequestTask | undefined

  public readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1)

  constructor() {
    super()
    // init
    this.setMaxListeners(1000)

    // TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued);

    const storedProvider: any = this.getLocalstorageItem('providerType')
    const providerType: ProviderType | null = (storedProvider as ProviderType) || null

    this.web3ProviderSettings = this.getWeb3ProviderSettings(appConfig.appNetworkId)
    if (!providerType || providerType === ProviderType.None) {
      this.web3ProviderSettings = this.getWeb3ProviderSettings(appConfig.appNetworkId)
      Web3ConnectionFactory.setReadonlyProvider()
        .then(() => {
          const web3Wrapper = Web3ConnectionFactory.currentWeb3Wrapper
          const engine = Web3ConnectionFactory.currentWeb3Engine
          const canWrite = Web3ConnectionFactory.canWrite

          if (web3Wrapper && this.web3ProviderSettings) {
            const contractsSource = new ContractsSource(
              engine,
              this.web3ProviderSettings.networkId,
              canWrite
            )
            contractsSource
              .Init()
              .then(() => {
                this.web3Wrapper = web3Wrapper
                this.providerEngine = engine
                this.contractsSource = contractsSource
                this.emit('ProviderAvailable')
              })
              .catch((err) => {
                // TODO: actually handle error
                console.error(err)
              })
          }
        })
        .catch((err) => {
          // TODO: actually handle error
          console.error(err)
        })
    }
  }

  public getLocalstorageItem(item: string): string {
    let response = ''
    response = localStorage.getItem(item) || ''
    return response
  }

  public setLocalstorageItem(item: string, val: string) {
    localStorage.setItem(item, val)
  }

  public getCurrentAccount(): string | undefined {
    return this.impersonateAddress
      ? this.impersonateAddress
      : this.accounts.length > 0 && this.accounts[0]
      ? this.accounts[0].toLowerCase()
      : undefined
  }

  public setWeb3Provider = async (connector: AbstractConnector, account?: string) => {
    this.unsupportedNetwork = false
    this.emit('ProviderIsChanging')
    const providerType = await ProviderTypeDictionary.getProviderTypeByConnector(connector)
    await Web3ConnectionFactory.setWalletProvider(connector, providerType, account)
    await this.setWeb3ProviderFinalize(providerType)
    this.emit('ProviderChanged', new ProviderChangedEvent(this.providerType, this.web3Wrapper))
  }

  public getLibrary = async (provider: any, connector: any): Promise<any> => {
    // handle connectors events (i.e. network changed)
    await this.setWeb3Provider(connector)
    if (!connector.listeners(ConnectorEvent.Update).includes(this.onConnectorUpdated)) {
      connector.on(ConnectorEvent.Update, this.onConnectorUpdated)
    }
    return Web3ConnectionFactory.currentWeb3Engine
  }

  public onConnectorUpdated = async (update: ConnectorUpdate) => {
    this.emit('ProviderIsChanging')
    Web3ConnectionFactory.updateConnector(update)
    await this.setWeb3ProviderFinalize(this.providerType)
    this.emit('ProviderChanged', new ProviderChangedEvent(this.providerType, this.web3Wrapper))
  }

  public async setReadonlyWeb3Provider() {
    this.emit('ProviderIsChanging')
    await Web3ConnectionFactory.setReadonlyProvider()
    await this.setWeb3ProviderFinalize(ProviderType.None)
    this.emit('ProviderChanged', new ProviderChangedEvent(this.providerType, this.web3Wrapper))
  }

  public async setWeb3ProviderFinalize(providerType: ProviderType) {
    this.web3Wrapper = Web3ConnectionFactory.currentWeb3Wrapper
    this.providerEngine = Web3ConnectionFactory.currentWeb3Engine
    let canWrite = Web3ConnectionFactory.canWrite
    const networkId = Web3ConnectionFactory.networkId
    this.accounts = Web3ConnectionFactory.userAccount ? [Web3ConnectionFactory.userAccount] : []

    if (this.web3Wrapper && networkId !== appConfig.appNetworkId) {
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

    this.providerType = canWrite ? providerType : ProviderType.None

    this.setLocalstorageItem('providerType', this.providerType)
  }

  public deactivate = async () => {
    await this.setReadonlyWeb3Provider()
  }

  public getWeb3ProviderSettings(networkId: number | null): IWeb3ProviderSettings {
    let networkName
    let etherscanURL

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

  public getErc20AddressOfAsset(asset: Asset): string | null {
    let result: string | null = null

    const assetDetails = AssetsDictionary.assets.get(asset)
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || ''
    }
    return result
  }

  public async getAssetTokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0)
    if (asset === Asset.UNKNOWN) {
      // always 0
      result = new BigNumber(0)
    } else {
      // get erc20 token balance
      const precision = AssetsDictionary.assets.get(asset)!.decimals || 18
      const assetErc20Address = this.getErc20AddressOfAsset(asset)
      if (assetErc20Address) {
        result = await this.getErc20BalanceOfUser(assetErc20Address)
        result = result.multipliedBy(10 ** (18 - precision))
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

  public gasPrice = async (): Promise<BigNumber> => {
    let result = new BigNumber(500).multipliedBy(10 ** 9) // upper limit 120 gwei
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
      result = new BigNumber(60).multipliedBy(10 ** 9) // error default 60 gwei
    }

    if (result.lt(lowerLimit)) {
      result = lowerLimit
    }

    return result
  }

  public getLargeApprovalAmount = (
    asset: Asset,
    neededAmount: BigNumber = new BigNumber(0)
  ): BigNumber => {
    let amount = new BigNumber(0)

    switch (asset) {
      case Asset.BZRX:
      case Asset.BZRXv1:
      case Asset.BPT:
        return new BigNumber(10 ** 18).multipliedBy(25000000)
      case Asset.ETH:
      case Asset.WETH:
        amount = new BigNumber(10 ** 18).multipliedBy(1500)
        break
      case Asset.WBTC:
        amount = new BigNumber(10 ** 8).multipliedBy(25)
        break
      case Asset.LINK:
        amount = new BigNumber(10 ** 18).multipliedBy(60000)
        break
      case Asset.ZRX:
        amount = new BigNumber(10 ** 18).multipliedBy(750000)
        break
      case Asset.KNC:
        amount = new BigNumber(10 ** 18).multipliedBy(550000)
        break
      case Asset.DAI:
      case Asset.SUSD:
        amount = new BigNumber(10 ** 18).multipliedBy(375000)
        break
      case Asset.USDC:
      case Asset.USDT:
        amount = new BigNumber(10 ** 6).multipliedBy(375000)
        break
      case Asset.REP:
        amount = new BigNumber(10 ** 18).multipliedBy(15000)
        break
      case Asset.MKR:
        amount = new BigNumber(10 ** 18).multipliedBy(1250)
        break
      default:
        break
    }

    if (amount.eq(0)) {
      throw new Error('Invalid approval asset!')
    }

    return amount.gt(neededAmount) ? amount : neededAmount
  }

  public getRepresentatives = async (): Promise<
    Array<{ wallet: string; BZRX: BigNumber; vBZRX: BigNumber; LPToken: BigNumber }>
  > => {
    let result: Array<{
      wallet: string
      BZRX: BigNumber
      vBZRX: BigNumber
      LPToken: BigNumber
    }> = []

    const account = this.getCurrentAccount()

    if (!this.contractsSource) {
      return result
    }

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract()
    if (!account || !bzrxStakingContract) return result

    const repVotes = await bzrxStakingContract.getRepVotes.callAsync(
      new BigNumber(0),
      new BigNumber(1000),
      {
        from: account
      }
    )

    result = result.concat(repVotes)
    return result
  }

  public checkIsRep = async (): Promise<boolean> => {
    let result = false
    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      return result
    }

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract()
    if (!bzrxStakingContract) {
      return result
    }

    result = await bzrxStakingContract.reps.callAsync(account, {
      from: account
    })

    return result
  }

  public stakeableByAsset = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)

    if (!this.contractsSource) {
      return result
    }

    const account = this.getCurrentAccount()

    if (!account) {
      return result
    }

    const bZxContract = await this.contractsSource.getBZRXStakingInterimContract()

    if (!bZxContract) {
      return result
    }

    const tokenErc20Address = this.getErc20AddressOfAsset(asset)

    if (!tokenErc20Address) {
      return result
    }

    const stakeable = await bZxContract.stakeableByAsset.callAsync(tokenErc20Address, account, {
      from: account
    })

    result = stakeable
    return result
  }

  public balanceOfByAsset = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)

    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      return result
    }

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract()
    if (!bzrxStakingContract) {
      return result
    }

    const tokenErc20Address = this.getErc20AddressOfAsset(asset)
    if (!tokenErc20Address) return result
    const balanceOf = await bzrxStakingContract.balanceOfByAsset.callAsync(
      tokenErc20Address,
      account,
      {
        from: account
      }
    )

    result = balanceOf
    return result
  }

  public balanceOfByAssetWalletAware = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0)

    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      return result
    }

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract()
    if (!bzrxStakingContract) {
      return result
    }

    const tokenErc20Address = this.getErc20AddressOfAsset(asset)
    if (!tokenErc20Address) return result
    const balanceOf = await bzrxStakingContract.balanceOfByAssetWalletAware.callAsync(
      tokenErc20Address,
      account,
      {
        from: account
      }
    )

    result = balanceOf
    return result
  }

  public getUserEarnings = async (): Promise<BigNumber> => {
    const result = new BigNumber(0)

    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      return result
    }

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract()
    if (!bzrxStakingContract) {
      return result
    }

    const earnedUsdAmount = await bzrxStakingContract.earned.callAsync(account, {
      from: account
    })

    return earnedUsdAmount.div(10 ** 18)
  }

  public getDelegateAddress = async (): Promise<string> => {
    let result = ''

    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      return result
    }

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract()
    if (!bzrxStakingContract) return result

    result = await bzrxStakingContract.delegate.callAsync(account, {
      from: account
    })

    return result
  }

  public getRebateRewards = async (): Promise<BigNumber> => {
    let result = new BigNumber(0)

    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      return result
    }

    const bZxContract = await this.contractsSource.getiBZxContract()
    if (!bZxContract) {
      return result
    }

    result = await bZxContract.rewardsBalanceOf.callAsync(account, {
      from: account
    })

    return result
  }

  public async getSwapToUsdRate(asset: Asset): Promise<BigNumber> {
    if (
      asset === Asset.DAI ||
      asset === Asset.USDC ||
      asset === Asset.SUSD ||
      asset === Asset.USDT
    ) {
      return new BigNumber(1)
    }

    return this.getSwapRate(asset, appConfig.isMainnetProd ? Asset.DAI : Asset.USDC)
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
    // console.log("srcAmount 11 = "+srcAmount)
    let result: BigNumber = new BigNumber(0)
    const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset)
    const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset)
    if (!srcAmount) {
      srcAmount = this.UNLIMITED_ALLOWANCE_IN_BASE_UNITS
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
        console.log(e)
        result = new BigNumber(0)
      }
    }
    return result
  }

  private waitForTransactionMinedRecursive = async (
    txHash: string,
    web3Wrapper: Web3Wrapper
  ): Promise<TransactionReceipt> => {
    const receipt = await web3Wrapper.getTransactionReceiptIfExistsAsync(txHash)
    if (receipt) {
      return receipt
    } else {
      await this.sleep(5000)
      return this.waitForTransactionMinedRecursive(txHash, web3Wrapper)
    }
  }

  public waitForTransactionMined = async (txHash: string) => {
    if (!this.web3Wrapper) {
      throw new Error('web3 is not available')
    }
    return this.waitForTransactionMinedRecursive(txHash, this.web3Wrapper)
  }

  public onRequestConfirmed = async (
    request: StakingRequest | ClaimRequest | BecomeRepresentativeRequest
  ) => {
    return this.processRequestTask(new RequestTask(request))
  }

  /**
   * Send a staking request.
   * Amounts should be in decimal base.
   * eg: if user wants to stake 10 BZRX then bzrx argument should be new BigNumber(10)
   * @param tokensToStake amount of bzrx, vbzrx and bpt to stake
   * @param repAddress representative address
   */
  public stakeTokens = async (
    tokensToStake: { bzrx: BigNumber; vbzrx: BigNumber; bpt: BigNumber },
    repAddress: string
  ) => {
    const bzrx = tokensToStake.bzrx.times(10 ** 18)
    const vbzrx = tokensToStake.vbzrx.times(10 ** 18)
    const bpt = tokensToStake.bpt.times(appConfig.bptDecimals)
    return this.onRequestConfirmed(new StakingRequest(bzrx, vbzrx, bpt, repAddress))
  }

  public processRequestTask = async (task: RequestTask) => {
    try {
      this.requestTask = task
      task.setEventEmitter(this)
      this.emit('AskToOpenProgressDlg', task)
      if (!(this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite)) {
        throw new Error('No provider available!')
      }

      const account = this.getCurrentAccount()

      if (!account) {
        throw new Error('Unable to get wallet address!')
      }

      const taskRequest = task.request

      task.processingStart([
        'Initializing',
        'Submitting ' + taskRequest.name,
        'Updating the blockchain',
        'Transaction completed'
      ])

      let txHash
      switch (taskRequest.constructor) {
        case StakingRequest:
          txHash = await this.processStakingRequestTask(task, account)
          break
        case ClaimRebateRewardsRequest:
          txHash = await this.processClaimRebateRewardsRequestTask(task, account)
          break
        case BecomeRepresentativeRequest:
          txHash = await this.processBecomeRepresentativeRequestTask(task, account)
          break
        default:
          throw new Error('Unknown request!')
      }

      task.processingStepNext()
      const txReceipt = await this.waitForTransactionMined(txHash)
      if (!txReceipt.status) {
        throw new Error('Reverted by EVM')
      }

      task.processingStepNext()
      await this.sleep(this.successDisplayTimeout)
      task.processingEnd(true, false, null)
    } catch (err) {
      if (
        !err.message.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)
      ) {
        console.log(err)
      }
      task.processingEnd(false, false, err)
    } finally {
      this.emit('AskToCloseProgressDlg', task)
    }
    return false
  }

  private processStakingRequestTask = async (task: RequestTask, account: string) => {
    const taskRequest = task.request as StakingRequest
    const { bzrxAmount, vbzrxAmount, bptAmount, address } = taskRequest

    const bzrxStakingContract = await this.contractsSource!.getBZRXStakingInterimContract()
    if (!bzrxStakingContract) {
      throw new Error('No ERC20 contract available!')
    }

    const bzrxErc20Address = this.getErc20AddressOfAsset(Asset.BZRX)
    const vbzrxErc20Address = this.getErc20AddressOfAsset(Asset.vBZRX)
    const bptErc20Address = this.getErc20AddressOfAsset(Asset.BPT)
    if (!bzrxErc20Address || !vbzrxErc20Address || !bptErc20Address) {
      throw new Error('No ERC20 contract available!')
    }

    const encodedInput =
      account.toLowerCase() === address.toLowerCase()
        ? bzrxStakingContract.stake.getABIEncodedTransactionData(
            [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
            [bzrxAmount, vbzrxAmount, bptAmount]
          )
        : bzrxStakingContract.stakeWithDelegate.getABIEncodedTransactionData(
            [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
            [bzrxAmount, vbzrxAmount, bptAmount],
            address
          )
    console.log(encodedInput)
    // Submitting loan
    task.processingStepNext()
    let gasAmountBN
    let gasAmount
    let txHash = ''
    try {
      gasAmount =
        account.toLowerCase() === address.toLowerCase()
          ? await bzrxStakingContract.stake.estimateGasAsync(
              [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
              [bzrxAmount, vbzrxAmount, bptAmount],
              {
                from: account,
                gas: this.gasLimit
              }
            )
          : await bzrxStakingContract.stakeWithDelegate.estimateGasAsync(
              [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
              [bzrxAmount, vbzrxAmount, bptAmount],
              address,
              {
                from: account,
                gas: this.gasLimit
              }
            )
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(this.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      console.error(e)
      throw e
    }

    try {
      txHash =
        account.toLowerCase() === address.toLowerCase()
          ? await bzrxStakingContract.stake.sendTransactionAsync(
              [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
              [bzrxAmount, vbzrxAmount, bptAmount],
              {
                from: account,
                gas: gasAmountBN ? gasAmountBN.toString() : this.gasLimit,
                gasPrice: await this.gasPrice()
              }
            )
          : await bzrxStakingContract.stakeWithDelegate.sendTransactionAsync(
              [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
              [bzrxAmount, vbzrxAmount, bptAmount],
              address,
              {
                from: account,
                gas: gasAmountBN ? gasAmountBN.toString() : this.gasLimit,
                gasPrice: await this.gasPrice()
              }
            )

      task.setTxHash(txHash)
    } catch (e) {
      console.log(e)
      throw e
    }
    return txHash
  }

  private processClaimRebateRewardsRequestTask = async (task: RequestTask, account: string) => {
    const bZxContract = await this.contractsSource!.getiBZxContract()
    if (!bZxContract) throw new Error('No ERC20 contract available!')
    // Submitting loan
    task.processingStepNext()
    let gasAmountBN
    let gasAmount
    let txHash = ''
    try {
      gasAmount = await bZxContract.claimRewards.estimateGasAsync(account, {
        from: account,
        gas: this.gasLimit
      })
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(this.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      console.error(e)
      throw e
    }

    try {
      txHash = await bZxContract.claimRewards.sendTransactionAsync(account, {
        from: account,
        gas: gasAmountBN ? gasAmountBN.toString() : this.gasLimit,
        gasPrice: await this.gasPrice()
      })

      task.setTxHash(txHash)
    } catch (e) {
      console.error(e)
      throw e
    }
    return txHash
  }

  private processBecomeRepresentativeRequestTask = async (task: RequestTask, account: string) => {
    const bzrxStakingContract = await this.contractsSource!.getBZRXStakingInterimContract()
    if (!bzrxStakingContract) throw new Error('No ERC20 contract available!')
    // Submitting loan
    task.processingStepNext()
    let gasAmountBN
    let gasAmount
    let txHash = ''
    try {
      gasAmount = await bzrxStakingContract.setRepActive.estimateGasAsync(true, {
        from: account,
        gas: this.gasLimit
      })
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(this.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      console.error(e)
      throw e
    }

    try {
      txHash = await bzrxStakingContract.setRepActive.sendTransactionAsync(true, {
        from: account,
        gas: gasAmountBN ? gasAmountBN.toString() : this.gasLimit,
        gasPrice: await this.gasPrice()
      })

      task.setTxHash(txHash)
    } catch (e) {
      console.error(e)
      throw e
    }
    return txHash
  }

  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public getRequestTask() {
    return this.requestTask
  }
}

export default new StakingProvider()
