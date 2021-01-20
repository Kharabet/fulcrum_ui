import { ReactComponent as CloseIcon } from 'app-images/ic__close.svg'
import React from 'react'
import Modal from 'react-modal'
import { observer } from 'mobx-react'
import GovernanceVM from '../GovernanceVM'
import ProposalHistoryItem from './ProposalHistoryItem'

export function Proposals({ vm }: { vm: GovernanceVM }) {
  const { proposals } = vm

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

  return (
    <Modal
      isOpen={proposals.visible}
      className="modal-content-div"
      overlayClassName="modal-overlay-div"
      ariaHideApp={false}>
      <div className="proposals">
        <div className="proposals-header">
          <span>Remove automatic COMP claims and COMP speed refresh</span>
          <div onClick={proposals.hide}>
            <CloseIcon className="disclosure__close" />
          </div>
        </div>
        <div className="proposals-body">
          <div className="proposals-votes">
            <div className="proposals-votes__title">Votes</div>
            <div className="proposals-votes__range">
              <div className="proposals-votes__range-active" style={{ width: '65%' }}></div>
            </div>
            <div className="proposals-votes__data">
              <div>
                <label>For:&nbsp;</label>
                <span className="value">340,345</span>
              </div>
              <div>
                <label>Against:&nbsp;</label>
                <span className="value">4,465</span>
              </div>
            </div>
          </div>
          <div className="flex jc-sb">
            <div className="proposals-info">
              <div className="proposals-info__title">Info</div>
              <div className="proposals-info__description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus leo, pellentesque
                sagittis maecenas maecenas ut. Eu interdum urna pulvinar in tincidunt fringilla odio
                dapibus. Ut orci consectetur justo a morbi molestie sit vitae. Rhoncus lectus neque
                nibh erat diam consectetur orci morbi nunc. Cursus leo, pellentesque sagittis
                maecenas maecenas ut.
              </div>
            </div>
            <div className="proposals-history">
              <div className="proposals-history__title">Proposal History</div>
              <ul className="proposals-history__list">
                {history.map((item, index) => {
                  return <ProposalHistoryItem key={index} date={item.date} status={item.status} />
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex jc-fe">
          <button className="button blue proposals-button" onClick={proposals.hide}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default observer(Proposals)
