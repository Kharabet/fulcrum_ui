import QRCode from "qrcode.react";
import React, { Component } from "react";

export interface IBorrowViaTransferAddressQRFormProps {
  address: string;

  onDecline: () => void;
}

export class BorrowViaTransferAddressQRForm extends Component<IBorrowViaTransferAddressQRFormProps> {
  public render() {
    return (
      <div className="borrow-via-transfer-address-qr-form">
        <section className="dialog-content">
          <div className="borrow-via-transfer-address-qr-form__qr-container">
            <QRCode
              value={this.props.address}
              size={240}
              level={"L"}
              renderAs={"svg"}
            />
          </div>
        </section>
        <section className="dialog-actions">
          <div className="borrow-via-transfer-address-qr-form__actions-container">
            <button className="btn btn-size--small" onClick={this.props.onDecline}>Close</button>
          </div>
        </section>
      </div>
    )
  }
}
