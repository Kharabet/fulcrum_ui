import { BigNumber } from "bignumber.js";
import React, { Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IExtendEstimate } from "../domain/IExtendEstimate";
import { TorqueProvider } from "../services/TorqueProvider";
import { ExtendLoanSlider } from "./ExtendLoanSlider";

export interface IExtendLoanFormProps {
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: ExtendLoanRequest) => void;
}

interface IExtendLoanFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;

  currentValue: number;
  selectedValue: number;
  depositAmount: BigNumber;
}

export class ExtendLoanForm extends Component<IExtendLoanFormProps, IExtendLoanFormState> {
  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IExtendLoanFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 1,
      maxValue: 365,
      assetDetails: null,
      currentValue: 100,
      selectedValue: 100,
      depositAmount: new BigNumber(0)
    };

    this.selectedValueUpdate = new Subject<number>();
    this.selectedValueUpdate
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe((value: IExtendEstimate) => {
        this.setState({
          ...this.state,
          depositAmount: value.depositAmount
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanExtendParams(this.props.loanOrderState.loanOrderHash).then(
      collateralState => {
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
      }
    );
  }

  public componentDidUpdate(
    prevProps: Readonly<IExtendLoanFormProps>,
    prevState: Readonly<IExtendLoanFormState>,
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
      <form className="extend-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <ExtendLoanSlider
            readonly={false}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            value={this.state.currentValue}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
          />

          <div className="extend-loan-form__tips">
            <div className="extend-loan-form__tip">Min</div>
            <div className="extend-loan-form__tip">Max</div>
          </div>

          <hr className="extend-loan-form__delimiter" />

          <div className="extend-loan-form__info-liquidated-at-container">
            <div className="extend-loan-form__info-liquidated-at-msg">
              Your loan will be extended by
            </div>
            <div className="extend-loan-form__info-liquidated-at-price">
              {this.state.selectedValue} {this.pluralize("day", "days", this.state.selectedValue)}
            </div>
          </div>

          <div className="extend-loan-form__operation-result-container">
            <img className="extend-loan-form__operation-result-img" src={this.state.assetDetails.logoSvg} />
            <div className="extend-loan-form__operation-result-msg">
              You will top up
            </div>
            <div className="extend-loan-form__operation-result-amount">
              {this.state.depositAmount.toFixed(6)} {this.state.assetDetails.displayName}
            </div>
          </div>
        </section>
        <section className="dialog-actions">
          <div className="extend-loan-form__actions-container">
            <button type="submit" className="btn btn-size--small">
              Extend
            </button>
          </div>
        </section>
      </form>
    );
  }

  private pluralize = (singular: string, plural: string, value: number) => {
    const isPlural = value !== 1;
    return isPlural ? plural : singular;
  };

  private rxGetEstimate = (selectedValue: number): Observable<IExtendEstimate> => {
    return new Observable<IExtendEstimate>(observer => {
      TorqueProvider.Instance.getLoanExtendEstimate(
        this.props.loanOrderState.asset,
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
      new ExtendLoanRequest(this.props.loanOrderState.loanOrderHash, this.state.currentValue)
    );
  };
}
