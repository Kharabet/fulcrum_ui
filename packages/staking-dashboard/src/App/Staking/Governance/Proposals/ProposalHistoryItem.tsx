import React from 'react'
import { observer } from 'mobx-react'
import {
  IGovernanceProposalHistoryItem,
  GovernanceProposalStates
} from 'src/domain/GovernanceProposal'
import ExternalLink from 'shared-components/ExternalLink'

export interface IProviderMenuListItemProps extends IGovernanceProposalHistoryItem {
  etherscanURL: string
}

export function ProposalHistoryItem(props: IProviderMenuListItemProps) {
  const { state, date } = props
  const stateName = GovernanceProposalStates[state]
  return (
    <li className="proposals-history__li">
      {props.txnHash ? (
        <ExternalLink
          className={`proposals-history__status ${stateName.toLowerCase()}`}
          showIcon={true}
          href={`${props.etherscanURL}tx/${props.txnHash}`}>
          {stateName}
        </ExternalLink>
      ) : (
        <div className={`proposals-history__status ${stateName.toLowerCase()}`}>{stateName}</div>
      )}
      <div className="proposals-history__date">
        {new Date(date * 1000).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: 'numeric'
        })}
      </div>
    </li>
  )
}

export default observer(ProposalHistoryItem)
