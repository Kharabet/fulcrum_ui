import React from 'react'
import { observer } from 'mobx-react'
import { IGovernanceProposalActionItem } from 'bzx-common/src/domain/staking/GovernanceProposal'

export interface IProposalActionItemProps extends IGovernanceProposalActionItem {
  index: number
}

export function ProposalActionItem(props: IProposalActionItemProps) {
  return (
    <div className="proposals-actions-item">
      <strong>{props.index + 1}.</strong>&nbsp;
      <span className="title">{props.title}</span>
    </div>
  )
}

export default observer(ProposalActionItem)
