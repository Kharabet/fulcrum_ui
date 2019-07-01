import React, { Component } from "react";
import ReactModal from "react-modal";
import { Asset } from "../domain/Asset";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { DialogHeader } from "./DialogHeader";
import { ManageCollateralForm } from "./ManageCollateralForm";

interface IManageCollateralDlgState {
  isOpen: boolean;
  asset: Asset;

  executorParams: { resolve: (value?: ManageCollateralRequest) => void; reject: (reason?: any) => void } | null;
}

export class ManageCollateralDlg extends Component<any, IManageCollateralDlgState> {


  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = { isOpen: false, asset: Asset.UNKNOWN, executorParams: null };
  }

  public render() {
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        onRequestClose={this.onFormDecline}
      >
        <DialogHeader title="Manage Collateral" onDecline={this.onFormDecline} />
        <ManageCollateralForm
          asset={this.state.asset}
          onSubmit={this.onFormSubmit}
        />
      </ReactModal>
    );
  }

  public getValue = async (asset: Asset): Promise<ManageCollateralRequest> => {
    if (this.state.isOpen) {
      return new Promise<ManageCollateralRequest>((resolve, reject) => reject());
    }

    return new Promise<ManageCollateralRequest>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        asset: asset
      });
    });
  };

  public hide = () => {
    this.setState({ ...this.state, isOpen: false, executorParams: null });
  };

  private onFormSubmit = (value: ManageCollateralRequest) => {
    if (this.state.executorParams) {
      this.state.executorParams.resolve(value);
    }
  };

  private onFormDecline = () => {
    if (this.state.executorParams) {
      this.state.executorParams.reject();
    }
  };
}
