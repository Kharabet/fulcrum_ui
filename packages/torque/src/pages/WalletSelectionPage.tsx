import React, { PureComponent } from "react";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export class WalletSelectionPage extends PureComponent {
  public render() {
    return (
      <div className="wallet-selection-page">
        <HeaderHome />
        <div className="wallet-selection-page__main">
          <div className="wallet-selection-page__wallet-type-selector">
            <div className="wallet-selection-page__wallet-type-selector-item">
              Browser wallets
            </div>
            <div className="wallet-selection-page__wallet-type-selector-item">
              Non Web 3 wallets
            </div>
          </div>
          <div className="wallet-selection-page__wallet-selector">
            <div className="wallet-selection-page__wallet-selector-item">
              Bitski
            </div>
            <div className="wallet-selection-page__wallet-selector-item">
              Formatic
            </div>
            <div className="wallet-selection-page__wallet-selector-item">
              Portis
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
