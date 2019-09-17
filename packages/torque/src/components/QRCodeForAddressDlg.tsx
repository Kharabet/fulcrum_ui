import React, { Component } from "react";
import ReactModal from "react-modal";
import { DialogHeader } from "./DialogHeader";
import { QRCodeForAddressForm } from "./QRCodeForAddressForm";

export interface IQRCodeForAddressDlgProps {
  address: string;
}

interface IQRCodeForAddressDlgState {
  isOpen: boolean;
}

export class QRCodeForAddressDlg extends Component<
  IQRCodeForAddressDlgProps,
  IQRCodeForAddressDlgState
> {
  constructor(props: IQRCodeForAddressDlgProps) {
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
        shouldCloseOnOverlayClick={false}
      >
        <DialogHeader title="QR code" onDecline={this.onFormDecline} />
        <QRCodeForAddressForm address={this.props.address} onDecline={this.onFormDecline} />
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
