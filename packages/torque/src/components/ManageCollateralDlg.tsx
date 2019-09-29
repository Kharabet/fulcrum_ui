import React, { Component } from "react";
import ReactModal from "react-modal";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { WalletType } from "../domain/WalletType";
import { DialogHeader } from "./DialogHeader";
// import { ManageCollateralForm } from "./ManageCollateralForm";
import { ManageCollateralFormNonWeb3 } from "./ManageCollateralFormNonWeb3";

interface IManageCollateralDlgState {
  isOpen: boolean;
  walletDetails: IWalletDetails | null;
  loanOrderState: IBorrowedFundsState | null;

  executorParams: { resolve: (value?: ManageCollateralRequest) => void; reject: (reason?: any) => void } | null;
}

export class ManageCollateralDlg extends Component<any, IManageCollateralDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = { isOpen: false, walletDetails: null, loanOrderState: null, executorParams: null };
  }

  public render() {
    if (this.state.walletDetails === null) {
      return null;
    }

    if (this.state.loanOrderState === null) {
      return null;
    }

    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        onRequestClose={this.onFormDecline}
        shouldCloseOnOverlayClick={false}
      >
        {this.state.walletDetails.walletType === WalletType.NonWeb3 ? (
          <React.Fragment>
            <DialogHeader title="Top up how much collateral?" onDecline={this.onFormDecline} />
            <ManageCollateralFormNonWeb3
              walletDetails={this.state.walletDetails}
              loanOrderState={this.state.loanOrderState}
              onSubmit={this.onFormSubmit}
              onCLose={this.onFormDecline}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DialogHeader title="Manage Collateral" onDecline={this.onFormDecline} />
            <ManageCollateralFormNonWeb3
              walletDetails={this.state.walletDetails}
              loanOrderState={this.state.loanOrderState}
              onSubmit={this.onFormSubmit}
              onCLose={this.onFormDecline}
            />
          </React.Fragment>
        )}
      </ReactModal>
    );
  }

  public getValue = async (walletDetails: IWalletDetails, item: IBorrowedFundsState): Promise<ManageCollateralRequest> => {
    if (this.state.isOpen) {
      return new Promise<ManageCollateralRequest>((resolve, reject) => reject());
    }

    return new Promise<ManageCollateralRequest>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        walletDetails: walletDetails,
        loanOrderState: item
      });
    });
  };

  public hide = () => {
    this.setState({ ...this.state, isOpen: false, executorParams: null });
  };

  private onFormSubmit = (value: ManageCollateralRequest) => {
    if (this.state.executorParams) {
      this.state.executorParams.resolve(value);
    }
  };

  private onFormDecline = () => {
    if (this.state.executorParams) {
      this.state.executorParams.reject();
    }
  };
}
