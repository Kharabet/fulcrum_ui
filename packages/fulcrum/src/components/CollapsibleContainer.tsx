import React, { Component } from "react";

export interface ICollapsibleContainerProps {
  titleOpen: string;
  titleClose: string;
  isTransparent: boolean;
}

interface ICollapsibleContainerState {
  isOpen: boolean;
}

export class CollapsibleContainer extends Component<ICollapsibleContainerProps, ICollapsibleContainerState> {
  constructor(props: ICollapsibleContainerProps) {
    super(props);

    this.state = { isOpen: false };
  }

  public render() {
    const uuid = this.uuidv4();
    const labelTransparentClassname = this.props.isTransparent ? "collapsible-container__toggle-label--transparent" : "";

    return (
      <div className={`collapsible-container ${this.state.isOpen ? "opened" : "closed"}`}>
        <input id={uuid} className="collapsible-container__toggle-cb" type="checkbox" value={(this.state.isOpen as any)} />
        <label htmlFor={uuid} className={`collapsible-container__toggle-label ${labelTransparentClassname}`} onClick={this.onCheckedChange}>
          {this.state.isOpen ? this.props.titleClose : this.props.titleOpen}
        </label>
        <div className="collapsible-container__content">
          <div className="collapsible-container__content-inner">{this.props.children}</div>
        </div>
      </div>
    );
  }

  private onCheckedChange = () => {
    this.setState({...this.state, isOpen: !this.state.isOpen});
  };

  // https://gist.github.com/jed/982883
  private uuidv4 = () => {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      // tslint:disable-next-line:no-bitwise
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}
