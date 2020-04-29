import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { AssetSelector } from "../components/AssetSelector";
import { BorrowDlg } from "../components/BorrowDlg";
import { Asset } from "../domain/Asset";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { ProviderType } from "../domain/ProviderType";

export interface IBorrowPageRouteParams {
}

export interface IBorrowPageState {
  isLoadingTransaction: boolean;
  selectedAsset: Asset
}

export interface IBorrowPageParams {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

export class BorrowPage extends PureComponent<IBorrowPageParams & RouteComponentProps<IBorrowPageRouteParams>, IBorrowPageState> {
  private borrowDlgRef: RefObject<BorrowDlg>;

  public constructor(props: any, context?: any) {
    super(props, context);
    this.borrowDlgRef = React.createRef();
    this.state = {
      isLoadingTransaction: false,
      selectedAsset: Asset.UNKNOWN
    }
  }
  public componentWillUnmount(): void {
  }

  public render() {
    return (
      <React.Fragment>
        <BorrowDlg ref={this.borrowDlgRef} />
        <div className="borrow-page">
          <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
          <main>
            <AssetSelector onSelectAsset={this.onSelectAsset} isLoadingTransaction={this.state.isLoadingTransaction} selectedAsset={this.state.selectedAsset} />
          </main>
          <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        </div>
      </React.Fragment>
    );
  }

  private onSelectAsset = async (asset: Asset) => {

    if (!this.borrowDlgRef.current) return;
    
    if (TorqueProvider.Instance.providerType === ProviderType.None || !TorqueProvider.Instance.contractsSource || !TorqueProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect()
      return
    }

    try {
      const borrowRequest = await this.borrowDlgRef.current.getValue(asset);
      this.setState({ ...this.state, isLoadingTransaction: true, selectedAsset: asset });
      let receipt = await TorqueProvider.Instance.doBorrow(borrowRequest);
      if (receipt.status === 1)
        this.setState({ ...this.state, isLoadingTransaction: false, selectedAsset: asset });
    } catch (error) {
      console.error(error);
      this.setState({ ...this.state, isLoadingTransaction: false, selectedAsset: asset });
    }
  };
}
