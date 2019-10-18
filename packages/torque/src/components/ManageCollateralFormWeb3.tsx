import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { ActionType } from "../domain/ActionType";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { IWalletDetails } from "../domain/IWalletDetails";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { WalletType } from "../domain/WalletType";
import { Asset } from "../domain/Asset";
import { TorqueProvider } from "../services/TorqueProvider";
import { CollateralSlider } from "./CollateralSlider";
import { OpsEstimatedResult } from "./OpsEstimatedResult";

export interface IManageCollateralFormWeb3Props {
  walletDetails: IWalletDetails;
  loanOrderState: IBorrowedFundsState;

  didSubmit: boolean;
  toggleDidSubmit: (submit: boolean) => void;
  onSubmit: (request: ManageCollateralRequest) => void;
  onClose: () => void;
}

interface IManageCollateralFormWeb3State {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;
  loanValue: number;
  selectedValue: number;

  collateralAmount: BigNumber;
  liquidationPrice: BigNumber;
  gasAmountNeeded: BigNumber;
  collateralizedPercent: BigNumber;
  balanceTooLow: boolean;
}

export class ManageCollateralFormWeb3 extends Component<IManageCollateralFormWeb3Props, IManageCollateralFormWeb3State> {
  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IManageCollateralFormWeb3Props, context?: any) {
    super(props, context);
    
    //console.log(props.loanOrderState);

    this.state = {
      minValue: 0, // <-- look at portal to see minimum collateral
      maxValue: 300, // <-- should be 300% collateralatizd max
      assetDetails: null,
      selectedValue: props.loanOrderState.collateralizedPercent.multipliedBy(100).toNumber(),
      loanValue: props.loanOrderState.collateralizedPercent.multipliedBy(100).toNumber(),
      liquidationPrice: new BigNumber(0),
      gasAmountNeeded: new BigNumber(0),
      collateralAmount: new BigNumber(0),
      collateralizedPercent: props.loanOrderState.collateralizedPercent.multipliedBy(100),
      balanceTooLow: false
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
          liquidationPrice: value.liquidationPrice,
          collateralAmount: value.collateralAmount,
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanCollateralManagementParams(
      this.props.walletDetails,
      this.props.loanOrderState
    ).then(collateralState => {
      TorqueProvider.Instance.getLoanCollateralManagementGasAmount().then(gasAmountNeeded => {
        this.setState(
          {
            ...this.state,
            minValue: collateralState.minValue,
            maxValue: collateralState.maxValue,
            assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset) || null,
            loanValue: collateralState.currentValue,
            selectedValue: collateralState.currentValue,
            gasAmountNeeded: gasAmountNeeded
          },
          () => {
            this.selectedValueUpdate.next(this.state.selectedValue);
          }
        );
      });
    });
  }

  public componentDidUpdate(
    prevProps: Readonly<IManageCollateralFormWeb3Props>,
    prevState: Readonly<IManageCollateralFormWeb3State>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.loanValue !== this.state.loanValue ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      TorqueProvider.Instance.getLoanCollateralManagementGasAmount().then(gasAmountNeeded => {
        this.setState(
          {
            ...this.state,
            gasAmountNeeded: gasAmountNeeded
          },
          () => {
            this.selectedValueUpdate.next(this.state.selectedValue);
          }
        );
      });
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
            value={this.state.selectedValue}
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
              This will make your loan
            </div>
            <div className="manage-collateral-form__info-liquidated-at-price">
              {this.state.collateralizedPercent.toFixed(2)}% collateralized
            </div>
          </div>

          {this.state.loanValue !== this.state.selectedValue ? (
            <React.Fragment>
              <OpsEstimatedResult
                assetDetails={this.state.assetDetails}
                actionTitle={`You will ${this.state.loanValue > this.state.selectedValue ? "withdraw" : "top up"}`}
                amount={this.state.collateralAmount.dividedBy(10**18)}
                precision={6}
              />
              <div className={`manage-collateral-form-insufficient-balance ${!this.state.balanceTooLow ? `manage-collateral-form-insufficient-balance--hidden` : ``}`}>
                Insufficient {this.state.assetDetails.displayName} balance!
              </div>
            </React.Fragment>
          ) : null}
        </section>
        <section className="dialog-actions">
          <div className="manage-collateral-form__actions-container">
            {this.props.walletDetails.walletType === WalletType.NonWeb3 ? (
              <button type="button" className="btn btn-size--small" onClick={this.props.onClose}>
                Close
              </button>
            ) : (
              <button type="submit" className={`btn btn-size--small ${this.props.didSubmit ? `btn-disabled` : ``}`}>
                {this.props.didSubmit ? "Submitting..." : this.state.loanValue > this.state.selectedValue ?
                  "Withdraw" :
                  "Top Up"}
              }
              </button>
            )}
          </div>
        </section>
      </form>
    );
  }

  private rxGetEstimate = (selectedValue: number): Observable<ICollateralChangeEstimate> => {
console.log(this.state.loanValue, selectedValue);
    let collateralAmount = new BigNumber(0);
    if (this.state.loanValue !== selectedValue && this.props.loanOrderState.loanData) {
      collateralAmount = this.props.loanOrderState.loanData.collateralTokenAmountFilled
        .multipliedBy(selectedValue).dividedBy(this.state.loanValue);
        
      if (this.state.loanValue > selectedValue) {
        collateralAmount = this.props.loanOrderState.loanData.collateralTokenAmountFilled.minus(collateralAmount);
      } else {
        collateralAmount = this.props.loanOrderState.loanData.collateralTokenAmountFilled.plus(collateralAmount);
      }
        console.log(collateralAmount.toString());
    }

    return new Observable<ICollateralChangeEstimate>(observer => {
      TorqueProvider.Instance.getLoanCollateralChangeEstimate(
        this.props.walletDetails,
        this.props.loanOrderState,
        collateralAmount,
        this.state.loanValue > selectedValue
      ).then(value => {
        observer.next(value);
      });
    });
  };

  private onChange = (value: number) => {
    this.setState({ ...this.state, selectedValue: value });
  };

  private onUpdate = (value: number) => {
    this.setState({ ...this.state, selectedValue: value });
  };

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!this.props.didSubmit) {
      this.props.toggleDidSubmit(true);

      if (this.state.loanValue < this.state.selectedValue) {
        let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.props.loanOrderState.collateralAsset);
        if (this.props.loanOrderState.collateralAsset === Asset.ETH) {
          assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
        }
        const precision = AssetsDictionary.assets.get(this.props.loanOrderState.collateralAsset)!.decimals || 18;
        const amountInBaseUnits = new BigNumber(this.state.collateralAmount.multipliedBy(10**precision).toFixed(0, 1));
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
      } else {
        this.setState({
          ...this.state,
          balanceTooLow: false
        });
      }

      this.props.onSubmit(
        new ManageCollateralRequest(
          this.props.walletDetails,
          this.props.loanOrderState,
          new BigNumber(this.state.collateralAmount),
          this.state.loanValue > this.state.selectedValue
        )
      );
    }
  };
}
