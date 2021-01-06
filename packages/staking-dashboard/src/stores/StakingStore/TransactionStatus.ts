import _ from 'lodash'
import * as mobx from 'mobx'
import ClaimRebateRewardsRequest from 'src/domain/ClaimRebateRewardsRequest'
import ClaimRequest from 'src/domain/ClaimRequest'
import StakingRequest from 'src/domain/StakingRequest'
import { StakingProvider } from 'src/services/StakingProvider'

type transactionStatusProp = 'status' | 'request' | 'steps' | 'stepCurrent' | 'txHash' | 'error'

export default class TransactionStatus {
  private stakingProvider: StakingProvider
  public request:
    | StakingRequest
    | ClaimRequest
    | ClaimRebateRewardsRequest
    | null = null

  public status: 'AWAITING' | 'IN_PROGRESS' | 'FAILED' | 'FAILED_SKIPGAS' | 'DONE' = 'AWAITING'
  public steps: string[] = []
  public stepCurrent: number = 0
  public txHash: string | null = null
  public error: Error | null = null

  public get statusDescription() {
    let title = this.steps.find((s, i) => i + 1 === this.stepCurrent)
    if (!title) {
      return { message: this.status, isWarning: false }
    }

    let errorMsg = ''
    if (this.error) {
      if (this.error.message) {
        errorMsg = this.error.message
      } else if (typeof this.error === 'string') {
        // TODO: clarify this: error can not be a string
        errorMsg = this.error
      }

      if (errorMsg) {
        if (
          errorMsg.includes(
            `Request for method "eth_estimateGas" not handled by any subprovider`
          ) ||
          errorMsg.includes(`always failing transaction`)
        ) {
          errorMsg =
            'The transaction seems like it will fail. Change request parameters and try again, please.' // The transaction seems like it will fail. You can submit the transaction anyway, or cancel.
        } else if (errorMsg.includes('Reverted by EVM')) {
          errorMsg = 'The transaction failed. Reverted by EVM' // . Etherscan link:";
        } else if (errorMsg.includes('MetaMask Tx Signature: User denied transaction signature.')) {
          errorMsg = "You didn't confirm in MetaMask. Please try again."
        } else if (errorMsg.includes('User denied account authorization.')) {
          errorMsg = "You didn't authorize MetaMask. Please try again."
        } else if (errorMsg.includes('Transaction rejected')) {
          errorMsg = "You didn't confirm in Gnosis Safe. Please try again."
        } else {
          errorMsg = this.status
        }
      }
    }
    if (errorMsg) {
      title = errorMsg
    }
    return { message: title, isWarning: errorMsg !== '' }
  }

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: transactionStatusProp, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public reset() {
    this.assign({
      request: null,
      status: 'AWAITING',
      steps: [],
      stepCurrent: 0,
      txHash: null,
      error: null
    })
  }

  private init() {
    this.stakingProvider.on('TaskChanged', (task) => {
      this.assign(_.pick(task, ['status', 'steps', 'stepCurrent', 'txHash', 'error']))
    })
  }

  constructor(stakingProvider: StakingProvider) {
    this.stakingProvider = stakingProvider
    this.init()
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
