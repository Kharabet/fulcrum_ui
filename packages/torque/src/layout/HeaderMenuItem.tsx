import React, { Component } from 'react'

export interface IHeaderMenuItemProps {
  title: string
  link: string
  external: boolean
}

export class HeaderMenuItem extends Component<IHeaderMenuItemProps> {
  public render() {
    return (
      <div className="header-menu__item">
        {this.props.external ? (
          <a href={this.props.link} className={`header-menu__item-link c-green`}>
            <span>{this.props.title}</span>
          </a>
        ) : (
          <span className="header-menu__item-link header-menu__item-link--active c-green">
            {this.props.title}
          </span>
        )}
      </div>
    )
  }
}
