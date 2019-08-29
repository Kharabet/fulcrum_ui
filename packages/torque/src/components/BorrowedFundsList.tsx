import React, { Component, RefObject } from "react";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { BorrowedFundsListItem } from "./BorrowedFundsListItem";

export interface IBorrowedFundsListProps {
  items: IBorrowedFundsState[];

  onManageCollateral: (item: IBorrowedFundsState) => void;
  onRepayLoan: (item: IBorrowedFundsState) => void;
  onExtendLoan: (item: IBorrowedFundsState) => void;
}

interface IBorrowedFundsListState {
  // colsCount: number;
}

export class BorrowedFundsList extends Component<IBorrowedFundsListProps, IBorrowedFundsListState> {
  private outerRef: RefObject<HTMLDivElement>;

  constructor(props: IBorrowedFundsListProps) {
    super(props);

    this.outerRef = React.createRef();
    this.state = { /*colsCount: this.getColsCount()*/ };
  }

  // public componentDidMount(): void {
  //   window.addEventListener("resize", this.didResize.bind(this));
  //   this.didResize();
  // }
  //
  // public componentWillUnmount(): void {
  //   window.removeEventListener("resize", this.didResize.bind(this));
  // }

  public render() {
    const items = this.props.items.map((e, index) => {
      // const rest = index % this.state.colsCount;
      return (
        <BorrowedFundsListItem
          key={index}
          // firstInTheRow={rest === 0}
          // lastInTheRow={rest === (this.state.colsCount - 1)}
          item={e}
          onManageCollateral={this.props.onManageCollateral}
          onRepayLoan={this.props.onRepayLoan}
          onExtendLoan={this.props.onExtendLoan}
        />
      );
    });

    return <div className="borrowed-funds-list" ref={this.outerRef}>{items}</div>;
  }

  // private didResize = () => {
  //   const colsCount = this.getColsCount();
  //   if (colsCount !== this.state.colsCount) {
  //     this.setState({ ...this.state, colsCount: colsCount });
  //   }
  // };
  //
  // private getColsCount = () => {
  //   let cols = 1;
  //   if (this.outerRef.current) {
  //     const widthInRem = this.convertPixelsToRem(this.outerRef.current.offsetWidth);
  //     cols = Math.trunc((widthInRem + 2) / 23);
  //   }
  //   return cols;
  // };
  //
  // private convertPixelsToRem = (pixels: number) => {
  //   const remSize = getComputedStyle(document.documentElement).fontSize;
  //   return pixels / parseFloat(remSize || "16");
  // };
}
