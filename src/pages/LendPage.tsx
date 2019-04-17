import React, { Component } from "react";
import Modal from "react-modal";
import { LendForm } from "../components/LendForm";
import { LendTokenSelector } from "../components/LendTokenSelector";
import { Asset } from "../domain/Asset";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface ILendPageProps {
  doNetworkConnect: () => void;
}

interface ILendPageState {
  isLendModalOpen: boolean;
  lendType: LendType;
  lendAsset: Asset;
}

export class LendPage extends Component<ILendPageProps, ILendPageState> {
  constructor(props: any) {
    super(props);

    this.state = { isLendModalOpen: false, lendType: LendType.LEND, lendAsset: Asset.UNKNOWN };
  }

  public componentDidMount(): void {
    if (!FulcrumProvider.Instance.web3) {
      this.props.doNetworkConnect();
    }
  }

  public render() {
    return (
      <div className="lend-page">
        <HeaderOps doNetworkConnect={this.props.doNetworkConnect} />
        <main>
          <LendTokenSelector onLend={this.onLendRequested} />
          <Modal
            isOpen={this.state.isLendModalOpen}
            onRequestClose={this.onRequestClose}
            className="modal-content-div"
            overlayClassName="modal-overlay-div"
          >
            <LendForm
              lendType={this.state.lendType}
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
      this.setState({ ...this.state, isLendModalOpen: true, lendType: request.lendType, lendAsset: request.asset });
    }
  };

  public onLendConfirmed = (request: LendRequest) => {
    FulcrumProvider.Instance.onLendConfirmed(request);
    this.setState({ ...this.state, isLendModalOpen: false, lendType: LendType.LEND, lendAsset: Asset.UNKNOWN });
  };

  public onRequestClose = () => {
    this.setState({ ...this.state, isLendModalOpen: false });
  };
}
