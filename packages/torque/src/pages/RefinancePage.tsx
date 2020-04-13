import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { RefinanceAssetCompoundLoan } from "../components/RefinanceAssetCompoundLoan";
import { RefinanceAssetCompoundLoanMobile } from "../components/RefinanceAssetCompoundLoanMobile";
import { RefinanceAssetSelector } from "../components/RefinanceAssetSelector";
import { RefinanceAssetSelectorMobile } from "../components/RefinanceAssetSelectorMobile";
import { WalletType, walletTypeAbbrToWalletType } from "../domain/WalletType";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { Loader } from "../components/Loader";

export interface IRefinancePageRouteParams {
  walletTypeAbbr: string;
}

export interface IRefinancePageParams {
  doNetworkConnect: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
  isRiskDisclosureModalOpen: () => void;
}
interface IRefinancePageState {
  isShowLoader: boolean
}
export class RefinancePage extends PureComponent<IRefinancePageParams & RouteComponentProps<IRefinancePageRouteParams>, IRefinancePageState> {

  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = {
      isShowLoader: true
    }
  }

  public render() {
    const walletType = walletTypeAbbrToWalletType(this.props.match.params.walletTypeAbbr);
    const isMobileMedia = this.props.isMobileMedia;
    const isShowLoader = this.state.isShowLoader;
    return (
      <React.Fragment>
        <div className="refinance-page">
          <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
          {/*<div className="borrow-page__main" style={walletType === WalletType.Web3 ? { paddingBottom: `90rem`} : undefined}>*/}
          <div className="refinance-page__main">
            {isShowLoader
              ? <Loader />
              : (
                <React.Fragment>
                  <h1>Refinance Your Loans</h1>
                  <p className="description">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                </React.Fragment>
              )
            }
            {isMobileMedia
              ? <RefinanceAssetCompoundLoanMobile walletType={walletType} />
              : <RefinanceAssetCompoundLoan walletType={walletType} />}
            {isMobileMedia
              ? <RefinanceAssetSelectorMobile updateStateShowLoader={this.updateStateShowLoader} walletType={walletType} />
              : <RefinanceAssetSelector updateStateShowLoader={this.updateStateShowLoader} walletType={walletType} />
            }
          </div>
          <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        </div>
      </React.Fragment>
    );
  }

  public updateStateShowLoader = (value: any) => {
    this.setState({ isShowLoader: value })
  }
}
