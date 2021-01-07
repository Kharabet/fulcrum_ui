// tslint:disable: max-classes-per-file
import * as mobx from 'mobx'
import RootStore from '../RootStore'

interface ITransactionEvent {
  opId: string
  opType?: 'staking'
  type?: 'txhash' | 'created'
  value?: string
  time?: number
}

class Transaction {
  public events: ITransactionEvent[] = []
  public hash: string = ''
  public opId: string = ''
  public opType: 'staking' | '' = ''
  public status: 'created' | 'mining' | 'failed' | 'success' = 'created'

  public updateWithEvent(event: ITransactionEvent) {
    if (event.type === 'txhash') {
      this.hash = event.value as string
      this.status = 'mining'
    }
    if (!event.time) {
      event.time = Date.now()
    }
    this.events = [event].concat(this.events)
  }

  constructor(props: { opId: string; opType: 'staking'; hash?: string }) {
    Object.assign(this, props)
    mobx.makeAutoObservable(this, undefined, { deep: false, autoBind: true })
    mobx.autorun(() => {
      if (this.events.length > 0) {
        const event = this.events[0]
        console.log(event.opId, event.type, event.value, event.time)
      }
    })
  }
}

export default class TransactionStore {
  public transactions: Transaction[] = []
  public rootStore: RootStore

  public findById(id: string) {
    return this.transactions.find((tx) => tx.opId === id)
  }

  public findLastStakingOp() {
    return this.transactions.find((tx) => tx.opType === 'staking')
  }

  public addNewTransaction(event: ITransactionEvent) {
    const transaction = new Transaction({ opId: event.opId, opType: event.opType! })
    transaction.updateWithEvent(event)
    const transactions =
      this.transactions.length >= 10
        ? this.transactions.slice(0, this.transactions.length - 1)
        : this.transactions
    this.transactions = [transaction].concat(transactions)
  }

  public updateTransaction(event: ITransactionEvent) {
    const tx = this.findById(event.opId)
    if (tx) {
      tx.updateWithEvent(event)
    } else {
      this.addNewTransaction(event)
    }
  }

  public init() {
    const sp = this.rootStore.stakingProvider
    sp.on('TaskUpdate', (event) => this.updateTransaction(event))
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    mobx.makeAutoObservable(this, undefined, { deep: false, autoBind: true })
  }
}
