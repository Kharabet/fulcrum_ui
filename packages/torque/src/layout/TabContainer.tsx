import { RouteComponentProps, withRouter } from 'react-router'
import React, { PureComponent } from 'react'
import BorrowPage from '../pages/BorrowPage'
import { DashboardPage } from '../pages/DashboardPage'
import Footer from '../layout/Footer'
import { HeaderOps } from '../layout/HeaderOps'
import Tabs from '../layout/Tabs'
import { Tab } from '../domain/Tab'

export interface ITabContainerProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
}

interface ITabContainerState {
  activeTab: Tab
}

export default class TabContainer extends PureComponent<
  ITabContainerProps & RouteComponentProps,
  ITabContainerState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeTab: Tab.Borrow,
    }
  }
  public setActiveTab = (tab: Tab) => {
    this.setState({ activeTab: tab })
  }
  public componentDidMount(): void {
    if (this.props.location.pathname === '/dashboard') {
      this.setActiveTab(Tab.Loans)
    }
  }

  public render() {
    return (
      <div className="page">
        <HeaderOps
          isMobileMedia={this.props.isMobileMedia}
          doNetworkConnect={this.props.doNetworkConnect}
          isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen}
          setActiveTab={this.setActiveTab}
        />
        <main>
          <Tabs activeTab={this.state.activeTab} setActiveTab={this.setActiveTab} />
          <React.Fragment>
            {this.state.activeTab === Tab.Borrow && (
              <BorrowPage setLoansActiveTab={() => this.setActiveTab(Tab.Loans)} {...this.props} />
            )}
            {this.state.activeTab === Tab.Loans && <DashboardPage {...this.props} />}
          </React.Fragment>
        </main>
        <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
      </div>
    )
  }
}
