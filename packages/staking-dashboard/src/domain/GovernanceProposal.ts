import { BigNumber } from '@0x/utils'

import { EventAbi, LogWithDecodedArgs, DecodedLogArgs } from 'ethereum-types'
import {
  CompoundGovernorAlphaEventArgs,
  CompoundGovernorAlphaProposalCanceledEventArgs,
  CompoundGovernorAlphaProposalCreatedEventArgs,
  CompoundGovernorAlphaProposalExecutedEventArgs,
  CompoundGovernorAlphaProposalQueuedEventArgs,
  CompoundGovernorAlphaVoteCastEventArgs
} from '../contracts/CompoundGovernorAlpha'
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

export interface IGovernanceProposalHistoryItem {
  state: GovernanceProposalStates
  date: number
  blockNumber: number
  txnHash?: string
}

export interface IGovernanceProposalReturnData {
  id: BigNumber
  propsoer: string
  eta: BigNumber
  startBlock: BigNumber
  endBlock: BigNumber
  forVotes: BigNumber
  againstVotes: BigNumber
  canceled: boolean
  executed: boolean
}
export interface IGovernanceProposalActionItem {
  target: string
  signature: string
  callData: string
  value: BigNumber
  title: string
}
export interface IGovernanceProposalProposer {
  address: string
  name: string
  imageSrc?: string
}

export interface IGovernanceProposalsEvents {
  proposalsCreatedEvents: Array<LogWithDecodedArgs<CompoundGovernorAlphaProposalCreatedEventArgs>>
  proposalsQueuedEvents: Array<LogWithDecodedArgs<CompoundGovernorAlphaProposalQueuedEventArgs>>
  proposalsExecutedEvents: Array<LogWithDecodedArgs<CompoundGovernorAlphaProposalExecutedEventArgs>>
  proposalsCanceledEvents: Array<LogWithDecodedArgs<CompoundGovernorAlphaProposalCanceledEventArgs>>
}

export default class GovernanceProposal {
  public readonly id: number
  public readonly title: string
  public readonly description: string
  public readonly state: string
  public readonly votesFor: BigNumber
  public readonly votesAgainst: BigNumber
  public readonly history: IGovernanceProposalHistoryItem[]
  public readonly actions: IGovernanceProposalActionItem[]
  public readonly proposer: IGovernanceProposalProposer

  constructor(
    id: number,
    title: string,
    description: string,
    votesFor: BigNumber,
    votesAgainst: BigNumber,
    state: string,
    history: IGovernanceProposalHistoryItem[],
    actions: IGovernanceProposalActionItem[],
    proposer: IGovernanceProposalProposer
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.proposer = proposer
    this.votesFor = votesFor
    this.votesAgainst = votesAgainst
    this.state = state
    this.history = history
    this.actions = actions
  }
}
