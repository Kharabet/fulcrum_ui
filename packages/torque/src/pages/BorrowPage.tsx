import Asset from 'bzx-common/src/assets/Asset'
import React, { RefObject, useState } from 'react'
import AssetSelector from '../components/AssetSelector'
import { BorrowDlg } from '../components/BorrowDlg'
import { TorqueProvider } from '../services/TorqueProvider'

export interface IBorrowPageProps {
  doNetworkConnect: () => void
  setLoansActiveTab: () => void
  isMobileMedia: boolean
}
let assetsShown: Asset[]

if (process.env.REACT_APP_ETH_NETWORK === 'mainnet') {
  assetsShown = [
    Asset.ETH,
    Asset.DAI,
    Asset.USDC,
    Asset.USDT,
    Asset.WBTC,
    Asset.LINK,
    Asset.YFI,
    Asset.BZRX,
    Asset.MKR,
    Asset.KNC,
    Asset.UNI,
    Asset.AAVE,
    Asset.LRC,
    Asset.COMP,
  ]
} else if (process.env.REACT_APP_ETH_NETWORK === 'bsc') {
  assetsShown = [Asset.BNB, Asset.ETH, Asset.BUSD, Asset.BTC, Asset.USDT]
} else if (process.env.REACT_APP_ETH_NETWORK === 'kovan') {
  assetsShown = [Asset.USDC, Asset.fWETH, Asset.WBTC]
} else if (process.env.REACT_APP_ETH_NETWORK === 'ropsten') {
  assetsShown = [Asset.DAI, Asset.ETH]
} else {
  assetsShown = []
}
const BorrowPage = (props: IBorrowPageProps) => {
  const borrowDlgRef: RefObject<BorrowDlg> = React.createRef()

  return (
    <React.Fragment>
      <BorrowDlg assetsShown={assetsShown} ref={borrowDlgRef} />
      <div>
        {!TorqueProvider.Instance.unsupportedNetwork ? (
          <AssetSelector
            assetsShown={assetsShown}
            borrowDlgRef={borrowDlgRef}
            doNetworkConnect={props.doNetworkConnect}
            setLoansActiveTab={props.setLoansActiveTab}
          />
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
