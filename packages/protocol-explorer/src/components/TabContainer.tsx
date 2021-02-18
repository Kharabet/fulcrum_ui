import { RouteComponentProps } from 'react-router'
import React, { PureComponent } from 'react'
import { MainPage } from '../pages/MainPage'
import { LiquidationsPage } from '../pages/LiquidationsPage'
import { Header } from '../layout/Header'
import { Tab } from '../domain/Tab'
import { StatsPage } from '../pages/StatsPage'
import { SearchResultPage } from '../pages/SearchResultPage'
import { Footer } from '../layout/Footer'

export interface ITabContainerProps {
  doNetworkConnect: () => void
  isMobileMedia: boolean
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

interface ITabContainerState {}

export default class TabContainer extends PureComponent<
  ITabContainerProps & RouteComponentProps,
  ITabContainerState
> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <div className="page">
        <Header
          isMobileMedia={this.props.isMobileMedia}
          doNetworkConnect={this.props.doNetworkConnect}
          activeTab={this.props.activeTab}
          setActiveTab={this.props.setActiveTab}
        />
        <main>
          {this.props.activeTab === Tab.Stats && <MainPage {...this.props} />}
          {this.props.activeTab === Tab.Liquidations && <LiquidationsPage {...this.props} />}
          {this.props.activeTab === Tab.Unknown && this.props.match.path === '/stats/:token' && (
            <StatsPage {...this.props} />
          )}
          {this.props.activeTab === Tab.Unknown && this.props.match.path === '/search/:filter' && (
            <SearchResultPage {...this.props} />
          )}
        </main>
        <Footer />
      </div>
    )
  }
}
