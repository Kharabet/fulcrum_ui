import React, { RefObject, useState } from 'react'
import AssetSelector from '../components/AssetSelector'
import { BorrowDlg } from '../components/BorrowDlg'
import { Footer } from '../layout/Footer'
import { HeaderOps } from '../layout/HeaderOps'

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
          <AssetSelector
            borrowDlgRef={borrowDlgRef}
            doNetworkConnect={props.doNetworkConnect}
          />
        </main>
        <Footer isRiskDisclosureModalOpen={props.isRiskDisclosureModalOpen} />
      </div>
    </React.Fragment>
  )
}

export default React.memo(BorrowPage)