import { BigNumber } from '@0x/utils'
import { TransactionReceipt, Web3Wrapper } from '@0x/web3-wrapper'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorEvent, ConnectorUpdate } from '@web3-react/types'
import hashUtils from 'app-lib/hashUtils'
import { TypedEmitter } from 'tiny-typed-emitter'
import appConfig from '../config/appConfig'
import Asset from '../domain/Asset'
import AssetsDictionary from '../domain/AssetsDictionary'
import ClaimRebateRewardsRequest from '../domain/ClaimRebateRewardsRequest'
import ClaimRequest from '../domain/ClaimRequest'
import ProviderType from '../domain/ProviderType'
import ProviderTypeDictionary from '../domain/ProviderTypeDictionary'
import RequestTask from '../domain/RequestTask'
import StakingRequest from '../domain/StakingRequest'
import Web3ConnectionFactory from '../domain/Web3ConnectionFactory'
import ContractsSource from './ContractsSource'
import ProviderChangedEvent from './events/ProviderChangedEvent'
import { stakeableToken } from 'src/domain/stakingTypes'

interface IStakingProviderEvents {
  ProviderAvailable: () => void
  ProviderChanged: (event: ProviderChangedEvent) => void
  ProviderIsChanging: () => void
  TaskChanged: (task: RequestTask) => void
  TaskUpdate: (event: {
    opId: string
    opType?: 'staking'
    type: 'txhash' | 'created'
    value?: any
    time?: number
  }) => void
  TransactionMined: () => void
  AskToOpenProgressDlg: (task: RequestTask) => void
  AskToCloseProgressDlg: (task: RequestTask) => void
}

export class StakingProvider extends TypedEmitter<IStakingProviderEvents> {
  public static Instance: StakingProvider

  public readonly gasLimit = '500000'

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber('1.1')
  // 5000ms
  public readonly successDisplayTimeout = 5000
  public providerType: ProviderType = ProviderType.None
  public providerEngine: any = null
  public web3Wrapper: Web3Wrapper | null = null
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

  public preloadContracts(names: Array<'staking' | 'erc20' | 'ibzx'>, erc20Address?: string) {
    const contracts = {
      staking: () => this.getStakingContract(),
      erc20: () =>
        this.contractsSource && erc20Address && this.contractsSource.getErc20Contract(erc20Address),
      ibzx: () => false
    }
  }

  public setWeb3Provider = async (connector: AbstractConnector, account?: string) => {
    this.unsupportedNetwork = false
    this.emit('ProviderIsChanging')
    const providerType = await ProviderTypeDictionary.getProviderTypeByConnector(connector)
    await Web3ConnectionFactory.setWalletProvider(connector, providerType, account)
    await this.setWeb3ProviderFinalize(providerType)
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
  }

  public async setReadonlyWeb3Provider() {
    this.emit('ProviderIsChanging')
    await Web3ConnectionFactory.setReadonlyProvider()
    await this.setWeb3ProviderFinalize(ProviderType.None)
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

    if (this.web3Wrapper && appConfig.web3ProviderSettings.networkId > 0) {
      const newContractsSource = new ContractsSource(
        this.providerEngine,
        appConfig.web3ProviderSettings.networkId,
        canWrite
      )
      this.contractsSource = newContractsSource
      this.contractsSource.getStakingV1Contract().catch((err) => console.error(err))
    } else {
      this.contractsSource = null
    }

    this.providerType = canWrite ? providerType : ProviderType.None
    this.emit('ProviderChanged', new ProviderChangedEvent(this.providerType, this.web3Wrapper))
    this.setLocalstorageItem('providerType', this.providerType)
  }

  public preloadIBZXContract() {
    if (this.contractsSource) {
      return this.contractsSource.getiBZxContract()
    }
  }

  public deactivate = async () => {
    await this.setReadonlyWeb3Provider()
  }

