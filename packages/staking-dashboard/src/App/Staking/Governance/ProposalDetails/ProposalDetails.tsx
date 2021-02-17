import { ReactComponent as ArrowLeftIcon } from 'app-images/ic_arrow_left.svg'

import Markdown from 'markdown-to-jsx'
import { observer } from 'mobx-react'
import React from 'react'
import GovernanceVM from '../GovernanceVM'
import ProposalActionItem from './ProposalActionItem'
import ProposalHistoryItem from './ProposalHistoryItem'
import { Button } from 'ui-framework'

import defaultAvatar from 'app-images/representative1.png'
import { ExternalLink } from 'src/shared-components/ExternalLink'

export function ProposalDetails({ vm }: { vm: GovernanceVM }) {
  const { proposalPopup, activeProposal } = vm
  const { etherscanURL } = vm.rootStore

  if (activeProposal === undefined) {
    return null
  }
  return (
    <div className="proposals">
      <h2 className="flex-row-center margin-bottom-2">
        <Button
          className="proposal__back-btn margin-right-1"
          variant="blue"
          onClick={proposalPopup.hide}>
          <ArrowLeftIcon className="btn__icon" />
        </Button>
        {activeProposal.title}
      </h2>

      <hr className="content-separator margin-v-2" />

      <div className="proposals-body">
        <div className="proposals-base-info margin-bottom-2 flex-row-center">
          <div
            className={`proposal__state-label margin-right-1 ${activeProposal.state.toLocaleLowerCase()}`}>
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
          <div className="section-header">Votes</div>
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

        <hr className="content-separator margin-v-2" />

        <div className="proposals-info">
          <h3 className="section-header">Info</h3>
          <div className="proposals-info__description">
            <Markdown>{activeProposal.description}</Markdown>
          </div>
        </div>

        <hr className="content-separator margin-v-2" />

        <h3 className="section-header">Actions</h3>
        <div className="proposals-actions__details">
          {activeProposal.actions.map((item, index) => {
            return <ProposalActionItem key={index} index={index} {...item} />
          })}
        </div>

        <hr className="content-separator margin-v-2" />

        <div className="proposals-history">
          <h3 className="section-header">Proposal History</h3>
          <table className="table">
            <thead>
              <tr>
                <td className="table__head">
                  <span className="margin-left-1">Status</span>
                </td>
                <td className="table__head">Time</td>
              </tr>
            </thead>
            <tbody>
              {activeProposal.history.map((item, index) => {
                return <ProposalHistoryItem key={index} etherscanURL={etherscanURL} {...item} />
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default observer(ProposalDetails)
