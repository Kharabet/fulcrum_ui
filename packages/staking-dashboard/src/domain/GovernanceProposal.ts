import { BigNumber } from '@0x/utils'

export enum GovernanceProposalStates {
  Pending = 'Pending',
  Active = 'Active',
  Canceled = 'Canceled',
  Defeated = 'Defeated',
  Succeeded = 'Succeeded',
  Queued = 'Queued',
  Expired = 'Expired',
  Executed = 'Executed'
}
export default class GovernanceProposal {
  public readonly id: number
  public readonly title: string
  public readonly description: string
  public readonly proposer: string
  public readonly state: string
  public readonly votesFor: BigNumber
  public readonly votesAgainst: BigNumber

  constructor(
    id: number,
    title: string,
    description: string,
    proposer: string,
    votesFor: BigNumber,
    votesAgainst: BigNumber,
    state: string
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.proposer = proposer
    this.votesFor = votesFor
    this.votesAgainst = votesAgainst
    this.state = state
  }
}
