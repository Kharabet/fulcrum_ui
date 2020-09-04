import React, { Component } from "react";

export interface IManageTokenGridHeaderProps {
  isMobileMedia: boolean;
  isShowHistory: boolean;
  updateStateisShowHistory: (updatedState: boolean) => void;
}

export interface IManageTokenGridHeaderState {
  isShowHistory: boolean;
}

export class ManageTokenGridHeader extends Component<IManageTokenGridHeaderProps, IManageTokenGridHeaderState> {
  constructor(props: IManageTokenGridHeaderProps) {
    super(props);
    this._isMounted = false;
    this.state = {
      isShowHistory: props.isShowHistory,
    };
  }

  private _isMounted: boolean;

  public componentDidMount(): void {
    this._isMounted = true;
  }

  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  public componentDidUpdate(prevState: Readonly<IManageTokenGridHeaderProps>): void {
    if (prevState.isShowHistory !== this.state.isShowHistory)
      this.props.updateStateisShowHistory(this.state.isShowHistory);
  }

  public render() {
    return (
      <React.Fragment>
        {this.props.isMobileMedia && <div className="manage-token-grid__title">Manage</div>}
        <div className="manage-token-grid__group-tabs">
          <div className={`tab ${!this.state.isShowHistory ? `active` : ``}`} onClick={this.onShowOpenPositions}>Open positions</div>
          <div className={`tab ${this.state.isShowHistory ? `active` : ``}`} onClick={this.onShowHistory}>Trade history</div>
        </div>
      </React.Fragment>
    );
  }
  private onShowHistory = () => {
    this._isMounted && this.setState({ ...this.state, isShowHistory: true });
  };

  private onShowOpenPositions = () => {
    this._isMounted && this.setState({ ...this.state, isShowHistory: false });
  };
}
