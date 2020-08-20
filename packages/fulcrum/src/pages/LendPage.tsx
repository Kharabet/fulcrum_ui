import React, { PureComponent } from "react";
import Modal from "react-modal";
import { LendTokenSelector } from "../components/LendTokenSelector";
import { Asset } from "../domain/Asset";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { InfoBlock } from "../components/InfoBlock";

import "../styles/pages/_lend-page.scss";

const LendForm = React.lazy(() => import('../components/LendForm'));

export interface ILendPageProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

interface ILendPageState {
  isLendModalOpen: boolean;
  lendType: LendType;
  lendAsset: Asset;
  lendRequestId: number;
}

export default class LendPage extends PureComponent<ILendPageProps, ILendPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLendModalOpen: false,
      lendType: LendType.LEND,
      lendAsset: Asset.UNKNOWN,
      lendRequestId: 0
    };
  }
  private _isMounted: boolean = false;

  public componentWillUnmount(): void {
    this._isMounted = false;
  }
  public componentDidMount(): void {
    this._isMounted = true;
    const provider = FulcrumProvider.getLocalstorageItem('providerType');
    if (!FulcrumProvider.Instance.web3Wrapper && (!provider || provider === "None")) {
      this.props.doNetworkConnect();
    }
  }

  public render() {
    return (
      <div className="lend-page">
        <main className="lend-page-main">
          <InfoBlock localstorageItemProp="lend-page-info">
            Currently only our lending, unlending, and closing of position functions are enabled.  <br />
              Full functionality will return after a thorough audit of our newly implemented and preexisting smart contracts.
          </InfoBlock>

          {this.props.isMobileMedia && <div className="lend-page__header">Lend</div>
          }
          <LendTokenSelector onLend={this.onLendRequested} />
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
        </main>
      </div>
    );
  }

  public onLendRequested = (request: LendRequest) => {
    if (!FulcrumProvider.Instance.contractsSource || !FulcrumProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      return;
    }
    const lendRequestId = request.id;

    if (request) {
      this._isMounted && this.setState({
        ...this.state,
        isLendModalOpen: true,
        lendType: request.lendType,
        lendAsset: request.asset,
        lendRequestId: lendRequestId
      });
    }
  };

  public onLendConfirmed = (request: LendRequest) => {
    this._isMounted && this.setState({
      ...this.state,
      isLendModalOpen: false,
    });
    request.id = this.state.lendRequestId;
    FulcrumProvider.Instance.onLendConfirmed(request);
  };

  public onRequestClose = () => {
    this._isMounted && this.setState({
      ...this.state,
      isLendModalOpen: false
    });
  };
}
