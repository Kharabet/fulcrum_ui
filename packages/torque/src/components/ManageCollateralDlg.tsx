import React, { Component } from "react";
import ReactModal from "react-modal";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { DialogHeader } from "./DialogHeader";
import { ManageCollateralFormWeb3 } from "./ManageCollateralFormWeb3";

interface IManageCollateralDlgState {
  isOpen: boolean;
  loanOrderState: IBorrowedFundsState | null;

  executorParams: { resolve: (value?: ManageCollateralRequest) => void; reject: (reason?: any) => void } | null;
}

export class ManageCollateralDlg extends Component<any, IManageCollateralDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = { isOpen: false, loanOrderState: null, executorParams: null };
  }

  public render() {

    if (this.state.loanOrderState === null) {
      return null;
    }

    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        onRequestClose={this.onFormDecline}
      >
        <DialogHeader title="Manage Collateral" onDecline={this.onFormDecline} />
        
        <ManageCollateralFormWeb3
          loanOrderState={this.state.loanOrderState}
          onSubmit={this.onFormSubmit}
          onClose={this.onFormDecline}
        />
      </ReactModal>
    );
  }

  public getValue = async (item: IBorrowedFundsState): Promise<ManageCollateralRequest> => {
    if (this.state.isOpen) {
      return new Promise<ManageCollateralRequest>((resolve, reject) => reject());
    }

    return new Promise<ManageCollateralRequest>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        loanOrderState: item
      });
    });
  };

  private hide = async () => {
    await this.setState({ ...this.state, isOpen: false, executorParams: null });
  };

  private onFormSubmit = async (value: ManageCollateralRequest) => {
    if (this.state.executorParams) {
      this.state.executorParams.resolve(value);
    }
    await this.hide();
  };

  private onFormDecline = async () => {
    if (this.state.executorParams) {
            this.state.executorParams.reject(new Error("Form closed"));
;
    }
    await this.hide();
  };
}
