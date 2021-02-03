import React from 'react'
import { observer } from 'mobx-react'
import {
  IGovernanceProposalHistoryItem,
  GovernanceProposalStates
} from 'src/domain/GovernanceProposal'
import { ReactComponent as ExternalLink } from 'app-images/external-link.svg'

export interface IProviderMenuListItemProps extends IGovernanceProposalHistoryItem {
  etherscanURL: string
}

export function ProposalHistoryItem(props: IProviderMenuListItemProps) {
  const { state, date } = props
  const activeStatus = [
    GovernanceProposalStates.Succeeded,
    GovernanceProposalStates.Queued,
    GovernanceProposalStates.Executed
  ]
  const classNameStatus = activeStatus.includes(state) ? 'green' : ''
  const liHtml = (
    <li className="proposals-history__li">
      <div className={`proposals-history__status ${classNameStatus}`}>
        <span className='status-name'>
          {GovernanceProposalStates[state]}
          {props.txnHash && (
            <span className="icon-external">
              <ExternalLink />
            </span>
          )}
        </span>
      </div>
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
  return props.txnHash ? (
    <a href={`${props.etherscanURL}tx/${props.txnHash}`} target="_blank" rel="noopener noreferrer">
      {liHtml}
    </a>
  ) : (
    liHtml
  )
}

export default observer(ProposalHistoryItem)
