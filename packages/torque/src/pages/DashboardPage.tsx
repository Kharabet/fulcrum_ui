import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { BorrowedFundsList } from "../components/BorrowedFundsList";
import { ManageCollateralDlg } from "../components/ManageCollateralDlg";
import { RepayLoanDlg } from "../components/RepayLoanDlg";
import { WalletAddressDlg } from "../components/WalletAddressDlg";
import { WalletAddressHint } from "../components/WalletAddressHint";
import { WalletAddressLargeForm } from "../components/WalletAddressLargeForm";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { WalletType, walletTypeAbbrToWalletType } from "../domain/WalletType";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";

export interface IDashboardPageRouteParams {
  walletTypeAbbr: string;
  walletAddress: string | undefined;
}

export interface IDashboardPageParams {
  doNetworkConnect?: () => void;
  isLoading: boolean;
}

interface IDashboardPageState {
  walletAddress: string | undefined;
  walletType: WalletType;
  items: IBorrowedFundsState[];
}

export class DashboardPage extends PureComponent<IDashboardPageParams & RouteComponentProps<IDashboardPageRouteParams>, IDashboardPageState> {
  private manageCollateralDlgRef: RefObject<ManageCollateralDlg>;
  private repayLoanDlgRef: RefObject<RepayLoanDlg>;
  private walletAddressDlgRef: RefObject<WalletAddressDlg>;

  constructor(props: any) {
    super(props);

    this.manageCollateralDlgRef = React.createRef();
    this.repayLoanDlgRef = React.createRef();
    this.walletAddressDlgRef = React.createRef();

    this.state = { walletAddress: "", walletType: WalletType.Unknown, items: [] };
  }

  private async derivedUpdate() {
    const walletType = walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr);
    const items = await TorqueProvider.Instance.getLoansList(walletType, this.state.walletAddress);

    this.setState({
      ...this.state,
      walletAddress: this.props.match.params.walletAddress,
      walletType: walletType,
      items: items
    });
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<IDashboardPageParams & RouteComponentProps<IDashboardPageRouteParams>>, prevState: Readonly<IDashboardPageState>, snapshot?: any): void {
    if (this.state.walletAddress !== prevState.walletAddress) {
      this.derivedUpdate();
    }
  }

  public render() {
    return (
      <React.Fragment>
        <ManageCollateralDlg ref={this.manageCollateralDlgRef} />
        <RepayLoanDlg ref={this.repayLoanDlgRef} />
        <WalletAddressDlg ref={this.walletAddressDlgRef} />
        <div className="dashboard-page">
          <HeaderHome isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} />
          <div className="dashboard-page__main">
            {this.props.match.params.walletAddress ? (
              <React.Fragment>
                {
                  this.state.walletType === WalletType.NonWeb3 ? (
                    <WalletAddressHint
                      walletAddress={this.props.match.params.walletAddress}
                      onSelectNewWalletAddress={this.onSelectNewWalletAddress}
                      onClearWalletAddress={this.onClearWalletAddress}
                    />
                  ) : null
                }
                <BorrowedFundsList
                  items={this.state.items}
                  onRepayLoan={this.onRepayLoan}
                  onManageCollateral={this.onManageCollateral}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {
                  this.state.walletType === WalletType.NonWeb3 ? (
                    <div className="dashboard-page__form">
                      <WalletAddressLargeForm onSubmit={this.onWalletAddressChange} />
                    </div>
                  ) : null
                }
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
    NavService.Instance.History.push(
      NavService.Instance.getDashboardAddress(WalletType.NonWeb3, "")
    );
  };

  private onWalletAddressChange = (walletAddress: string) => {
    NavService.Instance.History.push(
      NavService.Instance.getDashboardAddress(WalletType.NonWeb3, walletAddress)
    );
  };

  private onRepayLoan = async (item: IBorrowedFundsState) => {
    if (this.repayLoanDlgRef.current) {
      try {
        const repayLoanRequest = await this.repayLoanDlgRef.current.getValue(item);
        await TorqueProvider.Instance.doRepayLoan(repayLoanRequest);
      } finally {
        this.repayLoanDlgRef.current.hide();
      }
    }
  };

  private onManageCollateral = async (item: IBorrowedFundsState) => {
    if (this.manageCollateralDlgRef.current) {
      try {
        const manageCollateralRequest = await this.manageCollateralDlgRef.current.getValue(item);
        await TorqueProvider.Instance.setLoanCollateral(manageCollateralRequest);
      } finally {
        this.manageCollateralDlgRef.current.hide();
      }
    }
  };
}