  public getErc20AddressOfAsset(asset: keyof typeof Asset): string | null {
    const assetDetails = AssetsDictionary.getAsset(asset)
    if (assetDetails) {
      return assetDetails.addressErc20.get(appConfig.web3ProviderSettings.networkId) || ''
    }
    return null
  }

  public async checkErc20Allowance(asset: keyof typeof Asset, contractAddress: string) {
    const erc20Address = this.getErc20AddressOfAsset(asset)
    const account = this.getCurrentAccount()

    if (!account || !erc20Address || !this.contractsSource) {
      throw new Error('Missing account, erc20address, contract source')
    }

    const erc20Contract = await this.contractsSource.getErc20Contract(erc20Address)
    const result = await erc20Contract.allowance.callAsync(account, contractAddress)

    return result
  }

  /**
   * Check if the staking contract can spend user token
   * This must be called for all assets
   */
  public async checkStakingErc20Allowance(asset: keyof typeof Asset) {
    if (!this.contractsSource) {
      throw new Error('Missing contract source')
    }
    const stakingAddress = this.contractsSource.getStakingV1Address()
    return this.checkErc20Allowance(asset, stakingAddress)
  }

  /**
   * Set the spending allowance of tokens by the staking contract (so that user can stake)
   * This is expected to be called for bzrx, vbzrx, ibzrx and/or bpt
   */
  public async setStakingAllowance(asset: keyof typeof Asset, amount: BigNumber) {
    const erc20Address = this.getErc20AddressOfAsset(asset)
    const account = this.getCurrentAccount()

    if (!erc20Address || !account || !this.contractsSource) {
      throw new Error('setStakingAllowance: Missing account, erc20address or contract source')
    }
    const erc20Contract = await this.contractsSource.getErc20Contract(erc20Address)
    const stakingAddress = this.contractsSource.getStakingV1Address()

    const txHash = await erc20Contract.approve.sendTransactionAsync(stakingAddress, amount, {
      from: account
    })

    return this.waitForTransactionMined(txHash)
  }

  public async getVestedBzrxBalance() {
    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      throw new Error('Missing contract source or account')
    }

    const vbzrxContract = await this.contractsSource.getBzrxVestingContract()

