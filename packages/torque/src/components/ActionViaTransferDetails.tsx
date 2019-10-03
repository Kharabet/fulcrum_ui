import { BigNumber } from "@0x/utils";
import React, { Component, RefObject } from "react";

import { ActionType } from "../domain/ActionType";
import { Asset } from "../domain/Asset";
import { WalletType } from "../domain/WalletType";
import ic_copy from "./../assets/images/ic_copy.svg"
import ic_qr_code from "./../assets/images/ic_qr_code.svg"
import { QRCodeForAddressDlg } from "./QRCodeForAddressDlg";

export interface IActionViaTransferDetailsProps {
  walletType?: WalletType;
  assetAmount: BigNumber;
  contractAddress: string;
  borrowAsset: Asset;
  account: string;
  action: ActionType;
}

export class ActionViaTransferDetails extends Component<IActionViaTransferDetailsProps> {
  private borrowViaTransferAddressQRDlg: RefObject<QRCodeForAddressDlg>;

  constructor(props: IActionViaTransferDetailsProps) {
    super(props);

    this.borrowViaTransferAddressQRDlg = React.createRef();
  }

  public render() {

    const userENS = `${this.props.account.toLowerCase()}.tokenloan.eth`;

    let actionAsset: string = "";
    let actionContract1: string = "";
    let actionContract2: string = "";
    let classes1: string = "";
    let classes2: string = "";
    switch (this.props.action) {
      case ActionType.SetupENS:
          actionAsset = "ETH";
          actionContract1 = this.props.contractAddress;
          classes1 = "action-via-transfer-details__input-center";
        break;
      case ActionType.Borrow:
        actionAsset = "ETH";
        actionContract1 = this.props.contractAddress;
        classes1 = "action-via-transfer-details__input-center";
        break;
      case ActionType.ManageCollateral:
        actionAsset = "ETH";
        actionContract1 = this.props.contractAddress;
        classes1 = "action-via-transfer-details__input-center";
        break;
      case ActionType.ExtendLoan:
        actionAsset = this.props.borrowAsset;
        actionContract1 = userENS;
        actionContract2 = this.props.contractAddress;
        classes1 = "action-via-transfer-details__input-left";
        classes2 = "action-via-transfer-details__input-center";
        break;
      case ActionType.RepayLoan:
        actionAsset = this.props.borrowAsset;
        actionContract1 = userENS;
        actionContract2 = this.props.contractAddress;
        classes1 = "action-via-transfer-details__input-left";
        classes2 = "action-via-transfer-details__input-center";
        break;
    }

    return (
      <React.Fragment>
        <QRCodeForAddressDlg ref={this.borrowViaTransferAddressQRDlg} address={this.props.contractAddress} />
        <div className="action-via-transfer-details">
          <div className="action-via-transfer-details__title" style={{ marginBottom: this.props.action !== ActionType.Borrow ? `0.5rem` : undefined }}>
            Send <span className="action-via-transfer-details__title-amount">{this.props.assetAmount.dp(5, BigNumber.ROUND_CEIL).toString()} {actionAsset}</span>{" "}
            to
          </div>
          <div className="action-via-transfer-details__input-container">
            <input type="text" className={`action-via-transfer-details__input ${classes1}`} value={actionContract1} readOnly={true} />
            <div className="action-via-transfer-details__input-actions">
              {/*<img className="action-via-transfer-details__input-btn" src={ic_qr_code} onClick={this.onShowAddressQRClick} />*/}
              <img className="action-via-transfer-details__input-btn" src={ic_copy} onClick={() => this.onCopyAddressClick(actionContract1)} style={{ marginRight: `4px` }} />
            </div>
          </div>
          {classes2 ? (
            <React.Fragment>
              <div className="action-via-transfer-details__title" style={{ paddingTop: `16px`, marginBottom: `0.5rem` }}>
                then send <span className="action-via-transfer-details__title-amount">0 ETH</span>{" "}
                to
              </div>
              <div className="action-via-transfer-details__input-container">
                <input type="text" className={`action-via-transfer-details__input ${classes2}`} value={actionContract2} readOnly={true} />
                <div className="action-via-transfer-details__input-actions">
                  {/*<img className="action-via-transfer-details__input-btn" src={ic_qr_code} onClick={this.onShowAddressQRClick} />*/}
                  <img className="action-via-transfer-details__input-btn" src={ic_copy} onClick={() => this.onCopyAddressClick(actionContract2)} style={{ marginRight: `4px` }} />
                </div>
              </div>
            </React.Fragment>
          ) : ``}
        </div>
      </React.Fragment>
    );
  }

  private onShowAddressQRClick = () => {
    if (this.borrowViaTransferAddressQRDlg.current) {
      this.borrowViaTransferAddressQRDlg.current.open();
    }
  };

  private onCopyAddressClick = async (address: string) => {
    await navigator.clipboard.writeText(address);
  };
}
