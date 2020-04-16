import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { ActionType } from "../domain/ActionType";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IExtendEstimate } from "../domain/IExtendEstimate";
import { TorqueProvider } from "../services/TorqueProvider";
import { ExtendLoanSlider } from "./ExtendLoanSlider";
import { OpsEstimatedResult } from "./OpsEstimatedResult";

export interface IExtendLoanFormProps {
  loanOrderState: IBorrowedFundsState;

  didSubmit: boolean;
  toggleDidSubmit: (submit: boolean) => void;
  onSubmit: (request: ExtendLoanRequest) => void;
  onClose: () => void;
}

interface IExtendLoanFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;

  currentValue: number;
  selectedValue: number;
  depositAmount: BigNumber;
  extendManagementAddress: string | null;
  gasAmountNeeded: BigNumber;
  balanceTooLow: boolean;
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
      depositAmount: new BigNumber(0),
      extendManagementAddress: null,
      gasAmountNeeded: new BigNumber(0),
      balanceTooLow: false
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
    TorqueProvider.Instance.getLoanExtendParams(
      this.props.loanOrderState
    ).then(collateralState => {
      TorqueProvider.Instance.getLoanExtendManagementAddress(
        this.props.loanOrderState
      ).then(extendManagementAddress => {
        this.setState(
          {
            ...this.state,
            minValue: collateralState.minValue,
            maxValue: collateralState.maxValue,
            assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset) || null,
            currentValue: collateralState.currentValue,
            selectedValue: collateralState.currentValue,
            extendManagementAddress: extendManagementAddress
          },
          () => {
            this.selectedValueUpdate.next(this.state.selectedValue);
          }
        );
      });
    });
  }

  public componentDidUpdate(
    prevProps: Readonly<IExtendLoanFormProps>,
    prevState: Readonly<IExtendLoanFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.accountAddress !== this.props.loanOrderState.accountAddress ||
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      TorqueProvider.Instance.getLoanExtendManagementAddress(
        this.props.loanOrderState
      ).then(extendManagementAddress => {
        TorqueProvider.Instance.getLoanExtendGasAmount().then(gasAmountNeeded => {
          this.setState(
            {
              ...this.state,
              extendManagementAddress: extendManagementAddress,
              gasAmountNeeded: gasAmountNeeded
            },
            () => {
              this.selectedValueUpdate.next(this.state.selectedValue);
            }
          );
        });
      });
    }
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    let daysLeft;
    if (this.props.loanOrderState.loanData) {
      daysLeft = this.props.loanOrderState.loanData.loanEndUnixTimestampSec.minus(Date.now() / 1000).dividedBy(86400).toFixed(1);
    }

    return (
      <form className="extend-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content" style={{ marginTop: `-2rem` }}>

          {daysLeft ? (
            <div className="extend-loan-form__info-extended-by-container">
              <div className="extend-loan-form__info-extended-by-msg" style={{ fontSize: `0.9rem`, paddingBottom: `1rem` }}>There are {daysLeft} days until collateral will be partially liquidated to fund interest payments.</div>
            </div>
          ) : ``}

          <hr className="extend-loan-form__delimiter" />

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

          <div className="extend-loan-form__info-extended-by-container">
            <div className="extend-loan-form__info-extended-by-msg">This date will be extended by</div>
            <div className="extend-loan-form__info-extended-by-price">
              {this.state.selectedValue} {this.pluralize("day", "days", this.state.selectedValue)}
            </div>
          </div>
          <OpsEstimatedResult
            assetDetails={this.state.assetDetails}
            actionTitle="You will send"
            amount={this.state.depositAmount}
            precision={6}
          />
          <div className={`extend-loan-form-insufficient-balance ${!this.state.balanceTooLow ? `extend-loan-form-insufficient-balance--hidden` : ``}`}>
            Insufficient {this.state.assetDetails.displayName} balance in your wallet!
              </div>
        </section>
        <section className="dialog-actions">
          <div className="extend-loan-form__actions-container">
            <button type="submit" className={`btn btn-size--small ${this.props.didSubmit ? `btn-disabled` : ``}`}>
              {this.props.didSubmit ? "Submitting..." : "Extend"}
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
        this.props.loanOrderState.interestOwedPerDay,
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

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!this.props.didSubmit && this.state.depositAmount.gt(0)) {
      this.props.toggleDidSubmit(true);

      let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.props.loanOrderState.loanAsset);
      if (this.props.loanOrderState.loanAsset === Asset.ETH) {
        assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
      }
      const precision = AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset)!.decimals || 18;
      const amountInBaseUnits = new BigNumber(this.state.depositAmount.multipliedBy(10 ** precision).toFixed(0, 1));
      if (assetBalance.lt(amountInBaseUnits)) {
        this.props.toggleDidSubmit(false);

        this.setState({
          ...this.state,
          balanceTooLow: true
        });

        return;

      } else {
        this.setState({
          ...this.state,
          balanceTooLow: false
        });
      }

      this.props.onSubmit(
        new ExtendLoanRequest(
          this.props.loanOrderState.loanAsset,
          this.props.loanOrderState.accountAddress,
          this.props.loanOrderState.loanOrderHash,
          this.state.depositAmount
        )
      );
    }
  };
}
