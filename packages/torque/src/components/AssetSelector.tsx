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
  const [yields, setYield] = useState()
  const [liquidities, setLiquidity] = useState()

  useEffect(() => {
    getYield()
    getLiquidity()
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
      // Asset.LEND,
      Asset.KNC,
      Asset.UNI,
      Asset.AAVE,
      Asset.LRC,
      Asset.COMP
    ]
  } else if (process.env.REACT_APP_ETH_NETWORK === 'kovan') {
    assetsShown = [Asset.USDC, Asset.fWETH, Asset.WBTC]
  } else if (process.env.REACT_APP_ETH_NETWORK === 'ropsten') {
    assetsShown = [Asset.DAI, Asset.ETH]
  } else {
    assetsShown = []
  }
  
  async function getYield() {
    const yieldAPYRequest = await fetch(`${apiUrl}/yield-farimng-apy`)
    const yieldAPYJson = await yieldAPYRequest.json()
    let yieldAPYData = []
    if (yieldAPYJson.success) {
      yieldAPYData = yieldAPYJson.data
    }
    setYield(yieldAPYData)
  }

  async function getLiquidity() {
    const liquidityRequest = await fetch(`${apiUrl}/liquidity`)
    const liquidityJson = await liquidityRequest.json()
    let liquidityData = []
    if (liquidityJson.success) {
      liquidityData = liquidityJson.data
    }
    setLiquidity(liquidityData)
  }

  const assetSelectorItems = assetsShown.map((asset) => {
    const yieldApr =
      yields && yields![asset.toLowerCase()]
        ? new BigNumber(yields![asset.toLowerCase()])
        : new BigNumber(0)

      const liquidity =
      liquidities && liquidities![asset.toLowerCase()]
          ? new BigNumber(liquidities![asset.toLowerCase()])
          : new BigNumber(0)
  

    return <AssetSelectorItem key={asset} yieldApr={yieldApr} liquidity={liquidity} asset={asset} {...props} />
  })

  if (!yields || !liquidities || TorqueProvider.Instance.isLoading) {
    return <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
  }

  return <div className="asset-selector">{assetSelectorItems}</div>
}
