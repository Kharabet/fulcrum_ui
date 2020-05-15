import React, { Component, RefObject } from "react";
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { BorrowedFundsAwaitingListItem } from "./BorrowedFundsAwaitingListItem";
import { BorrowedFundsListItem } from "./BorrowedFundsListItem";
import { Asset } from "../domain/Asset";
import { ManageCollateralDlg } from "./ManageCollateralDlg";
import { RepayLoanDlg } from "./RepayLoanDlg";
import { ExtendLoanDlg } from "./ExtendLoanDlg";

export interface IBorrowedFundsListProps {
  items: IBorrowedFundsState[];
  itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting>;
  selectedAsset: Asset;
  isLoadingTransaction: boolean;
  onManageCollateral: (item: IBorrowedFundsState) => void;
  onRepayLoan: (item: IBorrowedFundsState) => void;
  onExtendLoan: (item: IBorrowedFundsState) => void;
  onBorrowMore: (item: IBorrowedFundsState) => void;
  manageCollateralDlgRef: React.RefObject<ManageCollateralDlg>;
  repayLoanDlgRef: React.RefObject<RepayLoanDlg>;
  extendLoanDlgRef: React.RefObject<ExtendLoanDlg>;
}

interface IBorrowedFundsListState {
  isLoading : boolean 
  // colsCount: number;
}

export class BorrowedFundsList extends Component<IBorrowedFundsListProps, IBorrowedFundsListState> {
  private readonly outerRef: RefObject<HTMLDivElement>;

  constructor(props: IBorrowedFundsListProps) {
    super(props);

    this.outerRef = React.createRef();

    this.state = {
      isLoading:true 
      /*colsCount: this.getColsCount()*/ };
  }

  public componentDidMount(): void {
    this.setState(
      {       
        isLoading : false 
      });
   // window.addEventListener("resize", this.didResize.bind(this));
    //this.didResize();
  }
  //
  // public componentWillUnmount(): void {
  //   window.removeEventListener("resize", this.didResize.bind(this));
  // }

  public render() {
    const itemsAwaiting = this.props.itemsAwaiting.map((e, index) => {
      // const rest = index % this.state.colsCount;
      return (
        <BorrowedFundsAwaitingListItem
          key={index}
          itemAwaiting={e}
        />
      );
    });
    const items = this.props.items.map((e, index) => {
      // const rest = index % this.state.colsCount;
      return (
        <BorrowedFundsListItem
          key={index}
          item={e}
          onManageCollateral={this.props.onManageCollateral}
          onRepayLoan={this.props.onRepayLoan}
          onExtendLoan={this.props.onExtendLoan}
          onBorrowMore={this.props.onBorrowMore}
          selectedAsset={this.props.selectedAsset}
          manageCollateralDlgRef={this.props.manageCollateralDlgRef}
          repayLoanDlgRef={this.props.repayLoanDlgRef}
          extendLoanDlgRef={this.props.extendLoanDlgRef}
        />
      );
    });
    
    
    return <div className="borrowed-funds-list" ref={this.outerRef}>
      {this.state.isLoading && itemsAwaiting.length === 0 && items.length === 0
        && <a href="/borrow" className="no-loans-msg">Looks like you don't have any loans.</a>}
      {itemsAwaiting}
      {items}
    </div>;
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
