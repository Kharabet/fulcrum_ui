import { HeaderMenuItem, IHeaderMenuItemProps } from './HeaderMenuItem'
import appConfig from 'bzx-common/src/config/appConfig'
import React, { Component } from 'react'

export interface IHeaderMenuProps {
  items: IHeaderMenuItemProps[]
  onMenuToggle: () => void
}

export class HeaderMenu extends Component<IHeaderMenuProps> {
  public render() {
    const menuItems = this.props.items.map((e: IHeaderMenuItemProps, index: number) => {
      if (appConfig.isBsc && e.title === 'Stake') {
        return null
      }
      return <HeaderMenuItem key={index} {...e} />
    })

    return (
      <div className="header-menu" onClick={this.props.onMenuToggle}>
        {menuItems}
      </div>
    )
  }
}
