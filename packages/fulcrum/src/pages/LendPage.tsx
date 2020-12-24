import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import LendTokenSelector from '../components/LendTokenSelector'
import { Asset } from '../domain/Asset'
import { LendRequest } from '../domain/LendRequest'
import { LendType } from '../domain/LendType'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { FulcrumProvider } from '../services/FulcrumProvider'

import '../styles/pages/_lend-page.scss'
const LendForm = React.lazy(() => import('../components/LendForm'))

export interface ILendPageProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
}

function LendPage(props: ILendPageProps) {
  const [isLendModalOpen, setIsLendModalOpen] = useState<boolean>(false)
  const [lendType, setLendType] = useState<LendType>(LendType.LEND)
  const [lendAsset, setLendAsset] = useState<Asset>(Asset.UNKNOWN)
  const [lendRequestId, setLendRequestId] = useState<number>(0)
  const [isSupportedNetwork, setSupportNetwork] = useState<boolean>(true)

  useEffect(() => {
    const isSupportedNetwork = FulcrumProvider.Instance.unsupportedNetwork
    setSupportNetwork(isSupportedNetwork)
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      onProviderChanged
    )
  }, [])

  const onLendRequested = (request: LendRequest) => {
    if (
      !FulcrumProvider.Instance.contractsSource ||
      !FulcrumProvider.Instance.contractsSource.canWrite
    ) {
      props.doNetworkConnect()
      return
    }

    if (request) {
      setIsLendModalOpen(true)
      setLendType(request.lendType)
      setLendAsset(request.asset)
      setLendRequestId(request.id)
    }
  }

  const onLendConfirmed = (request: LendRequest) => {
    setIsLendModalOpen(false)
    request.id = lendRequestId
    FulcrumProvider.Instance.onLendConfirmed(request)
  }

  const onProviderChanged = () => {
    const isSupportedNetwork = FulcrumProvider.Instance.unsupportedNetwork
    setSupportNetwork(isSupportedNetwork)
  }

  const onRequestClose = () => {
    setIsLendModalOpen(false)
  }
  return (
    <div className="lend-page">
      <main className="lend-page-main">
        {!isSupportedNetwork ? (
          <React.Fragment>
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
          </React.Fragment>
        ) : (
          <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
            <div style={{ cursor: `pointer` }}>You are connected to the wrong network.</div>
          </div>
        )}
      </main>
    </div>
  )
}

export default React.memo(LendPage)
