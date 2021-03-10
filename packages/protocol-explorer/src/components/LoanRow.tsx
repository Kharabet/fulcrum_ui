import { BigNumber } from '@0x/utils'
import React, { useEffect, useState } from 'react'
import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { LiquidationRequest } from '../domain/LiquidationRequest'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ExplorerProvider } from '../services/ExplorerProvider'
import { TasksQueue } from '../services/TasksQueue'
import { CircleLoader } from './CircleLoader'
import CopyToClipboard from './CopyToClipboard'
import { TxLoaderStep } from './TxLoaderStep'

export interface ILoanRowProps {
  loanId: string
  payOffAmount: BigNumber
  seizeAmount: BigNumber
  loanToken: Asset
  collateralToken: Asset
  onLiquidationUpdated: () => void
  onLiquidationRequested: (request: LiquidationRequest) => void
  doNetworkConnect: () => void
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
    const task = TasksQueue.Instance.getTasksList().find((t) => t.request.loanId === props.loanId)
    setLoadingTransaction(task && !task.error ? true : false)
    setRequest(task && task.request instanceof LiquidationRequest ? task.request : undefined)

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

  const onLiquidateClick = async () => {
    // setLoadingTransaction(true)
    const loanId = props.loanId
    const decimals: number = AssetsDictionary.assets.get(props.loanToken)!.decimals || 18

    const amountInBaseUnits = new BigNumber(
      props.payOffAmount.multipliedBy(10 ** decimals).toFixed(0, 1)
    )

    const rate = props.payOffAmount.dividedBy(props.seizeAmount)
    const request = new LiquidationRequest(
      loanId || '0x0000000000000000000000000000000000000000000000000000000000000000',
      props.loanToken,
      props.collateralToken,
      amountInBaseUnits,
      rate
    )

    props.onLiquidationRequested(request)
    changeLoadingTransaction(true, request)
    // await ExplorerProvider.Instance.onLiquidationConfirmed(request)
  }

  const getShortHash = (hash: string, count: number) => {
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - count)
  }

  const changeLoadingTransaction = (
    isLoading: boolean,
    request: LiquidationRequest | undefined
  ) => {
    setLoadingTransaction(isLoading)
    setRequest(request)
  }

  const onAskToOpenProgressDlg = async (taskId: string) => {
    if (!liquidationRequest || taskId !== liquidationRequest.loanId) return
    changeLoadingTransaction(true, liquidationRequest)
  }

  const onAskToCloseProgressDlg = async (task: RequestTask) => {
    if (!liquidationRequest || task.request.loanId !== liquidationRequest.loanId) return

    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(async () => {
        await ExplorerProvider.Instance.onTaskCancel(task)
        changeLoadingTransaction(false, undefined)
      }, 5000)
      return
    }

    props.onLiquidationUpdated()
    changeLoadingTransaction(false, undefined)
  }

  const LoanTokenIcon = loanToken.reactLogoSvg
  const CollateralTokenIcon = collateralToken.reactLogoSvg

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
            <CopyToClipboard>{props.loanId}</CopyToClipboard>
          </div>
          <div title={props.payOffAmount.toFixed(18)} className="table-row-loan__amount">
            <LoanTokenIcon />&nbsp;{props.payOffAmount.toFixed(3)}
          </div>
          <div title={props.seizeAmount.toFixed(18)} className="table-row-loan__collateral">
            <CollateralTokenIcon />
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
