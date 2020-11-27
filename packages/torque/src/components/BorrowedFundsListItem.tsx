import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { TorqueProvider } from '../services/TorqueProvider'
import { TasksQueue } from '../services/TasksQueue'
import { Rail } from './Rail'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { RepayLoanRequest } from '../domain/RepayLoanRequest'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { BorrowRequest } from '../domain/BorrowRequest'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { TxProcessingLoader } from './TxProcessingLoader'
import { ManageCollateralDlg } from './ManageCollateralDlg'
import { RepayLoanDlg } from './RepayLoanDlg'
import { ExtendLoanDlg } from './ExtendLoanDlg'
import { BorrowMoreDlg } from './BorrowMoreDlg'

export interface IBorrowedFundsListItemProps {
  item: IBorrowedFundsState
  borrowMoreDlgRef: React.RefObject<BorrowMoreDlg>
  manageCollateralDlgRef: React.RefObject<ManageCollateralDlg>
  repayLoanDlgRef: React.RefObject<RepayLoanDlg>
  extendLoanDlgRef: React.RefObject<ExtendLoanDlg>
}

interface IBorrowedFundsListItemState {
  borrowedFundsItem: IBorrowedFundsState
  assetDetails: AssetDetails | null
  interestRate: BigNumber
  liquidationPrice: BigNumber
  isInProgress: boolean
  isEmpty: boolean
  isLoadingTransaction: boolean
  request:
    | ManageCollateralRequest
    | RepayLoanRequest
    | ExtendLoanRequest
    | BorrowRequest
    | undefined
}

export class BorrowedFundsListItem extends Component<
  IBorrowedFundsListItemProps,
  IBorrowedFundsListItemState
