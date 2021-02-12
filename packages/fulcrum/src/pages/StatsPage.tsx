import React, { Component } from 'react'
import { StatsTokenGrid } from '../components/StatsTokenGrid'

import '../styles/pages/_stats-page.scss'

export interface IStatsPageProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
}

interface IStatsPageState {}

export default class StatsPage extends Component<IStatsPageProps, IStatsPageState> {
  constructor(props: any) {
    super(props)
  }
  private _isMounted: boolean = false

  public componentWillUnmount(): void {
    this._isMounted = false
  }

  public async componentDidMount() {
    this._isMounted = true
  }

  public render() {
    return (
      <div className="stats-page">
        <main>
          <StatsTokenGrid isMobileMedia={this.props.isMobileMedia} />
        </main>
      </div>
    )
  }
}
