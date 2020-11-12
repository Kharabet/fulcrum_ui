import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { LendRequest } from '../domain/LendRequest'
import { LendType } from '../domain/LendType'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { LendTransactionMinedEvent } from '../services/events/LendTransactionMinedEvent'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { TasksQueue } from '../services/TasksQueue'
import { ProfitTicker } from './ProfitTicker'
import { Preloader } from './Preloader'
import { CircleLoader } from './CircleLoader'
import { RequestTask } from '../domain/RequestTask'
import { RequestStatus } from '../domain/RequestStatus'
import { LendTxLoaderStep } from './LendTxLoaderStep'

export interface ILendTokenSelectorItemProps {
  asset: Asset
  interestRate?: BigNumber
  onLend: (request: LendRequest) => void
}

function LendTokenSelectorItem(props: ILendTokenSelectorItemProps) {
  const [profit, setProfit] = React.useState<BigNumber>(new BigNumber(0))
  const [balanceOfUser, setBalanceOfUser] = React.useState<BigNumber>(new BigNumber(0))
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTransaction, setIsLoadingTransaction] = React.useState<boolean>(false)
  const [request, setRequest] = React.useState<LendRequest | undefined>(undefined)

  const assetDetails = AssetsDictionary.assets.get(props.asset)

  const tickerSecondDiff =
    (balanceOfUser &&
      props.interestRate &&
      balanceOfUser.times(props.interestRate).dividedBy(100 * 365 * 24 * 60 * 60)) ||
    new BigNumber(0)
  const iTokenAddress =
    (FulcrumProvider.Instance.contractsSource &&
      FulcrumProvider.Instance.contractsSource.getITokenErc20Address(props.asset)) ||
    ''
  let _refreshInterval: any
  const _refreshProfitTimerMillisec: number = 1000 * 60 * 10
  let _isMounted: any

  React.useEffect(() => {
    _isMounted = true
    // FulcrumProvider.Instance.eventEmitter.on(
    //   FulcrumProviderEvents.ProviderAvailable,
    //   onProviderAvailable
    // )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      onProviderChanged
    )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.AskToOpenProgressDlg,
      onAskToOpenProgressDlg
    )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.AskToCloseProgressDlg,
      onAskToCloseProgressDlg
    )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.LendTransactionMined,
      onLendTransactionMined
    )

    const task = TasksQueue.Instance.getTasksList().find(
      (t) => t.request instanceof LendRequest && t.request.asset === props.asset
    )

    setIsLoadingTransaction(task && !task.error ? true : false)
    setRequest(task ? (task.request as LendRequest) : undefined)
    derivedUpdate()
    _refreshInterval = window.setInterval(derivedUpdate, _refreshProfitTimerMillisec)

    return () => {
      _isMounted = false
      window.clearInterval(_refreshInterval)
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.ProviderAvailable,
        onProviderAvailable
      )
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.ProviderChanged,
        onProviderChanged
      )
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.AskToOpenProgressDlg,
        onAskToOpenProgressDlg
      )
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.AskToCloseProgressDlg,
        onAskToCloseProgressDlg
      )
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.LendTransactionMined,
        onLendTransactionMined
      )
    }
  }, [])

  const derivedUpdate = () => {
    _isMounted && setIsLoading(true)
    console.log('derivedUpdate')

    // setTimeout(()=>{
    // console.log('setTimeout')

    //   setBalanceOfUser(new BigNumber(10))
    //   setProfit(new BigNumber(10))
    //   setIsLoading(false)
    // }, 10000)
    FulcrumProvider.Instance.getLendProfit(props.asset).then(([profit, balance]) => {
    console.log('getLendProfit')
      
      if (_isMounted) {
        setBalanceOfUser(balance)
        setProfit(profit && profit.lt(0) ? new BigNumber(0) : profit)
      }
      setIsLoading(false)
    }).catch((e) => {
      
      setIsLoading(false)
      console.log(e)
    })
  }

  const onProviderAvailable =  () => {
    derivedUpdate()
  }

  const onProviderChanged =  (event: ProviderChangedEvent) => {
    console.log("onProviderChanged")
    derivedUpdate()
  }

  const onAskToOpenProgressDlg = (taskId: number) => {
    if (!request || taskId !== request.id) return
    setIsLoadingTransaction(true)
  }
  const onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!request || task.request.id !== request.id) return
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task)
        setIsLoadingTransaction(false)
        setRequest(undefined)
      }, 5000)
      return
    }
    setIsLoadingTransaction(false)
    setRequest(undefined)
  }

  const onLendTransactionMined =  (event: LendTransactionMinedEvent) => {
    if (event.asset === props.asset) {
      derivedUpdate()
    }
  }

  const renderActions = (isLendOnly: boolean) => {
    return isLendOnly ? (
      <div className="token-selector-item__actions" style={{ marginTop: `-1.5rem` }}>
        <button
          className="token-selector-item__lend-button token-selector-item__lend-button--size-full"
          onClick={onLendClick}
          disabled={props.asset === Asset.SAI || props.asset === Asset.LEND}>
          Lend
        </button>
      </div>
    ) : (
      <div className="token-selector-item__actions">
        <button
          className="token-selector-item__lend-button token-selector-item__lend-button--size-half"
          onClick={onLendClick}
          disabled={props.asset === Asset.SAI || props.asset === Asset.LEND}>
          Lend
        </button>
        <button
          className="token-selector-item__un-lend-button token-selector-item__lend-button--size-half"
          onClick={onUnLendClick}>
          UnLend
        </button>
      </div>
    )
  }

  const onLendClick =  () => {
    const lendRequest = new LendRequest(LendType.LEND, props.asset, new BigNumber(0))
    setRequest(lendRequest)
    props.onLend(lendRequest)
  }

  const onUnLendClick =  () => {
    const unLendRequest = new LendRequest(LendType.UNLEND, props.asset, new BigNumber(0))
    setRequest(unLendRequest)
    props.onLend(unLendRequest)
  }

  if (!assetDetails) {
    return null
  }
  return (
    <div
      className={`token-selector-item ${balanceOfUser.eq(0) ? '' : 'token-selector-item_active'} ${
        isLoadingTransaction ? 'loading-transaction' : ''
      }`}>
      <div className="token-selector-item__image">
        {isLoadingTransaction ? (
          <CircleLoader>{assetDetails.reactLogoSvg.render()}</CircleLoader>
        ) : (
          assetDetails.reactLogoSvg.render()
        )}
      </div>

      {isLoadingTransaction && request ? (
        <LendTxLoaderStep taskId={request.id} />
      ) : (
        <React.Fragment>
          <div
            className="token-selector-item__descriptions"
            style={{ marginTop: profit === null ? `1.5rem` : undefined }}>
            <div className="token-selector-item__description">
              {iTokenAddress &&
              FulcrumProvider.Instance.web3ProviderSettings &&
              FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                <div className="token-selector-item__name">
                  <a
                    className="token-selector-item__name"
                    style={{ cursor: `pointer`, textDecoration: `none` }}
                    title={iTokenAddress}
                    href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${iTokenAddress}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {assetDetails.displayName}
                  </a>
                </div>
              ) : (
                <div className="token-selector-item__name">{assetDetails.displayName}</div>
              )}

              <div className="token-selector-item__interest-rate-container">
                <div className="token-selector-item__interest-rate-title">Interest APR:</div>
                <div
                  title={`${props.interestRate && props.interestRate.toFixed(18)}%`}
                  className="token-selector-item__interest-rate-value">
                  {!isLoading && props.interestRate ? (
                    <React.Fragment>
                      {props.interestRate.toFixed(4)}
                      <span className="sign-currency">%</span>
                    </React.Fragment>
                  ) : (
                    <div className="token-selector-item__interest-rate-value">
                      <Preloader width="74px" />
                    </div>
                  )}
                </div>
              </div>
              {balanceOfUser.gt(0) ? (
                <React.Fragment>
                  {profit !== null ? (
                    <div className="token-selector-item__profit-container token-selector-item__balance-container">
                      <div className="token-selector-item__profit-title token-selector-item__profit-balance">
                        Balance:
                      </div>
                      {!isLoading ? (
                        <div
                          title={`${balanceOfUser.toFixed(18)} ${props.asset}`}
                          className="token-selector-item__profit-value token-selector-item__balance-value">
                          {balanceOfUser.toFixed(2)}
                        </div>
                      ) : (
                        <div className="token-selector-item__interest-rate-value">
                          <Preloader width="74px" />
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div className="token-selector-item__profit-container">
                    <div className="token-selector-item__profit-title">Profit:</div>
                    <ProfitTicker
                      asset={props.asset}
                      secondDiff={tickerSecondDiff}
                      profit={profit}
                    />
                  </div>
                </React.Fragment>
              ) : (
                <div className="token-selector-item__description">
                  <div className="token-selector-item__interest-rate-container">
                    <div className="token-selector-item__interest-rate-title" />
                    <div className="token-selector-item__interest-rate-value" />
                  </div>
                </div>
              )}
            </div>
          </div>
          {renderActions(balanceOfUser.eq(0))}
        </React.Fragment>
      )}
    </div>
  )
}

export default React.memo(LendTokenSelectorItem)
