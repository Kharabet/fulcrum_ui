import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

export interface IHeaderMenuItemProps {
  id: number;
  title: string;
  link: string;
}

export class HeaderMenuItem extends Component<IHeaderMenuItemProps> {
  render() {
    return (
      <div className="header-menu__item">
        <NavLink to={this.props.link} exact={true} activeClassName="header-menu__item-link--active">{this.props.title}</NavLink>
      </div>
    );
  }
}
