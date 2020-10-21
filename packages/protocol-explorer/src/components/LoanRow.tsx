import React, { useState, useEffect } from 'react'
import { BigNumber } from '@0x/utils'
import { Asset } from '../domain/Asset'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { AssetDetails } from '../domain/AssetDetails'
import { ExplorerProvider } from '../services/ExplorerProvider'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { RequestTask } from '../domain/RequestTask'
import { RequestStatus } from '../domain/RequestStatus'
import { LiquidationRequest } from '../domain/LiquidationRequest'
import { CircleLoader } from './CircleLoader'
import { TxLoaderStep } from './TxLoaderStep'
import { TasksQueue } from '../services/TasksQueue'

export interface ILoanRowProps {
  loanId: string
  payOffAmount: BigNumber
  seizeAmount: BigNumber
  loanToken: Asset
  collateralToken: Asset
  onLiquidationUpdated: () => void
}

export interface ILoanRow {
  isLoadingTransaction: boolean
}

export const LoanRow = (props: ILoanRowProps) => {
  const loanToken = AssetsDictionary.assets.get(props.loanToken) as AssetDetails
  const collateralToken = AssetsDictionary.assets.get(props.collateralToken) as AssetDetails

  const [isLoadingTransaction, setLoadingTransaction] = useState(false)
  const [liquidationRequest, setRequest] = useState<LiquidationRequest>()

  useEffect(() => {
    async function loadData() {
      const task = await TasksQueue.Instance.getTasksList().find(
        (t) => t.request.loanId === props.loanId
      )
      setLoadingTransaction(task && !task.error ? true : false)
      setRequest(task ? task.request : undefined)
    }
    loadData()

    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderAvailable,
      onProviderAvailable
    )
    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderChanged,
      onProviderChanged
    )
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
        ExplorerProviderEvents.ProviderAvailable,
        onProviderAvailable
      )
      ExplorerProvider.Instance.eventEmitter.off(
        ExplorerProviderEvents.ProviderChanged,
        onProviderChanged
      )
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

  const onLiquidateClick = async () => {
    setLoadingTransaction(true)
    const loanId = props.loanId
    const decimals: number = AssetsDictionary.assets.get(props.loanToken)!.decimals || 18

    const amountInBaseUnits = new BigNumber(
      props.payOffAmount.multipliedBy(10 ** decimals).toFixed(0, 1)
    )
    const request = new LiquidationRequest(
      loanId || '0x0000000000000000000000000000000000000000000000000000000000000000',
      props.loanToken,
      amountInBaseUnits
    )

    console.log(request)
    changeLoadingTransaction(true, request)
    await ExplorerProvider.Instance.onLiquidationConfirmed(request)
  }

  const getShortHash = (hash: string, count: number) => {
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - count)
  }

  const changeLoadingTransaction = (
    isLoadingTransaction: boolean,
    request: LiquidationRequest | undefined
  ) => {
    setLoadingTransaction(isLoadingTransaction)
    setRequest(request)
  }

  const onProviderAvailable = () => {
    props.onLiquidationUpdated()
  }

  const onProviderChanged = () => {
    props.onLiquidationUpdated()
  }

  const onAskToOpenProgressDlg = async (taskId: string) => {
    if (!liquidationRequest || taskId !== liquidationRequest.loanId) return
    changeLoadingTransaction(true, liquidationRequest)
  }

  const onAskToCloseProgressDlg = async (task: RequestTask) => {
    if (!liquidationRequest || task.request.loanId !== liquidationRequest.loanId) return

    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        ExplorerProvider.Instance.onTaskCancel(task)
        changeLoadingTransaction(false, undefined)
      }, 5000)
      return
    }

    props.onLiquidationUpdated()
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
          <div title={props.payOffAmount.toFixed(18)} className="table-row-loan__amount">
            {loanToken.logoSvg.render()} {props.payOffAmount.toFixed(3)}
          </div>
          <div title={props.seizeAmount.toFixed(18)} className="table-row-loan__collateral">
            {collateralToken.logoSvg.render()}
            {props.seizeAmount.toFixed(3)}
          </div>
          <div className="table-row-loan__action">
            <button className="action" onClick={onLiquidateClick}>
              Liquidate
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
