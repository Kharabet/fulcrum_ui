import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { BorrowedFundsList } from "../components/BorrowedFundsList";
import { ExtendLoanDlg } from "../components/ExtendLoanDlg";
import { ManageCollateralDlg } from "../components/ManageCollateralDlg";
import { RepayLoanDlg } from "../components/RepayLoanDlg";
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { Loader } from "../components/Loader";
import { ProviderType } from "../domain/ProviderType";
import { BorrowMoreDlg } from "../components/BorrowMoreDlg";
import { Asset } from "../domain/Asset";

export interface IDashboardPageRouteParams {
  walletAddress: string | undefined;
}

export interface IDashboardPageParams {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isMobileMedia: boolean;
}

interface IDashboardPageState {
  items: IBorrowedFundsState[];
  itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting>;
  isDataLoading: boolean;
}

export class DashboardPage extends PureComponent<
  IDashboardPageParams & RouteComponentProps<IDashboardPageRouteParams>,
  IDashboardPageState
  > {
  private manageCollateralDlgRef: RefObject<ManageCollateralDlg>;
  private repayLoanDlgRef: RefObject<RepayLoanDlg>;
  private extendLoanDlgRef: RefObject<ExtendLoanDlg>;
  private borrowMoreDlgRef: RefObject<BorrowMoreDlg>;

  constructor(props: any) {
    super(props);

    this.manageCollateralDlgRef = React.createRef();
    this.repayLoanDlgRef = React.createRef();
    this.extendLoanDlgRef = React.createRef();
    this.borrowMoreDlgRef = React.createRef();

    this.state = {
      items: [],
      itemsAwaiting: [],
      isDataLoading: true
    };

    this._isMounted = false;
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    await this._isMounted && this.setState({
      ...this.state,
      isDataLoading: true
    });
    if (TorqueProvider.Instance.unsupportedNetwork) {
      await this._isMounted && this.setState({
        items: [],
        itemsAwaiting: [],
        isDataLoading: false
      });
      return;
    }

    if (TorqueProvider.Instance.providerType === ProviderType.None || !TorqueProvider.Instance.contractsSource || !TorqueProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      await this._isMounted && this.setState({
        items: [],
        itemsAwaiting: [],
        isDataLoading: false
      });
      return;
    }

    let items: IBorrowedFundsState[] = [];
    let itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting> = [];

    items = await TorqueProvider.Instance.getLoansList();
    console.log(items);
    itemsAwaiting = await TorqueProvider.Instance.getLoansAwaitingList();

    await this._isMounted && this.setState({
      ...this.state,
      items: items,
      itemsAwaiting: itemsAwaiting,
      isDataLoading: false
    });
  }
  
  private onProviderChanged = () => {
    this.derivedUpdate();
  };

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    this._isMounted = false;
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this._isMounted = true;
    this.derivedUpdate();
  }

  public render() {

    return (
      <React.Fragment>
        <ManageCollateralDlg ref={this.manageCollateralDlgRef} />
        <RepayLoanDlg ref={this.repayLoanDlgRef} />
        <ExtendLoanDlg ref={this.extendLoanDlgRef} />
        <BorrowMoreDlg ref={this.borrowMoreDlgRef} />
        <div className="dashboard-page">
          <HeaderOps isMobileMedia={this.props.isMobileMedia} doNetworkConnect={this.props.doNetworkConnect} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
          <main>
            {!TorqueProvider.Instance.unsupportedNetwork ? (
              <React.Fragment>
                {this.state.isDataLoading
                  ? <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
                  : (<div className="page-header">
                    <h1>Your Loans</h1>
                    <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                  </div>)
                }
                <BorrowedFundsList
                  items={this.state.items}
                  itemsAwaiting={this.state.itemsAwaiting}
                  manageCollateralDlgRef={this.manageCollateralDlgRef}
                  repayLoanDlgRef={this.repayLoanDlgRef}
                  extendLoanDlgRef={this.extendLoanDlgRef}
                  onBorrowMore={this.onBorrowMore}
                  isLoading={this.state.isDataLoading}
                />
              </React.Fragment>
            ) :
              (
                <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                  <div style={{ cursor: `pointer` }}>
                    You are connected to the wrong network.
                      </div>
                </div>
              )
            }
          </main>
          <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        </div>
      </React.Fragment>
    );
  }

  private onBorrowMore = async (item: IBorrowedFundsState) => {
    if (!this.borrowMoreDlgRef.current) return;

    try {
      const borrowMoreRequest = await this.borrowMoreDlgRef.current.getValue(item);
      // await TorqueProvider.Instance.doBorrow(borrowMoreRequest);
    } catch (error) {
      if (error.message !== "Form closed")
        console.error(error);
    }
  };
}
