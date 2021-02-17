import { BigNumber } from '@0x/utils'
import React, { useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import Asset from 'bzx-common/src/assets/Asset'
import { TorqueProvider } from '../services/TorqueProvider'
import AssetSelectorItem from './AssetSelectorItem'
import { BorrowDlg } from './BorrowDlg'

export interface IAssetSelectorProps {
  borrowDlgRef: React.RefObject<BorrowDlg>
  doNetworkConnect: () => void
}

const AssetSelector = (props: IAssetSelectorProps) => {
  const apiUrl = 'https://api.bzx.network/v1'
  const [interestRates, setInterestRates] = useState()
  const [liquidities, setLiquidity] = useState()

  useEffect(() => {
    getInterestRates()
    getLiquidity()
  }, [])

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
      Asset.BZRX,
      Asset.MKR,
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

  const getInterestRates = async () => {
    const interestRatesRequest = await fetch(`${apiUrl}/interest-rates`)
    const interestRatesJson = await interestRatesRequest.json()
    let interestRatesData = []
    if (interestRatesJson.success) {
      interestRatesData = interestRatesJson.data
    }
    setInterestRates(interestRatesData)
  }

  const getLiquidity = async () => {
    const liquidityRequest = await fetch(`${apiUrl}/liquidity`)
    const liquidityJson = await liquidityRequest.json()
    let liquidityData = []
    if (liquidityJson.success) {
      liquidityData = liquidityJson.data
    }
    setLiquidity(liquidityData)
  }

  const assetSelectorItems = assetsShown.map((asset) => {
    const interestRate =
      interestRates && interestRates![asset.toLowerCase()]
        ? new BigNumber(interestRates![asset.toLowerCase()]['borrowApr']).times(100)
        : new BigNumber(0)

    const liquidity =
      liquidities && liquidities![asset.toLowerCase()]
        ? new BigNumber(liquidities![asset.toLowerCase()])
        : new BigNumber(0)

    return (
      <AssetSelectorItem
        key={asset}
        interestRate={interestRate}
        liquidity={liquidity}
        asset={asset}
        {...props}
      />
    )
  })

  if (!interestRates || !liquidities || TorqueProvider.Instance.isLoading) {
    return <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
  }

  return <div className="asset-selector">{assetSelectorItems}</div>
}

export default React.memo(AssetSelector)
