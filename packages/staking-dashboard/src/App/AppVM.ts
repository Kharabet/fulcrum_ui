import _ from 'lodash'
import * as mobx from 'mobx'
import { RootStore } from 'src/stores'
import { DialogVM } from 'ui-framework'
import ProviderType from 'bzx-common/src/domain/ProviderType'

type AppVMProps = 'pending' | 'section'

export default class AppVM {
  [name: string]: any
  public rootStore: RootStore
  public pending = false
  public headerMenu = new DialogVM()
  public providerMenu = new DialogVM()
  public section: 'dao' | 'stake' | 'rewards' = 'stake'
  private stopAutoHidingProviderMenu: mobx.IReactionDisposer | null = null
  private stopAutoSettingBodyOverflow: mobx.IReactionDisposer | null = null

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: AppVMProps, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public connect(providerType: ProviderType) {
    this.providerMenu.hide()
    this.rootStore.web3Connection.connect(providerType)
  }

  public disconnect() {
    this.providerMenu.hide()
    this.rootStore.web3Connection.disconnect()
  }

  /**
   * - Prepare the contract for claiming rewards (optimization because of blocking UI)
   * - And refresh rewards balances
   */
  public async prepareRewardTab() {
    const { stakingProvider, web3Connection, stakingStore } = this.rootStore
    await stakingProvider.preloadIBZXContract()
    if (web3Connection.isConnected) {
      stakingStore.rewards.getAllRewards()
    }
  }

  /**
   * Load the governance proposal list only if not yet loaded.
   */
  public async prepareDaoTab() {
    const { governanceStore } = this.rootStore
    if (!governanceStore.pending && governanceStore.proposalsList.length === 0) {
      governanceStore.getProposals()
    }
  }

  public init() {
    const prepareRewardTab = _.throttle(() => this.prepareRewardTab(), 5000)

    this.stopAutoSettingBodyOverflow = mobx.reaction(
      () => this.headerMenu.visible || this.providerMenu.visible,
      (menuVisible) => {
        if (menuVisible) {
          document.body.classList.add('overflow')
        } else {
          document.body.classList.remove('overflow')
        }
      }
    )

    this.stopPreloadTab = mobx.reaction(
      () => this.section,
      (section) => {
        switch (section) {
          case 'rewards':
            prepareRewardTab()
            break
          case 'dao':
            this.prepareDaoTab()
        }
      }
    )
  }

  public destroyVM() {
    if (this.stopAutoHidingProviderMenu) {
      this.stopAutoHidingProviderMenu()
    }
    if (this.stopAutoSettingBodyOverflow) {
      this.stopAutoSettingBodyOverflow()
    }
    if (this.stopPreloadTab) {
      this.stopPreloadTab()
    }
  }

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
    this.init()
  }
}
