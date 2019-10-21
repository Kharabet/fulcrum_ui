import React, { Component, RefObject } from "react";
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { WalletType } from "../domain/WalletType";
import { TorqueProvider } from "../services/TorqueProvider";
import { BorrowedFundsAwaitingListItem } from "./BorrowedFundsAwaitingListItem";
import { BorrowedFundsListItem } from "./BorrowedFundsListItem";

export interface IBorrowedFundsListProps {
  walletDetails: IWalletDetails;
  items: IBorrowedFundsState[];
  itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting>;

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
    const itemsAwaiting = this.props.itemsAwaiting.filter(e => this.props.walletDetails.walletType === WalletType.Web3 || this.props.walletDetails.walletType === WalletType.ViewOnly || TorqueProvider.Instance.isETHAsset(e.collateralAsset))
      .map((e, index) => {
        // const rest = index % this.state.colsCount;
        return (
          <BorrowedFundsAwaitingListItem
            key={index}
            // firstInTheRow={rest === 0}
            // lastInTheRow={rest === (this.state.colsCount - 1)}
            walletDetails={this.props.walletDetails}
            itemAwaiting={e}
          />
        );
      });
    const items = this.props.items.filter(e => this.props.walletDetails.walletType === WalletType.Web3 || this.props.walletDetails.walletType === WalletType.ViewOnly || TorqueProvider.Instance.isETHAsset(e.collateralAsset))
      .map((e, index) => {
      // const rest = index % this.state.colsCount;
      return (
        <BorrowedFundsListItem
          key={index}
          // firstInTheRow={rest === 0}
          // lastInTheRow={rest === (this.state.colsCount - 1)}
          walletDetails={this.props.walletDetails}
          item={e}
          onManageCollateral={this.props.onManageCollateral}
          onRepayLoan={this.props.onRepayLoan}
          onExtendLoan={this.props.onExtendLoan}
        />
      );
    });

    return <div className="borrowed-funds-list" ref={this.outerRef}>{itemsAwaiting}{items}</div>;
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
