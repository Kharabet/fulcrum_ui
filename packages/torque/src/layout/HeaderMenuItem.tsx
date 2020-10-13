import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as ExternalLink } from "../assets/images/external-link.svg"

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
        {this.props.external
          ? <a href={this.props.link} className={`header-menu__item-link ${this.props.title === "Help Center" ? "c-primary-blue help-center" : "c-green"}`} target="_blank">
            {this.props.title !== "Help Center"
              ? (<span className="icon-external">
                <ExternalLink />
              </span>)
              : null}
            <span>{this.props.title}</span>
          </a>
          : <NavLink to={this.props.link} className="header-menu__item-link c-green" exact={true} activeClassName="header-menu__item-link--active">
            <span>{this.props.title}</span>
          </NavLink>
        }
      </div>
    );
  }
}
