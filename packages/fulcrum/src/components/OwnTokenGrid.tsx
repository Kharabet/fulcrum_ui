import React, { Component } from "react";
import { OwnTokenGridRow, IOwnTokenGridRowProps } from "./OwnTokenGridRow";
import { OwnTokenGridHeader } from "./OwnTokenGridHeader";
import { PreloaderChart } from "../components/PreloaderChart";

import { ReactComponent as Placeholder } from "../assets/images/history_placeholder.svg";
import "../styles/components/own-token-grid.scss"

export interface IOwnTokenGridProps {
  isMobileMedia: boolean;
  ownRowsData: IOwnTokenGridRowProps[];
  openedPositionsLoading: boolean;
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
  private _isMounted: boolean = false;

  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  public async componentDidMount() {
    this._isMounted = true;
  }

  public render() {
    if (this.props.openedPositionsLoading)
      return <PreloaderChart quantityDots={4} sizeDots={'middle'} title={"Loading"} isOverlay={false} />;

    if (!this.props.ownRowsData.length)
      return (
        <div className="history-token-grid__placeholder">
          <div>
            <Placeholder />
            <p>No open positions</p>
            <a href="/trade" className="history-token-grid__link-button">Start Trading</a>
          </div>

        </div>);

    const ownRows = this.props.ownRowsData.map((e, i) => <OwnTokenGridRow key={i} {...e} />);
    if (ownRows.length === 0) return null;

    return (
      <div className="own-token-grid">
        {!this.props.isMobileMedia && <OwnTokenGridHeader />}
        {ownRows}
      </div>
    );
  }

}
