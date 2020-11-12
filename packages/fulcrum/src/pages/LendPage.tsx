import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import LendTokenSelector from '../components/LendTokenSelector'
import { Asset } from '../domain/Asset'
import { LendRequest } from '../domain/LendRequest'
import { LendType } from '../domain/LendType'
import { FulcrumProvider } from '../services/FulcrumProvider'

import '../styles/pages/_lend-page.scss'

const LendForm = React.lazy(() => import('../components/LendForm'))

export interface ILendPageProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
}

function LendPage(props: ILendPageProps) {
  const [isLendModalOpen, setIsLendModalOpen] = useState(false)
  const [lendType, setLendType] = useState(LendType.LEND)
  const [lendAsset, setLendAsset] = useState(Asset.UNKNOWN)
  const [lendRequestId, setLendRequestId] = useState(0)

  let isMounted = true
  useEffect(() => {
    // const provider = FulcrumProvider.getLocalstorageItem('providerType')
    // if (!FulcrumProvider.Instance.web3Wrapper && (!provider || provider === 'None')) {
    //   props.doNetworkConnect()
    // }
    return () => {
      isMounted = false
    }
  }, [])

  const onLendRequested = (request: LendRequest) => {
    if (
      !FulcrumProvider.Instance.contractsSource ||
      !FulcrumProvider.Instance.contractsSource.canWrite
    ) {
      props.doNetworkConnect()
      return
    }

    if (request && isMounted) {
      setIsLendModalOpen(true)
      setLendType(request.lendType)
      setLendAsset(request.asset)
      setLendRequestId(request.id)
    }
  }

  const onLendConfirmed = (request: LendRequest) => {
    isMounted && setIsLendModalOpen(false)
    request.id = lendRequestId
    FulcrumProvider.Instance.onLendConfirmed(request)
  }

  const onRequestClose = () => {
    isMounted && setIsLendModalOpen(false)
  }
  return (
    <div className="lend-page">
      <main className="lend-page-main">
        {props.isMobileMedia && <div className="lend-page__header">Lend</div>}
        <LendTokenSelector onLend={onLendRequested} />
        <Modal
          isOpen={isLendModalOpen}
          onRequestClose={onRequestClose}
          className="modal-content-div modal-content-div-form"
          overlayClassName="modal-overlay-div">
          <LendForm
            lendType={lendType}
            asset={lendAsset}
            onSubmit={onLendConfirmed}
            onCancel={onRequestClose}
            isMobileMedia={props.isMobileMedia}
          />
        </Modal>
      </main>
    </div>
  )
}

export default React.memo(LendPage)
