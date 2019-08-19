import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { AssetSelector } from "../components/AssetSelector";
import { BorrowDlg } from "../components/BorrowDlg";
import { Asset } from "../domain/Asset";
import { WalletType } from "../domain/WalletType";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export interface IBorrowPageParams {

}

export class BorrowPage extends PureComponent<RouteComponentProps<IBorrowPageParams>> {
  private borrowDlgRef: RefObject<BorrowDlg>;

  public constructor(props: any, context?: any) {
    super(props, context);

    this.borrowDlgRef = React.createRef();
  }

  public render() {
    return (
      <React.Fragment>
        <BorrowDlg ref={this.borrowDlgRef} />
        <div className="borrow-page">
          <HeaderHome />
          <div className="borrow-page__main">
            <AssetSelector walletType={WalletType.NonWeb3} onSelectAsset={this.onSelectAsset} />
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }

  private onSelectAsset = async (asset: Asset) => {
    if (this.borrowDlgRef.current) {
      try {
        const borrowRequest = await this.borrowDlgRef.current.getValue(WalletType.NonWeb3, asset);

        if (borrowRequest.walletType === WalletType.NonWeb3) {
          // go to dashboard to track loans
        }

        if (borrowRequest.walletType === WalletType.Web3) {
          // submit loan
        }
      } finally {
        await this.borrowDlgRef.current.hide();
      }
    }
  };
}
