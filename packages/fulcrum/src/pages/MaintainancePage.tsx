import React, { Component } from "react";

import fulcrum_logo from "../assets/images/fulcrum_logo.svg"
import ic_maintenance from "./../assets/images/ic_maintenance.svg"

export class MaintainancePage extends Component {
  public render() {
    return (
      <div className="maintainance-page">
        <main className="maintainance-page-main">
          <div className="maintainance-page__symbol">
            <img src={ic_maintenance} />
          </div>
          <h1 className="maintainance-page__title"><span>Sorry, we're down for maintenance</span></h1>
          <div className="maintainance-page__title-2">We'll be back shortly</div>
          <div className="maintainance-page__logo">
            <img src={fulcrum_logo} />
          </div>
        </main>
      </div>
    );
  }
}
