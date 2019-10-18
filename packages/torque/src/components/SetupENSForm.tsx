import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent } from "react";
import { ActionType } from "../domain/ActionType";
import { Asset } from "../domain/Asset";
import { IWalletDetails } from "../domain/IWalletDetails";
import { SetupENSRequest } from "../domain/SetupENSRequest";
import { TorqueProvider } from "../services/TorqueProvider";
import { ActionViaTransferDetails } from "./ActionViaTransferDetails";

export interface ISetupENSFormProps {
  walletDetails: IWalletDetails;

  onSubmit: (request: SetupENSRequest) => void;
  onClose: () => void;
}

interface ISetupENSFormState {
  setupENSAddress: string | null;
  gasAmountNeeded: BigNumber;
}

export class SetupENSForm extends Component<ISetupENSFormProps, ISetupENSFormState> {

  constructor(props: ISetupENSFormProps, context?: any) {
    super(props, context);

    this.state = {
      setupENSAddress: null,
      gasAmountNeeded: new BigNumber(0)
    };
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getSetupENSAddress().then(setupENSAddress => {
      TorqueProvider.Instance.getLoanCollateralManagementGasAmount().then(gasAmountNeeded => {
        this.setState(
          {
            ...this.state,
            setupENSAddress: setupENSAddress,
            gasAmountNeeded: gasAmountNeeded
          }
        );
      });
    });
  }

  public render() {

    if (!this.props.walletDetails && this.props.walletDetails!.walletAddress) {
      return undefined;
    }

    return (
      <form className="setup-ens-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <div className="setup-ens-form__transfer-details">
            <ActionViaTransferDetails
              contractAddress={this.state.setupENSAddress || ""}
              borrowAsset={Asset.UNKNOWN}
              assetAmount={new BigNumber(0)}
              account={this.props.walletDetails.walletAddress!}
              action={ActionType.SetupENS}
            />
            <div className="setup-ens-form__transfer-details-msg setup-ens-form__transfer-details-msg--warning">
              Please send at least 2,500,000 gas with your transaction.
            </div>
            <div className="setup-ens-form__transfer-details-msg setup-ens-form__transfer-details-msg--warning">
              Always send funds from a private wallet to which you hold the private key!
            </div>
            {/*<div className="setup-ens-form__transfer-details-msg setup-ens-form__transfer-details-msg--warning">
              Note 3: If you want to partially repay loan use a web3 wallet!
            </div>*/}
            <div className="setup-ens-form__transfer-details-msg">
              That's it! Once you've sent the transaction, click Close to return to the dashboard.
            </div>
          </div>

        </section>
        <section className="dialog-actions">
          <div className="setup-ens-form__actions-container">
            <button type="button" className="btn btn-size--small" onClick={this.props.onClose}>
              Close
            </button>
          </div>
        </section>
      </form>
    );
  }

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.props.onSubmit(
      new SetupENSRequest(
        this.props.walletDetails,
        this.props.walletDetails!.walletAddress!
      )
    );
  };
}
