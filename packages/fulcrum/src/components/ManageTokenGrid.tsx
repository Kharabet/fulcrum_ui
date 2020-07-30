import React, { Component } from "react";

import { IHistoryEvents } from "../domain/IHistoryEvents";
import { Asset } from "../domain/Asset";
import { ManageTokenGridHeader } from "./ManageTokenGridHeader";
import { OwnTokenGrid } from "./OwnTokenGrid";
import { HistoryTokenGrid } from "./HistoryTokenGrid";
import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";


import "../styles/components/manage-token-grid.scss"

export interface IManageTokenGridProps {
  isMobileMedia: boolean;
  ownRowsData: IOwnTokenGridRowProps[];
  historyEvents: IHistoryEvents | undefined;
  stablecoins: Asset[];
  baseTokens: Asset[];
  quoteTokens: Asset[];
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
          ? <HistoryTokenGrid historyEvents={this.props.historyEvents}
            isMobileMedia={this.props.isMobileMedia}
            stablecoins={this.props.stablecoins}
            baseTokens={this.props.baseTokens}
            quoteTokens={this.props.quoteTokens} />
          : <OwnTokenGrid ownRowsData={this.props.ownRowsData} isMobileMedia={this.props.isMobileMedia} />
        }
      </div>
    )
  }

  public updateStateisShowHistory = (updatedState: boolean) => {
    this.setState({ isShowHistory: updatedState })
  }
}
