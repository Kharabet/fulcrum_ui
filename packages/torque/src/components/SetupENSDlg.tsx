import React, { Component } from "react";
import ReactModal from "react-modal";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { SetupENSRequest } from "../domain/SetupENSRequest";
import { DialogHeader } from "./DialogHeader";
import { SetupENSForm } from "./SetupENSForm";

interface ISetupENSDlgState {
  isOpen: boolean;
  walletDetails: IWalletDetails | null;
  loanOrderState: IBorrowedFundsState | null;

  executorParams: { resolve: (value?: SetupENSRequest) => void; reject: (reason?: any) => void } | null;
}

export class SetupENSDlg extends Component<any, ISetupENSDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = { isOpen: false, walletDetails: null, loanOrderState: null, executorParams: null };
  }

  public render() {
    if (this.state.walletDetails === null) {
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
        <React.Fragment>
          <DialogHeader title="Setup ENS" onDecline={this.onFormDecline} />
          <SetupENSForm
            walletDetails={this.state.walletDetails}
            onSubmit={this.onFormSubmit}
            onClose={this.onFormDecline}
          />
        </React.Fragment>
      </ReactModal>
    );
  }

  public getValue = async (walletDetails: IWalletDetails): Promise<SetupENSRequest> => {
    if (this.state.isOpen) {
      return new Promise<SetupENSRequest>((resolve, reject) => reject());
    }

    return new Promise<SetupENSRequest>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        walletDetails: walletDetails
      });
    });
  };

  public hide = () => {
    this.setState({ ...this.state, isOpen: false, executorParams: null });
  };

  private onFormSubmit = (value: SetupENSRequest) => {
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
