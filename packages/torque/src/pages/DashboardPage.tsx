import { BigNumber } from "@0x/utils";
import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { BorrowedFundsList } from "../components/BorrowedFundsList";
import { ManageCollateralDlg } from "../components/ManageCollateralDlg";
import { RepayLoanDlg } from "../components/RepayLoanDlg";
import { WalletAddressDlg } from "../components/WalletAddressDlg";
import { WalletAddressHint } from "../components/WalletAddressHint";
import { WalletAddressLargeForm } from "../components/WalletAddressLargeForm";
import { Asset } from "../domain/Asset";
import { BorrowedFundsState } from "../domain/BorrowedFundsState";
import { WalletType, walletTypeAbbrToWalletType } from "../domain/WalletType";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";
import { NavService } from "../services/NavService";

export interface IDashboardPageRouteParams {
  walletTypeAbbr: string;
  walletAddress: string | undefined;
}

export interface IDashboardPageParams {
  doNetworkConnect?: () => void;
  isLoading: boolean;
}

export class DashboardPage extends PureComponent<IDashboardPageParams & RouteComponentProps<IDashboardPageRouteParams>> {
  private manageCollateralDlgRef: RefObject<ManageCollateralDlg>;
  private repayLoanDlgRef: RefObject<RepayLoanDlg>;
  private walletAddressDlgRef: RefObject<WalletAddressDlg>;

  constructor(props: any) {
    super(props);

    this.manageCollateralDlgRef = React.createRef();
    this.repayLoanDlgRef = React.createRef();
    this.walletAddressDlgRef = React.createRef();

    this.state = { walletAddress: this.props.match.params.walletAddress };
  }

  public render() {
    const items: BorrowedFundsState[] = [
      {
        asset: Asset.ETH,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        asset: Asset.WBTC,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        asset: Asset.DAI,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        asset: Asset.DAI,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        asset: Asset.DAI,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        asset: Asset.DAI,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        asset: Asset.DAI,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      }
    ];

    const walletType = walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr);
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
                  walletType === WalletType.NonWeb3 ? (
                    <WalletAddressHint
                      walletAddress={this.props.match.params.walletAddress}
                      onSelectNewWalletAddress={this.onSelectNewWalletAddress}
                      onClearWalletAddress={this.onClearWalletAddress}
                    />
                  ) : null
                }
                <BorrowedFundsList
                  items={items}
                  onRepayLoan={this.onRepayLoan}
                  onManageCollateral={this.onManageCollateral}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {
                  walletType === WalletType.NonWeb3 ? (
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

  private onRepayLoan = async (item: BorrowedFundsState) => {
    if (this.repayLoanDlgRef.current) {
      try {
        await this.repayLoanDlgRef.current.getValue(item.asset);
      } finally {
        this.repayLoanDlgRef.current.hide();
      }
    }
  };

  private onManageCollateral = async (item: BorrowedFundsState) => {
    if (this.manageCollateralDlgRef.current) {
      try {
        await this.manageCollateralDlgRef.current.getValue(item.asset);
      } finally {
        this.manageCollateralDlgRef.current.hide();
      }
    }
  };
}
