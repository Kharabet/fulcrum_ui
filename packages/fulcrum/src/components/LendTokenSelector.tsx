import React from 'react'
import { Asset } from '../domain/Asset'
import { LendRequest } from '../domain/LendRequest'
import LendTokenSelectorItem from './LendTokenSelectorItem'
import { PreloaderChart } from '../components/PreloaderChart'

import { BigNumber } from '@0x/utils'
import { FulcrumProvider } from '../services/FulcrumProvider'
import '../styles/components/lend-token-selector.scss'

export interface ILendTokenSelectorProps {
  onLend: (request: LendRequest) => void
}

export interface ILendTokenSelectorState {
  interestRates: Map<Asset, BigNumber>
}

function LendTokenSelector(props: ILendTokenSelectorProps) {
  const assets = FulcrumProvider.Instance.lendAssetsShown
  const [interestRates, setInterestRates] = React.useState(new Map<Asset, BigNumber>())
  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    fetch('https://api.bzx.network/v1/supply-rate-apr')
      .then((resp) => resp.json())
      .then((resp) => {
        if (!resp.success) {
          isMounted && setIsLoading(false)
          return
        }
        const newInterestRates = new Map<Asset, BigNumber>()
        assets.forEach((asset: Asset) => {
          const interestRate = resp.data[asset.toLowerCase()]
          newInterestRates.set(asset, new BigNumber(interestRate || 0))
        })
        isMounted && setInterestRates(newInterestRates)
        isMounted && setIsLoading(false)
      })
      .catch((e) => {
        console.error(e)
        isMounted && setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const getTokenItems = () =>
    assets.map(
      (e: Asset) =>
        interestRates.get(e) !== undefined && (
          <LendTokenSelectorItem
            key={e}
            asset={e}
            interestRate={interestRates.get(e)}
            onLend={props.onLend}
          />
        )
    )

  return isLoading ? (
    <PreloaderChart quantityDots={4} sizeDots={'middle'} title={'Loading'} isOverlay={false} />
  ) : (
    <div className="lend-token-selector">{getTokenItems()}</div>
  )
}

export default React.memo(LendTokenSelector)
