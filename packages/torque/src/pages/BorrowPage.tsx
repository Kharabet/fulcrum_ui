import React, { PureComponent, RefObject } from "react";
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
            <div className="borrow-page__borrow-asset-selector">
              <div className="borrow-page__borrow-asset-selector-item" onClick={this.onBorrowDAIClick}>
                DAI
              </div>
              <div className="borrow-page__wallet-type-selector-item" onClick={this.onBorrowETHClick}>
                ETH
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }

  private onBorrowETHClick = async () => {
    if (this.borrowDlgRef.current) {
      try {
        const borrowRequest = await this.borrowDlgRef.current.getValue(Asset.ETH);
      } finally {
        await this.borrowDlgRef.current.hide();
      }
    }
  };

  private onBorrowDAIClick = async () => {
    if (this.borrowDlgRef.current) {
      try {
        const borrowRequest = await this.borrowDlgRef.current.getValue(Asset.DAI);
      } finally {
        await this.borrowDlgRef.current.hide();
      }
    }
  };
}
