import { NavService } from '../services/NavService'
import { ReactComponent as BSCLogo } from 'bzx-common/src/assets/images/binance/bsc_logo.svg'
import { ReactComponent as TorqueLogo } from '../assets/images/torque_logo.svg'
import { ReactComponent as TorqueLogoPartial } from '../assets/images/torque_logo_partial.svg'
import { Tab } from '../domain/Tab'
import appConfig from 'bzx-common/src/config/appConfig'
import React, { Component } from 'react'

export interface IHeaderOpsProps {
  setActiveTab: (tab: Tab) => void
}

export class HeaderLogo extends Component<IHeaderOpsProps> {
  public render() {
    return (
      <div className={`header-logo ${appConfig.isBsc ? 'bsc' : ''}`}>
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
          {appConfig.isBsc && (
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
