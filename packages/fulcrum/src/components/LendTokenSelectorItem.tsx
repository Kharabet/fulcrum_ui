import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import TagManager from "react-gtm-module";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { DAIConvertRequest } from "../domain/DAIConvertRequest";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { LendTransactionMinedEvent } from "../services/events/LendTransactionMinedEvent";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { ProfitTicker } from "./ProfitTicker";


export interface ILendTokenSelectorItemProps {
  asset: Asset;
  onLend: (request: LendRequest) => void;
  onDAIConvert: (request: DAIConvertRequest) => void;
}


interface ILendTokenSelectorItemState {
  assetDetails: AssetDetails | null;
  interestRate: BigNumber;
  profit: BigNumber | null;
  balanceOfUser: BigNumber;
  iTokenAddress: string,
  tickerSecondDiff: number;
  isLoading: boolean;
}

export class LendTokenSelectorItem extends Component<ILendTokenSelectorItemProps, ILendTokenSelectorItemState> {
  constructor(props: ILendTokenSelectorItemProps) {
    super(props);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    const interestRate = new BigNumber(0);
    const profit = null;
    const balanceOfUser = new BigNumber(0);

    this.state = {
      assetDetails: assetDetails || null,
      interestRate,
      profit,
      balanceOfUser,
      iTokenAddress: "",
      tickerSecondDiff: 0,
      isLoading: true,
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.LendTransactionMined, this.onLendTransactionMined);
  }

