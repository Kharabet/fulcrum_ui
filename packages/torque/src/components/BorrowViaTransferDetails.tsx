import { BigNumber } from "@0x/utils";
import React, { Component, RefObject } from "react";

import ic_copy from "./../assets/images/ic_copy.svg"
import ic_qr_code from "./../assets/images/ic_qr_code.svg"
import { BorrowViaTransferAddressQRDlg } from "./BorrowViaTransferAddressQRDlg";

export interface IBorrowViaTransferDetailsProps {
  ethAmount: BigNumber;
  contractAddress: string;
}

export class BorrowViaTransferDetails extends Component<IBorrowViaTransferDetailsProps> {
  private borrowViaTransferAddressQRDlg: RefObject<BorrowViaTransferAddressQRDlg>;

  constructor(props: IBorrowViaTransferDetailsProps) {
    super(props);

    this.borrowViaTransferAddressQRDlg = React.createRef();
  }

  public render() {
    return (
      <React.Fragment>
        <BorrowViaTransferAddressQRDlg ref={this.borrowViaTransferAddressQRDlg} address={this.props.contractAddress} />
        <div className="borrow-via-transfer-details">
          <div className="borrow-via-transfer-details__title">
            Send <span className="borrow-via-transfer-details__title-amount">{this.props.ethAmount.toFixed(3)} ETH</span>{" "}
            to
          </div>
          <div className="borrow-via-transfer-details__input-container">
            <input type="text" className="borrow-via-transfer-details__input" value={this.props.contractAddress} />
            <div className="borrow-via-transfer-details__input-actions">
              <img className="borrow-via-transfer-details__input-btn" src={ic_qr_code} onClick={this.onShowAddressQRClick} />
              <img className="borrow-via-transfer-details__input-btn" src={ic_copy} onClick={this.onCopyAddressClick} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  private onShowAddressQRClick = () => {
    if (this.borrowViaTransferAddressQRDlg.current) {
      this.borrowViaTransferAddressQRDlg.current.open();
    }
  };

  private onCopyAddressClick = async () => {
    await navigator.clipboard.writeText(this.props.contractAddress);
  };
}
