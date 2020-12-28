import stakingUtils from 'app-lib/stakingUtils'
import React from 'react'
import Modal from 'react-modal'
import { Loader } from 'ui-framework'
import AddToBalance from './AddToBalance'
import AnimationTx from './AnimationTx'
import FindRepresentative from './FindRepresentative'
import Rewards from './Rewards'
import StakingFormVM from './StakingFormVM'
import TopRepList from './TopRepList'
import UserBalances from './UserBalances'

export default function StakingForm({ vm }: { vm: StakingFormVM }) {
  const { userBalances, representatives } = vm.stakingStore

  return (
    <React.Fragment>
      <Modal
        isOpen={vm.findRepDialogIsOpen}
        onRequestClose={vm.closeFindRepDialog}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        ariaHideApp={false}>
        <FindRepresentative vm={vm} />
      </Modal>
      <div className="container">
        <div className="calculator">
          {vm.transactionIsRunning ? (
            <AnimationTx rootStore={vm.stakingStore.rootStore} />
          ) : (
            <React.Fragment>
              <div className="calculator-row balance">
                {userBalances.pending && (
                  <Loader
                    className="calculator__balance-loader"
                    quantityDots={3}
                    sizeDots="small"
                    title=""
                    isOverlay={false}
                  />
                )}
                <UserBalances rootStore={vm.rootStore} />
              </div>

              <Rewards rootStore={vm.rootStore} />

              {vm.repListLoaded && vm.rootStore.web3Connection.isConnected && (
                <React.Fragment>
                  <TopRepList vm={vm} />

                  {stakingUtils.isValidRepAddress(vm.selectedRepAddress) && (
                    <AddToBalance vm={vm} />
                  )}

                  <div className="calculator-row">
                    <div className="group-buttons">
                      <button className="button" onClick={vm.openFindRepDialog}>
                        Find a Representative
                      </button>
                      <button
                        className="button"
                        disabled={representatives.isAlreadyRepresentative}
                        onClick={representatives.becomeRepresentative}>
                        Become A Representative
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
