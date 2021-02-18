import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/ic_info.svg'
import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { BorrowRequest } from '../domain/BorrowRequest'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { RepayLoanRequest } from '../domain/RepayLoanRequest'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { RolloverRequest } from '../domain/RolloverRequest'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import { TasksQueue } from '../services/TasksQueue'
import { TorqueProvider } from '../services/TorqueProvider'
import { BorrowMoreDlg } from './BorrowMoreDlg'
import { ExtendLoanDlg } from './ExtendLoanDlg'
import { ManageCollateralDlg } from './ManageCollateralDlg'
import { Rail } from './Rail'
import { RepayLoanDlg } from './RepayLoanDlg'
import { TxProcessingLoader } from './TxProcessingLoader'
import { LiquidationDropdown } from './LiquidationDropdown'

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
    | RolloverRequest
    | undefined
  activeTokenLiquidation: Asset
}

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

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
      request: undefined,
      activeTokenLiquidation: this.props.item.collateralAsset
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
    const task = TasksQueue.Instance.getTasksList().find(
      (t) => t.request.loanId === this.state.borrowedFundsItem.loanId
    )
    const isLoadingTransaction = task && !task.error ? true : false
    const request = task ? task.request : undefined
    this.setState({
      ...this.state,
      isLoadingTransaction,
      request
    })

    await this.derivedUpdate()
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
      window.setTimeout(async () => {
        await TorqueProvider.Instance.onTaskCancel(task)
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
      }, 5000)
      return
    }
    await this.updateData()
    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
  }

  public async componentDidUpdate(prevProps: Readonly<IBorrowedFundsListItemProps>) {
    if (this.props.item.loanAsset !== prevProps.item.loanAsset) {
      await this.derivedUpdate()
    }
  }

  private updateData = async () => {
    const loans = await TorqueProvider.Instance.getLoansList()
    const thisLoan = loans.find((loan) => loan.loanId === this.props.item.loanId)
    this.setState(
      {
        ...this.state,
        isEmpty: thisLoan ? false : true,
        borrowedFundsItem: thisLoan ? thisLoan : this.state.borrowedFundsItem
      },
      async () => {
        await this.derivedUpdate()
      }
    )
  }

  private derivedUpdate = async () => {
    const assetDetails = AssetsDictionary.assets.get(this.props.item.loanAsset) || null

    const loanAssetDecimals = assetDetails!.decimals || 18
    const collateralAssetDecimals =
      AssetsDictionary.assets.get(this.state.borrowedFundsItem.collateralAsset)!.decimals || 18
    const loanAssetPrecision = new BigNumber(10 ** (18 - loanAssetDecimals))
    const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralAssetDecimals))

    // liquidation_collateralToLoanRate = ((maintenance_margin * principal / 10^20) + principal) / collateral * 10^18
    const liquidationCollateralToLoanRate = this.props.item
      .loanData!.maintenanceMargin.times(
        this.state.borrowedFundsItem.loanData!.principal.times(loanAssetPrecision)
      )
      .div(10 ** 20)
      .plus(this.state.borrowedFundsItem.loanData!.principal.times(loanAssetPrecision))
      .div(this.state.borrowedFundsItem.loanData!.collateral.times(collateralAssetPrecision))
      .times(10 ** 18)

    const liquidationPrice = liquidationCollateralToLoanRate.div(10 ** 18)

    this.setState({
      ...this.state,
      assetDetails: assetDetails,
      interestRate: this.props.item.interestRate,
      liquidationPrice
    })
  }

  public formatPrecision(output: BigNumber): string {
    const outputNumber = Number(output)
    const n = Math.log(outputNumber) / Math.LN10
    let x = 3 - n
    if (x < 0) x = 0
    if (x > 6) x = 6
    const result = Number(outputNumber.toFixed(x)).toString()
    return result
  }

  public render() {
    const loanData = this.state.borrowedFundsItem.loanData
    if (!this.state.assetDetails || !loanData) {
      return null
    }

    const { interestRate, assetDetails, borrowedFundsItem } = this.state

    const positionSafetyText = TorqueProvider.Instance.getPositionSafetyText(borrowedFundsItem)
    const collateralizedStateSelector =
      positionSafetyText === 'Safe' ? 'safe' : positionSafetyText === 'Danger' ? 'danger' : 'unsafe'

    // const firstInRowModifier = this.props.firstInTheRow ? "borrowed-funds-list-item--first-in-row" : "";
    // const lastInRowModifier = this.props.lastInTheRow ? "borrowed-funds-list-item--last-in-row" : "";
    const maintenanceMargin = loanData.maintenanceMargin.div(10 ** 18).toNumber()
    const startMargin = loanData.startMargin.div(10 ** 18).toNumber()
    // 115%
    const sliderMin = loanData.maintenanceMargin.div(10 ** 18).toNumber()
    // 300%
    const sliderMax = 3000
    const isUnhealthyLoan = this.state.borrowedFundsItem.collateralizedPercent
      .times(100)
      .plus(100)
      .lt(maintenanceMargin)
    const isBorrowMoreDisabled = this.state.borrowedFundsItem.collateralizedPercent
      .times(100)
      .plus(100)
      .lt(startMargin)

    const remainingDays = loanData.interestDepositRemaining.div(loanData.interestOwedPerDay)
    const isRollover = remainingDays.eq(0)
    let sliderValue = borrowedFundsItem.collateralizedPercent.multipliedBy(100).toNumber()
    if (sliderValue > sliderMax) {
      sliderValue = sliderMax
    } else if (sliderValue < sliderMin) {
      sliderValue = sliderMin
    }

    if (this.state.isEmpty) return null

    const liquidationPrice = 
    this.state.activeTokenLiquidation === this.props.item.collateralAsset
      ? this.state.liquidationPrice
      : new BigNumber(1).div(this.state.liquidationPrice)

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
            <div
              title={borrowedFundsItem.loanId}
              className="borrowed-funds-list-item__header-asset-img">
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
            <Rail sliderValue={sliderValue} sliderMin={sliderMin} sliderMax={sliderMax} />
          </div>
          <div
            title={`${borrowedFundsItem.collateralAmount.toFixed(18)} ${
              borrowedFundsItem.collateralAsset
            }`}
            className="borrowed-funds-list-item__body-collateralized-value">
            Collateral:&nbsp;
            <span className="value">{borrowedFundsItem.collateralAmount.toFixed(4)}</span>&nbsp;
            {borrowedFundsItem.collateralAsset === Asset.WETH
              ? Asset.ETH
              : borrowedFundsItem.collateralAsset}
          </div>
          <div
            title={`${liquidationPrice.toFixed()}`}
            className="borrowed-funds-list-item__body-collateralized-value">
            Liq. Price:&nbsp;
            <span className="value">{this.formatPrecision(liquidationPrice)}</span>
            <LiquidationDropdown
              selectedAsset={this.state.activeTokenLiquidation}
              loanAsset={this.props.item.loanAsset}
              collateralAsset={this.props.item.collateralAsset}
              onAssetChange={(activeTokenLiquidation) => this.setState({ activeTokenLiquidation })}
            />
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

            <div className="borrowed-funds-list-item__extend">
              {remainingDays.lte(6) && (
                <div
                  className={`remaining ${
                    isRollover ? `danger` : remainingDays.lte(3) ? `warning` : ``
                  }`}>
                  {isRollover ? `Warning` : `${remainingDays.toFixed(0, 1)} days`}
                  <IconInfo
                    className="tooltip__icon"
                    data-tip="Your loan is required to front more interest payments, this will come from your collateral."
                  />
                  <ReactTooltip className="tooltip__info" place="top" effect="solid" />
                </div>
              )}
              {isRollover ? (
                <button className="rollover" onClick={this.onRollover}>
                  Rollover
                </button>
              ) : (
                <button onClick={this.onExtendLoan}>Front Interest</button>
              )}
            </div>

            <button onClick={this.onRepayLoan}>Repay Loan</button>

            {/*<button className="" onClick={this.onRepayLoan}
                title={isUnhealthyLoan ? "Collateral too low" : ""}
                disabled={isUnhealthyLoan}>

                Repay Loan
              </button>*/}
            <button
              className=""
              title={isBorrowMoreDisabled ? 'Collateral too low' : ''}
              disabled={isBorrowMoreDisabled}
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
      this.setState({ ...this.state, request: manageCollateralRequest })
      await TorqueProvider.Instance.onDoManageCollateral(manageCollateralRequest)
    } catch (error) {
      if (error.message !== 'Form closed') {
        console.error(error)
      }
    }
    // this.props.onManageCollateral({ ...this.props.item });
  }

  private onRepayLoan = async () => {
    if (!this.props.repayLoanDlgRef.current) return

    try {
      const repayLoanRequest = await this.props.repayLoanDlgRef.current.getValue({
        ...this.state.borrowedFundsItem
      })
      this.setState({ ...this.state, request: repayLoanRequest })
      await TorqueProvider.Instance.onDoRepayLoan(repayLoanRequest)
    } catch (error) {
      if (error.message !== 'Form closed') {
        console.error(error)
      }
    }
    // this.props.onRepayLoan({ ...this.props.item });
  }

  private onExtendLoan = async () => {
    if (!this.props.extendLoanDlgRef.current) return

    try {
      const extendLoanRequest = await this.props.extendLoanDlgRef.current.getValue({
        ...this.state.borrowedFundsItem
      })
      this.setState({ ...this.state, request: extendLoanRequest })
      await TorqueProvider.Instance.onDoExtendLoan(extendLoanRequest)
    } catch (error) {
      if (error.message !== 'Form closed') {
        console.error(error)
      }
    }
    // this.props.onExtendLoan({ ...this.props.item });
  }

  private onRollover = async () => {
    const rolloverRequest = new RolloverRequest(this.props.item.loanData!.loanId)
    this.setState({ ...this.state, request: rolloverRequest, isLoadingTransaction: true })
    await TorqueProvider.Instance.onDoRollover(rolloverRequest)
  }

  private onBorrowMore = async () => {
    if (!this.props.borrowMoreDlgRef.current) return

    try {
      const borroweMoreRequest = await this.props.borrowMoreDlgRef.current.getValue({
        ...this.state.borrowedFundsItem
      })
      this.setState({ ...this.state, request: borroweMoreRequest })
      await TorqueProvider.Instance.onDoBorrow(borroweMoreRequest)
    } catch (error) {
      if (error.message !== 'Form closed') {
        console.error(error)
      }
    }
  }
}
