import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import TagManager from "react-gtm-module";
import { Tooltip } from "react-tippy";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import configProviders from "../config/providers.json";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { FulcrumMcdBridgeRequest } from "../domain/FulcrumMcdBridgeRequest";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

TagManager.initialize({
  gtmId: configProviders.Google_TrackingID,
  dataLayer: {
    name: "MCD Bridge form",
    status: "Initialized"
  },
  dataLayerName: 'PageDataLayer'
});

interface IMCDBridgeAmountChangeEvent {
  isMCDBridgeAmountTouched: boolean;
  mcdBridgeAmountText: string;
  mcdBridgeAmount: BigNumber;
  maxMCDBridgeAmount: BigNumber;
  mcdBridgeAmountEstimate: BigNumber;
}

export interface IFulcrumMcdBridgeFormProps {
  asset: Asset;

  onSubmit: (request: FulcrumMcdBridgeRequest) => void;
  onCancel: () => void;
}

interface IFulcrumMcdBridgeFormState {
  assetDetails: AssetDetails | null;

  isMCDBridgeAmountTouched: boolean;
  mcdBridgeAmountText: string;

  mcdBridgeAmount: BigNumber | null;
  maxMCDBridgeAmount: BigNumber | null;
  mcdBridgeAmountEstimate: BigNumber | null;
  ethBalance: BigNumber | null;
  iTokenSrcAddress: string;
  iTokenDestAddress: string;
  maybeNeedsApproval: boolean;
}

