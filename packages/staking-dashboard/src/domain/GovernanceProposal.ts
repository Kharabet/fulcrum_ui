import { BigNumber } from '@0x/utils'

export enum GovernanceProposalStates {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}

export interface GovernanceProposalHistoryItem {
  state: GovernanceProposalStates
  date: number
  blockNumber: number
  txnHash?: string

}
export default class GovernanceProposal {
  public readonly id: number
  public readonly title: string
  public readonly description: string
  public readonly proposer: string
  public readonly state: string
  public readonly votesFor: BigNumber
  public readonly votesAgainst: BigNumber
  public readonly data: any
  public readonly creationEvent: any
  public readonly queuedEvent: any
  public readonly executedEvent: any
  public readonly canceledEvent: any
  public readonly voteCasts: any
  public readonly history: Array<GovernanceProposalHistoryItem>

  constructor(
    id: number,
    title: string,
    description: string,
    proposer: string,
    votesFor: BigNumber,
    votesAgainst: BigNumber,
    state: string,
    data: any,
    creationEvent: any,
    queuedEvent: any,
    executedEvent: any,
    canceledEvent: any,
    voteCasts: any,
    history: Array<GovernanceProposalHistoryItem>
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.proposer = proposer
    this.votesFor = votesFor
    this.votesAgainst = votesAgainst
    this.state = state
    this.data = data
    this.creationEvent = creationEvent
    this.queuedEvent = queuedEvent
    this.executedEvent = executedEvent
    this.canceledEvent = canceledEvent
    this.voteCasts = voteCasts
    this.history = history
  }
}
