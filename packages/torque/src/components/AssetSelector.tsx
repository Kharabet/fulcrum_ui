import { BigNumber } from '@0x/utils'
import React, { useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import { Asset } from '../domain/Asset'
import { TorqueProvider } from '../services/TorqueProvider'
import { AssetSelectorItem } from './AssetSelectorItem'
import { BorrowDlg } from './BorrowDlg'

export interface IAssetSelectorProps {
  isLoadingTransaction: boolean
  borrowDlgRef: React.RefObject<BorrowDlg>
  doNetworkConnect: () => void
}

export const AssetSelector = (props: IAssetSelectorProps) => {
  const apiUrl = 'https://api.bzx.network/v1'
  const [yieldAPYJson, setYieldAPYJson] = useState()

  useEffect(() => {
    async function yieldAPYJson() {
      const yieldAPYRequest = await fetch(`${apiUrl}/yield-farimng-apy`)
      const yieldAPYJson = await yieldAPYRequest.json()
      setYieldAPYJson(yieldAPYJson)
    }
    yieldAPYJson()
  }, [props.isLoadingTransaction])

  // true includes ENS support
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
      // Asset.BZRX,
      Asset.MKR,
      Asset.LEND,
      Asset.KNC,
      Asset.UNI,
      Asset.AAVE
    ]
  } else if (process.env.REACT_APP_ETH_NETWORK === 'kovan') {
    assetsShown = [Asset.USDC, Asset.fWETH, Asset.WBTC]
  } else if (process.env.REACT_APP_ETH_NETWORK === 'ropsten') {
    assetsShown = [Asset.DAI, Asset.ETH]
  } else {
    assetsShown = []
  }

  const assetSelectorItems = assetsShown.map((asset) => {
    const yieldApr =
      yieldAPYJson && yieldAPYJson!['success'] && yieldAPYJson!['data'][asset.toLowerCase()]
        ? new BigNumber(yieldAPYJson!['data'][asset.toLowerCase()])
        : new BigNumber(0)

    return <AssetSelectorItem key={asset} yieldApr={yieldApr} asset={asset} {...props} />
  })

  if (!yieldAPYJson || TorqueProvider.Instance.isLoading) {
    return <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
  }

  return <div className="asset-selector">{assetSelectorItems}</div>
}
