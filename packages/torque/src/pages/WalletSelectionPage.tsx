import React, { PureComponent } from "react";
import { ProviderSelector } from "../components/ProviderSelector";
import { WalletTypeSelector } from "../components/WalletTypeSelector";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export class WalletSelectionPage extends PureComponent {
  public render() {
    return (
      <div className="wallet-selection-page">
        <HeaderHome />
        <div className="wallet-selection-page__main">
          <WalletTypeSelector />
          <ProviderSelector />
        </div>
        <Footer />
      </div>
    );
  }
}
