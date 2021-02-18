import React, { Component } from 'react'
import { HeaderMenuItem, IHeaderMenuItemProps } from './HeaderMenuItem'

export interface IHeaderMenuProps {
  items: IHeaderMenuItemProps[]
  onMenuToggle: () => void
}

export class HeaderMenu extends Component<IHeaderMenuProps> {
  public render() {
    const menuItems = this.props.items.map((e: IHeaderMenuItemProps, index: number) => (
      <HeaderMenuItem key={index} {...e} />
    ))

    return (
      <div className="header-menu" onClick={this.props.onMenuToggle}>
        {menuItems}
      </div>
    )
  }
}
