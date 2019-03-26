import React, { Component } from "react";
import Modal from "react-modal";
import { LendForm } from "../components/LendForm";
import { LendTokenSelector } from "../components/LendTokenSelector";
import { Asset } from "../domain/Asset";
import { LendRequest } from "../domain/LendRequest";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import FulcrumProvider from "../services/FulcrumProvider";

interface ILendPageState {
  isLendModalOpen: boolean;
  lendAsset: Asset;
}

export class LendPage extends Component<any, ILendPageState> {
  constructor(props: any) {
    super(props);

    this.state = { isLendModalOpen: false, lendAsset: Asset.UNKNOWN };
  }

  public render() {
    return (
      <div className="lend-page">
        <HeaderOps />
        <main>
          <LendTokenSelector onLoan={this.onLendRequested} />
          <Modal
            isOpen={this.state.isLendModalOpen}
            onRequestClose={this.onRequestClose}
            className="modal-content-div"
            overlayClassName="modal-overlay-div"
          >
            <LendForm
              asset={this.state.lendAsset}
              onSubmit={this.onLendConfirmed}
              onCancel={this.onRequestClose}
            />
          </Modal>
        </main>
        <Footer />
      </div>
    );
  }

  public onLendRequested = (request: LendRequest) => {
    if (request) {
      this.setState({ ...this.state, isLendModalOpen: true, lendAsset: request.asset });
    }
  };

  public onLendConfirmed = (request: LendRequest) => {
    FulcrumProvider.onLendConfirmed(request);
    this.setState({ ...this.state, isLendModalOpen: false, lendAsset: Asset.UNKNOWN });
  };

  public onRequestClose = () => {
    this.setState({ ...this.state, isLendModalOpen: false });
  };
}
