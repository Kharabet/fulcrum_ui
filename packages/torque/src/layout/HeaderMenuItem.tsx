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
    let headClass = "header-menu__item-link"
    if(window.location.href.indexOf(this.props.link)>1){
      headClass = "header-menu__item-link--active"
    }
    return (
      <div className="header-menu__item">
        {this.props.external ? (
          <a href={this.props.link} className={headClass}>
            <div>{this.props.title}</div>
            <div className="header-menu__item-link__accent-container">
              <div className="header-menu__item-link__accent" />
            </div>
          </a>
        ) : (
          <NavLink to={this.props.link} exact={true} className={headClass} activeClassName="header-menu__item-link--active">
            <div>{this.props.title}</div>
            <div className="header-menu__item-link__accent-container">
              <div className="header-menu__item-link__accent" />
            </div>
          </NavLink>
        )}
      </div>
    );
  }
}
