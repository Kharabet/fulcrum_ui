import React, { Component } from 'react'
import { Tab } from '../domain/Tab'

import { ReactComponent as TorqueLogo } from '../assets/images/torque_logo.svg'
import { ReactComponent as TorqueLogoPartial } from '../assets/images/torque_logo_partial.svg'
import { NavService } from '../services/NavService'

export interface IHeaderOpsProps {
  setActiveTab: (tab: Tab) => void
}

export class HeaderLogo extends Component<IHeaderOpsProps> {
  public render() {
    return (
      <div className="header-logo">
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
        </div>
      </div>
    )
  }
}
