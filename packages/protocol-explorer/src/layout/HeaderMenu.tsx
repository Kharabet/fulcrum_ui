import React, { Component } from 'react'
import { HeaderMenuItem, IHeaderMenuItemProps } from './HeaderMenuItem'

export interface IHeaderMenuProps {}
export class HeaderMenu extends Component<IHeaderMenuProps> {
  public render() {
    const itemsMenu = [
      { id: 0, title: 'Trade', link: 'https://app.fulcrum.trade//trade', external: true },
      { id: 1, title: 'Lend', link: 'https://app.fulcrum.trade//lend', external: true },

      { id: 2, title: 'Borrow', link: 'https://torque.loans', external: true },
      { id: 3, title: 'Stake', link: 'https://staking.bzx.network', external: true }
    ]
    const menuItems = itemsMenu.map((e: IHeaderMenuItemProps) => (
      <HeaderMenuItem key={e.id} {...e} />
    ))
    return <div className="header-menu">{menuItems}</div>
  }
}
