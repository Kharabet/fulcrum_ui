import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { LendTransactionMinedEvent } from "../services/events/LendTransactionMinedEvent";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { ProfitTicker } from "./ProfitTicker";
import { Preloader } from "./Preloader";
import { CircleLoader } from "./CircleLoader";
import { RequestTask } from "../domain/RequestTask";
import { RequestStatus } from "../domain/RequestStatus";
import { LendTxLoaderStep } from "./LendTxLoaderStep";




export interface ILendTokenSelectorItemProps {
  asset: Asset;
  onLend: (request: LendRequest) => void;
}


interface ILendTokenSelectorItemState {
  assetDetails: AssetDetails | null;
  interestRate: BigNumber;
  profit: BigNumber | null;
  balanceOfUser: BigNumber;
  iTokenAddress: string,
  tickerSecondDiff: BigNumber;
  isLoading: boolean;
  isLoadingTransaction: boolean;
  request: LendRequest | undefined;
}

export class LendTokenSelectorItem extends Component<ILendTokenSelectorItemProps, ILendTokenSelectorItemState> {
  constructor(props: ILendTokenSelectorItemProps) {
    super(props);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    const interestRate = new BigNumber(0);
    const profit = null;
    const balanceOfUser = new BigNumber(0);

    this._isMounted = false;

    this.state = {
      assetDetails: assetDetails || null,
      interestRate,
      profit,
      balanceOfUser,
      iTokenAddress: "",
      tickerSecondDiff: new BigNumber(0),
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.LendTransactionMined, this.onLendTransactionMined);
  }

  private _isMounted: boolean;
  private _refreshInterval: any;
  private _refreshProfitTimerMillisec: number = 1000 * 60 * 10;

  private async derivedUpdate() {
    console.log("this.derivedUpdate")
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    const interestRate = await FulcrumProvider.Instance.getLendTokenInterestRate(this.props.asset);
    let profit = await FulcrumProvider.Instance.getLendProfit(this.props.asset);
    if (profit && profit.lt(0))
      profit = new BigNumber(0);

    const balanceOfUser = await FulcrumProvider.Instance.getITokenAssetBalanceOfUser(this.props.asset);

    const address = FulcrumProvider.Instance.contractsSource ?
      await FulcrumProvider.Instance.contractsSource.getITokenErc20Address(this.props.asset) || "" :
      "";

    this._isMounted && this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      interestRate,
      profit,
      balanceOfUser,
      iTokenAddress: address,
      tickerSecondDiff: balanceOfUser.times(interestRate).dividedBy(100 * 365 * 24 * 60 * 60),
    });

    if (address !== "") {
      this._isMounted && this.setState({
        ...this.state,
        isLoading: false
      });
    }

  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true })
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.loanId !== this.state.request.loanId) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
      }, 5000)
      return;
    }
    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
  }

  private onLendTransactionMined = async (event: LendTransactionMinedEvent) => {
    if (event.asset === this.props.asset) {
      await this.derivedUpdate();
    }
  };

  public componentWillUnmount(): void {
    this._isMounted = false;
    window.clearInterval(this._refreshInterval);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.LendTransactionMined, this.onLendTransactionMined);
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
    this._refreshInterval = window.setInterval(this.derivedUpdate.bind(this), this._refreshProfitTimerMillisec);
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
      <div className={`token-selector-item ${this.state.balanceOfUser.eq(0) ? "" : "token-selector-item_active"} ${this.state.isLoadingTransaction ? "loading-transaction" : ""}`}>
        <div className="token-selector-item__image">
          {this.state.isLoadingTransaction
            ? <CircleLoader>{this.state.assetDetails.reactLogoSvg.render()}</CircleLoader>
            : this.state.assetDetails.reactLogoSvg.render()
          }
        </div>

        {this.state.isLoadingTransaction && this.state.request
          ? <LendTxLoaderStep taskId={this.state.request.id} />
          : <React.Fragment>
            <div className="token-selector-item__descriptions" style={{ marginTop: this.state.profit === null ? `1.5rem` : undefined }}>
              <div className="token-selector-item__description">
                {this.state.iTokenAddress &&
                  FulcrumProvider.Instance.web3ProviderSettings &&
                  FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                    <div className="token-selector-item__name">
                      <a
                        className="token-selector-item__name"
                        style={{ cursor: `pointer`, textDecoration: `none` }}
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


                <div className="token-selector-item__interest-rate-container">
                  <div className="token-selector-item__interest-rate-title">Interest APR:</div>
                  <div
                    title={`${this.state.interestRate.toFixed(18)}%`}
                    className="token-selector-item__interest-rate-value"
                  >
                    {!this.state.isLoading ? (<React.Fragment>{this.state.interestRate.toFixed(4)}<span className="sign-currency">%</span></React.Fragment>)
                      : (<div className="token-selector-item__interest-rate-value"><Preloader width="74px" /></div>)}
                  </div>
                </div>
                {this.state.balanceOfUser.gt(0)
                  ? (<React.Fragment>
                    {this.state.profit !== null ? (
                      <div className="token-selector-item__profit-container token-selector-item__balance-container">
                        <div className="token-selector-item__profit-title token-selector-item__profit-balance">Balance:</div>
                        {!this.state.isLoading ? (<div
                          title={`${this.state.balanceOfUser.toFixed(18)} ${this.props.asset}`}
                          className="token-selector-item__profit-value token-selector-item__balance-value"
                        >{this.state.balanceOfUser.toFixed(2)}</div>)
                          : (<div className="token-selector-item__interest-rate-value"><Preloader width="74px" /></div>)}
                      </div>) : null}
                    <div className="token-selector-item__profit-container">
                      <div className="token-selector-item__profit-title">Profit:</div>
                      <ProfitTicker asset={this.props.asset} secondDiff={this.state.tickerSecondDiff} profit={this.state.profit} />
                    </div>
                  </React.Fragment>)
                  : (<div className="token-selector-item__description">
                    <div className="token-selector-item__interest-rate-container">
                      <div className="token-selector-item__interest-rate-title" />
                      <div className="token-selector-item__interest-rate-value" />
                    </div>
                  </div>)
                }

              </div>
            </div>
            {this.renderActions(this.state.balanceOfUser.eq(0))}
          </React.Fragment>
        }
      </div>
    );
  }

  // private onProfit = async (profit: BigNumber) => {
  //   await FulcrumProvider.Instance.getLendProfit(this.props.asset).then(val => {
  //     console.log("profit change\n" + new BigNumber(val!).dividedBy(profit).toFixed(8));
  //     console.log(new Date().toLocaleString());

  //   });
  // }

  private renderActions = (isLendOnly: boolean) => {
    return isLendOnly ? (
      <div className="token-selector-item__actions" style={{ marginTop: `-1.5rem` }}>
        <button
          className="token-selector-item__lend-button token-selector-item__lend-button--size-full"
          onClick={this.onLendClick} disabled={this.props.asset === Asset.SAI}
        >
          Lend
        </button>
      </div>
    ) : (
        <div className="token-selector-item__actions">
          <button
            className="token-selector-item__lend-button token-selector-item__lend-button--size-half"
            onClick={this.onLendClick} disabled={this.props.asset === Asset.SAI}
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

  public onLendClick = async () => {
    const request = new LendRequest(LendType.LEND, this.props.asset, new BigNumber(0));
    await this.setState({ ...this.state, request: request });
    this.props.onLend(request);
  };

  public onUnLendClick = async () => {
    const request = new LendRequest(LendType.UNLEND, this.props.asset, new BigNumber(0));
    await this.setState({ ...this.state, request: request });
    this.props.onLend(request);
  };
}
