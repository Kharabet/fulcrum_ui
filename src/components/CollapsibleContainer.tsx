import React, { Component } from "react";

export interface ICollapsibleContainerProps {
  title: string;
}

export class CollapsibleContainer extends Component<ICollapsibleContainerProps> {
  public render() {
    const uuid = this.uuidv4();

    return (
      <div className="collapsible-container">
        <input id={uuid} className="collapsible-container__toggle-cb" type="checkbox" />
        <label htmlFor={uuid} className="collapsible-container__toggle-label">
          {this.props.title}
        </label>
        <div className="collapsible-container__content">
          <div className="collapsible-container__content-inner">{this.props.children}</div>
        </div>
      </div>
    );
  }

  // https://gist.github.com/jed/982883
  private uuidv4 = () => {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      // tslint:disable-next-line:no-bitwise
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}
