import React, { RefObject, useState } from 'react'
import AssetSelector from '../components/AssetSelector'
import { BorrowDlg } from '../components/BorrowDlg'
import { TorqueProvider } from '../services/TorqueProvider'

export interface IBorrowPageProps {
  doNetworkConnect: () => void
  setLoansActiveTab:()=> void
  isMobileMedia: boolean
}

const BorrowPage = (props: IBorrowPageProps) => {
  const borrowDlgRef: RefObject<BorrowDlg> = React.createRef()

  return (
    <React.Fragment>
      <BorrowDlg ref={borrowDlgRef} />
      <div>
        {!TorqueProvider.Instance.unsupportedNetwork ? (
          <AssetSelector borrowDlgRef={borrowDlgRef} doNetworkConnect={props.doNetworkConnect} setLoansActiveTab={props.setLoansActiveTab}/>
        ) : (
          <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
            <div style={{ cursor: `pointer` }}>You are connected to the wrong network.</div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default React.memo(BorrowPage)
