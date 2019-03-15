import React, { Component } from "react";
import { Link } from "react-router-dom";

export interface IHeaderMenuItemProps {
  id: number;
  title: string;
  link: string;
}

export class HeaderMenuItem extends Component<IHeaderMenuItemProps> {
  render() {
    return (
      <div className="header-menu__item header-menu__item--rounded">
        <Link to={this.props.link}>{this.props.title}</Link>
      </div>
    );
  }
}
