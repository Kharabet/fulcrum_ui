import React, { Component } from "react";
import { OwnTokenGridRow, IOwnTokenGridRowProps } from "./OwnTokenGridRow";
import { OwnTokenGridHeader } from "./OwnTokenGridHeader";
import { OwnTokenCardMobile } from "./OwnTokenCardMobile";

import "../styles/components/own-token-grid.scss"

export interface IOwnTokenGridProps {
  isMobileMedia: boolean;
  ownRowsData: IOwnTokenGridRowProps[];
}

interface IOwnTokenGridState {
  ownRowsData: IOwnTokenGridRowProps[];
  isShowHistory: boolean;
}

export class OwnTokenGrid extends Component<IOwnTokenGridProps, IOwnTokenGridState> {
  constructor(props: IOwnTokenGridProps) {
    super(props);
    this.state = {
      ownRowsData: [],
      isShowHistory: false
    };
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }

  private renderDesktop = () => {
    const ownDesktopRows = this.props.ownRowsData.map((e,i) => <OwnTokenGridRow key={i} {...e} />);
    if (ownDesktopRows.length === 0) return null;

    return (
      <div className="own-token-grid">
        <OwnTokenGridHeader />
        {ownDesktopRows}
      </div>
    );
  }

  private renderMobile = () => {
    const ownMobileRows = this.props.ownRowsData.map((e,i) => <OwnTokenCardMobile key={i} {...e} />);
    if (ownMobileRows.length === 0) return null;

    return (
      <div className="own-token-cards">
        <div className="own-token-cards__container">
          {ownMobileRows}
        </div>
      </div>
    );
  }
}
