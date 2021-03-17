import '../styles/components/lend-token-selector.scss'
import { BigNumber } from '@0x/utils'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { LendRequest } from '../domain/LendRequest'
import { PreloaderChart } from '../components/PreloaderChart'
import appConfig from 'bzx-common/src/config/appConfig'
import Asset from 'bzx-common/src/assets/Asset'
import LendTokenSelectorItem, { ILendTokenSelectorItemProps } from './LendTokenSelectorItem'
import React, { useEffect, useState } from 'react'

export interface ILendTokenSelectorProps {
  onLend: (request: LendRequest) => void
}

export interface ILendTokenSelectorState {
  lendTokenItemProps: Map<Asset, ILendTokenSelectorItemProps>
}

function LendTokenSelector(props: ILendTokenSelectorProps) {
  let _refreshInterval: any
  const apiUrl = 'https://api.bzx.network/v1'
  const _refreshProfitTimerMillisec: number = 1000 * 60 * 5
  const assets = FulcrumProvider.Instance.lendAssetsShown
  const [lendTokenItemProps, setLendTokenItemProps] = useState(
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

    let aprs = { data: {}, success: false }
    let liquidities = { data: {}, success: false }
    // TODO: add API endpoints for bsc
    if (appConfig.isBsc) {
      setIsLoading(false)
      return
    }
    aprs = await (await fetch(`${apiUrl}/supply-rate-apr`)).json()
    liquidities = await (await fetch(`${apiUrl}/liquidity`)).json()

    if (!aprs.success || !liquidities.success) {
      setIsLoading(false)
      return
    }

    const newLendTokenItemProps = new Map<Asset, ILendTokenSelectorItemProps>()
    for (const i in assets) {
      if (!assets[i]) {
        continue
      }
      const asset = assets[i]
      // @ts-ignore
      const interestRate = aprs.data[asset.toLowerCase()]
      // @ts-ignore
      const liquidity = liquidities.data[asset.toLowerCase()]
      newLendTokenItemProps.set(asset, {
        profit: new BigNumber(0),
        balanceOfUser: new BigNumber(0),
        asset,
        onLend: props.onLend,
        interestRate: new BigNumber(interestRate || 0),
        liquidity: new BigNumber(liquidity || 0),
        isLoading: false,
      } as ILendTokenSelectorItemProps)
    }
    setLendTokenItemProps(newLendTokenItemProps)
    setIsLoading(false)
  }

  const derivedUpdate = async () => {
    if (lendTokenItemProps.size === 0 && process.env.REACT_APP_ETH_NETWORK !== 'bsc') {
      setRetry(true)
      return
    } else {
      setRetry(false)
    }

    let aprs = { data: {}, success: false }
    let liquidities = { data: {}, success: false }
    if (appConfig.isBsc) {
      const assetsAPRs = await Promise.all(
        assets.map((asset) => FulcrumProvider.Instance.getLendTokenInterestRate(asset))
      )
      const assetsLiquidities = await Promise.all(
        assets.map((asset) => FulcrumProvider.Instance.getAvailableLiquidity(asset))
      )
      assets.forEach((asset, i) => {
        // @ts-ignore
        aprs.data[asset.toLowerCase()] = assetsAPRs[i]
        // @ts-ignore
        liquidities.data[asset.toLowerCase()] = assetsLiquidities[i]
      })
      // @ts-ignore
      aprs.success = true
      // @ts-ignore
      liquidities.success = true
    }
    const newLendTokenItemProps = new Map<Asset, ILendTokenSelectorItemProps>(lendTokenItemProps)
    for (const token in assets) {
      if (!assets[token]) {
        continue
      }

      const asset = assets[token]
      let currentLendTokenItemProps = undefined
      if (process.env.REACT_APP_ETH_NETWORK !== 'bsc') {
        currentLendTokenItemProps = newLendTokenItemProps.get(asset)!
      } else {
        // @ts-ignore
        const interestRate = aprs.data[asset.toLowerCase()]
        // @ts-ignore
        const liquidity = liquidities.data[asset.toLowerCase()]

        currentLendTokenItemProps = {
          profit: new BigNumber(0),
          balanceOfUser: new BigNumber(0),
          asset,
          onLend: props.onLend,
          interestRate: new BigNumber(interestRate || 0),
          liquidity: new BigNumber(liquidity || 0),
          isLoading: false,
        } as ILendTokenSelectorItemProps
      }

      newLendTokenItemProps.set(asset, {
        ...currentLendTokenItemProps,
        isLoading: true,
      } as ILendTokenSelectorItemProps)
      setLendTokenItemProps(new Map<Asset, ILendTokenSelectorItemProps>(newLendTokenItemProps)) // create a copy of object so re-render will happen

      const [profit, balance] = await FulcrumProvider.Instance.getLendProfit(asset)
      if (
        currentLendTokenItemProps.profit.eq(profit) &&
        currentLendTokenItemProps.balanceOfUser.eq(balance)
      ) {
        newLendTokenItemProps.set(asset, {
          ...currentLendTokenItemProps,
          isLoading: false,
        } as ILendTokenSelectorItemProps)
        setLendTokenItemProps(new Map<Asset, ILendTokenSelectorItemProps>(newLendTokenItemProps))
        continue
      }

      newLendTokenItemProps.set(asset, {
        profit: profit,
        balanceOfUser: balance,
        asset: asset,
        onLend: props.onLend,
        interestRate: new BigNumber(currentLendTokenItemProps.interestRate || 0),
        liquidity: new BigNumber(currentLendTokenItemProps.liquidity || 0),
        isLoading: false,
      } as ILendTokenSelectorItemProps)
      setLendTokenItemProps(new Map<Asset, ILendTokenSelectorItemProps>(newLendTokenItemProps))
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
