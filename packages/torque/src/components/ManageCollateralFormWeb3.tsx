import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { ActionType } from "../domain/ActionType";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { IWalletDetails } from "../domain/IWalletDetails";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { WalletType } from "../domain/WalletType";
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
  assetBalanceValue: number;

  collateralAmount: BigNumber;
  collateralExcess: BigNumber;
  liquidationPrice: BigNumber;
  gasAmountNeeded: BigNumber;
  collateralizedPercent: BigNumber;
  balanceTooLow: boolean;
}

export class ManageCollateralFormWeb3 extends Component<IManageCollateralFormWeb3Props, IManageCollateralFormWeb3State> {
  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IManageCollateralFormWeb3Props, context?: any) {
    super(props, context);
    
    // console.log(props.loanOrderState);

    this.state = {
      minValue: 0,
      maxValue: 0,
      assetDetails: null,
      selectedValue: 0,
      loanValue: 0,
      assetBalanceValue: 0,
      liquidationPrice: new BigNumber(0),
      gasAmountNeeded: new BigNumber(0),
      collateralAmount: new BigNumber(0),
      collateralExcess: new BigNumber(0),
      collateralizedPercent: new BigNumber(0),
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
          collateralizedPercent: value.collateralizedPercent
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.isLoading = true;
    
    TorqueProvider.Instance.getLoanCollateralManagementParams(
      this.props.walletDetails,
      this.props.loanOrderState
    ).then(collateralState => {
      TorqueProvider.Instance.getLoanCollateralManagementGasAmount().then(gasAmountNeeded => {
        TorqueProvider.Instance.getCollateralExcessAmount(this.props.loanOrderState).then(collateralExcess => {
          TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.props.loanOrderState.collateralAsset).then(assetBalance => {

            const collateralizedPercent = this.props.loanOrderState.collateralizedPercent
              .multipliedBy(100)
              .plus(100);

            // const marginPremium = TorqueProvider.Instance.getMarginPremiumAmount(this.props.loanOrderState.collateralAsset);

            /*const expectedMinCollateral = this.props.loanOrderState.collateralAmount
              //.multipliedBy(150 + marginPremium)
              .multipliedBy(150)
              .dividedBy(collateralizedPercent);*/

            let minCollateral;
            let maxCollateral;
            
            minCollateral = this.props.loanOrderState.collateralAmount
              .minus(collateralExcess);

            /*if (minCollateral.lt(expectedMinCollateral)) {
              collateralExcess = this.props.loanOrderState.collateralAmount > expectedMinCollateral ?
                this.props.loanOrderState.collateralAmount
                  .minus(expectedMinCollateral) :
                  new BigNumber(0);
              minCollateral = expectedMinCollateral;
            }*/

            minCollateral = minCollateral
              .times(10**18);
            
            maxCollateral = minCollateral
              .times(collateralState.maxValue - collateralState.minValue)
              .dividedBy(10**20);

            const currentCollateral = this.props.loanOrderState.collateralAmount
              .times(10**18);
            
            if (maxCollateral.lt(currentCollateral)) {
              maxCollateral = currentCollateral;
            }

            // new_v = (new_max - new_min) / (old_max - old_min) * (v - old_min) + new_min
            let currentCollateralNormalizedBN = new BigNumber(collateralState.maxValue - collateralState.minValue)
              .dividedBy(maxCollateral.minus(minCollateral))
              .times(currentCollateral.minus(minCollateral))
              .plus(collateralState.minValue);

            if (currentCollateralNormalizedBN.dividedBy(collateralState.maxValue - collateralState.minValue).lte(0.01)) {
              currentCollateralNormalizedBN = new BigNumber(collateralState.minValue);
            }

            // console.log(currentCollateralNormalizedBN.toString());

            // check balance
            if (this.props.loanOrderState.collateralAsset === Asset.ETH) {
              assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
            }
            let assetBalanceNormalizedBN = new BigNumber(collateralState.maxValue - collateralState.minValue)
              .dividedBy(maxCollateral.minus(minCollateral))
              .times(assetBalance.minus(minCollateral))
              .plus(collateralState.minValue);

            if (assetBalanceNormalizedBN.dividedBy(collateralState.maxValue - collateralState.minValue).lte(0.01)) {
              assetBalanceNormalizedBN = new BigNumber(collateralState.minValue);
            }

            this.setState(
              {
                ...this.state,
                minValue: collateralState.minValue,
                maxValue: collateralState.maxValue,
                assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.collateralAsset) || null,
                loanValue: currentCollateralNormalizedBN.toNumber(),
                selectedValue: currentCollateralNormalizedBN.toNumber(),
                gasAmountNeeded: gasAmountNeeded,
                collateralizedPercent: collateralizedPercent,
                collateralExcess: collateralExcess,
                assetBalanceValue: assetBalanceNormalizedBN.toNumber()
              },
              () => {
                this.selectedValueUpdate.next(this.state.selectedValue);

                TorqueProvider.Instance.isLoading = false;
              }
            );
          });
        });
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
        {TorqueProvider.Instance.isLoading ? (
        <div className="manage-collatera-loading">
          Loading...
        </div>
        ) : (
          <React.Fragment>
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

            {this.state.loanValue !== this.state.selectedValue ? (
              <React.Fragment>
                <div className="manage-collateral-form__info-liquidated-at-container">
                  <div className="manage-collateral-form__info-liquidated-at-msg">
                    This will make your loan
                  </div>
                  <div className="manage-collateral-form__info-liquidated-at-price">
                    {this.state.collateralizedPercent.toFixed(2)}% collateralized
                  </div>
                </div>
                <OpsEstimatedResult
                  assetDetails={this.state.assetDetails}
                  actionTitle={`You will ${this.state.loanValue > this.state.selectedValue ? "withdraw" : "top up"}`}
                  amount={this.state.collateralAmount}
                  precision={6}
                />
                <div className={`manage-collateral-form-insufficient-balance ${!this.state.balanceTooLow ? `manage-collateral-form-insufficient-balance--hidden` : ``}`}>
                  Insufficient {this.state.assetDetails.displayName} balance in your wallet!
                </div>
              </React.Fragment>
            ) : (
              <div className="manage-collateral-form__info-liquidated-at-container">
                <div className="manage-collateral-form__info-liquidated-at-msg">
                  Your loan is
                </div>
                <div className="manage-collateral-form__info-liquidated-at-price">
                  {this.state.collateralizedPercent.toFixed(2)}% collateralized
                </div>
              </div>
              )}
            </section>
            <section className="dialog-actions">
              <div className="manage-collateral-form__actions-container">
                {this.props.walletDetails.walletType === WalletType.NonWeb3 || this.state.loanValue === this.state.selectedValue ? (
                  <button type="button" className="btn btn-size--small" onClick={this.props.onClose}>
                    Close
                  </button>
                ) : (
                  <button type="submit" className={`btn btn-size--small ${this.props.didSubmit ? `btn-disabled` : ``}`}>
                    {this.props.didSubmit ? "Submitting..." : this.state.loanValue > this.state.selectedValue ?
                      "Withdraw" :
                      "Top Up"
                    }
                  </button>
                )}
              </div>
            </section>
          </React.Fragment>
        )}
      </form>
    );
  }

  private rxGetEstimate = (selectedValue: number): Observable<ICollateralChangeEstimate> => {

    // console.log(this.state.loanValue, selectedValue);

    let collateralAmount = new BigNumber(0);
    if (this.state.loanValue !== selectedValue && this.props.loanOrderState.loanData) {
      if (selectedValue < this.state.loanValue) {
        collateralAmount = new BigNumber(this.state.loanValue)
          .minus(selectedValue)
          .dividedBy(this.state.loanValue)
          .multipliedBy(this.state.collateralExcess);
      } else {
        collateralAmount = new BigNumber(selectedValue)
          .minus(this.state.loanValue)
          .dividedBy(this.state.maxValue - this.state.loanValue)
          .multipliedBy(this.props.loanOrderState.collateralAmount);
          // .multipliedBy(this.state.maxValue)
          // .dividedBy(this.state.maxValue - this.state.loanValue);
      }
      // console.log(collateralAmount.toString(), this.state.maxValue, this.props.loanOrderState.collateralAmount.toString());
    }

    return new Observable<ICollateralChangeEstimate>(observer => {
      TorqueProvider.Instance.getLoanCollateralChangeEstimate(
        this.props.walletDetails,
        this.props.loanOrderState,
        collateralAmount,
        selectedValue < this.state.loanValue
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

    // console.log(this.state.collateralAmount.toString(), new BigNumber(this.state.loanValue).dividedBy(10**18).toString(), new BigNumber(this.state.selectedValue).dividedBy(10**18).toString());
    if (!this.props.didSubmit && this.state.collateralAmount.gt(0)) {
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
