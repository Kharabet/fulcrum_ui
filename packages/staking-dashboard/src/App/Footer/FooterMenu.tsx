import React from 'react'

const contactClick = (event: React.SyntheticEvent) => {
  event.preventDefault()
  // @ts-ignore
  if (window.Intercom) {
    // @ts-ignore
    window.Intercom('show')
  }
}

export function FooterMenu() {
  return (
    <div className="footer-menu">
      <div className="column-menu">
        <h5 className="title-menu">bZx network</h5>
        <div className="list-menu">
          <a href="https://bzx.network/#how-it-works">How it works</a>
          <a href="https://docs.bzx.network/">Documentation</a>
          <a href="https://api.bzx.network/">API</a>
          <a href="https://bzx.network/ecosystem">Ecosystem</a>
          <a href="https://bzx.network/blog">Blog</a>
          <a href="https://bzx.network/calc">Staking Calculator</a>
        </div>
      </div>
      <div className="column-menu">
        <h5 className="title-menu">Products</h5>
        <div className="list-menu">
          <a href="https://fulcrum.trade/">Fulcrum</a>
          <a href="https://torque.loans">Torque</a>
          <a href="https://staking.bzx.network/">Staking Dashboard</a>
          <a href="https://explorer.bzx.network">Protocol Explorer</a>
          <a href="https://bzx.network/itokens">iTokens</a>
          <a href="https://bzx.network/bzrx-token">BZRX Token</a>
        </div>
      </div>
      <div className="column-menu">
        <h5 className="title-menu">Company</h5>
        <div className="list-menu">
          <a href="https://bzx.network/#history">History</a>
          <a href="https://bzx.network/#team">Team</a>
          <a href="https://angel.co/company/bzx-1/jobs">Careers</a>
          <a href="https://bzx.network/press">Press</a>
          <a href="https://bzx.network/media-assets">Media assets</a>
          <a href="#" className="contact-us-button" onClick={contactClick}>
            Contact us
          </a>
        </div>
      </div>
    </div>
  )
}

export default React.memo(FooterMenu)
