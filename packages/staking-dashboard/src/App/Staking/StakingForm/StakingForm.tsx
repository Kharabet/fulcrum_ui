import React from 'react'
import Modal from 'react-modal'
import AddToBalance from './AddToBalance'
// import Delegates from './Delegates'
import FindRepresentative from './FindRepresentative'
import StakingFormVM from './StakingFormVM'
import UserBalances from './UserBalances'
// import ChangeStake from './ChangeStake' // This is a proof of concept to stake and unstake

export default function StakingForm({ vm }: { vm: StakingFormVM }) {
  const { userBalances } = vm.stakingStore
  const { wallet, staked } = userBalances

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

      <UserBalances rootStore={vm.rootStore} />

      {/* {vm.repListLoaded && vm.rootStore.web3Connection.isConnected && (
                // DELEGATES aren't shown until we have the DAO. Code commented until then.
                <Delegates vm={vm} />
              )} */}
      {(wallet.isWorthEnough || staked.isWorthEnough) && <AddToBalance vm={vm} />}
      {/* <ChangeStake vm={vm} /> */}
    </React.Fragment>
  )
}
