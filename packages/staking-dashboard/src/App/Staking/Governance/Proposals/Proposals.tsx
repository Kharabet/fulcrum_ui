import 'simplebar/dist/simplebar.min.css'
import { ReactComponent as ArrowLeftIcon } from 'app-images/ic_arrow_left.svg'

import Markdown from 'markdown-to-jsx'
import { observer } from 'mobx-react'
import React from 'react'
import GovernanceVM from '../GovernanceVM'
import ProposalActionItem from './ProposalActionItem'
import ProposalHistoryItem from './ProposalHistoryItem'

import defaultAvatar from 'app-images/representative1.png'
import { ExternalLink } from 'src/shared-components/ExternalLink'

export function Proposals({ vm }: { vm: GovernanceVM }) {
  const { proposalPopup, activeProposal } = vm
  const { etherscanURL } = vm.rootStore

  if (activeProposal === undefined) {
    return null
  }
  return (
    <div className="proposals">
      <div className="proposals-header">
        <span className="back-to-list" onClick={proposalPopup.hide}>
          <ArrowLeftIcon />
        </span>
        &nbsp;<span>{activeProposal.title}</span>
      </div>
      <div className="proposals-body">
        <div className="proposals-base-info">
          <div className={`proposal__state-label ${activeProposal.state.toLocaleLowerCase()}`}>
            {activeProposal.state}
          </div>
          <ExternalLink
            className="proposals-proposer"
            href={`${etherscanURL}address/${activeProposal.proposer.address}`}>
            <img
              className="avatar"
              src={activeProposal.proposer.imageSrc || defaultAvatar}
              alt={`${activeProposal.proposer.name}'s avatar`}
            />
            <span className="name">{activeProposal.proposer.name}</span>
          </ExternalLink>
        </div>
        <div className="proposals-votes">
          <div className="proposals-votes__title">Votes</div>
          <div className="proposals-votes__range">
            <div
              className="proposals-votes__range-active"
              style={{
                width: `${activeProposal.votesFor
                  .div(activeProposal.votesFor.plus(activeProposal.votesAgainst))
                  .times(100)
                  .toNumber()}%`
              }}
            />
          </div>
          <div className="proposals-votes__data">
            <div>
              <label>For:&nbsp;</label>
              <span className="value">{activeProposal.votesFor.toFixed(0)}</span>
            </div>
            <div>
              <label>Against:&nbsp;</label>
              <span className="value">{activeProposal.votesAgainst.toFixed(0)}</span>
            </div>
          </div>
        </div>
        <div className="flex jc-sb">
          <div className="proposals-actions">
            <div className="proposals-actions__title">Actions</div>
            <div className="proposals-actions__details">
              {activeProposal.actions.map((item, index) => {
                return <ProposalActionItem key={index} index={index} {...item} />
              })}
            </div>
          </div>
          <div className="proposals-history">
            <div className="proposals-history__title">Proposal History</div>
            <ul className="proposals-history__list">
              {activeProposal.history.map((item, index) => {
                return <ProposalHistoryItem key={index} etherscanURL={etherscanURL} {...item} />
              })}
            </ul>
          </div>
        </div>

        <div className="proposals-info">
          <div className="proposals-info__title">Info</div>
          <div className="proposals-info__description">
            <Markdown>{activeProposal.description}</Markdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(Proposals)
