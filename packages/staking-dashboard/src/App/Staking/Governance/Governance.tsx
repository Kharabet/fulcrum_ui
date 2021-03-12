import React from 'react'
import GovernanceItem from './GovernanceItem'
import GovernanceVM from './GovernanceVM'
import ProposalDetails from './ProposalDetails'
import { Loader } from 'ui-framework'

const loader = (
  <Loader
    title="Loading proposals"
    className="margin-top-2"
    quantityDots={3}
    sizeDots="small"
    isOverlay={false}
  />
)

export default function Governance({ vm }: { vm: GovernanceVM }) {
  const { proposalsList } = vm.governanceStore

  if (vm.proposalPopup.visible) {
    return (
      <div className="panel--white padded-2 margin-bottom-2">
        <ProposalDetails vm={vm} />
      </div>
    )
  }

  return (
    <div className="panel--white r-padded-1 margin-bottom-2">
      <table className="governance__proposals-table table">
        <thead>
          <tr>
            <td className="table__head">Description</td>
            <td className="table__head">Author</td>
            <td className="table__head txt-center">Status</td>
          </tr>
        </thead>
        <tbody>
          {proposalsList.map((proposal) => (
            <GovernanceItem
              key={proposal.id}
              proposal={proposal}
              vm={vm}
              openProposals={vm.showProposal}
            />
          ))}
        </tbody>
      </table>
      {vm.governanceStore.pending && loader}
      {vm.governanceStore.listFailedToLoad && <p>The list could not be loaded</p>}
    </div>
  )
}
