import { BigNumber } from '@0x/utils'
import stakingUtils from 'app-lib/stakingUtils'
import sleep from 'bard-instruments/lib/async/sleep'
import * as mobx from 'mobx'
import appConfig from 'src/config/appConfig'
import RequestTask from 'src/domain/RequestTask'
import { stakeableToken } from 'src/domain/stakingTypes'
import { RootStore, StakingStore } from 'src/stores'
import UserBalances from 'src/stores/StakingStore/UserBalances'
import { DialogVM } from 'ui-framework'

type StakingFormVMProp =
  | 'bzrxInput'
  | 'vbzrxInput'
  | 'bptInput'
  | 'ibzrxInput'
  | 'selectedRepAddress'
  | 'transactionIsRunning'
  | 'unstakeSelected'

export default class StakingFormVM {
  [name: string]: any
  public rootStore: RootStore
  public stakingStore: StakingStore
  public userBalances: UserBalances
  public bzrxInput = '0'
  public ibzrxInput = '0'
  public bptInput = '0'
  public vbzrxInput = '0'
  public selectedRepAddress = ''
  public findRepDialogIsOpen = false
  public repSearchInput = ''
  public transactionIsRunning = false
  public changeDelegateDialog = new DialogVM({ id: 'changeDelegateDialog' })
  public spendingAllowanceDetails = new DialogVM({ id: 'spendingAllowanceDetails' })
  public unstakeSelected = false

  get inputsAsBN(): Record<stakeableToken, BigNumber> {
    return {
      bzrx: new BigNumber(this.bzrxInput),
      vbzrx: new BigNumber(this.vbzrxInput),
      ibzrx: new BigNumber(this.ibzrxInput),
      bpt: new BigNumber(this.bptInput)
    }
  }

  get canStake() {
    // TODO : redo check. Had to disable because of spending approval changes.
    return true
    // const { wallet } = this.stakingStore.userBalances
    // return stakingUtils.verifyStake(wallet, this.inputsAsBN)
  }

  get canUnstake() {
    const { staked } = this.stakingStore.userBalances
    return stakingUtils.verifyStake(staked, this.inputsAsBN)
  }

  get canChangeDelegate() {
    return stakingUtils.isValidRepAddress(this.selectedRepAddress)
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
  public changeTokenBalance(name: 'bzrx' | 'vbzrx' | 'bpt' | 'ibzrx', value: number) {
    const { wallet, staked } = this.stakingStore.userBalances
    const balance = this.unstakeSelected ? staked : wallet
    const totalBalance = balance[name]
    const valueBN = new BigNumber(value)
    let newInputValue = String(value)

    if (valueBN.gt(totalBalance)) {
      newInputValue = totalBalance.toFixed(2, 1)
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

  public setSpendingAllowance(name: stakeableToken) {
    const spendingAllowance = this.stakingStore.stakingAllowances[name]
    return spendingAllowance.update(appConfig.infiniteApproval)
  }

  /**
   * Stake
   * Uses some heuristic: we are assuming that the user wants to use the full amounts
   * by comparing rounded values of staked and inputs
   */
  public stake() {
    const { stakingAllowances } = this.stakingStore
    const { wallet } = this.userBalances
    const tokenAmounts = new Map<stakeableToken, BigNumber>()
    Object.values(stakeableToken).forEach((token) => {
      const inputValue = this.inputsAsBN[token]
      if (!stakingAllowances.needApprovals.get(token) && inputValue.gt(0)) {
        const amount =
          inputValue.toFixed(2, 1) === wallet[token].toFixed(2, 1) ? wallet[token] : inputValue
        tokenAmounts.set(token, amount)
      }
    })
    return this.stakingStore.stake(tokenAmounts)
  }

  /**
   * Unstake
   * Users some heuristic: we are assuming that the user wants to use the full amounts
   * by comparing rounded values of staked and inputs
   */
  public unstake() {
    const { staked } = this.userBalances
    const tokenAmounts = new Map<stakeableToken, BigNumber>()

    Object.values(stakeableToken).forEach((token) => {
      const inputValue = this.inputsAsBN[token]
      if (inputValue.gt(0)) {
        const amount =
          inputValue.toFixed(2, 1) === staked[token].toFixed(2, 1) ? staked[token] : inputValue
        tokenAmounts.set(token, amount)
      }
    })

    return this.stakingStore.unstake(tokenAmounts)
  }

  public showTransactionAnim(task: RequestTask) {
    this.transactionIsRunning = true
  }

  public async hideTransactionAnim(task: RequestTask) {
    await sleep(1500)
    this.set('transactionIsRunning', false)
  }

  public async changeDelegate() {
    return this.stakingStore.representatives.changeDelegate(this.selectedRepAddress)
  }

  private init() {
    const { wallet, staked } = this.userBalances
    this.unstakeSelected = !wallet.isWorthEnough && staked.isWorthEnough
    const balance = this.unstakeSelected ? staked : wallet

    this.bzrxInput = balance.bzrx.toFixed(2, 1)
    this.vbzrxInput = balance.vbzrx.toFixed(2, 1)
    this.bptInput = balance.bpt.toFixed(2, 1)
    this.ibzrxInput = balance.ibzrx.toFixed(2, 1)

    this.stopInputSync = mobx.reaction(
      () => {
        const unstakeSelected = !staked.isWorthEnough
          ? false
          : !wallet.isWorthEnough
          ? true
          : this.unstakeSelected
        const tokens = unstakeSelected ? staked : wallet
        return {
          bzrxInput: tokens.bzrx.toFixed(2, 1),
          vbzrxInput: tokens.vbzrx.toFixed(2, 1),
          bptInput: tokens.bpt.toFixed(2, 1),
          ibzrxInput: tokens.ibzrx.toFixed(2, 1),
          unstakeSelected
        }
      },
      (update) => {
        this.assign(update)
      }
    )

    this.stopDelegateSync = mobx.reaction(
      () => this.stakingStore.representatives.delegateAddress,
      (address) => this.set('selectedRepAddress', address)
    )
  }

  public destroyVM() {
    this.stopInputSync()
    this.stopDelegateSync()
  }

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.stakingStore = rootStore.stakingStore
    this.userBalances = rootStore.stakingStore.userBalances
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
    this.init()
  }
}
