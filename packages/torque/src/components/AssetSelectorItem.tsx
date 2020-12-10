import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { ReactComponent as ArrowRight } from '../assets/images/ic_arrow_right.svg'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
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
  isLoadingTransaction: boolean
  interestRate: BigNumber
  yieldApr: BigNumber
  liquidity: BigNumber
  borrowDlgRef: React.RefObject<BorrowDlg>
  doNetworkConnect: () => void
}

interface IAssetSelectorItemState {
  isLoadingTransaction: boolean
  request: BorrowRequest | undefined
}

export class AssetSelectorItem extends Component<IAssetSelectorItemProps, IAssetSelectorItemState> {
  constructor(props: IAssetSelectorItemProps) {
    super(props)

    this.state = {
      isLoadingTransaction: false,
      request: undefined
    }
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.AskToOpenProgressDlg,
      this.onAskToOpenProgressDlg
    )
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.AskToCloseProgressDlg,
      this.onAskToCloseProgressDlg
    )   
  }

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return
    this.setState({ ...this.state, isLoadingTransaction: true })
  }
  private onAskToCloseProgressDlg = async (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(async () => {
        await TorqueProvider.Instance.onTaskCancel(task)
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
      }, 5000)
      return
    }

    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
    NavService.Instance.History.push('/dashboard')
  }


  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.off(
      TorqueProviderEvents.AskToOpenProgressDlg,
      this.onAskToOpenProgressDlg
    )
    TorqueProvider.Instance.eventEmitter.off(
      TorqueProviderEvents.AskToCloseProgressDlg,
      this.onAskToCloseProgressDlg
    )   
  }

  public async componentDidMount() {
    const task = TasksQueue.Instance.getTasksList().find(
      (t) =>
        t.request instanceof BorrowRequest &&
        t.request.borrowAsset === this.props.asset &&
        t.request.loanId === '0x0000000000000000000000000000000000000000000000000000000000000000'
    )
    const isLoadingTransaction = task && !task.error ? true : false
    const request = task ? (task.request as BorrowRequest) : undefined
    this.setState({
      ...this.state,
      isLoadingTransaction,
      request
    })
  }


  public render() {
    const asset = AssetsDictionary.assets.get(this.props.asset) as AssetDetails
    return (
      <div className="asset-selector-item">
        {this.state.isLoadingTransaction && this.state.request && (
          <TxProcessingLoader
            quantityDots={3}
            sizeDots={'small'}
            isOverlay={true}
            taskId={this.state.request.id}
          />
        )}
        <div className="asset-selector-item-content" onClick={this.onClick}>
          <div className="asset-selector-body">
            <div className="asset-selector-row">
              <div className="asset-selector__apr">Est. Yield, vBZRX</div>
              <div
                title={this.props.yieldApr.toFixed(18)}
                className="asset-selector__interest-rate">
                <span className="asset-selector__interest-rate-value">
                  {this.props.yieldApr.toFixed(0)}
                </span>
                %
              </div>
            </div>
            <div className="asset-selector-row">
              <div className="asset-selector__apr">APR</div>
              <div className="asset-selector__fixed">
                FIXED
                {this.props.interestRate.gt(0) ? ` ${this.props.interestRate.toFixed(2)}` : ` 0`}
                <span>%</span>
              </div>
            </div>
            <div className="asset-selector-row">
              <div className="asset-selector__apr">Liquidity</div>
              <div className="asset-selector__fixed" title={this.props.liquidity.toFixed()}>
                {this.formatLiquidity(this.props.liquidity)}
              </div>
            </div>
          </div>
          <div className="asset-selector-footer">
            <div className="asset-selector__title">{this.props.asset}</div>
            <div className="asset-selector__icon">{asset.reactLogoSvg.render()}</div>
            <div className="asset-selector__arrow">
              <ArrowRight />
            </div>
          </div>
        </div>
        <div className="asset-selector-item-bg" style={{ backgroundColor: asset.bgBorrowItem }} />
      </div>
    )
  }

  private onClick = async () => {
    if (!this.props.borrowDlgRef.current) return

    if (
      TorqueProvider.Instance.providerType === ProviderType.None ||
      !TorqueProvider.Instance.contractsSource ||
      !TorqueProvider.Instance.contractsSource.canWrite
    ) {
      this.props.doNetworkConnect()
      return
    }

    try {
      const borrowRequest = await this.props.borrowDlgRef.current.getValue(this.props.asset)
      this.setState({ ...this.state, request: borrowRequest })
      await TorqueProvider.Instance.onDoBorrow(borrowRequest)
    } catch (error) {
      // tslint:disable-next-line: no-console
      if (error.message !== 'Form closed') console.error(error)
    }
  }
  
  private formatLiquidity(value: BigNumber): string {
    if (value.lt(1000)) return value.toFixed(2)
    if (value.lt(10 ** 6)) return `${Number(value.dividedBy(1000).toFixed(2)).toString()}k`
    if (value.lt(10 ** 9)) return `${Number(value.dividedBy(10 ** 6).toFixed(2)).toString()}m`
    return `${Number(value.dividedBy(10 ** 9).toFixed(2)).toString()}b`
  }
}
