import { BigNumber } from '@0x/utils'
import stakingUtils from 'app-lib/stakingUtils'
import sleep from 'bard-instruments/lib/async/sleep'
import * as mobx from 'mobx'
import RequestStatus from 'src/domain/RequestStatus'
import RequestTask from 'src/domain/RequestTask'
import { RootStore, StakingStore } from 'src/stores'

type StakingFormVMProp =
  | 'bzrxInput'
  | 'vbzrxInput'
  | 'bptInput'
  | 'selectedRepAddress'
  | 'transactionIsRunning'

export default class StakingFormVM {
  [name: string]: any
  public rootStore: RootStore
  public stakingStore: StakingStore
  public bzrxInput = '0'
  public vbzrxInput = '0'
  public bptInput = '0'
  public selectedRepAddress = ''
  public findRepDialogIsOpen = false
  public repSearchInput = ''
  public transactionIsRunning = false

  get inputsAsBigNumbers() {
    return {
      bzrx: new BigNumber(this.bzrxInput),
      vbzrx: new BigNumber(this.vbzrxInput),
      bpt: new BigNumber(this.bptInput)
    }
  }

  get canStake() {
    const { wallet } = this.stakingStore.userBalances
    return stakingUtils.verifyStake(wallet, this.inputsAsBigNumbers)
  }

  get repListLoaded() {
    return this.stakingStore.representatives.repsList.length > 0
  }

  get repFilteredList() {
    const { repsList } = this.stakingStore.representatives
    if (!this.repSearchInput) {
      return repsList
    }
    const searchValue = this.repSearchInput.toLowerCase()
    return repsList.filter(
      (rep) => rep.wallet.match(searchValue) || rep.name.toLowerCase().match(searchValue)
    )
  }

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: StakingFormVMProp, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  /**
   * Format the token amounts in inputs
   */
  private formatPrecision = (output: string) => {
    if (output.match(/^(\d+\.{1}0?)$/)) {
      return output
    }
    return Number(parseFloat(output).toFixed(2)).toPrecision()
  }

  /**
   * Helper function to change the input value ensuring it is always valid
   */
  public changeTokenBalance(name: 'bzrx' | 'vbzrx' | 'bpt', value: number) {
    const { wallet } = this.stakingStore.userBalances
    const walletBalance = wallet[name]
    const valueBN = new BigNumber(value)
    let newInputValue = String(value)

    if (valueBN.gt(walletBalance)) {
      newInputValue = walletBalance.toFixed(2, 1)
    } else if (valueBN.lt(0) || !value) {
      newInputValue = '0'
    } else {
      newInputValue = this.formatPrecision(String(value))
    }
    this[`${name}Input`] = newInputValue
  }

  public openFindRepDialog() {
    this.findRepDialogIsOpen = true
  }

  public closeFindRepDialog() {
    this.findRepDialogIsOpen = false
  }

  /**
   * User wants to choose a rep that is not in the top rep list
   */
  public selectNonTopRep(wallet: string) {
    const rep = this.stakingStore.representatives.addRepToTopList(wallet)
    if (rep) {
      this.selectedRepAddress = wallet
    }
    this.closeFindRepDialog()
  }

  public stake() {
    this.stakingStore.stake(this.inputsAsBigNumbers, this.selectedRepAddress).catch((err) => {
      console.error(err)
    })
  }

  public showTransactionAnim(task: RequestTask) {
    this.transactionIsRunning = true
  }

  public async hideTransactionAnim(task: RequestTask) {
    if (task.status === RequestStatus.DONE) {
      try {
        await this.stakingStore.syncData()
      } catch (err) {
        console.error(err)
      }
    }
    await sleep(1500)
    this.set('transactionIsRunning', false)
  }

  private init() {
    const sp = this.rootStore.stakingProvider
    sp.on('AskToOpenProgressDlg', this.showTransactionAnim)
    sp.on('AskToCloseProgressDlg', this.hideTransactionAnim)

    this.stopWalletSync = mobx.reaction(
      () => {
        const { wallet } = this.stakingStore.userBalances
        return {
          bzrxInput: wallet.bzrx.toFixed(2, 1),
          vbzrxInput: wallet.vbzrx.toFixed(2, 1),
          bptInput: wallet.bpt.toFixed(2, 1)
        }
      },
      (updatedBalances) => {
        this.assign(updatedBalances)
      }
    )

    this.stopDelegateSync = mobx.reaction(
      () => this.stakingStore.representatives.delegateAddress,
      (address) => this.set('selectedRepAddress', address)
    )
  }

  public destroyVM() {
    const sp = this.rootStore.stakingProvider
    sp.off('AskToOpenProgressDlg', this.showTransactionAnim)
    sp.off('AskToCloseProgressDlg', this.hideTransactionAnim)
    this.stopWalletSync()
    this.stopDelegateSync()
  }

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.stakingStore = rootStore.stakingStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
    this.init()
  }
}
