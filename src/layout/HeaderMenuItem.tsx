import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export interface IHeaderMenuItemProps {
  id: number;
  title: string;
  link: string;
}

export class HeaderMenuItem extends Component<IHeaderMenuItemProps> {
  public render() {
    return (
      <div className="header-menu__item">
        <NavLink to={this.props.link} exact={true} activeClassName="header-menu__item-link--active">
          <div>{this.props.title}</div>
          <div className="header-menu__item-link__accent-container">
            <div className="header-menu__item-link__accent" />
          </div>
        </NavLink>
      </div>
    );
  }
}
