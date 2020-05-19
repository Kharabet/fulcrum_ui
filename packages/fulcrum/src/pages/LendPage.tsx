import React, { PureComponent } from "react";
import Modal from "react-modal";
import { LendTokenSelector } from "../components/LendTokenSelector";
import { Asset } from "../domain/Asset";
import { FulcrumMcdBridgeRequest } from "../domain/FulcrumMcdBridgeRequest";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { InfoBlock } from "../components/InfoBlock";

import "../styles/lend.scss";

const FulcrumMcdBridgeForm = React.lazy(() => import('../components/FulcrumMcdBridgeForm'));
const LendForm = React.lazy(() => import('../components/LendForm'));

export interface ILendPageProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

interface ILendPageState {
  isFulcrumMcdBridgeModalOpen: boolean;
  isLendModalOpen: boolean;
  lendType: LendType;
  lendAsset: Asset;
}

export default class LendPage extends PureComponent<ILendPageProps, ILendPageState> {
  constructor(props: any) {
    super(props);

    this.state = { isLendModalOpen: false, isFulcrumMcdBridgeModalOpen: false, lendType: LendType.LEND, lendAsset: Asset.UNKNOWN };
  }

  public componentDidMount(): void {
    const provider = FulcrumProvider.getLocalstorageItem('providerType');
    if (!FulcrumProvider.Instance.web3Wrapper && (!provider || provider === "None")) {
      this.props.doNetworkConnect();
    }
  }

  public render() {
    return (
      <div className="lend-page">
        <main className="lend-page-main">
          <InfoBlock localstorageItemProp="defi-risk-notice" onAccept={() => { this.forceUpdate() }}>
            For your safety, please ensure the URL in your browser starts with: https://app.fulcrum.trade/. <br />
            Fulcrum is a non-custodial platform for tokenized lending and margin trading. <br />
            "Non-custodial" means YOU are responsible for the security of your digital assets. <br />
            To learn more about how to stay safe when using Fulcrum and other bZx products, please read our <button className="disclosure-link" onClick={this.props.isRiskDisclosureModalOpen}>DeFi Risk Disclosure</button>.
          </InfoBlock>
          {localStorage.getItem("defi-risk-notice") ?
            <InfoBlock localstorageItemProp="lend-page-info">
              Currently only our lending, unlending, and closing of position functions are enabled.  <br />
              Full functionality will return after a thorough audit of our newly implemented and preexisting smart contracts.
          </InfoBlock>
            : null}
          <LendTokenSelector onLend={this.onLendRequested} onFulcrumMcdBridge={this.onFulcrumMcdBridgeRequested} />
          <Modal
            isOpen={this.state.isLendModalOpen}
            onRequestClose={this.onRequestClose}
            className="modal-content-div modal-content-div-form"
            overlayClassName="modal-overlay-div"
          >
            <LendForm
              lendType={this.state.lendType}
              asset={this.state.lendAsset}
              onSubmit={this.onLendConfirmed}
              onCancel={this.onRequestClose}
              isMobileMedia={this.props.isMobileMedia}
            />
          </Modal>
          <Modal
            isOpen={this.state.isFulcrumMcdBridgeModalOpen}
            onRequestClose={this.onRequestClose}
            className="modal-content-div"
            overlayClassName="modal-overlay-div"
          >
            <FulcrumMcdBridgeForm
              asset={this.state.lendAsset}
              onSubmit={this.onFulcrumMcdBridgeConfirmed}
              onCancel={this.onRequestClose}
            />
          </Modal>
        </main>
        {/* <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} /> */}
      </div>
    );
  }


  public onFulcrumMcdBridgeRequested = (request: FulcrumMcdBridgeRequest) => {
    if (!FulcrumProvider.Instance.contractsSource || !FulcrumProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      return;
    }

    if (request) {
      this.setState({
        ...this.state,
        isFulcrumMcdBridgeModalOpen: true,
        lendAsset: request.asset
      });
    }
  };

  public onFulcrumMcdBridgeConfirmed = (request: FulcrumMcdBridgeRequest) => {
    this.setState({
      ...this.state,
      isFulcrumMcdBridgeModalOpen: false,
    });
    FulcrumProvider.Instance.onFulcrumMcdBridgeConfirmed(request);
  };

  public onLendRequested = (request: LendRequest) => {
    if (!FulcrumProvider.Instance.contractsSource || !FulcrumProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      return;
    }

    if (request) {
      this.setState({
        ...this.state,
        isLendModalOpen: true,
        lendType: request.lendType,
        lendAsset: request.asset
      });
    }
  };

  public onLendConfirmed = (request: LendRequest) => {
    this.setState({
      ...this.state,
      isLendModalOpen: false,
    });
    FulcrumProvider.Instance.onLendConfirmed(request);
  };

  public onRequestClose = () => {
    this.setState({
      ...this.state,
      isFulcrumMcdBridgeModalOpen: false,
      isLendModalOpen: false
    });
  };
}