export class FulcrumMcdBridgeForm extends Component<IFulcrumMcdBridgeFormProps, IFulcrumMcdBridgeFormState> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputChange: Subject<string>;
  private readonly _inputSetMax: Subject<void>;

  constructor(props: IFulcrumMcdBridgeFormProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.asset);

    this.state = {
      assetDetails: assetDetails || null,
      isMCDBridgeAmountTouched: false,
      mcdBridgeAmountText: "0",
      mcdBridgeAmount: null,
      maxMCDBridgeAmount: null,
      mcdBridgeAmountEstimate: null,
      ethBalance: null,
      iTokenSrcAddress: "",
      iTokenDestAddress: "",
      maybeNeedsApproval: false
    };

    this._inputChange = new Subject();
    this._inputSetMax = new Subject();

    merge(
      this._inputChange.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((value) => this.rxFromCurrentAmount(value))
      ),
      this._inputSetMax.pipe(
        switchMap(() => this.rxFromMaxAmount())
      )
    ).pipe(
      switchMap((value) => new Observable<IMCDBridgeAmountChangeEvent | null>((observer) => observer.next(value)))
    ).subscribe(next => {
      if (next) {
        this.setState({ ...this.state, ...next });
      } else {
        this.setState({
          ...this.state,
          isMCDBridgeAmountTouched: false,
          mcdBridgeAmountText: "",
          mcdBridgeAmount: new BigNumber(0),
          mcdBridgeAmountEstimate: new BigNumber(0)
        })
      }
    });

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private async derivedUpdate() {
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    const maxMCDBridgeAmount = (await FulcrumProvider.Instance.getMaxMCDBridgeValue(
      new FulcrumMcdBridgeRequest(this.props.asset, new BigNumber(0))
    ));
    const fulcrumMcdBridgeRequest = new FulcrumMcdBridgeRequest(this.props.asset, maxMCDBridgeAmount);
    const mcdBridgeAmountEstimate = await FulcrumProvider.Instance.getMCDBridgeAmountEstimate(fulcrumMcdBridgeRequest);
    const ethBalance = await FulcrumProvider.Instance.getEthBalance();
    const srcAddress = FulcrumProvider.Instance.contractsSource ?
      await FulcrumProvider.Instance.contractsSource.getITokenErc20Address(this.props.asset) || "" :
      "";
    const destAddress = FulcrumProvider.Instance.contractsSource ?
      await FulcrumProvider.Instance.contractsSource.getITokenErc20Address(this.props.asset === Asset.SAI ?
        Asset.DAI :
        Asset.SAI) || "" :
      "";


    const maybeNeedsApproval = await FulcrumProvider.Instance.checkCollateralApprovalForLend(this.props.asset);

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      mcdBridgeAmountText: maxMCDBridgeAmount.decimalPlaces(this._inputPrecision).toFixed(),
      mcdBridgeAmount: maxMCDBridgeAmount,
      maxMCDBridgeAmount: maxMCDBridgeAmount,
      mcdBridgeAmountEstimate: mcdBridgeAmountEstimate,
      ethBalance: ethBalance,
      iTokenSrcAddress: srcAddress,
      iTokenDestAddress: destAddress,
      maybeNeedsApproval: maybeNeedsApproval
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

  public componentDidUpdate(prevProps: Readonly<IFulcrumMcdBridgeFormProps>, prevState: Readonly<IFulcrumMcdBridgeFormState>, snapshot?: any): void {
    if (
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

    if (this.props.asset === Asset.SUSD) {
      // @ts-ignore
      divStyle.backgroundSize = `unset`;
    }

    const submitClassName = "lend-form__submit-button--lend";

    const tokenNameSource = `i${this.props.asset}`;
    const tokenNameDestination = this.props.asset === Asset.SAI ?
      `i${Asset.DAI}`:
      `i${Asset.SAI}`;

    const isAmountMaxed = this.state.mcdBridgeAmount ? this.state.mcdBridgeAmount.eq(this.state.maxMCDBridgeAmount!) : false;

    const amountMsg =
      this.state.ethBalance && this.state.ethBalance.lte(FulcrumProvider.Instance.gasBufferForLend)
        ? "Insufficient funds for gas \u2639"
        : this.state.maxMCDBridgeAmount && this.state.maxMCDBridgeAmount.eq(0)
          ? "Your wallet is empty \u2639"
          : "";

    const mcdBridgeAmountEstimateText =
      !this.state.mcdBridgeAmountEstimate || this.state.mcdBridgeAmountEstimate.eq(0)
        ? "0"
        : this.state.mcdBridgeAmountEstimate.gte(new BigNumber("0.000001"))
          ? this.state.mcdBridgeAmountEstimate.toFixed(6)
          : this.state.mcdBridgeAmountEstimate.toExponential(3);

    return (
      <form className="lend-form" onSubmit={this.onSubmitClick}>
        <div className="lend-form__image" style={divStyle}>
          <img src={this.state.assetDetails.logoSvg} alt={tokenNameSource} />
        </div>
        <div className="lend-form__form-container">
          <div className="lend-form__form-values-container">
            <div className="lend-form__kv-container lend-form__kv-container--w_dots">
              <div className="lend-form__label">Source Asset</div>
              <div className="lend-form__value">{tokenNameSource}</div>
            </div>
            <div className="lend-form__kv-container lend-form__kv-container--w_dots">
              <div className="lend-form__label">Destination Asset</div>
              <div className="lend-form__value">{tokenNameDestination}</div>
            </div>
            <div className="lend-form__kv-container">
              <div className="lend-form__label">Migrate Amount</div>
              {this.state.iTokenSrcAddress &&
                FulcrumProvider.Instance.web3ProviderSettings &&
                FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                <div className="lend-form__value">
                  <a
                    className="lend-form__value"
                    style={{cursor: `pointer`, textDecoration: `none`}}
                    title={this.state.iTokenSrcAddress}
                    href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.iTokenSrcAddress}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tokenNameSource}
                  </a>
                </div>
              ) :
                <div className="lend-form__value">{tokenNameSource}</div>
              }
            </div>
            <div className="lend-form__amount-container">
              <input
                type="text"
                ref={this._setInputRef}
                className="lend-form__amount-input"
                value={this.state.mcdBridgeAmountText}
                onChange={this.onMCDBridgeAmountChange}
              />
              {isAmountMaxed ? (
                <div className="lend-form__amount-maxed">MAX</div>
              ) : (
                <div className="lend-form__amount-max" onClick={this.onInsertMaxValue}>&#65087;<br/>MAX</div>
              )}
            </div>
            <div className="lend-form__kv-container">
              <div className="trade-form__label">{amountMsg}</div>
              <div title={this.state.mcdBridgeAmountEstimate ? `$${this.state.mcdBridgeAmountEstimate.toFixed(18)}` : ``} className="lend-form__value lend-form__value--no-color">
                <Tooltip
                  html={
                    <div style={{ /*maxWidth: `300px`*/ }}>
                      {/*... Info ...*/}
                    </div>
                  }
                >
                  {/*<span className="rounded-mark">?</span>*/}
                </Tooltip>
                {this.state.iTokenDestAddress &&
                  FulcrumProvider.Instance.web3ProviderSettings &&
                  FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                  <a
                    className="lend-form__value--no-color"
                    style={{cursor: `pointer`, textDecoration: `none`}}
                    title={this.state.iTokenDestAddress}
                    href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.iTokenDestAddress}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    &nbsp; {mcdBridgeAmountEstimateText} {tokenNameDestination}
                  </a>
                ) : (
                  <React.Fragment>&nbsp; {mcdBridgeAmountEstimateText} {tokenNameDestination}</React.Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="lend-form__actions-container">
            <button className="lend-form__cancel-button" onClick={this.onCancelClick}>
              <span className="lend-form__label--action">Cancel</span>
            </button>
            <button type="submit" className={`lend-form__submit-button ${submitClassName}`} style={{ width: `7rem` }}>
              {this.props.asset === Asset.SAI ? `Convert SAI` : `Convert DAI`}
            </button>
            <div className="lend-form__poweredBy">
              Powered By&nbsp;
              <a
                className="lend-form__poweredBy--link"
                title={`Dexwallet Recipes`}
                href={`https://recipes.dexwallet.io/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Dexwallet Recipes
              </a>
            </div>
          </div>
        </div>
      </form>
    );
  }

  public onMCDBridgeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "";

    // setting tradeAmountText to update display at the same time
    this.setState({...this.state, mcdBridgeAmountText: amountText}, () => {
      // emitting next event for processing with rx.js
      this._inputChange.next(this.state.mcdBridgeAmountText);
    });
  };

  public onInsertMaxValue = async () => {
    if (!this.state.assetDetails) {
      return null;
    }

    // emitting next event for processing with rx.js
    this._inputSetMax.next();
  };

  public onCancelClick = () => {
    const tagManagerArgs = {
                            dataLayer: {
                                name: this.props.asset === Asset.SAI ? "Upgrade SAI" : "Downgrade DAI",
                                sku: this.props.asset,
                                category: "MCDMigration",
                                price: this.state.mcdBridgeAmount,
                                status: "Canceled"
                            },
                            dataLayerName: 'PageDataLayer'
                        }
    TagManager.dataLayer(tagManagerArgs)
    this.props.onCancel();
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!this.state.mcdBridgeAmount || this.state.mcdBridgeAmount.isZero()) {
      if (this._input) {
        this._input.focus();
      }
      return;
    }

    if (!this.state.assetDetails) {
      this.props.onCancel();
      return;
    }

    if (!this.state.mcdBridgeAmount.isPositive()) {
      this.props.onCancel();
      return;
    }

    const tagManagerArgs = {
                            dataLayer: {
                                name: this.props.asset === Asset.SAI ? "Upgrade SAI" : "Downgrade DAI",
                                sku: this.props.asset,
                                category: "MCDMigration",
                                price: this.state.mcdBridgeAmount,
                                status: "Completed"
                            },
                            dataLayerName: 'PageDataLayer'
                        }
    // console.log("tagManagerArgs  = ",tagManagerArgs)
    TagManager.dataLayer(tagManagerArgs)
    this.props.onSubmit(

      new FulcrumMcdBridgeRequest(
        this.props.asset,
        this.state.mcdBridgeAmount
      )
    );
  };

  private rxFromMaxAmount = (): Observable<IMCDBridgeAmountChangeEvent | null> => {
    return new Observable<IMCDBridgeAmountChangeEvent | null>(observer => {
      const fulcrumMcdBridgeRequest = new FulcrumMcdBridgeRequest(
        this.props.asset,
        this.state.maxMCDBridgeAmount || new BigNumber(0)
      );

      FulcrumProvider.Instance.getMCDBridgeAmountEstimate(fulcrumMcdBridgeRequest).then(mcdBridgeAmountEstimate => {
        observer.next({
          isMCDBridgeAmountTouched: this.state.isMCDBridgeAmountTouched || false,
          mcdBridgeAmountText: this.state.maxMCDBridgeAmount ? this.state.maxMCDBridgeAmount.decimalPlaces(this._inputPrecision).toFixed() : "0",
          mcdBridgeAmount: this.state.maxMCDBridgeAmount || new BigNumber(0),
          maxMCDBridgeAmount: this.state.maxMCDBridgeAmount || new BigNumber(0),
          mcdBridgeAmountEstimate: mcdBridgeAmountEstimate || new BigNumber(0)
        });
      });
    });
  };

  private rxFromCurrentAmount = (value: string): Observable<IMCDBridgeAmountChangeEvent | null> => {
    return new Observable<IMCDBridgeAmountChangeEvent | null>(observer => {
      let amountText = value;
      const amountTextForConversion = amountText === "" ? "0" : amountText[0] === "." ? `0${amountText}` : amountText;
      const maxAmount = this.state.maxMCDBridgeAmount || new BigNumber(0);

      let amount = new BigNumber(amountTextForConversion);
      // handling negative values (incl. Ctrl+C)
      if (amount.isNegative()) {
        amount = amount.absoluteValue();
        amountText = amount.decimalPlaces(this._inputPrecision).toFixed();
      }
      if (amount.gt(maxAmount)) {
        amount = maxAmount;
        amountText = maxAmount.decimalPlaces(this._inputPrecision).toFixed();
      }

      if (!amount.isNaN()) {
        const fulcrumMcdBridgeRequest = new FulcrumMcdBridgeRequest(
          this.props.asset,
          amount
        );

        // updating stored value only if the new input value is a valid number
        FulcrumProvider.Instance.getMCDBridgeAmountEstimate(fulcrumMcdBridgeRequest).then(mcdBridgeAmountEstimate => {
          observer.next({
            isMCDBridgeAmountTouched: true,
            mcdBridgeAmountText: amountText,
            mcdBridgeAmount: amount,
            maxMCDBridgeAmount: this.state.maxMCDBridgeAmount || new BigNumber(0),
            mcdBridgeAmountEstimate: mcdBridgeAmountEstimate,
          });
        });
      } else {
        observer.next(null);
      }
    });
  };
}
