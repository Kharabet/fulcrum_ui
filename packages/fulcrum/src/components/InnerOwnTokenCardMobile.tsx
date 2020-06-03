import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

import { Preloader } from "./Preloader";
import { ReactComponent as OpenManageCollateral } from "../assets/images/openManageCollateral.svg";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";

import "../styles/components/inner-own-token-card-mobile.scss";
import {IOwnTokenGridRowProps} from "./OwnTokenGridRow";

interface IInnerOwnTokenCardMobileState {
  value: BigNumber;
  positionType: PositionType;
  positionValue: BigNumber;
  collateral: BigNumber;
  liquidationPrice: BigNumber;
  openPrice: BigNumber;
  profit: BigNumber;
  isLoading: boolean;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined;
  collateralToPrincipal: BigNumber;
}

export class InnerOwnTokenCardMobile extends Component<IOwnTokenGridRowProps, IInnerOwnTokenCardMobileState> {
  constructor(props: IOwnTokenGridRowProps, context?: any) {
    super(props, context);

    this._isMounted = false;

    this.state = {
      positionValue: new BigNumber(0),
      positionType: props.loan.collateralAsset === Asset.ETH
        ? PositionType.LONG
        : PositionType.SHORT,
      value: new BigNumber(0),
      collateral: new BigNumber(0),
      openPrice: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      profit: new BigNumber(0),
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined,
      collateralToPrincipal: new BigNumber(0)
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    const collateralToPrincipalRate = await FulcrumProvider.Instance.getSwapRate(this.props.loan.collateralAsset, this.props.loan.loanAsset);
    let positionValue = new BigNumber(0);
    let value = new BigNumber(0);
    let collateral = new BigNumber(0);
    let openPrice = new BigNumber(0);
    //liquidation_collateralToLoanRate = ((15000000000000000000 * principal / 10^20) + principal) / collateral * 10^18
    //If SHORT -> 10^36 / liquidation_collateralToLoanRate
    const liquidation_collateralToLoanRate = (new BigNumber("15000000000000000000").times(this.props.loan.loanData!.principal).div(10 ** 20)).plus(this.props.loan.loanData!.principal).div(this.props.loan.loanData!.collateral).times(10 ** 18);
    let liquidationPrice = new BigNumber(0);
    let profit = new BigNumber(0);
    if (this.state.positionType === PositionType.LONG) {
      positionValue = this.props.loan.loanData!.collateral.div(10 ** 18);
      value = this.props.loan.loanData!.collateral.div(10 ** 18).times(this.state.collateralToPrincipal);
      collateral = ((this.props.loan.loanData!.collateral.times(this.state.collateralToPrincipal).div(10 ** 18)).minus(this.props.loan.loanData!.principal.div(10 ** 18)));
      openPrice = this.props.loan.loanData!.startRate.div(10 ** 18);
      liquidationPrice = liquidation_collateralToLoanRate.div(10 ** 18);
      profit = this.state.collateralToPrincipal.minus(openPrice).times(positionValue);
    }
    else {
      positionValue = this.props.loan.loanData!.principal.div(10 ** 18);
      value = this.props.loan.loanData!.collateral.div(10 ** 18);
      collateral = ((this.props.loan.loanData!.collateral.div(10 ** 18)).minus(this.props.loan.loanData!.principal.div(this.state.collateralToPrincipal).div(10 ** 18)));
      openPrice = new BigNumber(10 ** 36).div(this.props.loan.loanData!.startRate).div(10 ** 18);
      liquidationPrice = new BigNumber(10 ** 36).div(liquidation_collateralToLoanRate).div(10 ** 18);
      profit = openPrice.minus(this.state.collateralToPrincipal).times(positionValue);
    }
    this._isMounted && this.setState(p => ({
      ...this.state,
      liquidationPrice,
      collateral,
      value,
      positionValue,
      openPrice,
      profit,
      isLoading: collateralToPrincipalRate.gt(0) ? false : p.isLoading,
      collateralToPrincipal: collateralToPrincipalRate
    }));
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async () => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }

  public render() {
    return (<div className="inner-own-token-card-mobile">
    <div className="inner-own-token-card-mobile__body-row">
      <div className="inner-own-token-card-mobile__col-token-name-full">
        <span className="inner-own-token-header">{`Position (${this.props.tradeAsset.toUpperCase()}/DAI)`}</span>
        {this.state.positionValue.toFixed(2)}

      </div>
      <div title={this.props.collateralAsset} className="inner-own-token-card-mobile__col-asset-type">
        <span className="position-type-marker">{`${this.props.leverage}x`}&nbsp; {this.props.positionType}</span>
      </div>
      <div className="inner-own-token-card-mobile__col-action">
        <button className="inner-own-token-card-mobile_button inner-own-token-card-mobile__sell-button inner-own-token-card-mobile__button--size-half" onClick={this.onSellClick}>
          {TradeType.SELL}
        </button>
      </div>
    </div>
    <div className="inner-own-token-card-mobile__body-row">
      <div title={this.state.value.toFixed(18)} className="inner-own-token-card-mobile__col-asset-price">
        <span className="inner-own-token-header">Value</span>
        {!this.state.isLoading
          ? <React.Fragment>
            <span className="sign-currency">$</span>{this.state.value.toFixed(2)}
            <span className="inner-own-token-card-mobile__col-asset-price-small">12.25%</span>
          </React.Fragment>
          : <Preloader width="74px" />
        }
      </div>
      <div className="inner-own-token-card-mobile__col-asset-collateral">
        <span className="inner-own-token-header">Collateral</span>
        <React.Fragment>
          <span className="sign-currency">$</span>{this.state.collateral.toFixed(2)}
          <span className="inner-own-token-card-mobile__col-asset-collateral-small">16.5%</span>
        </React.Fragment>
        <div className="inner-own-token-card-mobile__open-manage-collateral" onClick={this.onManageClick}>
          <OpenManageCollateral />
        </div>
      </div>
    </div>
    <div className="inner-own-token-card-mobile__body-row">
      <div title={this.state.openPrice.toFixed(18)} className="inner-own-token-card-mobile__col-position-value">
        <span className="inner-own-token-header">Open Price</span>
        {!this.state.isLoading
          ? this.state.openPrice
            ? <React.Fragment><span className="sign-currency">$</span>{this.state.openPrice.toFixed(2)}</React.Fragment>
            : '$0.00'
          : <Preloader width="74px" />
        }
      </div>
      <div title={this.state.liquidationPrice.toFixed(18)} className="inner-own-token-card-mobile__col-liquidation-price">
        <span className="inner-own-token-header">Liquidation Price</span>
        {!this.state.isLoading
          ? <React.Fragment><span className="sign-currency">$</span>{this.state.liquidationPrice.toFixed(2)}</React.Fragment>
          : <Preloader width="74px" />
        }
      </div>
      <div title={this.state.profit.toFixed(18)} className="inner-own-token-card-mobile__col-profit">
        <span className="inner-own-token-header">Pofit</span>
        {!this.state.isLoading ?
          this.state.profit
            ? <React.Fragment><span className="sign-currency">$</span>{this.state.profit.toFixed(2)}</React.Fragment>
            : '$0.00'
          : <Preloader width="74px" />
        }
      </div>
    </div>
  </div>)
  }

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  public onManageClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onManageCollateralOpen(
      new ManageCollateralRequest(
        new BigNumber(0),
        TradeType.BUY,
        this.props.tradeAsset,
        this.props.collateralAsset,
        this.props.positionType === PositionType.SHORT ? this.props.collateralAsset : Asset.USDC,
        this.props.positionType,
        this.props.leverage,
        new BigNumber(0),
        false
      )
    );
  };

  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onTrade(
      new TradeRequest(
        this.props.loan.loanId,
        TradeType.SELL,
        this.props.tradeAsset,
        Asset.UNKNOWN,
        this.props.collateralAsset,
        this.props.positionType,
        this.props.leverage,
        new BigNumber(0)
      )
    );
  };
}