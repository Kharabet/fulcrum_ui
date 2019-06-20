import React, { PureComponent, RefObject } from "react";
import { AssetSelector } from "../components/AssetSelector";
import { BorrowDlg } from "../components/BorrowDlg";
import { Asset } from "../domain/Asset";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export class BorrowPage extends PureComponent {
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
            <AssetSelector onSelectAsset={this.onSelectAsset} />
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }

  private onSelectAsset = async (asset: Asset) => {
    if (this.borrowDlgRef.current) {
      try {
        const borrowRequest = await this.borrowDlgRef.current.getValue(asset);
      } finally {
        await this.borrowDlgRef.current.hide();
      }
    }
  };
}
