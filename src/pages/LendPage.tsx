import BigNumber from "bignumber.js";
import React, { Component } from "react";
import Modal from "react-modal";
import { LendForm } from "../components/LendForm";
import { LendTokenSelector } from "../components/LendTokenSelector";
import { Asset } from "../domain/Asset";
import { LendRequest } from "../domain/LendRequest";
import Footer from "../layout/Footer";
import HeaderOps from "../layout/HeaderOps";

interface ILendPageState {
  isLendModalOpen: boolean;
  lendAsset: Asset;
}

class LendPage extends Component<any, ILendPageState> {
  constructor(props: any) {
    super(props);

    this.state = { isLendModalOpen: false, lendAsset: Asset.UNKNOWN };
  }

  public render() {
    return (
      <div className="lend-page">
        <HeaderOps provider={null} onNetworkConnect={this.onNetworkConnect} />
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
              tokenInterestRate={new BigNumber(1)}
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
    if (request) {
      alert(`loan ${request.amount} of ${request.asset}`);
    }
  };

  public onRequestClose = () => {
    this.setState({ isLendModalOpen: false });
  };

  public onNetworkConnect = () => {
    alert("connect to the network");
  };
}

export default LendPage;
