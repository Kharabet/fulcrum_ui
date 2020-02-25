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
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
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
  itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting>;
  isDataLoading: boolean;
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

    this.state = { walletDetails: { walletType: WalletType.Unknown, walletAddress: "" }, items: [], itemsAwaiting: [], isENSSetup: undefined, isDataLoading: true };

    // TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private async derivedUpdate() {
    if (TorqueProvider.Instance.unsupportedNetwork) {
      return;
    }

    const walletType = walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr);
    let walletAddress = this.props.match.params.walletAddress ?
      this.props.match.params.walletAddress.toLowerCase() :
      "";
    if (walletType === WalletType.Web3) {
      const account = TorqueProvider.Instance.accounts.length !== 0 ?
        TorqueProvider.Instance.accounts[0].toLowerCase() :
        "";
      if (!account || !TorqueProvider.Instance.contractsSource || !TorqueProvider.Instance.contractsSource.canWrite) {
        return;
      } else {
        if (walletAddress.toLowerCase() !== account) {
          NavService.Instance.History.replace(NavService.Instance.getDashboardAddress(WalletType.Web3, account));
          walletAddress = account;
        }
      }
    }

    const walletDetails = {
      walletType: walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr),
      walletAddress: walletAddress
    };

    let isENSSetup;
    // if (this.state.walletDetails.walletType === WalletType.NonWeb3) {
    //   if (walletAddress) {
    //     isENSSetup = await TorqueProvider.Instance.checkENSSetup(walletAddress);
    //   }
    // } else {
    //   isENSSetup = true;
    // }
    isENSSetup = undefined;


    let items: IBorrowedFundsState[] = [];
    let itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting> = [];
    if (isENSSetup) {
      // console.log(walletDetails);
      items = await TorqueProvider.Instance.getLoansList(walletDetails);
      itemsAwaiting = await TorqueProvider.Instance.getLoansAwaitingList(walletDetails);
      // console.log(items);
      // console.log(itemsAwaiting);
    }

    this.setState({
      ...this.state,
      walletDetails: walletDetails,
      items: items,
      itemsAwaiting: itemsAwaiting,
      isENSSetup: isENSSetup,
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

  public componentDidUpdate(
    prevProps: Readonly<IDashboardPageParams & RouteComponentProps<IDashboardPageRouteParams>>,
    prevState: Readonly<IDashboardPageState>,
    snapshot?: any
  ): void {
    if (this.state.walletDetails.walletAddress !== prevState.walletDetails.walletAddress) {
      // console.log("componentDidUpdate", this.state.walletDetails.walletAddress, prevState.walletDetails.walletAddress);
      this.refreshPage();
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
                {this.state.walletDetails.walletType === WalletType.NonWeb3 || this.state.walletDetails.walletType === WalletType.ViewOnly ? (
                  <WalletAddressHint
                    walletAddress={this.state.walletDetails.walletAddress || ""}
                    onSelectNewWalletAddress={this.onSelectNewWalletAddress}
                    onClearWalletAddress={this.onClearWalletAddress}
                  />
                ) : null}
                { !TorqueProvider.Instance.unsupportedNetwork && this.state.isENSSetup ? (
                  <React.Fragment>
                    <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                      {this.state.isDataLoading ? (
                        <div>
                          Loading...
                        </div>
                      ) : (
                        <div onClick={this.refreshPage} style={{ cursor: `pointer` }}>
                          Click to refresh and see recent loan activity.
                        </div>
                      )}
                    </div>
                    <BorrowedFundsList
                      walletDetails={this.state.walletDetails}
                      items={this.state.items}
                      itemsAwaiting={this.state.itemsAwaiting}
                      onManageCollateral={this.onManageCollateral}
                      onRepayLoan={this.onRepayLoan}
                      onExtendLoan={this.onExtendLoan}
                    />
                  </React.Fragment>
                ) :
                  TorqueProvider.Instance.unsupportedNetwork ? (
                    <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                      <div style={{ cursor: `pointer` }}>
                        You are connected to the wrong network.
                      </div>
                    </div>
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
                {this.state.walletDetails.walletType === WalletType.NonWeb3 || this.state.walletDetails.walletType === WalletType.ViewOnly ? (
                  <div className="dashboard-page__form">
                    <WalletAddressLargeForm onSubmit={this.onWalletAddressChange} />
                  </div>
                ) : <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                      <div>
                          Loading...
                        </div>
                </div>}
              </React.Fragment>
            )}
          </div>
          <Footer />
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
    // console.log("onClearWalletAddress");
    NavService.Instance.History.replace(NavService.Instance.getDashboardAddress(WalletType.NonWeb3, ""));
    this.props.match.params.walletAddress = "";
    this.refreshPage();
  };

  private onWalletAddressChange = (walletAddress: string) => {
    // console.log("onWalletAddressChange", walletAddress);
    NavService.Instance.History.replace(NavService.Instance.getDashboardAddress(WalletType.NonWeb3, walletAddress));
    this.props.match.params.walletAddress = walletAddress;
    this.refreshPage();
  };

  private onRepayLoan = async (item: IBorrowedFundsState) => {
    if (this.repayLoanDlgRef.current) {
      try {
        const repayLoanRequest = await this.repayLoanDlgRef.current.getValue(this.state.walletDetails, item);
        await TorqueProvider.Instance.doRepayLoan(repayLoanRequest);

        this.repayLoanDlgRef.current.toggleDidSubmit(false);
        await this.repayLoanDlgRef.current.hide();
      } catch(error) {
        /*let errorMsg;
        if (error.message) {
          errorMsg = error.message;
        } else if (typeof error === "string") {
          errorMsg = error;
        }

        if (errorMsg) {
          if (errorMsg.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)) {
            errorMsg = "The transaction seems like it will fail. You can submit the transaction anyway, or cancel.";
          } else if (errorMsg.includes("Reverted by EVM")) {
            errorMsg = "The transaction failed. Click View More for details.";
          } else if (errorMsg.includes("MetaMask Tx Signature: User denied transaction signature.")) {
            errorMsg = "You didn't confirm in MetaMask. Please try again.";
            await this.repayLoanDlgRef.current.hide();
          } else if (errorMsg.includes("User denied account authorization.")) {
            errorMsg = "You didn't authorize MetaMask. Please try again.";
          } else if (errorMsg.includes("Transaction rejected")) {
            errorMsg = "You didn't confirm in Gnosis Safe. Please try again.";
          } else {
            errorMsg = "";
          }
        }*/

        this.repayLoanDlgRef.current.toggleDidSubmit(false);
        await this.repayLoanDlgRef.current.hide();
      }
    }
  };

  private onExtendLoan = async (item: IBorrowedFundsState) => {
    if (this.extendLoanDlgRef.current) {
      try {
        const extendLoanRequest = await this.extendLoanDlgRef.current.getValue(this.state.walletDetails, item);
        await TorqueProvider.Instance.doExtendLoan(extendLoanRequest);

        this.extendLoanDlgRef.current.toggleDidSubmit(false);
        await this.extendLoanDlgRef.current.hide();
      } catch(error) {
        /*let errorMsg;
        if (error.message) {
          errorMsg = error.message;
        } else if (typeof error === "string") {
          errorMsg = error;
        }

        if (errorMsg) {
          if (errorMsg.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)) {
            errorMsg = "The transaction seems like it will fail. You can submit the transaction anyway, or cancel.";
          } else if (errorMsg.includes("Reverted by EVM")) {
            errorMsg = "The transaction failed. Click View More for details.";
          } else if (errorMsg.includes("MetaMask Tx Signature: User denied transaction signature.")) {
            errorMsg = "You didn't confirm in MetaMask. Please try again.";
            await this.extendLoanDlgRef.current.hide();
          } else if (errorMsg.includes("User denied account authorization.")) {
            errorMsg = "You didn't authorize MetaMask. Please try again.";
          } else if (errorMsg.includes("Transaction rejected")) {
            errorMsg = "You didn't confirm in Gnosis Safe. Please try again.";
          } else {
            errorMsg = "";
          }
        }*/

        this.extendLoanDlgRef.current.toggleDidSubmit(false);
        await this.extendLoanDlgRef.current.hide();
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
        await TorqueProvider.Instance.doManageCollateral(manageCollateralRequest);

        this.manageCollateralDlgRef.current.toggleDidSubmit(false);
        await this.manageCollateralDlgRef.current.hide();
      } catch(error) {
        /*let errorMsg;
        if (error.message) {
          errorMsg = error.message;
        } else if (typeof error === "string") {
          errorMsg = error;
        }

        if (errorMsg) {
          if (errorMsg.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)) {
            errorMsg = "The transaction seems like it will fail. You can submit the transaction anyway, or cancel.";
          } else if (errorMsg.includes("Reverted by EVM")) {
            errorMsg = "The transaction failed. Click View More for details.";
          } else if (errorMsg.includes("MetaMask Tx Signature: User denied transaction signature.")) {
            errorMsg = "You didn't confirm in MetaMask. Please try again.";
            await this.manageCollateralDlgRef.current.hide();
          } else if (errorMsg.includes("User denied account authorization.")) {
            errorMsg = "You didn't authorize MetaMask. Please try again.";
          } else if (errorMsg.includes("Transaction rejected")) {
            errorMsg = "You didn't confirm in Gnosis Safe. Please try again.";
          } else {
            errorMsg = "";
          }
        }*/

        this.manageCollateralDlgRef.current.toggleDidSubmit(false);
        await this.manageCollateralDlgRef.current.hide();
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

        await this.setupENSDlgRef.current.hide();
      } catch(error) {
        /*let errorMsg;
        if (error.message) {
          errorMsg = error.message;
        } else if (typeof error === "string") {
          errorMsg = error;
        }

        if (errorMsg) {
          if (errorMsg.includes(`Request for method "eth_estimateGas" not handled by any subprovider`)) {
            errorMsg = "The transaction seems like it will fail. You can submit the transaction anyway, or cancel.";
          } else if (errorMsg.includes("Reverted by EVM")) {
            errorMsg = "The transaction failed. Click View More for details.";
          } else if (errorMsg.includes("MetaMask Tx Signature: User denied transaction signature.")) {
            errorMsg = "You didn't confirm in MetaMask. Please try again.";
            await this.setupENSDlgRef.current.hide();
          } else if (errorMsg.includes("User denied account authorization.")) {
            errorMsg = "You didn't authorize MetaMask. Please try again.";
          } else if (errorMsg.includes("Transaction rejected")) {
            errorMsg = "You didn't confirm in Gnosis Safe. Please try again.";
          } else {
            errorMsg = "";
          }
        }*/

        await this.setupENSDlgRef.current.hide();
        // this.setupENSDlgRef.current.toggleDidSubmit(false);
      }
    }
  };

  private doNetworkConnect = () => {
    if (this.props.doNetworkConnect) {
      this.props.doNetworkConnect("b");
    }
  };
}
