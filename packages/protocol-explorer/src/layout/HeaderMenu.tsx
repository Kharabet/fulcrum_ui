import React, { Component } from "react";
import { HeaderMenuItem, IHeaderMenuItemProps } from "./HeaderMenuItem";

export interface IHeaderMenuProps { }
export class HeaderMenu extends Component<IHeaderMenuProps> {
  public render() {
    const itemsMenu = [
      { id: 1, title: "Stats", link: "/", external: false },
      { id: 2, title: "Liquidations", link: "/liquidations", external: false },
      { id: 3, title: "Staking", link: "https://staking.bzx.network", external: true },
      { id: 4, title: "Blog", link: "https://bzx.network/blog/", external: true },
    ];
    const menuItems = itemsMenu.map((e: IHeaderMenuItemProps) => <HeaderMenuItem key={e.id} {...e} />);
    return <div className="header-menu">{menuItems}</div>;
  }
}
