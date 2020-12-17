// tslint:disable: max-classes-per-file
import { BigNumber } from '@0x/utils'
import * as mobx from 'mobx'
import appConfig from 'src/config/appConfig'
import Asset from 'src/domain/Asset'
import { StakingProvider } from 'src/services/StakingProvider'

type userBalanceProp = 'pending' | 'stakingProvider' | 'error'
type tokens = 'bpt' | 'bzrx' | 'bzrxV1' | 'vbzrx'

class TokenBalances {
  public bpt = new BigNumber(0)
  public bzrx = new BigNumber(0)
  public bzrxV1 = new BigNumber(0)
  public vbzrx = new BigNumber(0)

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: tokens, value: BigNumber) {
    this[prop] = value
  }

  constructor() {
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}

export default class UserBalances {
  [name: string]: any
  public wallet = new TokenBalances()
  public staked = new TokenBalances()
  public pending = false
  public stakingProvider: StakingProvider
  public error: Error | null = null

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: userBalanceProp, value: any) {
    this[prop] = value
  }

  public async getUserBalances() {
    try {
      const sp = this.stakingProvider
      this.set('pending', true)
      this.wallet.set('bzrxV1', (await sp.getAssetTokenBalanceOfUser(Asset.BZRXv1)).div(10 ** 18))
      this.wallet.set('bzrx', (await sp.stakeableByAsset(Asset.BZRX)).div(10 ** 18))
      this.wallet.set('vbzrx', (await sp.stakeableByAsset(Asset.vBZRX)).div(10 ** 18))
      this.wallet.set('bpt', (await sp.stakeableByAsset(Asset.BPT)).div(appConfig.bptDecimals))
      this.staked.set('bzrx', (await sp.balanceOfByAsset(Asset.BZRX)).div(10 ** 18))
      this.staked.set('vbzrx', (await sp.balanceOfByAsset(Asset.vBZRX)).div(10 ** 18))
      this.staked.set('bpt', (await sp.balanceOfByAsset(Asset.BPT)).div(appConfig.bptDecimals))
      this.set('pending', false)
    }
    catch (err) {
      this.set('error', err)
      console.error(err)
    }
  }

  constructor(stakingProvider: StakingProvider) {
    this.stakingProvider = stakingProvider
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
