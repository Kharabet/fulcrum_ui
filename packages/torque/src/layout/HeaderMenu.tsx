import React, { Component } from 'react'
import { HeaderMenuItem, IHeaderMenuItemProps } from './HeaderMenuItem'

export interface IHeaderMenuProps {
  items: IHeaderMenuItemProps[]
}

export class HeaderMenu extends Component<IHeaderMenuProps> {
  public render() {
    const menuItems = this.props.items.map((e: IHeaderMenuItemProps, index: number) => {
      if (process.env.REACT_APP_ETH_NETWORK === 'bsc' && e.title === 'Stake') {
        return null
      }
      return <HeaderMenuItem key={index} {...e} />
    })

    return <div className="header-menu">{menuItems}</div>
  }
}
