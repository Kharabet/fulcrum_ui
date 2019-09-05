import { BigNumber } from "bignumber.js";
import React, { Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IRepayEstimate } from "../domain/IRepayEstimate";
import { IWalletDetails } from "../domain/IWalletDetails";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { TorqueProvider } from "../services/TorqueProvider";
import { RepayLoanSlider } from "./RepayLoanSlider";

export interface IRepayLoanFormProps {
  walletDetails: IWalletDetails;
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: RepayLoanRequest) => void;
}

interface IRepayLoanFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;

  currentValue: number;
  selectedValue: number;
  repayAmount: BigNumber;
}

export class RepayLoanForm extends Component<IRepayLoanFormProps, IRepayLoanFormState> {
  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IRepayLoanFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 0,
      maxValue: 100,
      assetDetails: null,
      currentValue: 100,
      selectedValue: 100,
      repayAmount: new BigNumber(0)
    };

    this.selectedValueUpdate = new Subject<number>();
    this.selectedValueUpdate
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe((value: IRepayEstimate) => {
        this.setState({
          ...this.state,
          repayAmount: value.repayAmount
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanRepayParams(
      this.props.walletDetails,
      this.props.loanOrderState.accountAddress,
      this.props.loanOrderState.loanOrderHash
    ).then(collateralState => {
      this.setState(
        {
          ...this.state,
          minValue: collateralState.minValue,
          maxValue: collateralState.maxValue,
          assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.asset) || null,
          currentValue: collateralState.currentValue,
          selectedValue: collateralState.currentValue
        },
        () => {
          this.selectedValueUpdate.next(this.state.selectedValue);
        }
      );
    });
  }

  public componentDidUpdate(
    prevProps: Readonly<IRepayLoanFormProps>,
    prevState: Readonly<IRepayLoanFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      this.selectedValueUpdate.next(this.state.selectedValue);
    }
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    return (
      <form className="repay-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <RepayLoanSlider
            readonly={false}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            value={this.state.currentValue}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
          />

          <div className="repay-loan-form__tips">
            <div className="repay-loan-form__tip">Current state</div>
            <div className="repay-loan-form__tip">Full repayment</div>
          </div>

          <hr className="repay-loan-form__delimiter" />

          <div className="repay-loan-form__operation-result-container">
            <img className="repay-loan-form__operation-result-img" src={this.state.assetDetails.logoSvg} />
            <div className="repay-loan-form__operation-result-msg">You will repay</div>
            <div className="repay-loan-form__operation-result-amount">
              {this.state.repayAmount.toFixed(6)} {this.state.assetDetails.displayName}
            </div>
          </div>
        </section>
        <section className="dialog-actions">
          <div className="repay-loan-form__actions-container">
            <button type="submit" className="btn btn-size--small">
              Repay
            </button>
          </div>
        </section>
      </form>
    );
  }

  private rxGetEstimate = (selectedValue: number): Observable<IRepayEstimate> => {
    return new Observable<IRepayEstimate>(observer => {
      TorqueProvider.Instance.getLoanRepayEstimate(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash,
        selectedValue
      ).then(value => {
        observer.next(value);
      });
    });
  };

  private onChange = (value: number) => {
    this.setState({ ...this.state, selectedValue: value, currentValue: value });
  };

  private onUpdate = (value: number) => {
    this.setState({ ...this.state, selectedValue: value });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    this.props.onSubmit(
      new RepayLoanRequest(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash,
        new BigNumber(this.state.currentValue)
      )
    );
  };
}
