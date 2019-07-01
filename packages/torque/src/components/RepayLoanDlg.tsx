import React, { Component } from "react";
import ReactModal from "react-modal";
import { Asset } from "../domain/Asset";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { DialogHeader } from "./DialogHeader";
import { RepayLoanForm } from "./RepayLoanForm";

interface IRepayLoanDlgState {
  isOpen: boolean;
  asset: Asset;

  executorParams: { resolve: (value?: RepayLoanRequest) => void; reject: (reason?: any) => void } | null;
}

export class RepayLoanDlg extends Component<any, IRepayLoanDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = { isOpen: false, asset: Asset.UNKNOWN, executorParams: null };
  }

  public render() {
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        onRequestClose={this.onFormDecline}
      >
        <DialogHeader title="Repay Loan" onDecline={this.onFormDecline} />
        <RepayLoanForm
          asset={this.state.asset}
          onSubmit={this.onFormSubmit}
        />
      </ReactModal>
    );
  }

  public getValue = async (asset: Asset): Promise<RepayLoanRequest> => {
    if (this.state.isOpen) {
      return new Promise<RepayLoanRequest>((resolve, reject) => reject());
    }

    return new Promise<RepayLoanRequest>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        asset: asset
      });
    });
  };

  public hide = () => {
    this.setState({ ...this.state, isOpen: false, executorParams: null });
  };

  private onFormSubmit = (value: RepayLoanRequest) => {
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
