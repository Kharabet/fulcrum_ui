import React from 'react'
import GovernanceProposal from 'src/domain/GovernanceProposal'
import hashUtils from 'app-lib/hashUtils'

export interface IGovernanceItemProps {
  proposal: GovernanceProposal
  openProposals: (id: number) => void
}

export function GovernanceItem(props: IGovernanceItemProps) {
  const { title, proposer, state, id } = props.proposal
  return (
    <tr className="table__row--link" onClick={() => props.openProposals(id)} role="button">
      <td>{title} </td>
      <td>{hashUtils.shortHash(proposer)}</td>
      <td>
        <button className={`${state.toLocaleLowerCase()}`}>{state}</button>
      </td>
    </tr>
  )
}

export default React.memo(GovernanceItem)
