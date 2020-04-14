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

export interface IDashboardPageRouteParams {
  walletTypeAbbr: string;
  walletAddress: string | undefined;
}

export interface IDashboardPageParams {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
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

    // TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private async derivedUpdate() {
    if (TorqueProvider.Instance.unsupportedNetwork) {
      return;
    }

    if (TorqueProvider.Instance.providerType === ProviderType.None || !TorqueProvider.Instance.contractsSource || !TorqueProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect()
      return;
    }

    let items: IBorrowedFundsState[] = [];
    let itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting> = [];

    items = await TorqueProvider.Instance.getLoansList();
    itemsAwaiting = await TorqueProvider.Instance.getLoansAwaitingList();

    this.setState({
      ...this.state,
      items: items,
      itemsAwaiting: itemsAwaiting,
      isDataLoading: false
    });
  }

  /*private onProviderAvailable = () => {
    //console.log("onProviderAvailable");
    this.refreshPage();
  };*/

  private onProviderChanged = () => {
    // console.log("onProviderChanged");
    this.refreshPage();
  };

  public componentWillUnmount(): void {
    // TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    // console.log("componentDidMount");
    this.refreshPage();
  }

  public render() {

    return (
      <React.Fragment>
        <ManageCollateralDlg ref={this.manageCollateralDlgRef} />
        <RepayLoanDlg ref={this.repayLoanDlgRef} />
        <ExtendLoanDlg ref={this.extendLoanDlgRef} />
        <BorrowMoreDlg ref={this.borrowMoreDlgRef} />
        <div className="dashboard-page">
          <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
          <div className="dashboard-page__main">

            {this.state.items.length === 0 && <h2>You have no loans!</h2>}

            {!TorqueProvider.Instance.unsupportedNetwork ? (
              <React.Fragment>
                {this.state.isDataLoading
                  ? <Loader />
                  : (<React.Fragment>
                    <div onClick={this.refreshPage} style={{ cursor: `pointer`, textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                      Click to refresh and see recent loan activity.
                        </div>
                  </React.Fragment>)
                }
                <BorrowedFundsList
                  items={this.state.items}
                  itemsAwaiting={this.state.itemsAwaiting}
                  onManageCollateral={this.onManageCollateral}
                  onRepayLoan={this.onRepayLoan}
                  onExtendLoan={this.onExtendLoan}
                  onBorrowMore={this.onBorrowMore}
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
          </div>
          <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        </div>
      </React.Fragment>
    );
  }

  private refreshPage = () => {
    // this.derivedUpdate();
    this.setState({
      ...this.state,
      isDataLoading: true,
      items: [],
      itemsAwaiting: []
    },
      () => {
        setTimeout(() => {
          this.derivedUpdate();
          /*this.setState({
            ...this.state,
            isDataLoading: true
          },
          () => {
            this.derivedUpdate();
          });*/
        }, 1000);
      });
  };

  private onRepayLoan = async (item: IBorrowedFundsState) => {
    if (!this.repayLoanDlgRef.current) return;

    try {
      const repayLoanRequest = await this.repayLoanDlgRef.current.getValue(item);
      await TorqueProvider.Instance.doRepayLoan(repayLoanRequest);
    } catch (error) {
      console.error(error);
    }

    this.repayLoanDlgRef.current.toggleDidSubmit(false);
    await this.repayLoanDlgRef.current.hide();
  };

  private onExtendLoan = async (item: IBorrowedFundsState) => {
    if (!this.extendLoanDlgRef.current) return

    try {
      const extendLoanRequest = await this.extendLoanDlgRef.current.getValue(item);
      await TorqueProvider.Instance.doExtendLoan(extendLoanRequest);
    } catch (error) {
      console.error(error);
    }

    this.extendLoanDlgRef.current.toggleDidSubmit(false);
    await this.extendLoanDlgRef.current.hide();
  };

  private onManageCollateral = async (item: IBorrowedFundsState) => {
    if (!this.manageCollateralDlgRef.current) return;

    try {
      const manageCollateralRequest = await this.manageCollateralDlgRef.current.getValue(item);
      await TorqueProvider.Instance.doManageCollateral(manageCollateralRequest);
    } catch (error) {
      console.error(error);
    }

    this.manageCollateralDlgRef.current.toggleDidSubmit(false);
    await this.manageCollateralDlgRef.current.hide();
  };

  private onBorrowMore = async (item: IBorrowedFundsState) => {
    if (!this.borrowMoreDlgRef.current) return;

    try {
      const borrowMoreRequest = await this.borrowMoreDlgRef.current.getValue(item);
      await TorqueProvider.Instance.doBorrow(borrowMoreRequest);
    } catch (error) {
      console.error(error);
    }

    this.borrowMoreDlgRef.current.toggleDidSubmit(false);
    await this.borrowMoreDlgRef.current.hide();
  };
}
