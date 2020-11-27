import React, { Component } from 'react'
import { HeaderMenuItem, IHeaderMenuItemProps } from './HeaderMenuItem'

export interface IHeaderMenuProps {}
export class HeaderMenu extends Component<IHeaderMenuProps> {
  public render() {
    const itemsMenu = [
      { id: 1, title: 'Dashboard', link: '/', external: false }
      // { id: 2, title: "Transactions", link: "/transactions", external: false }
    ]
    const menuItems = itemsMenu.map((e: IHeaderMenuItemProps) => (
      <HeaderMenuItem key={e.id} {...e} />
    ))
    return <div className="header-menu">{menuItems}</div>
  }
}
