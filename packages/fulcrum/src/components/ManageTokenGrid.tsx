import React, { Component } from "react";
import { ManageTokenGridHeader } from "./ManageTokenGridHeader";

import { OwnTokenGrid } from "./OwnTokenGrid";
import { HistoryTokenGrid } from "./HistoryTokenGrid";

import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";

import "../styles/components/manage-token-grid.scss"

export interface IManageTokenGridProps {
  isMobileMedia: boolean;
  ownRowsData: IOwnTokenGridRowProps[];
}

interface IManageTokenGridState {
  ownRowsData: IOwnTokenGridRowProps[];
  isShowHistory: boolean;
}

export class ManageTokenGrid extends Component<IManageTokenGridProps, IManageTokenGridState> {
  constructor(props: IManageTokenGridProps) {
    super(props);
    this.state = {
      ownRowsData: [],
      isShowHistory: false
    };
  }
  public render() {
    return (
      <div className="manage-token-grid">
        <ManageTokenGridHeader isMobileMedia={this.props.isMobileMedia} isShowHistory={this.state.isShowHistory} updateStateisShowHistory={this.updateStateisShowHistory} />
        {this.state.isShowHistory
          ? <HistoryTokenGrid historyRowsData={this.props.ownRowsData} isMobileMedia={this.props.isMobileMedia} />
          : <OwnTokenGrid ownRowsData={this.props.ownRowsData} isMobileMedia={this.props.isMobileMedia} />
        }
      </div>
    )
  }

  public updateStateisShowHistory = (updatedState: boolean) => {
    this.setState({ isShowHistory: updatedState })
  }
}
