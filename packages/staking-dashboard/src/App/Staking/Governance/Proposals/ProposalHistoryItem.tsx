import React from 'react'
import { observer } from 'mobx-react'

export interface IProviderMenuListItemProps {
  date: string
  status: string
}

export function ProposalHistoryItem(props: IProviderMenuListItemProps) {
  const { status, date } = props
  let classNameStatus = ''
  const activeStatus = ['Succeeded', 'Queued', 'Executed']
  activeStatus.map((item) => {
    if (item === status) classNameStatus = 'green'
  })

  return (
    <li className="proposals-history__li">
      <div className={`proposals-history__status ${classNameStatus}`}>{status}</div>
      <div className="proposals-history__date">{date}</div>
    </li>
  )
}

export default observer(ProposalHistoryItem)
