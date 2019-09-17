import React, { Component } from "react";
import ReactModal from "react-modal";
import { Asset } from "../domain/Asset";
import { DialogHeader } from "./DialogHeader";
import { WalletAddressForm } from "./WalletAddressForm";

interface IWalletAddressDlgState {
  isOpen: boolean;
  asset: Asset;

  executorParams: { resolve: (value?: string) => void; reject: (reason?: any) => void } | null;
}

export class WalletAddressDlg extends Component<any, IWalletAddressDlgState> {
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
        shouldCloseOnOverlayClick={false}
      >
        <DialogHeader title="Enter wallet address" onDecline={this.onFormDecline} />
        <WalletAddressForm onSubmit={this.onFormSubmit} />
      </ReactModal>
    );
  }

  public getValue = async (): Promise<string> => {
    if (this.state.isOpen) {
      return new Promise<string>((resolve, reject) => reject());
    }

    return new Promise<string>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject }
      });
    });
  };

  public hide = () => {
    this.setState({ ...this.state, isOpen: false, executorParams: null });
  };

  private onFormSubmit = (value: string) => {
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
