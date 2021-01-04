import React, { RefObject, useState } from 'react'
import AssetSelector from '../components/AssetSelector'
import { BorrowDlg } from '../components/BorrowDlg'
import Footer from '../layout/Footer'
import { HeaderOps } from '../layout/HeaderOps'
import { TorqueProvider } from '../services/TorqueProvider'

export interface IBorrowPageProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
}

const BorrowPage = (props: IBorrowPageProps) => {
  const borrowDlgRef: RefObject<BorrowDlg> = React.createRef()

  return (
    <React.Fragment>
      <BorrowDlg ref={borrowDlgRef} />
      <div className="borrow-page">
        <HeaderOps
          isMobileMedia={props.isMobileMedia}
          doNetworkConnect={props.doNetworkConnect}
          isRiskDisclosureModalOpen={props.isRiskDisclosureModalOpen}
        />
        <main>
          {!TorqueProvider.Instance.unsupportedNetwork ? (
            <AssetSelector borrowDlgRef={borrowDlgRef} doNetworkConnect={props.doNetworkConnect} />
          ) : (
            <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
              <div style={{ cursor: `pointer` }}>You are connected to the wrong network.</div>
            </div>
          )}
        </main>
        <Footer isRiskDisclosureModalOpen={props.isRiskDisclosureModalOpen} />
      </div>
    </React.Fragment>
  )
}

export default React.memo(BorrowPage)
