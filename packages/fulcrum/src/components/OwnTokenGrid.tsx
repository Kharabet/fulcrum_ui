import React, { Component } from 'react'
import { PreloaderChart } from '../components/PreloaderChart'
import { OwnTokenGridHeader } from './OwnTokenGridHeader'
import { IOwnTokenGridRowProps, OwnTokenGridRow } from './OwnTokenGridRow'

import { ReactComponent as Placeholder } from '../assets/images/history_placeholder.svg'
import '../styles/components/own-token-grid.scss'

export interface IOwnTokenGridProps {
  isMobileMedia: boolean
  ownRowsData: IOwnTokenGridRowProps[] | undefined
}

export class OwnTokenGrid extends Component<IOwnTokenGridProps> {
  constructor(props: IOwnTokenGridProps) {
    super(props)   
  }

  public render() {
    if (this.props.ownRowsData===undefined) {
        return (
          <PreloaderChart
            quantityDots={4}
            sizeDots={'middle'}
            title={'Loading'}
            isOverlay={false}
          />
        )
    }

    if (!this.props.ownRowsData.length) {
      return (
        <div className="history-token-grid__placeholder">
          <div>
            <Placeholder />
            <p>No open positions</p>
            <a href="/trade" className="history-token-grid__link-button">
              Start Trading
            </a>
          </div>
        </div>
      )
    }

    const ownRows = this.props.ownRowsData.map((e, i) => <OwnTokenGridRow key={i} {...e} />)
    if (ownRows.length === 0) return null

    return (
      <div className="own-token-grid">
        {!this.props.isMobileMedia && <OwnTokenGridHeader />}
        {ownRows}
      </div>
    )
  }
}
