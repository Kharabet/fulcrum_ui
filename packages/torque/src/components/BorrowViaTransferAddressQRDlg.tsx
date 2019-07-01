import React, { Component } from "react";
import ReactModal from "react-modal";
import { BorrowViaTransferAddressQRForm } from "./BorrowViaTransferAddressQRForm";
import { DialogHeader } from "./DialogHeader";

export interface IBorrowViaTransferAddressQRDlgProps {
  address: string;
}

interface IBorrowViaTransferAddressQRDlgState {
  isOpen: boolean;
}

export class BorrowViaTransferAddressQRDlg extends Component<
  IBorrowViaTransferAddressQRDlgProps,
  IBorrowViaTransferAddressQRDlgState
> {
  constructor(props: IBorrowViaTransferAddressQRDlgProps) {
    super(props);

    this.state = { isOpen: false };
  }

  public render() {
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        onRequestClose={this.onFormDecline}
      >
        <DialogHeader title="QR code" onDecline={this.onFormDecline} />
        <BorrowViaTransferAddressQRForm address={this.props.address} onDecline={this.onFormDecline} />
      </ReactModal>
    );
  }

  public open = () => {
    this.setState({ ...this.state, isOpen: true });
  };

  private onFormDecline = () => {
    this.setState({ ...this.state, isOpen: false });
  };
}
