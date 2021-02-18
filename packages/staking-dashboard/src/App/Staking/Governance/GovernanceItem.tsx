import React from 'react'
import GovernanceProposal from 'src/domain/GovernanceProposal'
import hashUtils from 'app-lib/hashUtils'
import { observer } from 'mobx-react'
import GovernanceVM from './GovernanceVM'

export interface IGovernanceItemProps {
  proposal: GovernanceProposal
  vm: GovernanceVM
  openProposals: (id: number) => void
}

export function GovernanceItem(props: IGovernanceItemProps) {
  const { title, proposer, state, id } = props.proposal
  return (
    <tr className="table__row--link" onClick={() => props.openProposals(id)} role="button">
      <td>{title} </td>
      {!props.vm.rootStore.uiStore.media.smScreen && (
        <td className="proposal__proposer-address">{hashUtils.shortHash(proposer.address)}</td>
      )}
      <td>
        <span className={`proposal__state-label txt-center ${state.toLocaleLowerCase()}`}>
          {state}
        </span>
      </td>
    </tr>
  )
}

export default observer(GovernanceItem)
