import { BigNumber } from '@0x/utils'
import React, { useEffect, useState } from 'react'
import { Asset } from '../domain/Asset'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { CircleLoader } from './CircleLoader'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { LendRequest } from '../domain/LendRequest'
import { LendTxLoaderStep } from './LendTxLoaderStep'
import { LendType } from '../domain/LendType'
import { TasksQueue } from '../services/TasksQueue'
import { RequestTask } from '../domain/RequestTask'
import { RequestStatus } from '../domain/RequestStatus'
import { ProfitTicker } from './ProfitTicker'

export interface ILendTokenSelectorItemProps {
  asset: Asset
  profit: BigNumber
  balanceOfUser: BigNumber
  interestRate: BigNumber
  onLend: (request: LendRequest) => void
  isLoading?: boolean
}

function LendTokenSelectorItem(props: ILendTokenSelectorItemProps) {
  const [isLoadingTransaction, setIsLoadingTransaction] = useState<boolean>(false)
  const [request, setRequest] = useState<LendRequest | undefined>(undefined)

  const assetDetails = AssetsDictionary.assets.get(props.asset)

  const tickerSecondDiff = props.balanceOfUser
    .times(props.interestRate)
    .dividedBy(100 * 365 * 24 * 60 * 60)
  const iTokenAddress =
    (FulcrumProvider.Instance.contractsSource &&
      FulcrumProvider.Instance.contractsSource.getITokenErc20Address(props.asset)) ||
    ''

  let _isMounted: any

  useEffect(() => {
    _isMounted = true

    const task = TasksQueue.Instance.getTasksList().find(
      (t) => t.request instanceof LendRequest && t.request.asset === props.asset
    )

    setIsLoadingTransaction(task && !task.error ? true : false)
    setRequest(task ? (task.request as LendRequest) : undefined)

    return () => {
      _isMounted = false
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.AskToOpenProgressDlg,
        onAskToOpenProgressDlg
      )
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.AskToCloseProgressDlg,
        onAskToCloseProgressDlg
      )
    }
  }, [])

  useEffect(() => {
    if (request) {
      FulcrumProvider.Instance.eventEmitter.on(
        FulcrumProviderEvents.AskToOpenProgressDlg,
        onAskToOpenProgressDlg
      )
      FulcrumProvider.Instance.eventEmitter.on(
        FulcrumProviderEvents.AskToCloseProgressDlg,
        onAskToCloseProgressDlg
      )
    } else {
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.AskToOpenProgressDlg,
        onAskToOpenProgressDlg
      )
      FulcrumProvider.Instance.eventEmitter.off(
        FulcrumProviderEvents.AskToCloseProgressDlg,
        onAskToCloseProgressDlg
      )
    }
  }, [request])

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

  const renderActions = (isLendOnly: boolean) => {
    return isLendOnly ? (
      <div className="token-selector-item__actions">
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

  const onLendClick = () => {
    const lendRequest = new LendRequest(LendType.LEND, props.asset, new BigNumber(0))
    setRequest(lendRequest)
    props.onLend(lendRequest)
  }

  const onUnLendClick = () => {
    const unLendRequest = new LendRequest(LendType.UNLEND, props.asset, new BigNumber(0))
    setRequest(unLendRequest)
    props.onLend(unLendRequest)
  }

  if (!assetDetails) {
    return null
  }

  return (
    <div
      className={`token-selector-item ${
        props.balanceOfUser.eq(0) ? '' : 'token-selector-item_active'
      } ${isLoadingTransaction ? 'loading-transaction' : ''}`}>
      <div className="token-selector-item__image">
        {props.isLoading || isLoadingTransaction ? (
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
            style={{ marginTop: props.profit.eq(0) ? `1.5rem` : undefined }}>
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
                  {props.interestRate.toFixed(4)}
                  <span className="sign-currency">%</span>
                </div>
              </div>
              {props.balanceOfUser.gt(0) ? (
                <React.Fragment>
                  <div className="token-selector-item__profit-container token-selector-item__balance-container">
                    <div className="token-selector-item__profit-title token-selector-item__profit-balance">
                      Balance:
                    </div>
                    <div
                      title={`${props.balanceOfUser.toFixed(18)} ${props.asset}`}
                      className="token-selector-item__profit-value token-selector-item__balance-value">
                      {props.balanceOfUser.toFixed(2)}
                    </div>
                  </div>
                  <div className="token-selector-item__profit-container">
                    <div className="token-selector-item__profit-title">Profit:</div>
                    <ProfitTicker
                      asset={props.asset}
                      secondDiff={tickerSecondDiff}
                      profit={props.profit}
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
          {renderActions(props.balanceOfUser.eq(0))}
        </React.Fragment>
      )}
    </div>
  )
}

export default React.memo(LendTokenSelectorItem)
