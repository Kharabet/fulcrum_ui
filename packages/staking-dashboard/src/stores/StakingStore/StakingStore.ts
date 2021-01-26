import { BigNumber } from '@0x/utils'
import errorUtils from 'app-lib/errorUtils'
import stakingUtils from 'app-lib/stakingUtils'
import sleep from 'bard-instruments/lib/async/sleep'
import * as mobx from 'mobx'
import { stakeableToken } from 'src/domain/stakingTypes'
import { StakingProvider } from 'src/services/StakingProvider'
import RootStore from 'src/stores/RootStore'
import Representatives from './Representatives'
import Rewards from './Rewards'
import StakingAllowances from './StakingAllowances'
import UserBalances from './UserBalances'
import WalletUpdate, { ITokenAmounts } from './WalletUpdate'

type stakingStoreProp = 'stakingError' | 'stakingPending' | 'walletUpdate'

export default class StakingStore {
  public rootStore: RootStore
  public representatives: Representatives
  public rewards: Rewards
  public stakingProvider: StakingProvider
  public userBalances: UserBalances
  public etherscanURL = ''
  public stakingError: Error | null = null
  public stakingPending = false
  public walletUpdate: WalletUpdate | null = null
  public stakingAllowances: StakingAllowances

  public get error() {
    return (
      this.stakingError ||
      this.userBalances.error ||
      this.rewards.error ||
      this.stakingAllowances.error
    )
  }

  /**
   * Flag to know if the user has at least one token approved and enough of it in the wallet
   * to stake it.
   */
  public get hasEnoughToStake() {
    return Object.values(stakeableToken).some((token) => {
      return (
        !this.stakingAllowances.needApprovals.get(token) && this.userBalances.wallet[token].gt(0.01)
      )
    })
  }

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

  /**
   * Reset error state to null for any model that might have an error.
   * stakingStore.error computed value will be null as a result.
   */
  public clearError() {
    this.stakingError = null
    this.userBalances.error = null
    this.rewards.error = null
    this.stakingAllowances.clearError()
  }

  public async stake(tokenAmounts: Map<stakeableToken, BigNumber>) {
    try {
      // if (!stakingUtils.verifyStake(this.userBalances.wallet, tokenAmounts)) {
      //   throw new Error('Staking amounts are invalid. Maybe trying to stake more than possible.')
      // }
      this.assign({ stakingPending: true, stakingError: null })
      const { result } = this.stakingProvider.stake(tokenAmounts)
      await result
      this.userBalances.staked.add(Object.fromEntries(tokenAmounts))
      this.userBalances.wallet.substract(Object.fromEntries(tokenAmounts))
    } catch (err) {
      this.set('stakingError', errorUtils.decorateError(err, { title: 'Could not stake' }))
      throw err
    } finally {
      this.set('stakingPending', false)
    }
  }

  public async unstake(tokenAmounts: Map<stakeableToken, BigNumber>) {
    try {
      // if (!stakingUtils.verifyStake(this.userBalances.staked, tokenAmounts)) {
      //   throw new Error('Staking amounts are invalid. Maybe trying to unstake more than possible.')
      // }
      this.assign({ stakingPending: true, stakingError: null })
      await this.stakingProvider.unstakeTokens(tokenAmounts)
      this.userBalances.wallet.add(Object.fromEntries(tokenAmounts))
      this.userBalances.staked.substract(Object.fromEntries(tokenAmounts))
    } catch (err) {
      this.set('stakingError', errorUtils.decorateError(err, { title: 'Could not unstake' }))
      throw err
    } finally {
      this.set('stakingPending', false)
    }
  }

  public async unstakeAll() {
    this.set('stakingError', null)
    try {
      await this.stakingProvider.unstakeAll()
    } catch (err) {
      this.set('stakingError', errorUtils.decorateError(err, { title: 'Could not unstake' }))
      throw err
    }
  }

  /**
   * Updates the "user wallet update" model and sets a new wallet update diff.
   * (eg: useful to notify wallet change)
   * @param diff Amounts of tokens that are added or removed from the wallet
   */
  public updateUserWallet(diff: ITokenAmounts[]) {
    const { wallet, staked } = this.userBalances.getCopy()
    const amounts = diff.reduce(
      (acc, tokenAmount) => {
        const balance = tokenAmount.staked ? staked : wallet
        acc.from.push({
          token: tokenAmount.token,
          amount: balance[tokenAmount.token],
          staked: tokenAmount.staked
        })
        acc.to.push({
          token: tokenAmount.token,
          amount: wallet[tokenAmount.token].plus(tokenAmount.amount),
          staked: tokenAmount.staked
        })
        return acc
      },
      { from: [] as ITokenAmounts[], to: [] as ITokenAmounts[], diff: diff }
    )
    const walletUpdate = new WalletUpdate(amounts)
    this.walletUpdate = walletUpdate

    diff.forEach((tokenDiff) => {
      const destination = tokenDiff.staked ? this.userBalances.staked : this.userBalances.wallet
      destination.add({ [tokenDiff.token]: tokenDiff.amount })
    })
  }

  /**
   * Claim staking rewards and update user balances
   */
  public async claimStakingRewards(shouldRestake: boolean = false) {
    const claimed = await this.rewards.claimStakingRewards(shouldRestake)
    this.updateUserWallet([
      { token: 'bzrx', amount: claimed.bzrx, staked: shouldRestake },
      { token: 'crv', amount: claimed.stableCoin, staked: false }
    ])
  }

  /**
   * Claim rebate rewards and update user balances
   */
  public async claimRebateRewards() {
    const vbzrxAmount = await this.rewards.claimRebateRewards()
    if (vbzrxAmount) {
      this.updateUserWallet([{ token: 'vbzrx', amount: vbzrxAmount, staked: false }])
    }
  }

  /**
   * Claim vested BZRX and update user balances
   */
  public async claimVestedBzrx() {
    const bzrxAmount = await this.rewards.claimVestedBzrx()
    if (bzrxAmount) {
      this.updateUserWallet([{ token: 'bzrx', amount: bzrxAmount, staked: false }])
    }
  }

  /**
   * Meant to be called when provider changes
   */
  public async syncData() {
    if (this.rootStore.web3Connection.isConnected) {
      // TODO: Representatives deactivated until DAO
      // this.representatives.updateAll().catch((err) => {
      //   this.set('stakingError', err)
      //   console.error(err)
      // })
      await this.userBalances.getUserBalances()
      await this.stakingAllowances.check()
      await sleep(500)
      await this.rewards.getAllRewards()
    } else {
      this.userBalances.clearBalances()
      this.rewards.clearBalances()
    }
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
    this.rewards = new Rewards(stakingProvider, this)
    this.userBalances = new UserBalances(stakingProvider, this.rootStore)
    this.stakingAllowances = new StakingAllowances(this.userBalances, this.rootStore)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
