import React from 'react'

export interface IGovernanceItemProps {
  description: string
  author: string
  action: string
  openProposals: () => void
}

export default function GovernanceItem(props: IGovernanceItemProps) {
  const { description, author, action } = props
  return (
    <div className="trow" onClick={props.openProposals}>
      <div className="trow__description">{description} </div>
      <div className="trow__right">
        <div className="trow__author">{author}</div>
        <div className="trow__action">
          <button className={`${action.toLocaleLowerCase()}`}>{action}</button>
        </div>
      </div>
    </div>
  )
}
