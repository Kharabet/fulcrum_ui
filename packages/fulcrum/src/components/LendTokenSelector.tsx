import React from 'react'
import { Asset } from '../domain/Asset'
import { LendRequest } from '../domain/LendRequest'
import LendTokenSelectorItem, { ILendTokenSelectorItemProps } from './LendTokenSelectorItem'
import { PreloaderChart } from '../components/PreloaderChart'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'

import { BigNumber } from '@0x/utils'
import { FulcrumProvider } from '../services/FulcrumProvider'
import '../styles/components/lend-token-selector.scss'
import { LendTransactionMinedEvent } from '../services/events/LendTransactionMinedEvent'

export interface ILendTokenSelectorProps {
  onLend: (request: LendRequest) => void
}

export interface ILendTokenSelectorState {
  interestRates: Map<Asset, ILendTokenSelectorItemProps>
}

function LendTokenSelector(props: ILendTokenSelectorProps) {
  
  let _refreshInterval: any
  const _refreshProfitTimerMillisec: number = 1000 * 60 * 10
  const assets = FulcrumProvider.Instance.lendAssetsShown
  const [interestRates, setInterestRates] = React.useState(
    new Map<Asset, ILendTokenSelectorItemProps>()
  )
  const [tokenItems, setTokenItems] = React.useState<Array<typeof LendTokenSelectorItem>>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [retry, setRetry] = React.useState(false)
  let isMounted: boolean = false
  React.useEffect(() => {
    isMounted = true
    _refreshInterval = window.setInterval(derivedUpdate, _refreshProfitTimerMillisec)

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, derivedUpdate)

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.LendTransactionMined,
      derivedUpdate
    )
    setReadonlyInterestRates()

    return () => {
      isMounted = false
      
      window.clearInterval(_refreshInterval)
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.ProviderChanged,
        derivedUpdate
      )
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.LendTransactionMined,
        derivedUpdate
      )
    }
  }, [])

  React.useEffect(() => {
    if (retry) {
      derivedUpdate()
    }
  }, [interestRates])
  React.useEffect(() => {
    if (retry && interestRates.size > 0) {
      derivedUpdate()
    }
  }, [retry])

  const onLendTransactionMined = async (event: LendTransactionMinedEvent) => {
    const newInterestRates = new Map<Asset, ILendTokenSelectorItemProps>(interestRates)
    const asset = event.asset
    const [profit, balance] = await FulcrumProvider.Instance.getLendProfit(asset)

    newInterestRates.set(asset, {
      profit: profit,
      balanceOfUser: balance,
      asset,
      onLend: props.onLend,
      interestRate: new BigNumber(newInterestRates.get(asset)?.interestRate || 0)
    } as ILendTokenSelectorItemProps)
    setInterestRates(newInterestRates)
  }

  const setReadonlyInterestRates = async () => {
    setIsLoading(true)
    fetch('https://api.bzx.network/v1/supply-rate-apr')
      .then((resp) => resp.json())
      .then(async (resp) => {
        if (!resp.success) {
          isMounted && setIsLoading(false)
          return
        }
        const newInterestRates = new Map<Asset, ILendTokenSelectorItemProps>()
        for (const i in assets) {
          if (!assets[i]) {
            continue
          }
          const asset = assets[i]
          const interestRate = resp.data[asset.toLowerCase()]
          newInterestRates.set(asset, {
            profit: new BigNumber(0),
            balanceOfUser: new BigNumber(0),
            asset,
            onLend: props.onLend,
            interestRate: new BigNumber(interestRate || 0)
          } as ILendTokenSelectorItemProps)
        }
        setInterestRates(newInterestRates)
        setIsLoading(false)
      })
      .catch((e) => {
        console.error(e)
        isMounted && setIsLoading(false)
      })
  }

  const derivedUpdate = async () => {
    if (interestRates.size === 0) {
      setRetry(true)
      return
    } else {
      setRetry(false)
    }
    const newInterestRates = new Map<Asset, ILendTokenSelectorItemProps>(interestRates)
    for (const token in assets) {
      if (!assets[token]) {
        continue
      }
      const asset = assets[token]
      const [profit, balance] = await FulcrumProvider.Instance.getLendProfit(asset)
      const currentInterestRates = newInterestRates.get(asset)
      if (
        !currentInterestRates ||
        (currentInterestRates.profit.eq(profit) && currentInterestRates.balanceOfUser.eq(balance))
      ) {
        continue
      }

      newInterestRates.set(asset, {
        profit,
        balanceOfUser: balance,
        asset,
        onLend: props.onLend,
        interestRate: new BigNumber(currentInterestRates.interestRate || 0)
      } as ILendTokenSelectorItemProps)
      setInterestRates(new Map<Asset, ILendTokenSelectorItemProps>(newInterestRates))
    }
  }
  const getTokenItems = assets.map(
    (e: Asset) =>
      interestRates.get(e) !== undefined && (
        <LendTokenSelectorItem key={e} {...interestRates.get(e)!} />
      )
  )

  return isLoading ? (
    <PreloaderChart quantityDots={4} sizeDots={'middle'} title={'Loading'} isOverlay={false} />
  ) : (
    <div className="lend-token-selector">{getTokenItems}</div>
  )
}

export default React.memo(LendTokenSelector)
