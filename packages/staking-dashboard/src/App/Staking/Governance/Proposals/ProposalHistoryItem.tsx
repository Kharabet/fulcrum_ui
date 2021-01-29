import React from 'react'
import { observer } from 'mobx-react'
import { GovernanceProposalHistoryItem, GovernanceProposalStates } from 'src/domain/GovernanceProposal'

export interface IProviderMenuListItemProps extends GovernanceProposalHistoryItem {
}

export function ProposalHistoryItem(props: IProviderMenuListItemProps) {
  const { state, date } = props
  const activeStatus = [GovernanceProposalStates.Succeeded, GovernanceProposalStates.Queued, GovernanceProposalStates.Executed]
  const classNameStatus = activeStatus.includes(state) ? 'green' : ''

  return (
    <li className="proposals-history__li">
      <div className={`proposals-history__status ${classNameStatus}`}>{GovernanceProposalStates[state]}</div>
      <div className="proposals-history__date">{date}</div>
    </li>
  )
}

export default observer(ProposalHistoryItem)
