import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { CollateralSlider } from "./CollateralSlider";

export interface IManageCollateralFormProps {
  asset: Asset;

  onSubmit: (request: ManageCollateralRequest) => void;
  onCancel: () => void;
}

interface IManageCollateralFormState {
  assetDetails: AssetDetails | null;
  positionValue: number;
  currentValue: number;
  selectedValue: number;
  diffAmount: BigNumber;
  liquidationPrice: BigNumber;
}

export class ManageCollateralForm extends Component<IManageCollateralFormProps, IManageCollateralFormState> {
  private minValue: number = 0;
  private maxValue: number = 100;

  constructor(props: IManageCollateralFormProps, context?: any) {
    super(props, context);

    this.state = {
      assetDetails: AssetsDictionary.assets.get(this.props.asset) || null,
      positionValue: 66,
      currentValue: 66,
      selectedValue: 66,
      diffAmount: new BigNumber(0),
      liquidationPrice: new BigNumber(700)
    };
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IManageCollateralFormProps>,
    prevState: Readonly<IManageCollateralFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.asset !== this.props.asset ||
      prevState.positionValue !== this.state.positionValue ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    // TODO: calculate and update this.state.diffAmount and this.state.liquidationPrice
    this.setState({
      ...this.state,
      diffAmount: new BigNumber(this.state.selectedValue * 3),
      liquidationPrice: new BigNumber(700 - this.state.selectedValue)
    });
  };

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    return (
      <form className="manage-collateral-form" onSubmit={this.onSubmitClick}>
        <div className="manage-collateral-form__title">Manage your collateral</div>

        <CollateralSlider
          minValue={this.minValue}
          maxValue={this.maxValue}
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

        {this.state.positionValue !== this.state.selectedValue ? (
          <div className="manage-collateral-form__operation-result-container">
            <img className="manage-collateral-form__operation-result-img" src={this.state.assetDetails.logoSvg} />
            <div className="manage-collateral-form__operation-result-msg">
              You will {this.state.positionValue > this.state.selectedValue ? "withdraw" : "top up"}
            </div>
            <div className="manage-collateral-form__operation-result-amount">
              {this.state.diffAmount.toFixed(6)} {this.state.assetDetails.displayName}
            </div>
          </div>
        ) : null}

        {this.state.positionValue !== this.state.selectedValue ? (
          <div className="manage-collateral-form__actions-container">
            <button className="manage-collateral-form__action-cancel" onClick={this.props.onCancel}>
              Cancel
            </button>
            {this.state.positionValue > this.state.selectedValue ? (
              <button type="submit" className="manage-collateral-form__action-withdraw">
                Withdraw
              </button>
            ) : (
              <button type="submit" className="manage-collateral-form__action-top-up">
                Top Up
              </button>
            )}
          </div>
        ) : (
          <div className="manage-collateral-form__actions-container">
            <button className="manage-collateral-form__action-close" onClick={this.props.onCancel}>
              Close
            </button>
          </div>
        )}
      </form>
    );
  }

  private onChange = (value: number) => {
    this.setState({ ...this.state, currentValue: value });
  };

  private onUpdate = (value: number) => {
    this.setState({ ...this.state, selectedValue: value });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    this.props.onSubmit(new ManageCollateralRequest(new BigNumber(this.state.currentValue)));
  };
}
