import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export interface IHeaderMenuItemProps {
  id: number;
  title: string;
  link: string;
  external: boolean;
}

export class HeaderMenuItem extends Component<IHeaderMenuItemProps> {
  public render() {
    return (
      <div className="header-menu__item">
        {this.props.external ? (
          <a href={this.props.link} className={`header-menu__item-link ${this.props.id === 4 ? "color-primary" : ""}`}>
            <div>{this.props.title}</div>
          </a>
        ) : (
          <NavLink to={this.props.link} exact={true} activeClassName="header-menu__item-link--active">
            <div>{this.props.title}</div>
          </NavLink>
        )}
      </div>
    );
  }
}
