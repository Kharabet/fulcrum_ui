import React, { ChangeEventHandler, Component } from "react";

export interface ICheckBoxProps {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export class CheckBox extends Component<ICheckBoxProps> {
  public render() {
    return (
      <label className="cb-container">
        <span className="cb-label">{this.props.children}</span>
        <input type="checkbox" className="cb-checkbox" checked={this.props.checked} onChange={this.props.onChange} />
        <span className="cb-checkmark" />
      </label>
    );
  }
}
