import { BigNumber } from '@0x/utils'
import { BorrowDlg } from './BorrowDlg'
import { Loader } from '../components/Loader'
import { TorqueProvider } from '../services/TorqueProvider'
import { TorqueProviderEvents } from 'src/services/events/TorqueProviderEvents'
import appConfig from 'bzx-common/src/config/appConfig'
import Asset from 'bzx-common/src/assets/Asset'
import AssetSelectorItem from './AssetSelectorItem'
import React, { useEffect, useState } from 'react'

export interface IAssetSelectorProps {
  borrowDlgRef: React.RefObject<BorrowDlg>
  assetsShown: Asset[]
  doNetworkConnect: () => void
  setLoansActiveTab: () => void
}

const AssetSelector = (props: IAssetSelectorProps) => {
  const apiUrl = 'https://api.bzx.network/v1'
  const [interestRates, setInterestRates] = useState()
  const [liquidities, setLiquidity] = useState()

  useEffect(() => {
    derivedUpdate()
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, derivedUpdate)
    return () => {
      TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.ProviderChanged, derivedUpdate)
    }
  }, [])

  const derivedUpdate = () => {
    getInterestRates()
    getLiquidity()
  }
  const getInterestRates = async () => {
    let interestRatesData = {}
    // TODO: add API endpoints for bsc
    if (appConfig.isBsc) {
      const assetsInterestRates = await Promise.all(
        props.assetsShown.map((asset) => TorqueProvider.Instance.getAssetBorrowInterestRate(asset))
      )
      props.assetsShown.forEach((asset, i) => {
        // @ts-ignore
        interestRatesData[asset.toLowerCase()] = { borrowApr: assetsInterestRates[i] }
      })
    } else {
      const interestRatesRequest = await fetch(`${apiUrl}/interest-rates`)
      const interestRatesJson = await interestRatesRequest.json()
      let interestRatesData = []
      if (interestRatesJson.success) {
        interestRatesData = interestRatesJson.data
      }
    }
    // @ts-ignore
    setInterestRates(interestRatesData)
  }

  const getLiquidity = async () => {
    let liquidityData = {}
    // TODO: add API endpoints for bsc
    if (appConfig.isBsc) {
      const assetsLiquidities = await Promise.all(
        props.assetsShown.map((asset) => TorqueProvider.Instance.getAvailableLiquidity(asset))
      )
      props.assetsShown.forEach((asset, i) => {
        // @ts-ignore
        liquidityData[asset.toLowerCase()] = assetsLiquidities[i]
      })
    } else {
      const liquidityRequest = await fetch(`${apiUrl}/liquidity`)
      const liquidityJson = await liquidityRequest.json()
      if (liquidityJson.success) {
        liquidityData = liquidityJson.data
      }
    }
    //@ts-ignore
    setLiquidity(liquidityData)
  }

  const assetSelectorItems = props.assetsShown.map((asset) => {
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
