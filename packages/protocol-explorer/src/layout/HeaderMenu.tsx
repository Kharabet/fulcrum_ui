import React, { Component } from 'react'
import { HeaderMenuItem, IHeaderMenuItemProps } from './HeaderMenuItem'

export interface IHeaderMenuProps {}
export class HeaderMenu extends Component<IHeaderMenuProps> {
  public render() {
    const itemsMenu = [
      { title: 'Trade', link: 'https://app.fulcrum.trade/trade' },
      { title: 'Lend', link: 'https://app.fulcrum.trade/lend' },

      { title: 'Borrow', link: 'https://app.torque.loans/borrow' },
      { title: 'Stake', link: 'https://staking.bzx.network' },
    ]
    const menuItems = itemsMenu.map((e: IHeaderMenuItemProps, index: number) => (
      <HeaderMenuItem key={index} {...e} />
    ))
    return <div className="header-menu">{menuItems}</div>
  }
}
