import { BigNumber } from '@0x/utils'
import errorUtils from 'app-lib/errorUtils'
import * as mobx from 'mobx'
import Asset from 'src/domain/Asset'
import { StakingProvider } from 'src/services/StakingProvider'

type allowanceProp = 'tokenName' | 'amount' | 'pending' | 'error'

export default class SpendingAllowance {
  private stakingProvider: StakingProvider
  public tokenName: keyof typeof Asset
  public amount: BigNumber = new BigNumber(0)
  public checked = false
  public pending = false
  public error: Error | null = null

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: allowanceProp, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  /**
   * Get the current amount of spending allowance for the token
   */
  public async check() {
    try {
      this.assign({ pending: true, error: null })
      const amount = await this.stakingProvider.checkStakingErc20Allowance(this.tokenName)
      this.assign({ amount, checked: true })
      return amount
    } catch (err) {
      errorUtils.decorateError(err, { title: `Could not check allowance [${this.tokenName}]` })
      this.set('error', err)
    } finally {
      this.set('pending', false)
    }
  }

  public async update(amount: BigNumber) {
    try {
      this.assign({ pending: true, error: null })
      await this.stakingProvider.setStakingAllowance(this.tokenName, amount)
      this.amount = amount
      return this.amount
    } catch (err) {
      errorUtils.decorateError(err, { title: `Could not update allowance [${this.tokenName}]` })
      this.set('error', err)
    } finally {
      this.set('pending', false)
    }
  }

  constructor(tokenName: keyof typeof Asset, stakingProvider: StakingProvider) {
    this.stakingProvider = stakingProvider
    this.tokenName = tokenName
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
