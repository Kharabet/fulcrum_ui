import React, { Component } from "react";
import { HistoryTokenGridHeader } from "./HistoryTokenGridHeader";
import { IHistoryTokenGridRowProps, HistoryTokenGridRow } from "./HistoryTokenGridRow";
import { HistoryTokenCardMobile } from "./HistoryTokenCardMobile";
import { ReactComponent as ArrowPagination } from "../assets/images/icon_pagination.svg";

import "../styles/components/history-token-grid.scss";

export interface IHistoryTokenGridProps {
  isMobileMedia: boolean;
  historyRowsData: IHistoryTokenGridRowProps[];
}

interface IHistoryTokenGridState {
  numberPagination: number;
  quantityGrids: number;
  isLastRow: boolean;
}

export class HistoryTokenGrid extends Component<IHistoryTokenGridProps, IHistoryTokenGridState> {
  private quantityVisibleRow = 8;
  constructor(props: IHistoryTokenGridProps) {
    super(props);
    this.state = {
      numberPagination: 0,
      quantityGrids: 0,
      isLastRow: false
    };
  }

  public UNSAFE_componentWillMount(): void {
    const quantityGrids = Math.floor(this.props.historyRowsData.length / this.quantityVisibleRow);
    const isLastRow = this.props.historyRowsData.length === (this.state.numberPagination + 1) * this.quantityVisibleRow;
    this.setState({ ...this.state, quantityGrids: quantityGrids, isLastRow: isLastRow })
  }
  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }

  private renderDesktop = () => {
    const historyRows = this.props.historyRowsData.slice(this.quantityVisibleRow * this.state.numberPagination, this.quantityVisibleRow * this.state.numberPagination + this.quantityVisibleRow).map((e, i) => <HistoryTokenGridRow key={i} {...e} />);
    if (historyRows.length === 0) return null;

    return (
      <div className="history-token-grid">
        <HistoryTokenGridHeader />
        {historyRows}
        <div className="pagination">
          <div className={`prev ${this.state.numberPagination === 0 ? `disabled` : ``}`} onClick={this.prevPagination}><ArrowPagination /></div>
          <div className={`next ${this.state.numberPagination === this.state.quantityGrids || this.state.isLastRow ? `disabled` : ``}`} onClick={this.nextPagination}><ArrowPagination /></div>
        </div>
      </div>
    );
  }

  private renderMobile = () => {
    const historyRows = this.props.historyRowsData.map((e, i) => <HistoryTokenCardMobile key={i} {...e} />);
    if (historyRows.length === 0) return null;

    return (
      <div className="history-token-cards">
        {historyRows}
      </div>
    );
  }

  public nextPagination = () => {
    if (this.state.numberPagination !== this.state.quantityGrids && !this.state.isLastRow) {
      const isLastRow = this.props.historyRowsData.length === (this.state.numberPagination + 2) * this.quantityVisibleRow;
      this.setState({ ...this.state, numberPagination: this.state.numberPagination + 1, isLastRow: isLastRow });
    }
  }

  public prevPagination = () => {
    if (this.state.numberPagination !== 0)
      this.setState({ ...this.state, numberPagination: this.state.numberPagination - 1, isLastRow: false });
  }
}
