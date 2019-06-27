import React, { Component } from "react";

import fulcrum_logo from "../assets/images/fulcrum_logo.svg"
import ic_maintenance from "./../assets/images/ic_maintenance.svg"

export class MaintenancePage extends Component {
  public render() {
    return (
      <div className="maintenance-page">
        <main className="maintenance-page-main">
          <div className="maintenance-page__symbol">
            <img src={ic_maintenance} />
          </div>
          <h1 className="maintenance-page__title"><span>Sorry, we're down for maintenance</span></h1>
          <div className="maintenance-page__title-2">We'll be back shortly</div>
          <div className="maintenance-page__logo">
            <img src={fulcrum_logo} />
          </div>
        </main>
      </div>
    );
  }
}
