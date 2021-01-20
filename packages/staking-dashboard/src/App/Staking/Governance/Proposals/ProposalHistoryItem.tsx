import React from 'react'
import { observer } from 'mobx-react'
import GovernanceVM from '../GovernanceVM'

export interface IProviderMenuListItemProps {
  date: string
  status: string
}

export function ProposalHistoryItem(props: IProviderMenuListItemProps) {
  const { status, date } = props

  return (
    <li className="proposals-history__li">
      <div className="proposals-history__status primary">{status}</div>
      <div className="proposals-history__date">{date}</div>
    </li>
  )
}

export default observer(ProposalHistoryItem)
