import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { ReactComponent as FulcrumLogo } from '../assets/images/fulcrum_logo.svg'
import { ReactComponent as FulcrumLogoSign } from '../assets/images/fulcrum_logo_partial.svg'

export class HeaderLogo extends Component {
  public render() {
    return (
      <div className="header-logo">
        <Link to="/">
          <div className="fulcrum-logo-sign">
            <FulcrumLogoSign />
          </div>
          <div className="fulcrum-logo">
            <FulcrumLogo />
          </div>
        </Link>
      </div>
    )
  }
}
