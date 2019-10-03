import { BigNumber } from "@0x/utils";
import React, { Component, RefObject } from "react";

import { ActionType } from "../domain/ActionType";
import { Asset } from "../domain/Asset";
import { WalletType } from "../domain/WalletType";

export interface IActionViaWeb3DetailsProps {
  walletType: WalletType;
  assetAmount: BigNumber;
  borrowAsset: Asset;
  account: string;
  action: ActionType;
}

export class ActionViaWeb3Details extends Component<IActionViaWeb3DetailsProps> {

  constructor(props: IActionViaWeb3DetailsProps) {
    super(props);
  }

  public render() {

    const userENS = `${this.props.account.toLowerCase()}.tokenloan.eth`;

    let actionAsset: string = "";
    let actionContract1: string = "";
    let actionContract2: string = "";
    let classes1: string = "";
    let classes2: string = "";
    switch (this.props.action) {
      case ActionType.Borrow:
        actionAsset = "ETH";
        actionContract1 = ``;
        classes1 = "action-via-web3-details__input-center";
        break;
      case ActionType.ManageCollateral:
        actionAsset = "ETH";
        actionContract1 = ``;
        classes1 = "action-via-web3-details__input-center";
        break;
      case ActionType.ExtendLoan:
        actionAsset = this.props.borrowAsset;
        actionContract1 = userENS;
        actionContract2 = ``;
        classes1 = "action-via-web3-details__input-left";
        classes2 = "action-via-web3-details__input-center";
        break;
      case ActionType.RepayLoan:
        actionAsset = this.props.borrowAsset;
        actionContract1 = userENS;
        actionContract2 = ``;
        classes1 = "action-via-web3-details__input-left";
        classes2 = "action-via-web3-details__input-center";
        break;
    }

    return (
      <React.Fragment>
        <div className="action-via-web3-details">
          <div className="action-via-web3-details__title" style={{ marginBottom: this.props.action !== ActionType.Borrow ? `0.5rem` : undefined }}>
            Send <span className="action-via-web3-details__title-amount">{this.props.assetAmount.dp(5, BigNumber.ROUND_CEIL).toString()} {actionAsset}</span>{" "}
            to
          </div>
          <div className="action-via-web3-details__input-container">
            <input type="text" className={`action-via-web3-details__input ${classes1}`} value={actionContract1} readOnly={true} />
            <div className="action-via-web3-details__input-actions">
              {/*<img className="action-via-web3-details__input-btn" src={ic_qr_code} onClick={this.onShowAddressQRClick} />*/}
              {/*<img className="action-via-web3-details__input-btn" src={ic_copy} onClick={() => this.onCopyAddressClick(actionContract1)} style={{ marginRight: `4px` }} />*/}
            </div>
          </div>
          {this.props.action !== ActionType.Borrow && this.props.action !== ActionType.ManageCollateral ? (
            <React.Fragment>
              <div className="action-via-web3-details__title" style={{ paddingTop: `16px`, marginBottom: `0.5rem` }}>
                then send <span className="action-via-web3-details__title-amount">0 ETH</span>{" "}
                to
              </div>
              <div className="action-via-web3-details__input-container">
                <input type="text" className={`action-via-web3-details__input ${classes2}`} value={actionContract2} readOnly={true} />
                <div className="action-via-web3-details__input-actions">
                  {/*<img className="action-via-web3-details__input-btn" src={ic_qr_code} onClick={this.onShowAddressQRClick} />*/}
                  {/*<img className="action-via-web3-details__input-btn" src={ic_copy} onClick={() => this.onCopyAddressClick(actionContract2)} style={{ marginRight: `4px` }} />*/}
                </div>
              </div>
            </React.Fragment>
          ) : ``}
        </div>
      </React.Fragment>
    );
  }
}
