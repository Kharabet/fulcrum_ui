import React, { Component } from "react";
import { OnChainIndicator } from "../components/OnChainIndicator";
import { HeaderLogo } from "./HeaderLogo";

export interface IHeaderHomeProps {
  doNetworkConnect?: () => void;
  isLoading: boolean;
}

export class HeaderHome extends Component<IHeaderHomeProps> {
  public render() {
    return (
      <header className="header">
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
          </div>
          {/*<div className="header__center">
            <HeaderMenu items={this._menu.items} />
          </div>*/}
          {this.props.doNetworkConnect ? (
            <div className="header__right">
              {/*<OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />*/}
            </div>
          ): ``}
        </div>
      </header>
    );
  }
}
