import React, { Component } from "react";
import ReactModal from "react-modal";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { DialogHeader } from "./DialogHeader";
import { RepayLoanForm } from "./RepayLoanForm";

interface IRepayLoanDlgState {
  isOpen: boolean;
  walletDetails: IWalletDetails | null;
  loanOrderState: IBorrowedFundsState | null;
  didSubmit: boolean;

  executorParams: { resolve: (value?: RepayLoanRequest) => void; reject: (reason?: any) => void } | null;
}

export class RepayLoanDlg extends Component<any, IRepayLoanDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = { isOpen: false, walletDetails: null, loanOrderState: null, didSubmit: false, executorParams: null };
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
        <DialogHeader title="Repay Loan" onDecline={this.onFormDecline} />
        <RepayLoanForm
          walletDetails={this.state.walletDetails}
          loanOrderState={this.state.loanOrderState}
          onSubmit={this.onFormSubmit}
          onClose={this.onFormDecline}
          didSubmit={this.state.didSubmit}
          toggleDidSubmit={this.toggleDidSubmit} 
        />
      </ReactModal>
    );
  }

  public toggleDidSubmit = (submit: boolean) => {
    this.setState({
      ...this.state,
      didSubmit: submit
    });
  }

  public getValue = async (walletDetails: IWalletDetails, item: IBorrowedFundsState): Promise<RepayLoanRequest> => {
    if (this.state.isOpen) {
      return new Promise<RepayLoanRequest>((resolve, reject) => reject());
    }

    return new Promise<RepayLoanRequest>((resolve, reject) => {
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
    this.setState({ ...this.state, isOpen: false, executorParams: null, didSubmit: false });
  };

  private onFormSubmit = (value: RepayLoanRequest) => {
    if (this.state.executorParams) {
      this.state.executorParams.resolve(value);
    }
  };

  private onFormDecline = () => {
    this.hide();
    if (this.state.executorParams) {
      this.state.executorParams.reject();
    }
  };
}
