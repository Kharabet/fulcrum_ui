import React, { PureComponent } from "react";
import { RouteComponentProps } from "react-router";
import { ProviderSelector } from "../components/ProviderSelector";
import { WalletTypeSelector } from "../components/WalletTypeSelector";
import { ProviderType } from "../domain/ProviderType";
import { WalletType } from "../domain/WalletType";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";

export interface IWalletSelectionPageParams {
  destinationAbbr: string; // "b" - borrow, "t" - track, dashboard
}

export interface IWalletSelectionPageProps {
  onSelectProvider?: (providerType: ProviderType) => void;
  doNetworkConnect?: () => void;
  isLoading: boolean;
}

export class WalletSelectionPage extends PureComponent<IWalletSelectionPageProps & RouteComponentProps<IWalletSelectionPageParams>> {
  
  public componentDidMount(): void {
    TorqueProvider.Instance.destinationAbbr = this.props.match.params.destinationAbbr;
  }

  public render() {
    return (
      <div className="wallet-selection-page">
        <HeaderHome isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} />
        <div className="wallet-selection-page__main">
          <div className="wallet-selection-page__main-centeredOverlay" style={!TorqueProvider.Instance.isLoading ? { display: `none`} : undefined}>
              <span>Loading...</span>
          </div>
          <WalletTypeSelector onSelectWalletType={this.onSelectWalletType} />
          <ProviderSelector onSelectProvider={this.props.onSelectProvider} />
        </div>
        <Footer />
      </div>
    );
  }

  private onSelectWalletType = async (walletType: WalletType) => {
    TorqueProvider.Instance.isLoading = true;
    
    if (walletType === WalletType.Web3) {
      if (this.props.onSelectProvider) {
        await this.props.onSelectProvider(ProviderType.MetaMask);

        const accountAddress =
          TorqueProvider.Instance.accounts.length > 0 && TorqueProvider.Instance.accounts[0]
            ? TorqueProvider.Instance.accounts[0].toLowerCase()
            : null;

        if (this.props.match.params.destinationAbbr === "b") {
          NavService.Instance.History.replace(
            NavService.Instance.getBorrowAddress(WalletType.Web3)
          );
        } if (this.props.match.params.destinationAbbr === "t") {
          if (accountAddress) {
            NavService.Instance.History.replace(
              NavService.Instance.getDashboardAddress(WalletType.Web3, accountAddress)
            );
          }
        } else {
          // do nothing
        }
      }
    } if (walletType === WalletType.NonWeb3) {
      if (this.props.onSelectProvider) {
        await this.props.onSelectProvider(ProviderType.None);
      }
      
      TorqueProvider.Instance.providerType = ProviderType.None;

      if (this.props.match.params.destinationAbbr === "b") {
        NavService.Instance.History.replace(
          NavService.Instance.getBorrowAddress(WalletType.NonWeb3)
        );
      } if (this.props.match.params.destinationAbbr === "t") {
        NavService.Instance.History.replace(
          NavService.Instance.getDashboardAddress(WalletType.NonWeb3, "")
        );
      } else {
        // do nothing
      }
    } else {
      // do nothing
    }

    TorqueProvider.Instance.isLoading = false;
  };
}
