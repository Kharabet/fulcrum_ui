import React from "react";
export const FooterMenu = () => {
  return (
    <div className="footer-menu">
      <div className="column-menu">
        <h5 className="title-menu">bZx network</h5>
        <div className="list-menu">
          <a href="https://docs.bzx.network/">Documentation</a>
          <a href="https://bzx.network/pdfs/bZx_lite_paper.pdf">Litepaper</a>
          <a href="https://api.bzx.network/">API</a>
          <a href="https://bzx.network/ecosystem">Ecosystem</a>
          <a href="https://bzx.network/blog">Blog</a>
          <a href="https://app.fulcrum.trade/#/stats">Stats</a>
        </div>
      </div>
      <div className="column-menu">
        <h5 className="title-menu">Products</h5>
        <div className="list-menu">
          <a href="https://fulcrum.trade/">Fulcrum</a>
          <a href="https://torque.loans">Torque</a>
          <a href="https://bzx.network/itokens">iTokens</a>
          <a href="https://bzx.network/ptokens">pTokens</a>
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
          <a href="#" className="contact-us-button">Contact us</a>
        </div>
      </div>
    </div>
  );
}
