import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Tooltip } from "react-tippy";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface ILendFormProps {
  lendType: LendType;
  asset: Asset;

  onSubmit: (request: LendRequest) => void;
  onCancel: () => void;
}

interface ILendFormState {
  assetDetails: AssetDetails | null;
  interestRate: BigNumber;

  isLendAmountTouched: boolean;
  lendAmountText: string;
  lendAmount: BigNumber;
  balance: BigNumber;
  maxLendAmount: BigNumber;

  lendedAmountEstimate: BigNumber;
}

export class LendForm extends Component<ILendFormProps, ILendFormState> {
  private _input: HTMLInputElement | null = null;

  constructor(props: ILendFormProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    const interestRate = new BigNumber(0);
    const balance = new BigNumber(0);
    const maxLendValue = new BigNumber(0);
    const lendedAmountEstimate = new BigNumber(0);

    this.state = {
      assetDetails: assetDetails || null,
      isLendAmountTouched: false,
      lendAmountText: maxLendValue.toFixed(),
      lendAmount: maxLendValue,
      balance: balance,
      maxLendAmount: maxLendValue,
      lendedAmountEstimate: lendedAmountEstimate,
      interestRate: interestRate
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private async derivedUpdate() {
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    const interestRate = await FulcrumProvider.Instance.getLendTokenInterestRate(this.props.asset);
    const balance =
      this.props.lendType === LendType.LEND
        ? await FulcrumProvider.Instance.getBaseTokenBalance(this.props.asset)
        : await FulcrumProvider.Instance.getLoanTokenBalance(this.props.asset);
    const maxLendValue = (await FulcrumProvider.Instance.getMaxLendValue(
      new LendRequest(this.props.lendType, this.props.asset, new BigNumber(0))
    )).decimalPlaces(6);
    const lendedAmountEstimate = await FulcrumProvider.Instance.getLendedAmountEstimate(
      new LendRequest(this.props.lendType, this.props.asset, maxLendValue)
    );

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      lendAmountText: maxLendValue.toFixed(),
      lendAmount: maxLendValue,
      balance: balance,
      maxLendAmount: maxLendValue,
      lendedAmountEstimate: lendedAmountEstimate,
      interestRate: interestRate
    });
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this.derivedUpdate();

    if (this._input) {
      this._input.select();
      this._input.focus();
    }
  }

