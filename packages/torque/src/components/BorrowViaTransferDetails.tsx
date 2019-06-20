import { BigNumber } from "@0x/utils";
import React, { Component } from "react";

import ic_copy from "./../assets/images/ic_copy.svg"

export interface IBorrowViaTransferDetailsProps {
  ethAmount: BigNumber;
  contractAddress: string;

  onCopyAddressClick?: () => void;
}

export class BorrowViaTransferDetails extends Component<IBorrowViaTransferDetailsProps> {
  public render() {
    return (
      <div className="borrow-via-transfer-details">
        <div className="borrow-via-transfer-details__title">
          Send <span className="borrow-via-transfer-details__title-amount">{this.props.ethAmount.toFixed(3)} ETH</span>{" "}
          to
        </div>
        <div className="borrow-via-transfer-details__input-container">
          <input type="text" className="borrow-via-transfer-details__input" value={this.props.contractAddress} />
          <img className="borrow-via-transfer-details__input-btn" src={ic_copy} onClick={this.props.onCopyAddressClick} />
        </div>
      </div>
    );
  }
}
