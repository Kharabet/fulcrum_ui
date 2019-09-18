import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { BorrowedFundsList } from "../components/BorrowedFundsList";
import { ExtendLoanDlg } from "../components/ExtendLoanDlg";
import { ManageCollateralDlg } from "../components/ManageCollateralDlg";
import { RepayLoanDlg } from "../components/RepayLoanDlg";
import { WalletAddressDlg } from "../components/WalletAddressDlg";
import { WalletAddressHint } from "../components/WalletAddressHint";
import { WalletAddressLargeForm } from "../components/WalletAddressLargeForm";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { WalletType, walletTypeAbbrToWalletType } from "../domain/WalletType";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";

export interface IDashboardPageRouteParams {
  walletTypeAbbr: string;
  walletAddress: string | undefined;
}

export interface IDashboardPageParams {
  doNetworkConnect?: (destinationAbbr: string) => void;
  isLoading: boolean;
}

interface IDashboardPageState {
  walletDetails: IWalletDetails;
  items: IBorrowedFundsState[];
}

export class DashboardPage extends PureComponent<
  IDashboardPageParams & RouteComponentProps<IDashboardPageRouteParams>,
  IDashboardPageState
> {
  private manageCollateralDlgRef: RefObject<ManageCollateralDlg>;
  private repayLoanDlgRef: RefObject<RepayLoanDlg>;
  private extendLoanDlgRef: RefObject<ExtendLoanDlg>;
  private walletAddressDlgRef: RefObject<WalletAddressDlg>;

  constructor(props: any) {
    super(props);

    this.manageCollateralDlgRef = React.createRef();
    this.repayLoanDlgRef = React.createRef();
    this.extendLoanDlgRef = React.createRef();
    this.walletAddressDlgRef = React.createRef();

    this.state = { walletDetails: { walletType: WalletType.Unknown, walletAddress: "" }, items: [] };

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  private async derivedUpdate() {
    const walletDetails = {
      walletType: walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr),
      walletAddress: this.props.match.params.walletAddress
    };
    const items = await TorqueProvider.Instance.getLoansList(walletDetails);

    this.setState({
      ...this.state,
      walletDetails: walletDetails,
      items: items
    });
  }

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IDashboardPageParams & RouteComponentProps<IDashboardPageRouteParams>>,
    prevState: Readonly<IDashboardPageState>,
    snapshot?: any
  ): void {
    if (this.state.walletDetails.walletAddress !== prevState.walletDetails.walletAddress) {
      this.derivedUpdate();
    }
  }

  public render() {
    return (
      <React.Fragment>
        <ManageCollateralDlg ref={this.manageCollateralDlgRef} />
        <RepayLoanDlg ref={this.repayLoanDlgRef} />
        <ExtendLoanDlg ref={this.extendLoanDlgRef} />
        <WalletAddressDlg ref={this.walletAddressDlgRef} />
        <div className="dashboard-page">
          <HeaderOps isLoading={this.props.isLoading} doNetworkConnect={this.doNetworkConnect} />
          <div className="dashboard-page__main">
            {this.state.walletDetails.walletAddress ? (
              <React.Fragment>
                {this.state.walletDetails.walletType === WalletType.NonWeb3 ? (
                  <WalletAddressHint
                    walletAddress={this.state.walletDetails.walletAddress || ""}
                    onSelectNewWalletAddress={this.onSelectNewWalletAddress}
                    onClearWalletAddress={this.onClearWalletAddress}
                  />
                ) : null}
                <BorrowedFundsList
                  walletDetails={this.state.walletDetails}
                  items={this.state.items}
                  onManageCollateral={this.onManageCollateral}
                  onRepayLoan={this.onRepayLoan}
                  onExtendLoan={this.onExtendLoan}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {this.state.walletDetails.walletType === WalletType.NonWeb3 ? (
                  <div className="dashboard-page__form">
                    <WalletAddressLargeForm onSubmit={this.onWalletAddressChange} />
                  </div>
                ) : null}
              </React.Fragment>
            )}
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }

  private onSelectNewWalletAddress = async () => {
    if (this.walletAddressDlgRef.current) {
      try {
        const walletAddress = await this.walletAddressDlgRef.current.getValue();
        this.onWalletAddressChange(walletAddress);
      } finally {
        this.walletAddressDlgRef.current.hide();
      }
    }
  };

  private onClearWalletAddress = () => {
    NavService.Instance.History.replace(NavService.Instance.getDashboardAddress(WalletType.NonWeb3, ""));
    window.location.reload();
  };

  private onWalletAddressChange = (walletAddress: string) => {
    NavService.Instance.History.replace(NavService.Instance.getDashboardAddress(WalletType.NonWeb3, walletAddress));
    window.location.reload();
  };

  private onRepayLoan = async (item: IBorrowedFundsState) => {
    if (this.repayLoanDlgRef.current) {
      try {
        const repayLoanRequest = await this.repayLoanDlgRef.current.getValue(this.state.walletDetails, item);
        await TorqueProvider.Instance.doRepayLoan(repayLoanRequest);
      } finally {
        this.repayLoanDlgRef.current.hide();
      }
    }
  };

  private onExtendLoan = async (item: IBorrowedFundsState) => {
    if (this.extendLoanDlgRef.current) {
      try {
        const extendLoanRequest = await this.extendLoanDlgRef.current.getValue(this.state.walletDetails, item);
        await TorqueProvider.Instance.doExtendLoan(extendLoanRequest);
      } finally {
        this.extendLoanDlgRef.current.hide();
      }
    }
  };

  private onManageCollateral = async (item: IBorrowedFundsState) => {
    if (this.manageCollateralDlgRef.current) {
      try {
        const manageCollateralRequest = await this.manageCollateralDlgRef.current.getValue(
          this.state.walletDetails,
          item
        );
        await TorqueProvider.Instance.setLoanCollateral(manageCollateralRequest);
      } finally {
        this.manageCollateralDlgRef.current.hide();
      }
    }
  };

  private doNetworkConnect = () => {
    if (this.props.doNetworkConnect) {
      this.props.doNetworkConnect("b");
    }
  };
}
