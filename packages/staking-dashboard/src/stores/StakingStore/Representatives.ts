import hashUtils from 'app-lib/hashUtils'
import stakingApi from 'app-lib/stakingApi'
import stakingUtils from 'app-lib/stakingUtils'
import * as mobx from 'mobx'
import IRep from 'src/domain/IRep'
import { StakingProvider } from 'src/services/StakingProvider'

type representativesProp =
  | 'repsList'
  | 'topRepsList'
  | 'delegateAddress'
  | 'isAlreadyRepresentative'

export default class Representatives {
  [prop: string]: any
  public stakingProvider: StakingProvider
  public repsList: IRep[] = []
  public topRepsList: IRep[] = []
  public delegateAddress: string = ''
  public isAlreadyRepresentative = false

  get delegateAlreadyChosen() {
    return stakingUtils.isValidRepAddress(this.delegateAddress)
  }

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: representativesProp, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Look for a rep in the entire list of representatives
   */
  public findRepByWallet(wallet: string) {
    return this.repsList.find((rep) => rep.wallet.toLowerCase() === wallet.toLowerCase())
  }

  /**
   * Look for a rep in the top rep list of representatives
   */
  public findTopRepByWallet(wallet: string) {
    return this.topRepsList.find((rep) => rep.wallet.toLowerCase() === wallet.toLowerCase())
  }

  /**
   * When user wants to choose another rep that is not in the top rep list
   * we want to add it to the top rep list
   */
  public addRepToTopList(wallet: string) {
    const topRep = this.findTopRepByWallet(wallet)
    if (!topRep) {
      const rep = this.findRepByWallet(wallet)
      if (rep) {
        this.topRepsList = this.topRepsList.concat(rep)
        return rep
      }
    }
  }

  public async checkIsRep() {
    const isRep = await this.stakingProvider.checkIsRep()
    this.set('isAlreadyRepresentative', isRep)
  }

  public async getTopReps() {
    const topReps = this.repsList.sort((a, b) => b.BZRX.minus(a.BZRX).toNumber()).slice(0, 3)
    this.set('topRepsList', topReps)
    const topRepsWithProfiles = await Promise.all(
      topReps.map((rep, index) => stakingApi.getRepInfo(rep, index))
    )
    this.set('topRepsList', topRepsWithProfiles)
    return this.topRepsList
  }

  public async getRepresentatives() {
    const repsList = ((await this.stakingProvider.getRepresentatives()) as IRep[]).map((rep, i) => {
      rep.index = i
      rep.name = hashUtils.shortHash(rep.wallet, 6, 4)
      return rep
    })
    this.set('repsList', repsList)

    const topReps = await this.getTopReps()
    return { repsList, topReps }
  }

  /**
   * Get user delegate.
   * TODO: this should be refactored to pass the user address to provider.getDelegateAddress()
   * instead of relying on internal provider state
   */
  public async getDelegate() {
    const delegateAddress = await this.stakingProvider.getDelegateAddress()
    if (delegateAddress) {
      this.set('delegateAddress', delegateAddress)
      const delegate = this.topRepsList.find(
        (rep) => rep.wallet.toLowerCase() === delegateAddress.toLowerCase()
      )
      if (delegate && !this.topRepsList.includes(delegate)) {
        this.set('topRepsList', this.topRepsList.concat([delegate]))
      }
    }
  }

  /**
   * Helper function meant to be called when the provider has changed.
   * Updates all things related to representatives and delegate.
   */
  public async updateAll() {
    if (this.repsList.length === 0) {
      // Only load repsList if it has not been loaded yet
      await this.getRepresentatives()
    }
    await this.checkIsRep()
    await this.getDelegate()
  }

  constructor(stakingProvider: StakingProvider) {
    this.stakingProvider = stakingProvider
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
