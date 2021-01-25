import { ReactComponent as SearchIcon } from 'app-images/icon-search.svg'
import React, { ChangeEvent, useState } from 'react'
import GovernanceVM from './GovernanceVM'
import Proposals from './Proposals/Proposals'
import GovernanceItem from './GovernanceItem'

export default function Governance({ vm }: { vm: GovernanceVM }) {
  const governanceProposals = vm.governanceStore.proposalsList.map((proposal) => (
    <GovernanceItem
      key={proposal.id}
      proposal={proposal}
      openProposals={vm.proposals.show}
    />
  ))

  return (
    <React.Fragment>
      <Proposals vm={vm} />
      <div className="panel--white padded-2 margin-bottom-2 governance">
        <div className="governance__search">
          <input
            value={vm.name}
            placeholder="Search"
            onChange={(e) => (vm.name = e.target.value)}
          />
          <div className="governance__search__button" onClick={vm.search}>
            <SearchIcon />
          </div>
        </div>
        <div className="governance__table">
          <div className="thead">
            <div className="thead__description">Description</div>
            <div className="thead__right">
              <div className="thead__author">Author</div>
              <div className="thead__action">Action</div>
            </div>
          </div>
          <div className="tbody">{governanceProposals}</div>
        </div>
      </div>
    </React.Fragment>
  )
}
