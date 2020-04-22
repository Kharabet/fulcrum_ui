import React, { PureComponent, RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { RefinanceAssetCompoundLoan } from "../components/RefinanceAssetCompoundLoan";
import { RefinanceAssetCompoundLoanMobile } from "../components/RefinanceAssetCompoundLoanMobile";
import { RefinanceAssetSelector } from "../components/RefinanceAssetSelector";
import { RefinanceAssetSelectorMobile } from "../components/RefinanceAssetSelectorMobile";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { Loader } from "../components/Loader";

export interface IRefinancePageRouteParams {
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
    const isMobileMedia = this.props.isMobileMedia;
    const isShowLoader = this.state.isShowLoader;
    
    return (
      <React.Fragment>
        <div className="refinance-page">
          <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />

          <main>            {isShowLoader
              ? <Loader />
              : (<div className="page-header">
                  <h1>Refinance Your Loans</h1>
                  <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                  </div>
              )
            }
            <div className="refinance-list">
            {isMobileMedia
              ? <RefinanceAssetCompoundLoanMobile />
              : <RefinanceAssetCompoundLoan doNetworkConnect={this.props.doNetworkConnect} />}
            {isMobileMedia
              ? <RefinanceAssetSelectorMobile updateStateShowLoader={this.updateStateShowLoader} />
              : <RefinanceAssetSelector updateStateShowLoader={this.updateStateShowLoader} />
            }
            </div>
          </main>
          <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        </div>
      </React.Fragment>
    );
  }

  public updateStateShowLoader = (value: any) => {
    this.setState({ isShowLoader: value })
  }
}
