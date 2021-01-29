import { BigNumber } from '@0x/utils'
import { TransactionReceipt, Web3Wrapper, LogEntry } from '@0x/web3-wrapper'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorEvent, ConnectorUpdate } from '@web3-react/types'
import hashUtils from 'app-lib/hashUtils'
import GovernanceProposal, {
  GovernanceProposalHistoryItem,
  GovernanceProposalStates
} from 'src/domain/GovernanceProposal'
import ProposalCreated from 'src/domain/ProposalCreated'
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
import { ContractsSource } from './ContractsSource'
import ProviderChangedEvent from './events/ProviderChangedEvent'
import { EventAbi, LogWithDecodedArgs, DecodedLogArgs } from 'ethereum-types'
import {
  CompoundGovernorAlphaEventArgs,
  CompoundGovernorAlphaProposalCanceledEventArgs,
  CompoundGovernorAlphaProposalCreatedEventArgs,
  CompoundGovernorAlphaProposalExecutedEventArgs,
  CompoundGovernorAlphaProposalQueuedEventArgs,
  CompoundGovernorAlphaVoteCastEventArgs
} from '../contracts/CompoundGovernorAlpha'

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

  public async getGovernanceProposals(): Promise<Array<GovernanceProposal>> {
    let result: Array<GovernanceProposal> = []

    let proposalCreatedEvents: Array<
      LogWithDecodedArgs<CompoundGovernorAlphaProposalCreatedEventArgs>
    > = []
    let proposalQueuedEvents: Array<
      LogWithDecodedArgs<CompoundGovernorAlphaProposalQueuedEventArgs>
    > = []
    let proposalExecutedEvents: Array<
      LogWithDecodedArgs<CompoundGovernorAlphaProposalExecutedEventArgs>
    > = []
    let proposalCanceledEvents: Array<
      LogWithDecodedArgs<CompoundGovernorAlphaProposalCanceledEventArgs>
    > = []
    let proposalVoteCastEvents: Array<
      LogWithDecodedArgs<CompoundGovernorAlphaVoteCastEventArgs>
    > = []
    let proposalsData = []
    let proposalsStates: BigNumber[] = []

    const enumerateProposalState = (state: number) => {
      const proposalStates = [
        'Pending',
        'Active',
        'Canceled',
        'Defeated',
        'Succeeded',
        'Queued',
        'Expired',
        'Executed'
      ]
      return proposalStates[state]
    }

    if (!this.web3Wrapper || !this.contractsSource) {
      throw new Error('getGovernanceProposals: Missing source or web3')
    }

    const governanceContract = this.contractsSource.getCompoundGovernorAlphaContract()
    this.web3Wrapper.abiDecoder.addABI(governanceContract.abi)
    const proposalsCount = await governanceContract.proposalCount.callAsync()
    const quorumVotes = await governanceContract.quorumVotes.callAsync()
    const votingPeriod = await governanceContract.votingPeriod.callAsync()
    const currentBlock = await this.web3Wrapper.getBlockNumberAsync()

    const voteCastEvents = await this.web3Wrapper.getLogsAsync({
      fromBlock: '0x895440', //9000000
      toBlock: 'latest',
      topics: ['0x877856338e13f63d0c36822ff0ef736b80934cd90574a3a5bc9262c39d217c46'],
      address: this.contractsSource.getCompoundGovernorAlphaAddress()
    })
    for (const i in voteCastEvents) {
      if (!voteCastEvents[i]) {
        continue
      }
      const event: LogEntry = voteCastEvents[i]
      const decodedData = this.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<
        CompoundGovernorAlphaVoteCastEventArgs
      >(event)
      if ('args' in decodedData) {
        proposalVoteCastEvents.push(decodedData)
      } else {
        console.warn({ decodedData })
      }
    }

    const createdEvents = await this.web3Wrapper.getLogsAsync({
      fromBlock: '0x895440', //9000000
      toBlock: 'latest',
      topics: [ProposalCreated.topic0],
      address: this.contractsSource.getCompoundGovernorAlphaAddress()
    })
    for (const i in createdEvents) {
      if (!createdEvents[i]) {
        continue
      }
      const event: LogEntry = createdEvents[i]
      const decodedData = this.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<
        CompoundGovernorAlphaProposalCreatedEventArgs
      >(event)
      if ('args' in decodedData) {
        proposalCreatedEvents.push(decodedData)
      } else {
        console.warn({ decodedData })
      }
    }

    const queuedEvents = await this.web3Wrapper.getLogsAsync({
      fromBlock: '0x895440', //9000000
      toBlock: 'latest',
      topics: ['0x9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892'],
      address: this.contractsSource.getCompoundGovernorAlphaAddress()
    })
    for (const i in queuedEvents) {
      if (!createdEvents[i]) {
        continue
      }
      const event: LogEntry = queuedEvents[i]
      const decodedData = this.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<
        CompoundGovernorAlphaProposalQueuedEventArgs
      >(event)
      if ('args' in decodedData) {
        proposalQueuedEvents.push(decodedData)
      } else {
        console.warn({ decodedData })
      }
    }

    const executedEvents = await this.web3Wrapper.getLogsAsync({
      fromBlock: '0x895440', //9000000
      toBlock: 'latest',
      topics: ['0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f'],
      address: this.contractsSource.getCompoundGovernorAlphaAddress()
    })
    for (const i in executedEvents) {
      if (!createdEvents[i]) {
        continue
      }
      const event: LogEntry = executedEvents[i]
      const decodedData = this.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<
        CompoundGovernorAlphaProposalExecutedEventArgs
      >(event)
      if ('args' in decodedData) {
        proposalExecutedEvents.push(decodedData)
      } else {
        console.warn({ decodedData })
      }
    }
    const canceledEvents = await this.web3Wrapper.getLogsAsync({
      fromBlock: '0x895440', //9000000
      toBlock: 'latest',
      topics: ['0x789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c'],
      address: this.contractsSource.getCompoundGovernorAlphaAddress()
    })
    for (const i in canceledEvents) {
      if (!createdEvents[i]) {
        continue
      }
      const event: LogEntry = canceledEvents[i]
      const decodedData = this.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<
        CompoundGovernorAlphaProposalCanceledEventArgs
      >(event)
      if ('args' in decodedData) {
        proposalCanceledEvents.push(decodedData)
      } else {
        console.warn({ decodedData })
      }
    }

    for (const i of Array.from(Array(parseInt(proposalsCount.toFixed())), (n, i) => i + 1)) {
      proposalsData.push(await governanceContract.proposals.callAsync(new BigNumber(i)))
      proposalsStates.push(
        new BigNumber(await governanceContract.state.callAsync(new BigNumber(i)))
      )
    }
    const remappedProposals = []
    for (const i in proposalsData) {
      const p = proposalsData[i]
      const id = p[0].toNumber()
      const creationEvent = proposalCreatedEvents.find((e) => e.args.id.eq(id))
      if (creationEvent === undefined) {
        continue
      }
      const queuedEvent = proposalQueuedEvents.find((e) => e.args.id.eq(id))
      const executedEvent = proposalExecutedEvents.find((e) => e.args.id.eq(id))
      const canceledEvent = proposalCanceledEvents.find((e) => e.args.id.eq(id))
      const voteCasts = proposalVoteCastEvents.filter(
        (e) => e.args.proposalId.eq(id) && e.args.support === true
      )
      // let votesAccumulator = new BigNumber(0)
      // voteCasts.some( vote => {
      //   votesAccumulator = votesAccumulator.plus(vote.args.votes)
      //   if (votesAccumulator.gt(quorumVotes)){
      //     console.log(id, vote.blockNumber!.toFixed())
      //     return true
      //   }
      //   return false
      // })

      const splittedDescription = creationEvent.args.description.split(/\n/g)
      const title = splittedDescription[0].split('# ')[1] || 'Untitled'
      splittedDescription.splice(0, 1)
      const description = splittedDescription.join('\n') || 'No description.'

      const pendingHistoryItem = {
        state: GovernanceProposalStates.Pending,
        blockNumber: p[3].toNumber(),
        txnHash: creationEvent.transactionHash,
        date: await this.web3Wrapper!.getBlockTimestampAsync(creationEvent.blockNumber!)
      } as GovernanceProposalHistoryItem
      const activeHistoryItem = {
        state: GovernanceProposalStates.Active,
        blockNumber: p[3].toNumber(),
        txnHash: creationEvent.transactionHash,
        date: await this.web3Wrapper!.getBlockTimestampAsync(creationEvent.blockNumber!)
      } as GovernanceProposalHistoryItem
      const voteResultHisoryItem = {
        state:
          p[4].lt(currentBlock) && p[2].isZero()
            ? GovernanceProposalStates.Defeated
            : GovernanceProposalStates.Succeeded,
        blockNumber: p[4].toNumber(),
        date: await this.web3Wrapper!.getBlockTimestampAsync(p[4].toNumber())
      } as GovernanceProposalHistoryItem

      const queuedHisoryItem =
        (queuedEvent &&
          ({
            state: GovernanceProposalStates.Queued,
            blockNumber: queuedEvent.blockNumber!,
            txnHash: queuedEvent.transactionHash,
            date: await this.web3Wrapper!.getBlockTimestampAsync(queuedEvent.blockNumber!)
          } as GovernanceProposalHistoryItem)) ||
        undefined

      const executedHisoryItem =
        (executedEvent &&
          ({
            state: GovernanceProposalStates.Executed,
            blockNumber: executedEvent.blockNumber!,
            txnHash: executedEvent.transactionHash,
            date: await this.web3Wrapper!.getBlockTimestampAsync(executedEvent.blockNumber!)
          } as GovernanceProposalHistoryItem)) ||
        undefined

      const expiredHisoryItem =
        (queuedEvent &&
          p[2].plus(1209600).lt(currentBlock) &&
          ({
            state: GovernanceProposalStates.Expired,
            blockNumber: p[2].plus(1209600).toNumber(),
            date: await this.web3Wrapper!.getBlockTimestampAsync(p[2].plus(1209600).toNumber())
          } as GovernanceProposalHistoryItem)) ||
        undefined

      const canceledHisoryItem =
        (canceledEvent &&
          ({
            state: GovernanceProposalStates.Canceled,
            blockNumber: canceledEvent.blockNumber!,
            txnHash: canceledEvent.transactionHash
          } as GovernanceProposalHistoryItem)) ||
        undefined

      const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
        return value !== null && value !== undefined
      }
      const history: Array<GovernanceProposalHistoryItem> = [
        pendingHistoryItem,
        activeHistoryItem,
        voteResultHisoryItem,
        queuedHisoryItem,
        executedHisoryItem,
        expiredHisoryItem,
        canceledHisoryItem
      ].filter(notEmpty)

      remappedProposals.push(
        new GovernanceProposal(
          id,
          title,
          description,
          creationEvent.args.proposer,
          p[5].div(10 ** 18),
          p[6].div(10 ** 18),
          GovernanceProposalStates[proposalsStates[id - 1].toNumber()],
          p,
          creationEvent,
          queuedEvent,
          executedEvent,
          canceledEvent,
          voteCasts,
          history
        )
      )
    }
    result = remappedProposals.reverse()
    console.log({ result })
    return result
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
  public async getStakedBalances(address?: string) {
    const stakingContract = await this.getStakingContract()
    const account = address || this.getCurrentAccount()
    if (!stakingContract || !account) {
      return {
        bzrx: new BigNumber(0),
        vbzrx: new BigNumber(0),
        ibzrx: new BigNumber(0),
        bpt: new BigNumber(0)
      }
    }
    const [bzrx, ibzrx, vbzrx, bpt] = await stakingContract.balanceOfByAssets.callAsync(account)
    return { bzrx, ibzrx, vbzrx, bpt }
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
      case Asset.BZRXV1:
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
  public getUserEarnings = async (): Promise<{
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

  public stake = (tokens: {
    bzrx: BigNumber
    vbzrx: BigNumber
    ibzrx: BigNumber
    bpt: BigNumber
  }) => {
    const opId = (Math.random() + 1).toString()
    this.emit('TaskUpdate', { opId, opType: 'staking', type: 'created', value: Date.now() })
    return { opId, type: 'staking', result: this._stake(tokens, opId) }
  }

  /**
   * Send stake request.
   * Amounts should be in decimal base.
   * eg: if user wants to unstake 10 BZRX then bzrx argument should be new BigNumber(10)
   * @param tokens amount of bzrx, vbzrx, ibzrx and bpt to stake
   */
  public _stake = async (
    tokens: {
      bzrx: BigNumber
      vbzrx: BigNumber
      ibzrx: BigNumber
      bpt: BigNumber
    },
    opId?: string
  ) => {
    const account = this.getCurrentAccount()
    const stakingContract = await this.getStakingContract()

    if (!account || !stakingContract) {
      throw new Error('Missing account of stakingContract')
    }

    const bzrxErc20Address = this.getErc20AddressOfAsset(Asset.BZRX)
    const vbzrxErc20Address = this.getErc20AddressOfAsset(Asset.VBZRX)
    const ibzrxErc20Address = this.getErc20AddressOfAsset(Asset.IBZRX)
    const bptErc20Address = this.getErc20AddressOfAsset(Asset.BPT)

    if (!bzrxErc20Address || !vbzrxErc20Address || !ibzrxErc20Address || !bptErc20Address) {
      throw new Error('No ERC20 contract available!')
    }

    const bzrx = tokens.bzrx.times(10 ** 18)
    const vbzrx = tokens.vbzrx.times(10 ** 18)
    const ibzrx = tokens.ibzrx.times(10 ** 18)
    const bpt = tokens.bpt.times(10 ** 18)

    const { gasAmount } = await this.getGasEstimate(() =>
      stakingContract.stake.estimateGasAsync(
        [bzrxErc20Address, vbzrxErc20Address, ibzrxErc20Address, bptErc20Address],
        [bzrx, vbzrx, ibzrx, bpt],
        {
          from: account
        }
      )
    )

    const txHash = await stakingContract.stake.sendTransactionAsync(
      [bzrxErc20Address, vbzrxErc20Address, ibzrxErc20Address, bptErc20Address],
      [bzrx, vbzrx, ibzrx, bpt],
      {
        from: account,
        gas: gasAmount,
        gasPrice: await this.gasPrice()
      }
    )

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
  public unstakeTokens = async (tokens: {
    bzrx: BigNumber
    vbzrx: BigNumber
    ibzrx: BigNumber
    bpt: BigNumber
  }) => {
    const account = this.getCurrentAccount()
    const stakingContract = await this.getStakingContract()

    if (!account || !stakingContract) {
      throw new Error('Missing account of stakingContract')
    }

    const bzrxErc20Address = this.getErc20AddressOfAsset(Asset.BZRX)
    const vbzrxErc20Address = this.getErc20AddressOfAsset(Asset.VBZRX)
    const ibzrxErc20Address = this.getErc20AddressOfAsset(Asset.IBZRX)
    const bptErc20Address = this.getErc20AddressOfAsset(Asset.BPT)

    if (!bzrxErc20Address || !vbzrxErc20Address || !ibzrxErc20Address || !bptErc20Address) {
      throw new Error('No ERC20 contract available!')
    }

    const bzrx = tokens.bzrx.times(10 ** 18)
    const vbzrx = tokens.vbzrx.times(10 ** 18)
    const ibzrx = tokens.ibzrx.times(10 ** 18)
    const bpt = tokens.bpt.times(10 ** 18)

    const { gasAmount } = await this.getGasEstimate(() =>
      stakingContract.unstake.estimateGasAsync(
        [bzrxErc20Address, vbzrxErc20Address, ibzrxErc20Address, bptErc20Address],
        [bzrx, vbzrx, ibzrx, bpt],
        {
          from: account
        }
      )
    )

    const txHash = await stakingContract.unstake.sendTransactionAsync(
      [bzrxErc20Address, vbzrxErc20Address, ibzrxErc20Address, bptErc20Address],
      [bzrx, vbzrx, ibzrx, bpt],
      {
        from: account,
        gas: gasAmount,
        gasPrice: await this.gasPrice()
      }
    )

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
      console.log('hey')
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
