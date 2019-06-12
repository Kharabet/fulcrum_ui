import { BigNumber } from "@0x/utils";
import React, { Component } from "react";

export interface IBorrowViaTransferDetailsProps {
  ethAmount: BigNumber;
  contractAddress: string;
}

export class BorrowViaTransferDetails extends Component<IBorrowViaTransferDetailsProps> {
  public render() {
    return (
      <div className="borrow-via-transfer-details">
        <div>Send {this.props.ethAmount.toFixed(3)} ETH to</div>
        <div>
          <input type="text" value={this.props.ethAmount.toFixed()} />
          <button onClick={this.onCopyAddressClick}>CP</button>
        </div>
      </div>
    );
  }

  private onCopyAddressClick = () => {
    //
  };
}
