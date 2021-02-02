import { ReactComponent as CloseIcon } from 'app-images/ic__close.svg'
import React from 'react'
import Modal from 'react-modal'
import { observer } from 'mobx-react'
import GovernanceVM from '../GovernanceVM'
import ProposalHistoryItem from './ProposalHistoryItem'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

export function Proposals({ vm }: { vm: GovernanceVM }) {
  const { proposalPopup, activeProposal } = vm

  const history = [
    {
      status: 'Created',
      date: 'December 22nd, 2020'
    },
    {
      status: 'Active',
      date: 'December 22nd, 2020'
    },
    {
      status: 'Succeeded',
      date: 'December 22nd, 2020'
    }
  ]
  if (activeProposal === undefined) {
    return null
  }
  return (
    <Modal
      isOpen={proposalPopup.visible && activeProposal !== undefined}
      className="modal__content"
      overlayClassName="modal__overlay"
      ariaHideApp={false}>
      <SimpleBar style={{ maxHeight: '90vh', width: '720px', margin: '10px 0' }}>
        <div className="proposals">
          <div className="proposals-header">
            <span>{activeProposal.title}</span>
            <div onClick={proposalPopup.hide}>
              <CloseIcon className="disclosure__close" />
            </div>
          </div>
          <div className="proposals-body">
            <div className="proposals-votes">
              <div className="proposals-votes__title">Votes</div>
              <div className="proposals-votes__range">
                <div className="proposals-votes__range-active" style={{ width: '65%' }} />
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
              <div className="proposals-info">
                <div className="proposals-info__title">Actions</div>
                <div className="proposals-info__description">actions</div>
              </div>
              <div className="proposals-history">
                <div className="proposals-history__title">Proposal History</div>
                <ul className="proposals-history__list">
                  {activeProposal.history.map((item, index) => {
                    return <ProposalHistoryItem key={index} {...item} />
                  })}
                </ul>
              </div>
            </div>

            <div className="proposals-info">
              <div className="proposals-info__title">Info</div>
              <div className="proposals-info__description">{activeProposal.description}</div>
            </div>
          </div>
          <div className="flex jc-fe">
            <button className="button blue proposals-button" onClick={proposalPopup.hide}>
              Cancel
            </button>
          </div>
        </div>
      </SimpleBar>
    </Modal>
  )
}

export default observer(Proposals)
