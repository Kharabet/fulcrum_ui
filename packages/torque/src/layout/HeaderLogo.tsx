import { ReactComponent as BSCLogo } from 'bzx-common/src/assets/images/binance/bsc_logo.svg'
import React, { Component } from 'react'
import { ReactComponent as TorqueLogo } from '../assets/images/torque_logo.svg'
import { ReactComponent as TorqueLogoPartial } from '../assets/images/torque_logo_partial.svg'
import { Tab } from '../domain/Tab'
import { NavService } from '../services/NavService'

export interface IHeaderOpsProps {
  setActiveTab: (tab: Tab) => void
}

const bsc = process.env.REACT_APP_ETH_NETWORK === 'bsc'

export class HeaderLogo extends Component<IHeaderOpsProps> {
  public render() {
    return (
      <div className={`header-logo ${bsc ? 'bsc' : ''}`}>
        <div
          onClick={() => {
            NavService.Instance.History.push('/')
            this.props.setActiveTab(Tab.Borrow)
          }}>
          <div className="header-logo-full">
            <TorqueLogo />
          </div>
          <div className="header-logo-partial">
            <TorqueLogoPartial />
          </div>
          {process.env.REACT_APP_ETH_NETWORK === 'bsc' && (
            <React.Fragment>
              <div className="bsc-logo">
                <BSCLogo />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
}
