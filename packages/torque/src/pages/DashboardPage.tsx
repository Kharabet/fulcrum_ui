import React, { PureComponent, RefObject } from 'react'
import { BorrowedFundsList } from '../components/BorrowedFundsList'
import { BorrowMoreDlg } from '../components/BorrowMoreDlg'
import { ExtendLoanDlg } from '../components/ExtendLoanDlg'
import { Loader } from '../components/Loader'
import { ManageCollateralDlg } from '../components/ManageCollateralDlg'
import { RepayLoanDlg } from '../components/RepayLoanDlg'
import { BorrowRequestAwaiting } from '../domain/BorrowRequestAwaiting'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { ProviderType } from '../domain/ProviderType'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import { TorqueProvider } from '../services/TorqueProvider'
import { InfoBlock } from '../components/InfoBlock'

export interface IDashboardPageParams {
  doNetworkConnect: () => void
  isMobileMedia: boolean
}

interface IDashboardPageState {
  items: IBorrowedFundsState[]
  itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting>
  isDataLoading: boolean
  recentLiquidationsNumber: number
}

export class DashboardPage extends PureComponent<IDashboardPageParams, IDashboardPageState> {
  private manageCollateralDlgRef: RefObject<ManageCollateralDlg>
  private repayLoanDlgRef: RefObject<RepayLoanDlg>
  private extendLoanDlgRef: RefObject<ExtendLoanDlg>
  private borrowMoreDlgRef: RefObject<BorrowMoreDlg>
  private readonly daysNumberForLoanActionNotification = 2

  constructor(props: any) {
    super(props)

    this.manageCollateralDlgRef = React.createRef()
    this.repayLoanDlgRef = React.createRef()
    this.extendLoanDlgRef = React.createRef()
    this.borrowMoreDlgRef = React.createRef()

    this.state = {
      items: [],
      itemsAwaiting: [],
      isDataLoading: true,
      recentLiquidationsNumber: 0,
    }

    this._isMounted = false
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private _isMounted: boolean

  private async derivedUpdate() {
    ;(await this._isMounted) &&
      this.setState({
        ...this.state,
        isDataLoading: true,
      })
    if (TorqueProvider.Instance.unsupportedNetwork) {
      ;(await this._isMounted) &&
        this.setState({
          items: [],
          itemsAwaiting: [],
          isDataLoading: false,
        })
      return
    }

    if (
      TorqueProvider.Instance.providerType === ProviderType.None ||
      !TorqueProvider.Instance.contractsSource ||
      !TorqueProvider.Instance.contractsSource.canWrite
    ) {
      this.props.doNetworkConnect()
      ;(await this._isMounted) &&
        this.setState({
          items: [],
          itemsAwaiting: [],
          isDataLoading: false,
        })
      return
    }

    let items: IBorrowedFundsState[] = []
    let itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting> = []

    items = await TorqueProvider.Instance.getLoansList()
    itemsAwaiting = await TorqueProvider.Instance.getLoansAwaitingList()
    ;(await this._isMounted) &&
      this.setState({
        ...this.state,
        items: items,
        itemsAwaiting: itemsAwaiting,
        isDataLoading: false,
      })
  }

  private onProviderChanged = async () => {
    this.derivedUpdate()
    await this.setRecentLiquidationsNumber()
  }

  private onProviderAvailable = () => {
    this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    this._isMounted = false
    TorqueProvider.Instance.eventEmitter.removeListener(
      TorqueProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    TorqueProvider.Instance.eventEmitter.removeListener(
      TorqueProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public async componentDidMount() {
    this._isMounted = true
    this.derivedUpdate()
    await this.setRecentLiquidationsNumber()
  }

  private async setRecentLiquidationsNumber() {
    const liquidationsNumber = await TorqueProvider.Instance.getLiquidationsInPastNDays(
      this.daysNumberForLoanActionNotification
    )
    this.setState({ ...this.state, recentLiquidationsNumber: liquidationsNumber })
  }

  public render() {
    return (
      <React.Fragment>
        <ManageCollateralDlg ref={this.manageCollateralDlgRef} />
        <RepayLoanDlg ref={this.repayLoanDlgRef} />
        <ExtendLoanDlg ref={this.extendLoanDlgRef} />
        <BorrowMoreDlg ref={this.borrowMoreDlgRef} />
        <div>
          {this.state.recentLiquidationsNumber > 0 && (
            <InfoBlock localstorageItemProp="past-liquidations-info">
              {this.state.recentLiquidationsNumber === 1
                ? 'One'
                : this.state.recentLiquidationsNumber}
              &nbsp;of your loans&nbsp;
              {this.state.recentLiquidationsNumber === 1 ? 'has' : 'have'} been liquidated during
              the past {this.daysNumberForLoanActionNotification} days. For more information visit
              your&nbsp;
              <a
                href="https://explorer.bzx.network/liquidations"
                className="regular-link"
                target="_blank"
                rel="noopener noreferrer">
                Liquidations
              </a>
              .
            </InfoBlock>
          )}
          {!TorqueProvider.Instance.unsupportedNetwork ? (
            <React.Fragment>
              <div>
                {this.state.isDataLoading ||
                  (TorqueProvider.Instance.isLoading && (
                    <Loader
                      quantityDots={5}
                      sizeDots={'large'}
                      title={'Loading'}
                      isOverlay={false}
                    />
                  ))}
              </div>
              <BorrowedFundsList
                items={this.state.items}
                itemsAwaiting={this.state.itemsAwaiting}
                manageCollateralDlgRef={this.manageCollateralDlgRef}
                repayLoanDlgRef={this.repayLoanDlgRef}
                extendLoanDlgRef={this.extendLoanDlgRef}
                borrowMoreDlgRef={this.borrowMoreDlgRef}
                isLoading={this.state.isDataLoading}
              />
            </React.Fragment>
          ) : (
            <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
              <div style={{ cursor: `pointer` }}>You are connected to the wrong network.</div>
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }
}
