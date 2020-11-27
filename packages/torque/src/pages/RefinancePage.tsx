import React, { PureComponent, RefObject } from 'react'
import { RouteComponentProps } from 'react-router'
import { RefinanceAssetSelector } from '../components/RefinanceAssetSelector'
import { Footer } from '../layout/Footer'
import { HeaderOps } from '../layout/HeaderOps'
import { Loader } from '../components/Loader'

export interface IRefinancePageRouteParams {}

export interface IRefinancePageParams {
  doNetworkConnect: () => void
  isMobileMedia: boolean
  isRiskDisclosureModalOpen: () => void
}
interface IRefinancePageState {
  isShowLoader: boolean
}
export class RefinancePage extends PureComponent<
  IRefinancePageParams & RouteComponentProps<IRefinancePageRouteParams>,
  IRefinancePageState
> {
  public constructor(props: any, context?: any) {
    super(props, context)

    this.state = {
      isShowLoader: true
    }
  }

  public render() {
    return (
      <React.Fragment>
        <div className="refinance-page">
          <HeaderOps
            isMobileMedia={this.props.isMobileMedia}
            doNetworkConnect={this.props.doNetworkConnect}
            isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen}
          />

          <main>
            {this.state.isShowLoader ? (
              <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
            ) : (
              <div className="page-header">
                <h1>Refinance Your Loans</h1>
                <p>
                  Lorem ipsum is placeholder text commonly used in the graphic, print, and
                  publishing industries for previewing layouts and visual mockups.
                </p>
              </div>
            )}
            <div className="refinance-list">
              <RefinanceAssetSelector
                isMobileMedia={this.props.isMobileMedia}
                updateStateShowLoader={this.updateStateShowLoader}
                doNetworkConnect={this.props.doNetworkConnect}
              />
            </div>
          </main>
          <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        </div>
      </React.Fragment>
    )
  }

  public updateStateShowLoader = (value: any) => {
    this.setState({ isShowLoader: value })
  }
}
