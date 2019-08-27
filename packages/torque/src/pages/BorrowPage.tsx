import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { AssetSelector } from "../components/AssetSelector";
import { BorrowDlg } from "../components/BorrowDlg";
import { Asset } from "../domain/Asset";
import { WalletType, walletTypeAbbrToWalletType } from "../domain/WalletType";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";

export interface IBorrowPageRouteParams {
  walletTypeAbbr: string;
}

export interface IBorrowPageParams {
  doNetworkConnect?: () => void;
  isLoading: boolean;
}

export class BorrowPage extends PureComponent<IBorrowPageParams & RouteComponentProps<IBorrowPageRouteParams>> {
  private borrowDlgRef: RefObject<BorrowDlg>;

  public constructor(props: any, context?: any) {
    super(props, context);

    this.borrowDlgRef = React.createRef();
  }

  public render() {
    const walletType = walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr);

    return (
      <React.Fragment>
        <BorrowDlg ref={this.borrowDlgRef} />
        <div className="borrow-page">
          <HeaderHome isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} />
          <div className="borrow-page__main">
            <AssetSelector walletType={walletType} onSelectAsset={this.onSelectAsset} />
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }

  private onSelectAsset = async (asset: Asset) => {
    const walletType = walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr);

    if (this.borrowDlgRef.current) {
      try {
        const borrowRequest = await this.borrowDlgRef.current.getValue(walletType, asset);

        if (borrowRequest.walletType === WalletType.NonWeb3) {
          NavService.Instance.History.push(NavService.Instance.getDashboardAddress(walletType, ""));
        }

        if (borrowRequest.walletType === WalletType.Web3) {
          const accountAddress =
            TorqueProvider.Instance.accounts.length > 0 && TorqueProvider.Instance.accounts[0]
              ? TorqueProvider.Instance.accounts[0].toLowerCase()
              : null;

          if (accountAddress) {
            await TorqueProvider.Instance.submitBorrowRequest(borrowRequest);
            NavService.Instance.History.push(NavService.Instance.getDashboardAddress(walletType, accountAddress));
          }
        }
      } finally {
        await this.borrowDlgRef.current.hide();
      }
    }
  };
}