  private async derivedUpdate() {
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    const interestRate = await FulcrumProvider.Instance.getLendTokenInterestRate(this.props.asset);
    let profit = await FulcrumProvider.Instance.getLendProfit(this.props.asset);
    if (profit && profit.lt(0)) {
      profit = new BigNumber(0);
    }
    const balanceOfUser = await FulcrumProvider.Instance.getITokenAssetBalanceOfUser(this.props.asset);

    const address = FulcrumProvider.Instance.contractsSource ?
      await FulcrumProvider.Instance.contractsSource.getITokenErc20Address(this.props.asset) || "" :
      "";

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      interestRate,
      profit,
      balanceOfUser,
      iTokenAddress: address,
      tickerSecondDiff: balanceOfUser.toNumber() * (interestRate.toNumber() / 100) / 365 / 24 / 60 / 60,
    });

    if(address !== "") {
      this.setState({
        ...this.state,
        isLoading: false
      });
    }

  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  // noinspection JSUnusedLocalSymbols TODO
  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
    // this.setState({
    //   isLoading: false,
    // });
  };

  private onLendTransactionMined = async (event: LendTransactionMinedEvent) => {
    if (event.asset === this.props.asset) {
      await this.derivedUpdate();
    }
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.LendTransactionMined, this.onLendTransactionMined);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<ILendTokenSelectorItemProps>,
    prevState: Readonly<ILendTokenSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.asset !== prevProps.asset) {
      this.derivedUpdate();
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }
    return (
      <div className="token-selector-item">
        {/* 
        {this.props.asset === Asset.SAI ? (
          <div className="token-select-item-dai-convert" onClick={this.onDAIConvertClick}>
            <div className="token-select-item-dai-convert__text">
              upgrade to dai
            </div>
          </div>
        ) : null }
        {this.props.asset === Asset.DAI ? (
          <div className="token-select-item-dai-convert" onClick={this.onDAIConvertClick}>
            <div className="token-select-item-dai-convert__text">
              downgrade to sai
            </div>
          </div>
        ) : null }
        */ }
        <div className={"token-selector-item__image"}>
          <img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName} />
        </div>
        <div className="token-selector-item__descriptions" style={{ marginTop: this.state.profit === null ? `1.5rem` : undefined }}>
          <div className="token-selector-item__description">
            {this.state.iTokenAddress &&
              FulcrumProvider.Instance.web3ProviderSettings &&
              FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
              <div className="token-selector-item__name">
                <a
                  className="token-selector-item__name"
                  style={{cursor: `pointer`, textDecoration: `none`}}
                  title={this.state.iTokenAddress}
                  href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.iTokenAddress}#readContract`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.state.assetDetails.displayName}
                </a>
              </div>
            ) : (
              <div className="token-selector-item__name">{this.state.assetDetails.displayName}</div>
            )}
            {this.state.profit !== null ? (
              <div className="token-selector-item__profit-container">
                <div className="token-selector-item__profit-title">Balance:</div>
                <div
                  title={`$${this.state.balanceOfUser.toFixed(18)}`}
                  className="token-selector-item__profit-value"
                >{`$${this.state.balanceOfUser.toFixed(2)}`}</div>
              </div>
            ) : ``}
          </div>
          {this.state.balanceOfUser.gt(0) ? (
            <div className="token-selector-item__description">
              <div className="token-selector-item__interest-rate-container">
                <div className="token-selector-item__interest-rate-title">Interest APR:</div>
                <div
                  title={`${this.state.interestRate.toFixed(18)}%`}
                  className="token-selector-item__interest-rate-value"
                >{`${this.state.interestRate.toFixed(4)}%`}</div>
              </div>
              <div className="token-selector-item__profit-container">
                <div className="token-selector-item__profit-title">Profit:</div>
                <ProfitTicker secondDiff={this.state.tickerSecondDiff} profit={this.state.profit} />
              </div>
            </div>
          ) : (
            <div className="token-selector-item__description">
              <div className="token-selector-item__interest-rate-container">
                <div className="token-selector-item__interest-rate-title">Interest APR :</div>

                {!this.state.isLoading ? (
                  <div
                    title={`${this.state.interestRate.toFixed(18)}%`}
                    className="token-selector-item__interest-rate-value"
                  >{`${this.state.interestRate.toFixed(4)}%`}</div>
                ) : (
                  <div className="token-selector-item__interest-rate-value">Loading...</div>
                )}
              </div>
              <div className="token-selector-item__interest-rate-container">
                <div className="token-selector-item__interest-rate-title" />
                <div className="token-selector-item__interest-rate-value" />
              </div>
            </div>
          )}
        </div>
        {this.renderActions(this.state.balanceOfUser.eq(0))}
      </div>
    );
  }

  private renderActions = (isLendOnly: boolean) => {
    return isLendOnly ? (
      <div className="token-selector-item__actions" style={{ marginTop: `-1.5rem` }}>
        <button
          className="token-selector-item__lend-button token-selector-item__lend-button--size-full"
          onClick={this.onLendClick}
        >
          Lend
        </button>
      </div>
    ) : (
      <div className="token-selector-item__actions">
        <button
          className="token-selector-item__lend-button token-selector-item__lend-button--size-half"
          onClick={this.onLendClick}
        >
          Lend
        </button>
        <button
          className="token-selector-item__un-lend-button token-selector-item__lend-button--size-half"
          onClick={this.onUnLendClick}
        >
          UnLend
        </button>
      </div>
    );
  };

  public onDAIConvertClick = () => {
    this.props.onDAIConvert(new DAIConvertRequest(this.props.asset, new BigNumber(0)));
  };

  public onLendClick = () => {
    const tagManagerArgs = {
                            dataLayer: {
                                name: LendType.LEND + '-' + this.props.asset,
                                sku: this.props.asset,
                                category: LendType.LEND,
                                price: "0",
                                status: "In-progress"
                            },
                            dataLayerName: 'PageDataLayer'
                        }
    TagManager.dataLayer(tagManagerArgs)
    this.props.onLend(new LendRequest(LendType.LEND, this.props.asset, new BigNumber(0)));
  };

  public onUnLendClick = () => {
    this.props.onLend(new LendRequest(LendType.UNLEND, this.props.asset, new BigNumber(0)));
  };
}
