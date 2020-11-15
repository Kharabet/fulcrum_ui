import React, { useEffect, useState } from 'react'
import { PreloaderChart } from '../components/PreloaderChart'
import { Asset } from '../domain/Asset'
import { LendRequest } from '../domain/LendRequest'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import LendTokenSelectorItem, { ILendTokenSelectorItemProps } from './LendTokenSelectorItem'

import { BigNumber } from '@0x/utils'
import { FulcrumProvider } from '../services/FulcrumProvider'
import '../styles/components/lend-token-selector.scss'

export interface ILendTokenSelectorProps {
  onLend: (request: LendRequest) => void
}

export interface ILendTokenSelectorState {
  lendTokenItemProps: Map<Asset, ILendTokenSelectorItemProps>
}

function LendTokenSelector(props: ILendTokenSelectorProps) {
  let _refreshInterval: any
  const _refreshProfitTimerMillisec: number = 1000 * 60 * 10
  const assets = FulcrumProvider.Instance.lendAssetsShown
  const [lendTokenItemProps, setInterestRates] = useState(
    new Map<Asset, ILendTokenSelectorItemProps>()
  )
  const [isLoading, setIsLoading] = useState(false)
  const [retry, setRetry] = useState(false)
  useEffect(() => {
    _refreshInterval = window.setInterval(derivedUpdate, _refreshProfitTimerMillisec)

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, derivedUpdate)

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.LendTransactionMined,
      derivedUpdate
    )
    setReadonlyInterestRates()
    derivedUpdate()
    return () => {
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

  useEffect(() => {
    if (retry) {
      derivedUpdate()
    }
  }, [lendTokenItemProps])
  useEffect(() => {
    if (retry && lendTokenItemProps.size > 0) {
      derivedUpdate()
    }
  }, [retry])

  const setReadonlyInterestRates = async () => {
    setIsLoading(true)
    const resp = await (await fetch('https://api.bzx.network/v1/supply-rate-apr')).json()
    if (!resp.success) {
      setIsLoading(false)
      return
    }
    const newLendTokenItemProps = new Map<Asset, ILendTokenSelectorItemProps>()
    for (const i in assets) {
      if (!assets[i]) {
        continue
      }
      const asset = assets[i]
      const interestRate = resp.data[asset.toLowerCase()]
      newLendTokenItemProps.set(asset, {
        profit: new BigNumber(0),
        balanceOfUser: new BigNumber(0),
        asset,
        onLend: props.onLend,
        interestRate: new BigNumber(interestRate || 0),
        isLoading: false
      } as ILendTokenSelectorItemProps)
    }
    setInterestRates(newLendTokenItemProps)
    setIsLoading(false)
  }

  const derivedUpdate = async () => {
    if (lendTokenItemProps.size === 0) {
      setRetry(true)
      return
    } else {
      setRetry(false)
    }
    const newLendTokenItemProps = new Map<Asset, ILendTokenSelectorItemProps>(lendTokenItemProps)
    for (const token in assets) {
      if (!assets[token] || newLendTokenItemProps.get(assets[token]) === undefined) {
        continue
      }

      const asset = assets[token]
      const currentLendTokenItemProps = newLendTokenItemProps.get(asset)!

      newLendTokenItemProps.set(asset, {
        ...currentLendTokenItemProps,
        isLoading: true
      } as ILendTokenSelectorItemProps)
      setInterestRates(new Map<Asset, ILendTokenSelectorItemProps>(newLendTokenItemProps)) // create a copy of object so re-render will happen

      const [profit, balance] = await FulcrumProvider.Instance.getLendProfit(asset)
      if (
        currentLendTokenItemProps.profit.eq(profit) &&
        currentLendTokenItemProps.balanceOfUser.eq(balance)
      ) {
        newLendTokenItemProps.set(asset, {
          ...currentLendTokenItemProps,
          isLoading: false
        } as ILendTokenSelectorItemProps)
        setInterestRates(new Map<Asset, ILendTokenSelectorItemProps>(newLendTokenItemProps))
        continue
      }

      newLendTokenItemProps.set(asset, {
        profit: profit,
        balanceOfUser: balance,
        asset: asset,
        onLend: props.onLend,
        interestRate: new BigNumber(currentLendTokenItemProps.interestRate || 0),
        isLoading: false
      } as ILendTokenSelectorItemProps)
      setInterestRates(new Map<Asset, ILendTokenSelectorItemProps>(newLendTokenItemProps))
    }
  }

  const getTokenItems = assets.map(
    (e: Asset) =>
      lendTokenItemProps.get(e) !== undefined && (
        <LendTokenSelectorItem key={e} {...lendTokenItemProps.get(e)!} />
      )
  )

  return isLoading ? (
    <PreloaderChart quantityDots={4} sizeDots={'middle'} title={'Loading'} isOverlay={false} />
  ) : (
    <div className="lend-token-selector">{getTokenItems}</div>
  )
}

export default React.memo(LendTokenSelector)
