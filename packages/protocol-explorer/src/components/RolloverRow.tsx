import React, { useState, useEffect } from 'react'
import { BigNumber } from '@0x/utils'
import { Asset } from '../domain/Asset'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { AssetDetails } from '../domain/AssetDetails'
import { ExplorerProvider } from '../services/ExplorerProvider'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { RequestTask } from '../domain/RequestTask'
import { RequestStatus } from '../domain/RequestStatus'
import { RolloverRequest } from '../domain/RolloverRequest'
import { CircleLoader } from './CircleLoader'
import { TxLoaderStep } from './TxLoaderStep'
import { TasksQueue } from '../services/TasksQueue'

export interface IRolloverRowProps {
  loanId: string
  rebateAsset: Asset
  gasRebate: BigNumber
  onRolloverUpdated: () => void
  doNetworkConnect: () => void
}

export interface IRolloverRow {
  isLoadingTransaction: boolean
}

export const RolloverRow = (props: IRolloverRowProps) => {
    const rebateToken = AssetsDictionary.assets.get(props.rebateAsset) as AssetDetails

  const [isLoadingTransaction, setLoadingTransaction] = useState(false)
  const [rolloverRequest, setRequest] = useState<RolloverRequest>()

  useEffect(() => {
    async function loadData() {
      const task =TasksQueue.Instance.getTasksList().find(
        (t: RequestTask) => t.request instanceof RolloverRequest && t.request.loanId === props.loanId
      )
      setLoadingTransaction(task && !task.error ? true : false)
      setRequest(task && task.request instanceof RolloverRequest ? task.request : undefined)
    }
    loadData()

    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.AskToOpenProgressDlg,
      onAskToOpenProgressDlg
    )
    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.AskToCloseProgressDlg,
      onAskToCloseProgressDlg
    )

    return () => {
      ExplorerProvider.Instance.eventEmitter.off(
        ExplorerProviderEvents.AskToOpenProgressDlg,
        onAskToOpenProgressDlg
      )
      ExplorerProvider.Instance.eventEmitter.off(
        ExplorerProviderEvents.AskToCloseProgressDlg,
        onAskToCloseProgressDlg
      )
    }
  })

  const onRolloverClick = async () => {
    const provider = ExplorerProvider.getLocalstorageItem('providerType')

    if (
      !provider ||
      provider === 'None' ||
      !ExplorerProvider.Instance.contractsSource ||
      !ExplorerProvider.Instance.contractsSource.canWrite
    ) {
      props.doNetworkConnect()
      return
    }

    setLoadingTransaction(true)
    const loanId = props.loanId

    const request = new RolloverRequest(loanId)

    console.log(request)
    changeLoadingTransaction(true, request)
    await ExplorerProvider.Instance.onRolloverConfirmed(request)
  }

  const getShortHash = (hash: string, count: number) => {
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - count)
  }

  const changeLoadingTransaction = (
    isLoadingTransaction: boolean,
    request: RolloverRequest | undefined
  ) => {
    setLoadingTransaction(isLoadingTransaction)
    setRequest(request)
  }

  const onAskToOpenProgressDlg = async (taskId: string) => {
    if (!rolloverRequest || taskId !== rolloverRequest.loanId) return
    changeLoadingTransaction(true, rolloverRequest)
  }

  const onAskToCloseProgressDlg = async (task: RequestTask) => {
    if (!rolloverRequest || task.request.loanId !== rolloverRequest.loanId) return

    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        ExplorerProvider.Instance.onTaskCancel(task)
        changeLoadingTransaction(false, undefined)
      }, 5000)
      return
    }

    props.onRolloverUpdated()
    changeLoadingTransaction(false, undefined)
  }

  return (
    <React.Fragment>
      {isLoadingTransaction ? (
        <div className="table-row__image">
          <TxLoaderStep taskId={props.loanId} />
          <CircleLoader></CircleLoader>
        </div>
      ) : (
        <div className="table-row table-row-loan">
          <div title={props.loanId} className="table-row-loan__id">
            {getShortHash(props.loanId, 45)}
          </div>
          <div className="table-row-loan__amount">
            {rebateToken.logoSvg.render()}
          </div>
          <div title={props.gasRebate.toFixed()} className="table-row-loan__collateral">
            {props.gasRebate.toFixed(2)}
          </div>
          <div className="table-row-loan__action">
            <button className="action" onClick={onRolloverClick}>
              Rollover
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
