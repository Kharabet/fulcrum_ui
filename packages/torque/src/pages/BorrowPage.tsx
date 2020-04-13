import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { AssetSelector } from "../components/AssetSelector";
import { BorrowDlg } from "../components/BorrowDlg";
import { Asset } from "../domain/Asset";
import { WalletType, walletTypeAbbrToWalletType } from "../domain/WalletType";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { ProviderType } from "../domain/ProviderType";

export interface IBorrowPageRouteParams {
  walletTypeAbbr: string;
}

export interface IBorrowPageParams {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

export class BorrowPage extends PureComponent<IBorrowPageParams & RouteComponentProps<IBorrowPageRouteParams>> {
  private borrowDlgRef: RefObject<BorrowDlg>;

  public constructor(props: any, context?: any) {
    super(props, context);
    this.borrowDlgRef = React.createRef();
  }
  public componentWillUnmount(): void {
  }

  public render() {
    return (
      <React.Fragment>
        <BorrowDlg ref={this.borrowDlgRef} />
        <div className="borrow-page">
          <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
          <div className="borrow-page__main">
            <AssetSelector  onSelectAsset={this.onSelectAsset} />
          </div>
          <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        </div>
      </React.Fragment>
    );
  }

  private onSelectAsset = async (asset: Asset) => {

    if (!this.borrowDlgRef.current) return;

    const walletType = walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr);
    
    if (TorqueProvider.Instance.providerType === ProviderType.None || !TorqueProvider.Instance.contractsSource || !TorqueProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect()
      return
    }

    const borrowRequest = await this.borrowDlgRef.current.getValue(walletType, asset);

    try {
      await TorqueProvider.Instance.doBorrow(borrowRequest);
    } catch (error) {
      console.error(error);
    }

    this.borrowDlgRef.current.toggleDidSubmit(false);
    await this.borrowDlgRef.current.hide();

  };
}
