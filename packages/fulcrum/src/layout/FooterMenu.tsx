import React, { Component } from 'react'
import { Link } from 'react-router-dom'

interface IFooterMenuProps {
  isRiskDisclosureModalOpen: () => void
}

export class FooterMenu extends Component<IFooterMenuProps> {
  public render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          <a href="https://legacy.fulcrum.trade/#/trade">Legacy dApp</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade/tos/">Terms of use</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade/privacy/">Privacy policy</a>
        </div>
        <div className="footer-menu__item">
          <button onClick={this.props.isRiskDisclosureModalOpen}>Risk Disclosure</button>
        </div>
        <div className="footer-menu__item">
          <a href="https://bzx.network/faq-fulcrum.html">FAQ</a>
        </div>
        <div className="footer-menu__item">
          <Link to="/stats">Stats</Link>
        </div>
      </div>
    )
  }
}
