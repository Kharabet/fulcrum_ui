import React, { Component } from "react";
import ReactModal from "react-modal";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { DialogHeader } from "./DialogHeader";
import { ExtendLoanForm } from "./ExtendLoanForm";

interface IExtendLoanDlgState {
  isOpen: boolean;
  walletDetails: IWalletDetails | null;
  loanOrderState: IBorrowedFundsState | null;

  executorParams: { resolve: (value?: ExtendLoanRequest) => void; reject: (reason?: any) => void } | null;
}

export class ExtendLoanDlg extends Component<any, IExtendLoanDlgState> {
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
        <DialogHeader title="Extend Loan" onDecline={this.onFormDecline} />
        <ExtendLoanForm
          walletDetails={this.state.walletDetails}
          loanOrderState={this.state.loanOrderState}
          onSubmit={this.onFormSubmit}
          onCLose={this.onFormDecline}
        />
      </ReactModal>
    );
  }

  public getValue = async (walletDetails: IWalletDetails, item: IBorrowedFundsState): Promise<ExtendLoanRequest> => {
    if (this.state.isOpen) {
      return new Promise<ExtendLoanRequest>((resolve, reject) => reject());
    }

    return new Promise<ExtendLoanRequest>((resolve, reject) => {
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

  private onFormSubmit = (value: ExtendLoanRequest) => {
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
