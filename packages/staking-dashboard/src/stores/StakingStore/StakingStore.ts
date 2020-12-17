import { BigNumber } from '@0x/utils'
import stakingUtils from 'app-lib/stakingUtils'
import * as mobx from 'mobx'
import ConvertRequest from 'src/domain/ConvertRequest'
import { StakingProvider } from 'src/services/StakingProvider'
import RootStore from 'src/stores/RootStore'
import Representatives from './Representatives'
import Rewards from './Rewards'
import UserBalances from './UserBalances'
import TransactionStatus from './TransactionStatus'

type stakingStoreProp = 'error' | 'transactionStatus'

export default class StakingStore {
  public rootStore: RootStore
  public representatives: Representatives
  public rewards: Rewards
  public stakingProvider: StakingProvider
  public userBalances: UserBalances
  public etherscanURL = ''
  public transactionStatus: TransactionStatus
  public error: Error | null = null

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: stakingStoreProp, value: any) {
    this[prop] = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public async stake(
    tokenToStake: { bzrx: BigNumber; vbzrx: BigNumber; bpt: BigNumber },
    repAddress: string
  ) {
    try {
      if (!stakingUtils.verifyStake(this.userBalances.wallet, tokenToStake)) {
        throw new Error('Staking amounts are invalid. Maybe trying to stake more than possible.')
      }
      if (!stakingUtils.isValidRepAddress(repAddress)) {
        throw new Error(`Invalid rep address "${repAddress}"`)
      }
      return this.stakingProvider.stakeTokens(tokenToStake, repAddress)
    } catch (err) {
      this.set('error', err)
      throw err // Rethrowing for now, until we have proper error handling for users
    }
  }

  public convertBzrxV1ToV2() {
    const bzrxAmount = this.userBalances.wallet.bzrxV1.times(10 ** 18)
    this.stakingProvider.onRequestConfirmed(new ConvertRequest(bzrxAmount)).catch((err) => {
      console.error(err)
    })
  }

  public async syncData() {
    this.representatives.updateAll().catch((err) => {
      this.set('error', err)
      console.error(err)
    })
    await this.userBalances.getUserBalances()
    await this.rewards.getRewards()
  }

  public init() {
    // TODO: this is only valid as long as the apps are not merged, syncing should be done
    // when user goes to the staking page
    const sp = this.stakingProvider
    sp.on('ProviderChanged', this.syncData)
  }

  constructor(rootStore: RootStore) {
    const { stakingProvider } = rootStore
    this.rootStore = rootStore
    this.stakingProvider = stakingProvider
    this.representatives = new Representatives(stakingProvider)
    this.rewards = new Rewards(stakingProvider)
    this.userBalances = new UserBalances(stakingProvider)
    this.transactionStatus = new TransactionStatus(stakingProvider)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
