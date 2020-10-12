import React from "react";

import { IHistoryEvents } from "../domain/IHistoryEvents";
import { Asset } from "../domain/Asset";
import { OwnTokenGrid } from "./OwnTokenGrid";
import { HistoryTokenGrid } from "./HistoryTokenGrid";
import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";


import "../styles/components/manage-token-grid.scss"

export interface IManageTokenGridProps {
  isMobileMedia: boolean;
  isShowHistory: boolean;
  ownRowsData: IOwnTokenGridRowProps[];
  historyEvents: IHistoryEvents | undefined;
  stablecoins: Asset[];
  baseTokens: Asset[];
  quoteTokens: Asset[];
  openedPositionsLoaded: boolean;
}

export const ManageTokenGrid = (props: IManageTokenGridProps) => {

  return (
    <div className="manage-token-grid">
      {props.isShowHistory
        ? <HistoryTokenGrid historyEvents={props.historyEvents}
          isMobileMedia={props.isMobileMedia}
          stablecoins={props.stablecoins}
          baseTokens={props.baseTokens}
          quoteTokens={props.quoteTokens} />
        : <OwnTokenGrid ownRowsData={props.ownRowsData} isMobileMedia={props.isMobileMedia} openedPositionsLoaded={props.openedPositionsLoaded} />
      }
    </div>
  )
}
