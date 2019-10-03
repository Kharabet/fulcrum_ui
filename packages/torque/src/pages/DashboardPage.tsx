import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { BorrowedFundsList } from "../components/BorrowedFundsList";
import { ExtendLoanDlg } from "../components/ExtendLoanDlg";
import { ManageCollateralDlg } from "../components/ManageCollateralDlg";
import { RepayLoanDlg } from "../components/RepayLoanDlg";
import { SetupENSDlg } from "../components/SetupENSDlg";
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
  isENSSetup?: boolean;
  items: IBorrowedFundsState[];
}

export class DashboardPage extends PureComponent<
  IDashboardPageParams & RouteComponentProps<IDashboardPageRouteParams>,
  IDashboardPageState
> {
  private setupENSDlgRef: RefObject<SetupENSDlg>;
  private manageCollateralDlgRef: RefObject<ManageCollateralDlg>;
  private repayLoanDlgRef: RefObject<RepayLoanDlg>;
  private extendLoanDlgRef: RefObject<ExtendLoanDlg>;
  private walletAddressDlgRef: RefObject<WalletAddressDlg>;

  constructor(props: any) {
    super(props);

    this.setupENSDlgRef = React.createRef();
    this.manageCollateralDlgRef = React.createRef();
    this.repayLoanDlgRef = React.createRef();
    this.extendLoanDlgRef = React.createRef();
    this.walletAddressDlgRef = React.createRef();

    this.state = { walletDetails: { walletType: WalletType.Unknown, walletAddress: "" }, items: [], isENSSetup: undefined };

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  private async derivedUpdate() {
    const walletType = walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr);
    if (walletType === WalletType.Web3) {
      const account = TorqueProvider.Instance.accounts.length !== 0 ?
        TorqueProvider.Instance.accounts[0].toLowerCase() :
        "";
      if (!account || !TorqueProvider.Instance.contractsSource || !TorqueProvider.Instance.contractsSource.canWrite) {
        return;
      } else {
        if (!this.props.match.params.walletAddress || this.props.match.params.walletAddress.toLowerCase() !== account) {
          NavService.Instance.History.replace(NavService.Instance.getDashboardAddress(WalletType.Web3, account));
          return;
        }
      }
    }
    
    const walletDetails = {
      walletType: walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr),
      walletAddress: this.props.match.params.walletAddress
    };

    let isENSSetup;
    if (this.state.walletDetails.walletType === WalletType.NonWeb3) {
      if (this.props.match.params.walletAddress) {
        isENSSetup = await TorqueProvider.Instance.checkENSSetup(this.props.match.params.walletAddress);
      }
    } else {
      isENSSetup = true;
    }

    let items: IBorrowedFundsState[] = [];
    if (isENSSetup) {
      items = await TorqueProvider.Instance.getLoansList(walletDetails);
    }

    this.setState({
      ...this.state,
      walletDetails: walletDetails,
      items: items,
      isENSSetup: isENSSetup
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
        <SetupENSDlg ref={this.setupENSDlgRef} />
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
                { this.state.isENSSetup ? (
                  <React.Fragment>
                    <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                      <div onClick={this.refreshPage} style={{ cursor: `pointer` }}>
                        Click to refresh and see recent loan activity.
                      </div>
                    </div>
                    <BorrowedFundsList
                      walletDetails={this.state.walletDetails}
                      items={this.state.items}
                      onManageCollateral={this.onManageCollateral}
                      onRepayLoan={this.onRepayLoan}
                      onExtendLoan={this.onExtendLoan}
                    />
                  </React.Fragment>
                ) : 
                  this.state.isENSSetup !== undefined ? (
                    <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                      <div onClick={this.onSetupENS} style={{ cursor: `pointer` }}>
                        Click to enable this wallet for ENS Loans.
                      </div>
                    </div>
                  ) : ``
                }
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
  
  private refreshPage = () => {
    window.location.reload();
  };

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

  private onSetupENS = async () => {
    if (this.setupENSDlgRef.current) {
      try {
        const setupENSRequest = await this.setupENSDlgRef.current.getValue(
          this.state.walletDetails
        );
        await TorqueProvider.Instance.setupENS(setupENSRequest);
      } finally {
        this.setupENSDlgRef.current.hide();
      }
    }
  };

  private doNetworkConnect = () => {
    if (this.props.doNetworkConnect) {
      this.props.doNetworkConnect("b");
    }
  };
}
