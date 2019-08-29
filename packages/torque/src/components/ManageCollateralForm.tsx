import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { TorqueProvider } from "../services/TorqueProvider";
import { CollateralSlider } from "./CollateralSlider";

export interface IManageCollateralFormProps {
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: ManageCollateralRequest) => void;
}

interface IManageCollateralFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;
  loanValue: number;

  currentValue: number;
  selectedValue: number;

  diffAmount: BigNumber;
  liquidationPrice: BigNumber;
}

export class ManageCollateralForm extends Component<IManageCollateralFormProps, IManageCollateralFormState> {
  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IManageCollateralFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 0,
      maxValue: 100,
      assetDetails: null,
      loanValue: 100,
      currentValue: 100,
      selectedValue: 100,
      diffAmount: new BigNumber(0),
      liquidationPrice: new BigNumber(0)
    };

    this.selectedValueUpdate = new Subject<number>();
    this.selectedValueUpdate
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe((value: ICollateralChangeEstimate) => {
        this.setState({
          ...this.state,
          diffAmount: value.diffAmount,
          liquidationPrice: value.liquidationPrice
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanCollateralManagementParams(this.props.loanOrderState.loanOrderHash).then(
      collateralState => {
        this.setState(
          {
            ...this.state,
            minValue: collateralState.minValue,
            maxValue: collateralState.maxValue,
            assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.asset) || null,
            loanValue: collateralState.currentValue,
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
    prevProps: Readonly<IManageCollateralFormProps>,
    prevState: Readonly<IManageCollateralFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.loanValue !== this.state.loanValue ||
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
      <form className="manage-collateral-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <CollateralSlider
            readonly={false}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            value={this.state.currentValue}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
          />

          <div className="manage-collateral-form__tips">
            <div className="manage-collateral-form__tip">Withdraw</div>
            <div className="manage-collateral-form__tip">Top Up</div>
          </div>

          <hr className="manage-collateral-form__delimiter" />

          <div className="manage-collateral-form__info-liquidated-at-container">
            <div className="manage-collateral-form__info-liquidated-at-msg">
              Your loan will be liquidated if the price of
            </div>
            <div className="manage-collateral-form__info-liquidated-at-price">
              {this.state.assetDetails.displayName} falls below ${this.state.liquidationPrice.toFixed(2)}
            </div>
          </div>

          {this.state.loanValue !== this.state.selectedValue ? (
            <div className="manage-collateral-form__operation-result-container">
              <img className="manage-collateral-form__operation-result-img" src={this.state.assetDetails.logoSvg} />
              <div className="manage-collateral-form__operation-result-msg">
                You will {this.state.loanValue > this.state.selectedValue ? "withdraw" : "top up"}
              </div>
              <div className="manage-collateral-form__operation-result-amount">
                {this.state.diffAmount.toFixed(6)} {this.state.assetDetails.displayName}
              </div>
              {this.state.loanValue !== this.state.selectedValue ? (
                <div className="manage-collateral-form__actions-container">
                  {this.state.loanValue > this.state.selectedValue ? (
                    <button type="submit" className="btn btn-size--small">
                      Withdraw
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-size--small">
                      Top Up
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </form>
    );
  }

  private rxGetEstimate = (selectedValue: number): Observable<ICollateralChangeEstimate> => {
    return new Observable<ICollateralChangeEstimate>(observer => {
      TorqueProvider.Instance.getLoanCollateralChangeEstimate(
        this.props.loanOrderState.asset,
        this.state.loanValue,
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
      new ManageCollateralRequest(this.props.loanOrderState.loanOrderHash, new BigNumber(this.state.currentValue))
    );
  };
}