  public componentDidUpdate(prevProps: Readonly<ILendFormProps>, prevState: Readonly<ILendFormState>, snapshot?: any): void {
    if (
      this.props.lendType !== prevProps.lendType ||
      this.props.asset !== prevProps.asset
    ) {
      this.derivedUpdate();
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const divStyle = {
      backgroundImage: `url(${this.state.assetDetails.bgSvg})`
    };

    const submitClassName =
      this.props.lendType === LendType.LEND ? "lend-form__submit-button--lend" : "lend-form__submit-button--un-lend";
    const tokenNameBase = this.state.assetDetails.displayName;
    const tokenNamePosition = `i${this.state.assetDetails.displayName}`;

    const tokenNameSource = this.props.lendType === LendType.LEND ? tokenNameBase : tokenNamePosition;
    const tokenNameDestination = this.props.lendType === LendType.LEND ? tokenNamePosition : tokenNameBase;

    const isAmountMaxed = this.state.lendAmount.eq(this.state.maxLendAmount);
    const amountMaxedMsg =
      isAmountMaxed
        ? this.state.balance.eq(0)
          ? "Your wallet is empty \u2639"
          : this.state.isLendAmountTouched
            ? "Max amount entered."
            : ""
        : "";

    const lendedAmountEstimateText =
      this.state.lendedAmountEstimate.eq(0)
        ? "0"
        : this.state.lendedAmountEstimate.gte(new BigNumber("0.000001"))
          ? this.state.lendedAmountEstimate.toFixed(6)
          : this.state.lendedAmountEstimate.toExponential(3);

    return (
      <form className="lend-form" onSubmit={this.onSubmitClick}>
        <div className="lend-form__image" style={divStyle}>
          <img src={this.state.assetDetails.logoSvg} alt={tokenNameSource} />
        </div>
        <div className="lend-form__form-container">
          <div className="lend-form__form-values-container">
            <div className="lend-form__kv-container lend-form__kv-container--w_dots">
              <div className="lend-form__label">Token</div>
              <div className="lend-form__value">{tokenNameSource}</div>
            </div>
            <div className="lend-form__kv-container lend-form__kv-container--w_dots">
              <div className="lend-form__label">Interest rate</div>
              <div className="lend-form__value">{`${this.state.interestRate.toFixed(2)}%`}</div>
            </div>
            <div className="lend-form__kv-container">
              <div className="lend-form__label">{this.props.lendType === LendType.LEND ? `Lend Amount` : `UnLend Amount`}</div>
              <div className="lend-form__value">{tokenNameSource}</div>
            </div>
            <input
              type="text"
              ref={this._setInputRef}
              className="lend-form__amount"
              value={this.state.lendAmountText}
              onChange={this.onLendAmountChange}
            />
            <div className="lend-form__kv-container">
              {isAmountMaxed ? (
                <div className="trade-form__label">{amountMaxedMsg}</div>
              ) : (
                <div className="trade-form__label trade-form__label--action" onClick={this.onInsertMaxValue}>
                  Insert max value
                </div>
              )}
              <div className="lend-form__value lend-form__value--no-color">
                <Tooltip
                  html={
                    <div style={{ /*maxWidth: `300px`*/ }}>
                      ... Info ...
                    </div>
                  }
                >
                  <span className="rounded-mark">?</span>
                </Tooltip>
                &nbsp; {lendedAmountEstimateText} {tokenNameDestination}
              </div>
            </div>
          </div>

          <div className="lend-form__actions-container">
            <button className="lend-form__cancel-button" onClick={this.onCancelClick}>
              <span className="lend-form__label--action">Cancel</span>
            </button>
            <button type="submit" className={`lend-form__submit-button ${submitClassName}`}>
              {this.props.lendType}
            </button>
          </div>
        </div>
      </form>
    );
  }

  public onLendAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    let amountText = event.target.value ? event.target.value : "";
    const amountTextForConversion = amountText === "" ? "0" : amountText[0] === "." ? `0${amountText}` : amountText;

    let amount = new BigNumber(amountTextForConversion);
    // handling negative values (incl. Ctrl+C)
    if (amount.isNegative()) {
      amountText = amount.absoluteValue().toFixed();
      amount = amount.absoluteValue();
    }
    if (amount.gt(this.state.maxLendAmount)) {
      amount = this.state.maxLendAmount;
      amountText = this.state.maxLendAmount.toFixed();
    }

    // updating stored value only if the new input value is a valid number
    const lendedAmountEstimate = await FulcrumProvider.Instance.getLendedAmountEstimate(
      new LendRequest(this.props.lendType, this.props.asset, amount)
    );
    if (!amount.isNaN()) {
      this.setState({
        ...this.state,
        isLendAmountTouched: true,
        lendAmountText: amountText,
        lendAmount: amount,
        lendedAmountEstimate: lendedAmountEstimate
      });
    }
  };

  public onInsertMaxValue = async () => {
    if (!this.state.assetDetails) {
      return null;
    }

    const maxLendValue = await FulcrumProvider.Instance.getMaxLendValue(
      new LendRequest(this.props.lendType, this.props.asset, new BigNumber(0))
    );
    const lendedAmountEstimate = await FulcrumProvider.Instance.getLendedAmountEstimate(
      new LendRequest(this.props.lendType, this.props.asset, maxLendValue)
    );
    this.setState({
      ...this.state,
      lendAmountText: maxLendValue.toFixed(),
      lendAmount: maxLendValue,
      maxLendAmount: maxLendValue,
      lendedAmountEstimate: lendedAmountEstimate
    });
  };

  public onCancelClick = () => {
    this.props.onCancel();
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.state.lendAmount.isZero()) {
      if (this._input) {
        this._input.focus();
      }
      return;
    }

    if (!this.state.assetDetails) {
      this.props.onCancel();
      return;
    }

    if (!this.state.lendAmount.isPositive()) {
      this.props.onCancel();
      return;
    }

    this.props.onSubmit(
      new LendRequest(
        this.props.lendType,
        this.props.asset,
        this.state.lendAmount
      )
    );
  };
}