> {
  constructor(props: IBorrowedFundsListItemProps) {
    super(props)

    this.state = {
      borrowedFundsItem: props.item,
      assetDetails: null,
      interestRate: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      isLoadingTransaction: false,
      isInProgress: props.item.isInProgress,
      isEmpty: false,
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
  public async componentDidMount() {
    const task = await TasksQueue.Instance.getTasksList().find(
      (t) => t.request.loanId === this.state.borrowedFundsItem.loanId
    )
    const isLoadingTransaction = task && !task.error ? true : false
    const request = task
      ? (task.request as
          | BorrowRequest
          | ExtendLoanRequest
          | ManageCollateralRequest
          | RepayLoanRequest)
      : undefined
    this.setState({
      ...this.state,
      isLoadingTransaction,
      request
    })

    this.derivedUpdate()
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

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return
    this.setState({ ...this.state, isLoadingTransaction: true })
  }
  private onAskToCloseProgressDlg = async (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        TorqueProvider.Instance.onTaskCancel(task)
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
      }, 5000)
      return
    }
    await this.updateData()
    await this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
  }

  public componentDidUpdate(
    prevProps: Readonly<IBorrowedFundsListItemProps>,
    prevState: Readonly<IBorrowedFundsListItemState>,
    snapshot?: any
  ): void {
    if (this.props.item.loanAsset !== prevProps.item.loanAsset) {
      this.derivedUpdate()
    }
  }

  private updateData = async () => {
    const loans = await TorqueProvider.Instance.getLoansList()
    const thisLoan = loans.find((loan) => loan.loanId === this.props.item.loanId)
    await this.setState({
      ...this.state,
      isEmpty: thisLoan ? false : true,
      borrowedFundsItem: thisLoan ? thisLoan : this.state.borrowedFundsItem
    })
  }

  private derivedUpdate = async () => {
    const assetDetails = AssetsDictionary.assets.get(this.props.item.loanAsset) || null

    const loanAssetDecimals = assetDetails!.decimals || 18
    const collateralAssetDecimals =
      AssetsDictionary.assets.get(this.state.borrowedFundsItem.collateralAsset)!.decimals || 18
    const loanAssetPrecision = new BigNumber(10 ** (18 - loanAssetDecimals))
    const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralAssetDecimals))

    const collateralToUSDCurrentRate = await TorqueProvider.Instance.getSwapToUsdRate(
      this.state.borrowedFundsItem.loanAsset
    )

    //liquidation_collateralToLoanRate = ((maintenance_margin * principal / 10^20) + principal) / collateral * 10^18
    const liquidation_collateralToLoanRate = this.props.item
      .loanData!.maintenanceMargin.times(
        this.state.borrowedFundsItem.loanData!.principal.times(loanAssetPrecision)
      )
      .div(10 ** 20)
      .plus(this.state.borrowedFundsItem.loanData!.principal.times(loanAssetPrecision))
      .div(this.state.borrowedFundsItem.loanData!.collateral.times(collateralAssetPrecision))
      .times(10 ** 18)
    const liquidationPrice = liquidation_collateralToLoanRate
      .div(10 ** 18)
      .times(collateralToUSDCurrentRate)
    await this.setState({
      ...this.state,
      assetDetails: assetDetails,
      interestRate: this.props.item.interestRate,
      liquidationPrice
    })
  }

  public render() {
    if (!this.state.assetDetails) {
      return null
    }

    const { interestRate, assetDetails, borrowedFundsItem } = this.state

    const positionSafetyText = TorqueProvider.Instance.getPositionSafetyText(borrowedFundsItem)
    const collateralizedStateSelector =
      positionSafetyText === 'Safe' ? 'safe' : positionSafetyText === 'Danger' ? 'danger' : 'unsafe'

    // const firstInRowModifier = this.props.firstInTheRow ? "borrowed-funds-list-item--first-in-row" : "";
    // const lastInRowModifier = this.props.lastInTheRow ? "borrowed-funds-list-item--last-in-row" : "";
    const maintenanceMargin = borrowedFundsItem.loanData!.maintenanceMargin.div(10 ** 18).toNumber()
    const startMargin = borrowedFundsItem.loanData!.startMargin.div(10 ** 18).toNumber()
    //115%
    const sliderMin = borrowedFundsItem.loanData!.maintenanceMargin.div(10 ** 18).toNumber()
    //300%
    const sliderMax = sliderMin + 185
    const isUnhealthyLoan = this.state.borrowedFundsItem.collateralizedPercent
      .times(100)
      .plus(100)
      .lt(maintenanceMargin)
    const isBoorowMoreDisabled = this.state.borrowedFundsItem.collateralizedPercent
      .times(100)
      .plus(100)
      .lt(startMargin)

    let sliderValue = borrowedFundsItem.collateralizedPercent.multipliedBy(100).toNumber()
    if (sliderValue > sliderMax) {
      sliderValue = sliderMax
    } else if (sliderValue < sliderMin) {
      sliderValue = sliderMin
    }

    if (this.state.isEmpty) return null

    return (
      <div className={`borrowed-funds-list-item`}>
        {this.state.isLoadingTransaction && this.state.request && (
          <TxProcessingLoader
            quantityDots={4}
            sizeDots={'middle'}
            isOverlay={true}
            taskId={this.state.request.id}
          />
        )}
        <div className="borrowed-funds-list-item__header">
          <div className="borrowed-funds-list-item__header-loan">
            <div
              title={`${borrowedFundsItem.amountOwed.toFixed(18)} ${assetDetails.displayName}`}
              className="borrowed-funds-list-item__header-loan-owed">
              {borrowedFundsItem.amountOwed.toFixed(5)}
            </div>
            <div
              title={`${interestRate.multipliedBy(100).toFixed(18)}% APR`}
              className="borrowed-funds-list-item__header-loan-interest-rate">
              <span className="value">{interestRate.multipliedBy(100).toFixed(2)}%</span>&nbsp;APR
            </div>
          </div>
          <div className="borrowed-funds-list-item__header-asset">
            <div className="borrowed-funds-list-item__header-asset-img">
              <img src={assetDetails.logoSvg} alt={assetDetails.displayName} />
            </div>
            <div className="borrowed-funds-list-item__header-asset-name">
              {assetDetails.displayName}
            </div>
          </div>
        </div>
        <div className="borrowed-funds-list-item__body">
          <div className="d-flex j-c-sb">
            {positionSafetyText !== 'Display Error' && (
              <div>
                <div
                  title={`${borrowedFundsItem.collateralizedPercent
                    .multipliedBy(100)
                    .plus(100)
                    .toFixed(18)}%`}
                  className={`borrowed-funds-list-item__body-collateralized ${collateralizedStateSelector}`}>
                  <span className="value">
                    {borrowedFundsItem.collateralizedPercent
                      .multipliedBy(100)
                      .plus(100)
                      .toFixed(2)}
                  </span>
                  %
                </div>
                <div className="borrowed-funds-list-item__body-collateralized-label">
                  Collateralized
                </div>
              </div>
            )}
            <div
              className={`borrowed-funds-list-item__body-collateralized-state ${collateralizedStateSelector}`}>
              {positionSafetyText}
              {isUnhealthyLoan ? (
                <React.Fragment>
                  <br />
                  Add Collateral
                </React.Fragment>
              ) : null}
            </div>
          </div>
          <div className="borrowed-funds-list-item__body-collateralized-rail">
            <Rail sliderValue={sliderValue} sliderMax={sliderMax} />
          </div>
          <div
            title={`${borrowedFundsItem.collateralAmount.toFixed(18)} ${
              borrowedFundsItem.collateralAsset
            }`}
            className="borrowed-funds-list-item__body-collateralized-value">
            <span className="value">{borrowedFundsItem.collateralAmount.toFixed(4)}</span>&nbsp;
            {borrowedFundsItem.collateralAsset === Asset.WETH
              ? Asset.ETH
              : borrowedFundsItem.collateralAsset}
          </div>
          <div
            title={`$${this.state.liquidationPrice.toFixed()}`}
            className="borrowed-funds-list-item__body-collateralized-value">
            Liq. Price:&nbsp;$
            <span className="value">{this.state.liquidationPrice.toFixed(2)}</span>
          </div>
        </div>
        {this.state.isInProgress ? (
          <div className="borrowed-funds-list-item__in-progress-container">
            <div className="borrowed-funds-list-item__in-progress-title">Pending</div>
            <div className="borrowed-funds-list-item__in-progress-animation">{/**/}</div>
          </div>
        ) : (
          <div className="borrowed-funds-list-item__actions-container">
            <button className={isUnhealthyLoan ? 'unsafe' : ''} onClick={this.onManageCollateral}>
              Manage Collateral
            </button>
            <button className="" onClick={this.onExtendLoan}>
              Front Interest
            </button>
            <button className="" onClick={this.onRepayLoan}>
              Repay Loan
            </button>
            {/*<button className="" onClick={this.onRepayLoan}
                title={isUnhealthyLoan ? "Collateral too low" : ""}
                disabled={isUnhealthyLoan}>

                Repay Loan
              </button>*/}
            <button
              className=""
              title={isBoorowMoreDisabled ? 'Collateral too low' : ''}
              disabled={isBoorowMoreDisabled}
              onClick={this.onBorrowMore}>
              Borrow More
            </button>
          </div>
        )}
      </div>
    )
  }

  private onManageCollateral = async () => {
    if (!this.props.manageCollateralDlgRef.current) return

    try {
      const manageCollateralRequest = await this.props.manageCollateralDlgRef.current.getValue({
        ...this.state.borrowedFundsItem
      })
      await this.setState({ ...this.state, request: manageCollateralRequest })
      await TorqueProvider.Instance.onDoManageCollateral(manageCollateralRequest)
    } catch (error) {
      if (error.message !== 'Form closed') console.error(error)
    }
    // this.props.onManageCollateral({ ...this.props.item });
  }

  private onRepayLoan = async () => {
    if (!this.props.repayLoanDlgRef.current) return

    try {
      const repayLoanRequest = await this.props.repayLoanDlgRef.current.getValue({
        ...this.state.borrowedFundsItem
      })
      await this.setState({ ...this.state, request: repayLoanRequest })
      await TorqueProvider.Instance.onDoRepayLoan(repayLoanRequest)
    } catch (error) {
      if (error.message !== 'Form closed') console.error(error)
    }
    // this.props.onRepayLoan({ ...this.props.item });
  }

  private onExtendLoan = async () => {
    if (!this.props.extendLoanDlgRef.current) return

    try {
      const extendLoanRequest = await this.props.extendLoanDlgRef.current.getValue({
        ...this.state.borrowedFundsItem
      })
      await this.setState({ ...this.state, request: extendLoanRequest })
      await TorqueProvider.Instance.onDoExtendLoan(extendLoanRequest)
    } catch (error) {
      if (error.message !== 'Form closed') console.error(error)
    }
    // this.props.onExtendLoan({ ...this.props.item });
  }

  private onBorrowMore = async () => {
    if (!this.props.borrowMoreDlgRef.current) return

    try {
      const borroweMoreRequest = await this.props.borrowMoreDlgRef.current.getValue({
        ...this.props.item
      })
      await this.setState({ ...this.state, request: borroweMoreRequest })
      await TorqueProvider.Instance.onDoBorrow(borroweMoreRequest)
    } catch (error) {
      if (error.message !== 'Form closed') console.error(error)
    }
  }
}
