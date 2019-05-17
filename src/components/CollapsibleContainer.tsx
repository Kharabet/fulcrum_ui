import React, { Component } from "react";

export interface ICollapsibleContainerProps {
  title: string;
}

export class CollapsibleContainer extends Component<ICollapsibleContainerProps> {
  public render() {
    return (
      <div className="collapsible-container">
        <input id="collapsible" className="collapsible-container__toggle-cb" type="checkbox" />
        <label htmlFor="collapsible" className="collapsible-container__toggle-label">
          {this.props.title}
        </label>
        <div className="collapsible-container__content">
          <div className="collapsible-container__content-inner">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
