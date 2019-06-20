import React, { Component } from "react";
import ReactModal from "react-modal";
import { Asset } from "../domain/Asset";
import { CollateralTokenSelector } from "./CollateralTokenSelector";
import { DialogHeader } from "./DialogHeader";

interface ICollateralTokenSelectorDlgState {
  isOpen: boolean;
  collateralAsset: Asset;

  executorParams: { resolve: (value?: Asset) => void; reject: (reason?: any) => void } | null;
}

export class CollateralTokenSelectorDlg extends Component<any, ICollateralTokenSelectorDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = { isOpen: false, collateralAsset: Asset.UNKNOWN, executorParams: null };
  }

  public render() {
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        onRequestClose={this.onFormDecline}
      >
        <DialogHeader title={`Select collateral token`} onDecline={this.onFormDecline} />
        <CollateralTokenSelector selectedCollateral={this.state.collateralAsset} onCollateralChange={this.onFormSubmit} onClose={this.onFormDecline} />
      </ReactModal>
    );
  }

  public getValue = async (asset: Asset): Promise<Asset> => {
    if (this.state.isOpen) {
      return new Promise<Asset>((resolve, reject) => reject());
    }

    return new Promise<Asset>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        collateralAsset: asset
      });
    });
  };

  public hide = () => {
    this.setState({ ...this.state, isOpen: false, executorParams: null });
  };

  private onFormSubmit = (value: Asset) => {
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
