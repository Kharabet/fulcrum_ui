import React, { Component } from "react";
import ReactModal from "react-modal";
import { IBorrowMoreState } from "../domain/IBorrowMoreState";
import { BorrowMoreRequest } from "../domain/BorrowMoreRequest";
import { DialogHeader } from "./DialogHeader";
import { BorrowMoreForm } from "./BorrowMoreForm";

interface IBorrowMoreDlgState {
  isOpen: boolean;
  loanOrderState: IBorrowMoreState | null;

  executorParams: { resolve: (value?: BorrowMoreRequest) => void; reject: (reason?: any) => void } | null;
}

export class BorrowMoreDlg extends Component<any, IBorrowMoreDlgState> {
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
        shouldCloseOnOverlayClick={false}
      >
        <DialogHeader title="Borrow More" onDecline={this.onFormDecline} />
        <BorrowMoreForm
          loanOrderState={this.state.loanOrderState}
          onSubmit={this.onFormSubmit}
          onDecline={this.onFormDecline}
        />
      </ReactModal>
    );
  }

  public getValue = async (item: IBorrowMoreState): Promise<BorrowMoreRequest> => {
    if (this.state.isOpen) {
      return new Promise<BorrowMoreRequest>((resolve, reject) => reject());
    }

    return new Promise<BorrowMoreRequest>((resolve, reject) => {
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

  private onFormSubmit = async (value: BorrowMoreRequest) => {
    if (this.state.executorParams) {
      this.state.executorParams.resolve(value);
    }
    await this.hide();
  };

  private onFormDecline = async () => {
    if (this.state.executorParams) {
      this.state.executorParams.reject();
    }
    await this.hide();
  };
}
