import React, { Component } from "react";
import { ManageTokenGridHeader } from "./ManageTokenGridHeader";

import { OwnTokenGrid } from "./OwnTokenGrid";
import {IHistoryTokenGridProps, HistoryTokenGrid } from "./HistoryTokenGrid";
import {IHistoryTokenGridRowProps } from "./HistoryTokenGridRow";

import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";

import "../styles/components/manage-token-grid.scss"

export interface IManageTokenGridProps {
  isMobileMedia: boolean;
  ownRowsData: IOwnTokenGridRowProps[];
  historyRowsData: IHistoryTokenGridRowProps[];
}

interface IManageTokenGridState {
  isShowHistory: boolean;
}

export default class ManageTokenGrid extends Component<IManageTokenGridProps, IManageTokenGridState> {
  constructor(props: IManageTokenGridProps) {
    super(props);
    this.state = {
      isShowHistory: false
    };
  }
  public render() {
    return (
      <div className="manage-token-grid">
        <ManageTokenGridHeader isMobileMedia={this.props.isMobileMedia} isShowHistory={this.state.isShowHistory} updateStateisShowHistory={this.updateStateisShowHistory} />
        {this.state.isShowHistory
          ? <HistoryTokenGrid historyRowsData={this.props.historyRowsData} isMobileMedia={this.props.isMobileMedia} />
          : <OwnTokenGrid ownRowsData={this.props.ownRowsData} isMobileMedia={this.props.isMobileMedia} />
        }
      </div>
    )
  }

  public updateStateisShowHistory = (updatedState: boolean) => {
    this.setState({ isShowHistory: updatedState })
  }
}
