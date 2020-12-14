import { BigNumber } from '@0x/utils'
import React, { useEffect, useState } from 'react'
import { ReactComponent as IconCopy } from '../assets/images/ic__copy.svg'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { RolloverRequest } from '../domain/RolloverRequest'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ExplorerProvider } from '../services/ExplorerProvider'
import { TasksQueue } from '../services/TasksQueue'
import { CircleLoader } from './CircleLoader'
import { TxLoaderStep } from './TxLoaderStep'

import Clipboard from 'clipboard'
import ReactTooltip from 'react-tooltip'

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

  const copyEl = React.useRef<HTMLSpanElement | null>(null)
  let clipboard: Clipboard | undefined
  useEffect(() => {
    async function loadData() {
      const task = TasksQueue.Instance.getTasksList().find(
        (t: RequestTask) =>
          t.request instanceof RolloverRequest && t.request.loanId === props.loanId
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
      if (clipboard) {
        clipboard.destroy()
      }
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

  const onCopyClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const loanId = e.currentTarget.dataset.id
    if (!loanId) {
      return
    }

    const tempInput = document.createElement('input')
    tempInput.style.position = 'absolute'
    tempInput.style.left = '-1000px'
    tempInput.style.top = '-1000px'
    tempInput.value = loanId
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)
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

  if (copyEl.current !== null && !clipboard) {
    clipboard = new Clipboard(copyEl.current)
    clipboard.on('success', (e) => {
      if (!copyEl.current) {
        return
      }
      copyEl.current.dataset.tip = 'Copied!'
      ReactTooltip.show(copyEl.current)
      window.setTimeout(() => ReactTooltip.hide(copyEl.current), 1000)
      e.clearSelection()
    })
    clipboard.on('error', (e) => {
      if (!copyEl.current) {
        return
      }
      copyEl.current.dataset.tip = 'Copy failed!'
      ReactTooltip.show(copyEl.current)
      window.setTimeout(() => ReactTooltip.hide(copyEl.current), 1000)
    })
  }

  return (
    <React.Fragment>
      {isLoadingTransaction ? (
        <div className="table-row__image">
          <TxLoaderStep taskId={props.loanId} />
          <CircleLoader />
        </div>
      ) : (
        <div className="table-row table-row-loan">
          <div title={props.loanId} className="table-row-loan__id">
            {getShortHash(props.loanId, 45)}&nbsp;
            <span
              className="table-row-loan__id-copy"
              ref={copyEl}
              data-clipboard-text={props.loanId}
              data-for={props.loanId}>
              <IconCopy />
            </span>
            <ReactTooltip className="tooltip__info" id={props.loanId} event="fakeEvent" />
          </div>
          <div className="table-row-loan__amount" />
          <div title={props.gasRebate.toFixed()} className="table-row-loan__collateral">
            {rebateToken.logoSvg.render()}&nbsp;{props.gasRebate.toFixed(2)}
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