    return vbzrxContract.vestedBalanceOf.callAsync(account)
  }

  /**
   * Mostly for users who hold vbzrx in their wallet and just want to claim their bzrx
   */
  public async claimVestedBZRX() {
    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      throw new Error('Missing contract source or account')
    }

    const vbzrxContract = await this.contractsSource.getBzrxVestingContract()

    const { gasAmount } = await this.getGasEstimate(() =>
      vbzrxContract.claim.estimateGasAsync({
        from: account
      })
    )

    const txHash = await vbzrxContract.claim.sendTransactionAsync({
      from: account,
      gas: gasAmount,
      gasPrice: await this.gasPrice()
    })

    await this.waitForTransactionMined(txHash)
  }

  public async getSpendingAllowances() {
    if (!this.contractsSource) {
      throw new Error('Missing contract source')
    }
  }

  /**
   * Staking contract may not be available
   * TODO: Check if staking contract may really not be available. This check might not be needed
   */
  public async getStakingContract() {
    if (!this.contractsSource) {
      return null
    }

    const stakingContract = await this.contractsSource.getStakingV1Contract()

    if (!stakingContract) {
      return null
    }

    return stakingContract
  }

  /**
   * Returns the amount of staked tokens of a user.
   *
   * The amounts are in base units so they must be divided by 10 ** decimals
   * @param address the wallet of the user
   */
  public async getStakedBalances(address: string) {
    const stakingContract = await this.getStakingContract()
    if (!stakingContract) {
      return {
        bzrx: new BigNumber(0),
        vbzrx: new BigNumber(0),
        ibzrx: new BigNumber(0),
        bpt: new BigNumber(0)
      }
    }
    const [bzrx, ibzrx, vbzrx, bpt] = await stakingContract.balanceOfByAssets.callAsync(address)
    return { bzrx, ibzrx, vbzrx, bpt }
  }

  public gasPrice = async (): Promise<BigNumber> => {
    let result = new BigNumber(500).multipliedBy(10 ** 9) // upper limit 120 gwei
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
      // console.log(error);
      result = new BigNumber(60).multipliedBy(10 ** 9) // error default 60 gwei
    }

    if (result.lt(lowerLimit)) {
      result = lowerLimit
    }

    return result
  }

  /**
   * Get addresses of the stakeable tokens.
   * Throws an error if there is a missing address
   */
  public getStakeableAddresses() {
    if (!this.contractsSource) {
      throw new Error('Missing contract sources')
    }
    const bzrx = this.getErc20AddressOfAsset(Asset.BZRX)
    const vbzrx = this.getErc20AddressOfAsset(Asset.VBZRX)
    const ibzrx = this.getErc20AddressOfAsset(Asset.IBZRX)
    const bpt = this.getErc20AddressOfAsset(Asset.BPT)

    if (!bzrx || !vbzrx || !ibzrx || !bpt) {
      throw new Error('Missing stakeable token address')
    }

    return {
      bzrx,
      vbzrx,
      ibzrx,
      bpt
    }
  }

  /**
   * Get the staking specific tokens balances from a user wallet
   * @param userAddress user wallet
   */
  public async getStakeableBalances(userAddress: string) {
    if (!this.contractsSource) {
      throw new Error('Missing contract sources')
    }
    const helper = await this.contractsSource.getHelperContract()
    const addresses = this.getStakeableAddresses()
    const [bzrx, vbzrx, ibzrx, bpt] = await helper.balanceOf.callAsync(
      [addresses.bzrx, addresses.vbzrx, addresses.ibzrx, addresses.bpt],
      userAddress
    )

    return { bzrx, vbzrx, ibzrx, bpt }
  }

  /**
   * Get the spending allowance for each stakeable asset for a user wallet
   * @param userAddress user wallet
   */

  public async getStakeableAllowances(userAddress: string) {
    if (!this.contractsSource) {
      throw new Error('Missing contract sources')
    }
    const helper = await this.contractsSource.getHelperContract()
    const addresses = this.getStakeableAddresses()
    const stakingAddress = this.contractsSource.getStakingV1Address()
    const [bzrx, vbzrx, ibzrx, bpt] = await helper.allowance.callAsync(
      [addresses.bzrx, addresses.vbzrx, addresses.ibzrx, addresses.bpt],
      userAddress,
      stakingAddress
    )

    return { bzrx, vbzrx, ibzrx, bpt }
  }

  public getRepresentatives = async (): Promise<
    Array<{
      bpt: BigNumber
      bzrx: BigNumber
      ibzrx: BigNumber
      name: string
      totalVotes: BigNumber
      vbzrx: BigNumber
      wallet: string
    }>
  > => {
    const stakingContract = await this.getStakingContract()
    const account = this.getCurrentAccount()

    if (!stakingContract || !account) {
      return []
    }

    const repVotes = await stakingContract.getDelegateVotes.callAsync(
      new BigNumber(0),
      new BigNumber(100),
      {
        from: account
      }
    )

    return repVotes.map((rep) => ({
      name: hashUtils.shortHash(rep.user, 6, 4),
      wallet: rep.user,
      bzrx: rep.BZRX.div(10 ** 18),
      bpt: rep.LPToken.div(10 ** 18),
      ibzrx: rep.iBZRX.div(10 ** 18),
      vbzrx: rep.vBZRX.div(10 ** 18),
      totalVotes: rep.totalVotes
    }))
  }

  /**
   * Change the delegate for the current account
   */
  public async changeDelegate(delegateAddress: string) {
    const account = this.getCurrentAccount()
    const staking = await this.getStakingContract()

    if (!account || !staking) {
      throw new Error('Missing account or Staking contract')
    }

    const { gasAmount } = await this.getGasEstimate(() =>
      staking.changeDelegate.estimateGasAsync(delegateAddress, {
        from: account
      })
    )

    const txHash = await staking.changeDelegate.sendTransactionAsync(delegateAddress, {
      from: account,
      gas: gasAmount,
      gasPrice: await this.gasPrice()
    })

    await this.waitForTransactionMined(txHash)
    return true
  }

  /**
   * User gets 4 types of rewards (earnings)
   */
  public getStakingRewards = async (): Promise<{
    bzrx: BigNumber
    stableCoin: BigNumber
    bzrxVesting: BigNumber
    stableCoinVesting: BigNumber
  }> => {
    const account = this.getCurrentAccount()
    const stakingContract = await this.getStakingContract()

    if (!account || !stakingContract) {
      return {
        bzrx: new BigNumber(0),
        stableCoin: new BigNumber(0),
        bzrxVesting: new BigNumber(0),
        stableCoinVesting: new BigNumber(0)
      }
    }

    const [
      bzrx,
      stableCoin,
      bzrxVesting,
      stableCoinVesting
    ] = await stakingContract.earned.callAsync(account, {
      from: account
    })

    return {
      bzrx: bzrx.div(10 ** 18),
      stableCoin: stableCoin.div(10 ** 18),
      bzrxVesting: bzrxVesting.div(10 ** 18),
      stableCoinVesting: stableCoinVesting.div(10 ** 18)
    }
  }

  /**
   * Helper to get the gas estimate
   * @param task a function that calls estimateGasAsync under the hood
   *
   * Example
   * ```
   * const { gasAmount } = await this.getGasEstimate(() =>
   *  stakingContract.exit.estimateGasAsync({
   *    from: account,
   *    gas: this.gasLimit
   *  })
   * )
   * ```
   */
  public async getGasEstimate(task: () => Promise<number>) {
    const gasAmount = await task()
    const gasAmountBN = new BigNumber(gasAmount)
      .multipliedBy(this.gasBufferCoeff)
      .integerValue(BigNumber.ROUND_UP)
    return {
      gasAmount: gasAmountBN ? gasAmountBN.toString() : this.gasLimit,
      gasAmountBN
    }
  }

  /**
   * Unstake a single token
   * @param token token to unstake
   * @param amount unstake 10 tokens = new BigNumber(10)
   */
  public async unstakeOne(token: 'BZRX' | 'VBZRX' | 'IBZRX' | 'BPT', amount: BigNumber) {
    const account = this.getCurrentAccount()
    const stakingContract = await this.getStakingContract()
    if (!account || !stakingContract) {
      throw new Error('Account or staking contract unavailable')
    }

    const tokenAddress = this.getErc20AddressOfAsset(token)
    if (!tokenAddress) {
      throw new Error('ERC20 Token address not found')
    }

    const { gasAmount } = await this.getGasEstimate(() =>
      stakingContract.unstake.estimateGasAsync([tokenAddress], [amount.times(10 ** 18)], {
        from: account
      })
    )

    const txHash = await stakingContract.unstake.sendTransactionAsync(
      [tokenAddress],
      [amount.times(10 ** 18)],
      {
        from: account,
        gas: gasAmount,
        gasPrice: await this.gasPrice()
      }
    )

    await this.waitForTransactionMined(txHash)
  }

  public async unstakeAll() {
    const account = this.getCurrentAccount()
    const stakingContract = await this.getStakingContract()
    if (!account || !stakingContract) {
      throw new Error('Account or staking contract unavailable')
    }

    const { gasAmount } = await this.getGasEstimate(() =>
      stakingContract.exit.estimateGasAsync({
        from: account
      })
    )

    const txHash = await stakingContract.exit.sendTransactionAsync({
      from: account,
      gas: gasAmount,
      gasPrice: await this.gasPrice()
    })

    await this.waitForTransactionMined(txHash)
  }

  /**
   * Returns delegate for current account
   */
  public getDelegateAddress = async (): Promise<string> => {
    const account = this.getCurrentAccount()
    const staking = await this.getStakingContract()

    if (!account || !staking) {
      throw new Error('Missing contract or account')
    }

    return staking.delegate.callAsync(account, {
      from: account
    })
  }

  public getRebateRewards = async (): Promise<BigNumber> => {
    const account = this.getCurrentAccount()

    if (!this.contractsSource || !account) {
      throw new Error('Missing contract or account')
    }

    const bZxContract = await this.contractsSource.getiBZxContract()
    const vbzrxAmount = await bZxContract.rewardsBalanceOf.callAsync(account, {
      from: account
    })

    return vbzrxAmount.div(10 ** 18)
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

  public onRequestConfirmed = async (request: StakingRequest | ClaimRequest) => {
    return this.processRequestTask(new RequestTask(request))
  }

  public stake = (tokenAmounts: Map<stakeableToken, BigNumber>) => {
    const opId = (Math.random() + 1).toString()
    this.emit('TaskUpdate', { opId, opType: 'staking', type: 'created', value: Date.now() })
    return { opId, type: 'staking', result: this._stake(tokenAmounts, opId) }
  }

  /**
   * Send stake request.
   * Amounts should be in decimal base.
   * eg: if user wants to unstake 10 BZRX then bzrx argument should be new BigNumber(10)
   * @param tokenAmounts amount of bzrx, vbzrx, ibzrx and bpt to stake
   */
  public _stake = async (tokenAmounts: Map<stakeableToken, BigNumber>, opId?: string) => {
    const account = this.getCurrentAccount()
    const stakingContract = await this.getStakingContract()
    const stakeableAddresses = this.getStakeableAddresses()

    if (!account || !stakingContract) {
      throw new Error('Missing account of stakingContract')
    }

    const { addresses, amounts } = Array.from(tokenAmounts).reduce(
      (acc, [token, amount]) => {
        acc.amounts.push(amount.times(10 ** 18))
        acc.addresses.push(stakeableAddresses[token])
        return acc
      },
      { addresses: [] as string[], amounts: [] as BigNumber[] }
    )

    const { gasAmount } = await this.getGasEstimate(() =>
      stakingContract.stake.estimateGasAsync(addresses, amounts, {
        from: account
      })
    )

    const txHash = await stakingContract.stake.sendTransactionAsync(addresses, amounts, {
      from: account,
      gas: gasAmount,
      gasPrice: await this.gasPrice()
    })

    if (opId) {
      this.emit('TaskUpdate', { opId: opId, type: 'txhash', value: txHash })
    }

    await this.waitForTransactionMined(txHash)
  }

  /**
   * Send unstake request.
   * Amounts should be in decimal base.
   * eg: if user wants to unstake 10 BZRX then bzrx argument should be new BigNumber(10)
   * @param tokens amount of bzrx, vbzrx and bpt to stake
   */
  public unstakeTokens = async (tokenAmounts: Map<stakeableToken, BigNumber>) => {
    const account = this.getCurrentAccount()
    const stakingContract = await this.getStakingContract()
    const stakeableAddresses = this.getStakeableAddresses()

    if (!account || !stakingContract) {
      throw new Error('Missing account of stakingContract')
    }

    const { addresses, amounts } = Array.from(tokenAmounts).reduce(
      (acc, [token, amount]) => {
        acc.amounts.push(amount.times(10 ** 18))
        acc.addresses.push(stakeableAddresses[token])
        return acc
      },
      { addresses: [] as string[], amounts: [] as BigNumber[] }
    )

    const { gasAmount } = await this.getGasEstimate(() =>
      stakingContract.unstake.estimateGasAsync(addresses, amounts, {
        from: account
      })
    )

    const txHash = await stakingContract.unstake.sendTransactionAsync(addresses, amounts, {
      from: account,
      gas: gasAmount,
      gasPrice: await this.gasPrice()
    })

    await this.waitForTransactionMined(txHash)
  }

  public claimStakingRewards = async (shouldRestake: boolean = false) => {
    const account = this.getCurrentAccount()
    const stakingContract = await this.getStakingContract()

    if (!account || !stakingContract) {
      return {
        bzrx: new BigNumber(0),
        stableCoin: new BigNumber(0)
      }
    }

    const method = shouldRestake ? stakingContract.claimAndRestake : stakingContract.claim

    const { gasAmount } = await this.getGasEstimate(() =>
      method.estimateGasAsync({
        from: account
      })
    )

    const txHash = await method.sendTransactionAsync({
      from: account,
      gas: gasAmount,
      gasPrice: await this.gasPrice()
    })

    await this.waitForTransactionMined(txHash)
  }

  /**
   * "Rebate Rewards" earned by using the platform.
   * User gets back half of the fees in VBZRX
   */
  public async claimRebateRewards() {
    const account = this.getCurrentAccount()
    const bZxContract = await this.contractsSource!.getiBZxContract()
    if (!account || !bZxContract) {
      throw new Error('No account/ibzx contract available!')
    }

    const { gasAmount } = await this.getGasEstimate(() =>
      bZxContract.claimRewards.estimateGasAsync(account, {
        from: account
      })
    )

    const txHash = await bZxContract.claimRewards.sendTransactionAsync(account, {
      from: account,
      gas: gasAmount,
      gasPrice: await this.gasPrice()
    })

    await this.waitForTransactionMined(txHash)
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
      task.processingEnd(false, false, err)
      throw err
    } finally {
      this.emit('AskToCloseProgressDlg', task)
    }
    return false
  }

  private processStakingRequestTask = async (task: RequestTask, account: string) => {
    const taskRequest = task.request as StakingRequest
    const { amounts } = taskRequest

    const stakingContract = await this.contractsSource!.getStakingV1Contract()

    if (!stakingContract) {
      throw new Error('No staking contract available!')
    }

    const bzrxErc20Address = this.getErc20AddressOfAsset(Asset.BZRX)
    const vbzrxErc20Address = this.getErc20AddressOfAsset(Asset.VBZRX)
    const ibzrxErc20Address = this.getErc20AddressOfAsset(Asset.IBZRX)
    const bptErc20Address = this.getErc20AddressOfAsset(Asset.BPT)

    if (!bzrxErc20Address || !vbzrxErc20Address || !ibzrxErc20Address || !bptErc20Address) {
      throw new Error('No ERC20 contract available!')
    }

    // const encodedInput = stakingContract.stake.getABIEncodedTransactionData(
    //   [bzrxErc20Address, vbzrxErc20Address, ibzrxErc20Address, bptErc20Address],
    //   [amounts.bzrx, amounts.vbzrx, amounts.ibzrx, amounts.bpt]
    // )
    // console.log(encodedInput)

    task.processingStepNext()
    let gasAmountBN
    let gasAmount
    let txHash = ''
    try {
      gasAmount = await stakingContract.stake.estimateGasAsync(
        [bzrxErc20Address, vbzrxErc20Address, ibzrxErc20Address, bptErc20Address],
        [amounts.bzrx, amounts.vbzrx, amounts.ibzrx, amounts.bpt],
        {
          from: account,
          gas: this.gasLimit
        }
      )
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(this.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (err) {
      console.error(err)
      throw err
    }

    try {
      txHash = await stakingContract.stake.sendTransactionAsync(
        [bzrxErc20Address, vbzrxErc20Address, ibzrxErc20Address, bptErc20Address],
        [amounts.bzrx, amounts.vbzrx, amounts.ibzrx, amounts.bpt],
        {
          from: account,
          gas: gasAmountBN ? gasAmountBN.toString() : this.gasLimit,
          gasPrice: await this.gasPrice()
        }
      )

      task.setTxHash(txHash)
    } catch (err) {
      console.log(err)
      throw err
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
