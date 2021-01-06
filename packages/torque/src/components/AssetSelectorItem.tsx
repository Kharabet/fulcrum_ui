import { BigNumber } from '@0x/utils'
import React, { useEffect, useState } from 'react'
import { ReactComponent as ArrowRight } from '../assets/images/ic_arrow_right.svg'
import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { BorrowRequest } from '../domain/BorrowRequest'
import { ProviderType } from '../domain/ProviderType'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import { NavService } from '../services/NavService'
import { TasksQueue } from '../services/TasksQueue'
import { TorqueProvider } from '../services/TorqueProvider'
import { BorrowDlg } from './BorrowDlg'
import { TxProcessingLoader } from './TxProcessingLoader'

export interface IAssetSelectorItemProps {
  asset: Asset
  interestRate: BigNumber
  liquidity: BigNumber
  borrowDlgRef: React.RefObject<BorrowDlg>
  doNetworkConnect: () => void
}

const AssetSelectorItem = (props: IAssetSelectorItemProps) => {
  const [isLoadingTransaction, setLoadingTransaction] = useState<boolean>(false)
  const [request, setRequest] = useState<BorrowRequest | undefined>(undefined)

  useEffect(() => {
    function onAskToOpenProgressDlg(taskId: number) {
      if (!request || taskId !== request.id) return
      setLoadingTransaction(true)
    }

    function onAskToCloseProgressDlg(task: RequestTask) {
      if (!request || task.request.id !== request.id) return
      if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
        window.setTimeout(async () => {
          await TorqueProvider.Instance.onTaskCancel(task)
          setLoadingTransaction(false)
          setRequest(undefined)
        }, 5000)
        return
      }
      setLoadingTransaction(false)
      setRequest(undefined)
      NavService.Instance.History.push('/dashboard')
    }
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.AskToOpenProgressDlg,
      onAskToOpenProgressDlg
    )
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.AskToCloseProgressDlg,
      onAskToCloseProgressDlg
    )

    return () => {
      TorqueProvider.Instance.eventEmitter.off(
        TorqueProviderEvents.AskToOpenProgressDlg,
        onAskToOpenProgressDlg
      )
      TorqueProvider.Instance.eventEmitter.off(
        TorqueProviderEvents.AskToCloseProgressDlg,
        onAskToCloseProgressDlg
      )
    }
  })

  useEffect(() => {
    const task = TasksQueue.Instance.getTasksList().find(
      (t) =>
        t.request instanceof BorrowRequest &&
        t.request.borrowAsset === props.asset &&
        t.request.loanId === '0x0000000000000000000000000000000000000000000000000000000000000000'
    )
    setLoadingTransaction(task && !task.error ? true : false)
    setRequest(task ? (task.request as BorrowRequest) : undefined)
  })

  const onClick = async () => {
    if (!props.borrowDlgRef.current) return
    if (
      TorqueProvider.Instance.providerType === ProviderType.None ||
      !TorqueProvider.Instance.contractsSource ||
      !TorqueProvider.Instance.contractsSource.canWrite
    ) {
      props.doNetworkConnect()
      return
    }
    try {
      const borrowRequest = await props.borrowDlgRef.current.getValue(props.asset)
      setRequest(borrowRequest)
      await TorqueProvider.Instance.onDoBorrow(borrowRequest)
    } catch (error) {
      // tslint:disable-next-line: no-console
      if (error.message !== 'Form closed') console.error(error)
    }
  }

  function formatLiquidity(value: BigNumber): string {
    if (value.lt(1000)) return value.toFixed(2)
    if (value.lt(10 ** 6)) return `${Number(value.dividedBy(1000).toFixed(2)).toString()}k`
    if (value.lt(10 ** 9)) return `${Number(value.dividedBy(10 ** 6).toFixed(2)).toString()}m`
    return `${Number(value.dividedBy(10 ** 9).toFixed(2)).toString()}b`
  }

  const asset = AssetsDictionary.assets.get(props.asset) as AssetDetails
  return (
    <div className="asset-selector-item">
      {isLoadingTransaction && request && (
        <TxProcessingLoader
          quantityDots={3}
          sizeDots={'small'}
          isOverlay={true}
          taskId={request.id}
        />
      )}
      <div className="asset-selector-item-content" onClick={onClick}>
        <div className="asset-selector-body">
          <div className="asset-selector-row">
            <div className="asset-selector__interest-rate">
              <span className="asset-selector__interest-rate-value">
                {props.interestRate.gt(0) ? `${props.interestRate.toFixed(2)}` : `0`}
              </span>
              %
            </div>
          </div>
          <div className="asset-selector-row">
            <div className="asset-selector__apr">APR</div>
            <div className="asset-selector__fixed">FIXED</div>
          </div>
          <div className="asset-selector-row">
            <div className="asset-selector__apr">Liquidity</div>
            <div className="asset-selector__fixed" title={props.liquidity.toFixed()}>
              {formatLiquidity(props.liquidity)}
            </div>
          </div>
        </div>
        <div className="asset-selector-footer">
          <div className="asset-selector__title">{props.asset}</div>
          <div className="asset-selector__icon">{asset.reactLogoSvg.render()}</div>
          <div className="asset-selector__arrow">
            <ArrowRight />
          </div>
        </div>
      </div>
      <div className="asset-selector-item-bg" style={{ backgroundColor: asset.bgLightColor }} />
    </div>
  )
}

export default React.memo(AssetSelectorItem)
