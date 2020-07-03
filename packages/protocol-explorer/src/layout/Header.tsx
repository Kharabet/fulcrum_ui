import React, { Component } from "react";

import { OnChainIndicator } from "../components/OnChainIndicator";
import { ReactComponent as LogoExplorer } from "../assets/images/logo-explorer.svg"
import { HeaderMenu } from "./HeaderMenu";
import { Link } from "react-router-dom";

import { ReactComponent as MenuIconOpen } from "../assets/images/ic_menu.svg";
import { ReactComponent as MenuIconClose } from "../assets/images/ic_close.svg";

interface IHeaderProps {
  doNetworkConnect: () => void;
  isMobileMedia: boolean;
}
interface IHeaderState {
  isMenuOpen: boolean;
}

export class Header extends Component<IHeaderProps, IHeaderState> {
  constructor(props: IHeaderProps) {
    super(props);
    this.state = {
      isMenuOpen: false
    };
  }

  public render() {
    return (
      <header>
        <div className="container">
          <div className="flex jc-sb ai-c">
            <Link to="/" className="logo">
              <LogoExplorer />
            </Link>
            <HeaderMenu />
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
          </div>
        </div>
      </header>
    );
  }

  private onMenuToggle = () => {
    document.body.style.overflow = !this.state.isMenuOpen ? "hidden" : "";
    this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen });
  };
}
