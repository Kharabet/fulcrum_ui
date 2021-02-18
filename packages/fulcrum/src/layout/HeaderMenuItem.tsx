import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export interface IHeaderMenuItemProps {
  title: string
  link: string
  external: boolean
  newTab?: boolean
}

export class HeaderMenuItem extends Component<IHeaderMenuItemProps> {
  public render() {
    return (
      <div className="header-menu__item">
        {this.props.external ? (
          this.props.newTab ? (
            <a
              href={this.props.link}
              className={`header-menu__item-link`}
              target="_blank"
              rel="noopener noreferrer">
              <span>{this.props.title}</span>
            </a>
          ) : (
            <a href={this.props.link} className={`header-menu__item-link`}>
              <span>{this.props.title}</span>
            </a>
          )
        ) : (
          <NavLink
            to={this.props.link}
            className="header-menu__item-link c-green"
            exact={true}
            activeClassName="header-menu__item-link--active">
            <span>{this.props.title}</span>
          </NavLink>
        )}
      </div>
    )
  }
}
