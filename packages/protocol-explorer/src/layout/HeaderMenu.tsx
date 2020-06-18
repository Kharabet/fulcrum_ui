import React, { Component } from "react";
import { HeaderMenuItem, IHeaderMenuItemProps } from "./HeaderMenuItem";

export interface IHeaderMenuProps { }
export class HeaderMenu extends Component<IHeaderMenuProps> {
  public render() {
    const itemsMenu = [
      { id: 2, title: "Liquidations", link: "/liquidations", external: false },
      { id: 3, title: "Blog", link: "https://bzx.network/blog/", external: true },
      { id: 4, title: "Help", link: "https://help.bzx.network/en/", external: true }
    ];
    const menuItems = itemsMenu.map((e: IHeaderMenuItemProps) => <HeaderMenuItem key={e.id} {...e} />);
    return <div className="header-menu">{menuItems}</div>;
  }
}
