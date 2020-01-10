import React, { Component } from "react";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { OwnTokenGridHeader } from "./OwnTokenGridHeader";
import { OwnTokenGridHeaderMobile } from "./OwnTokenGridHeaderMobile";
import { IOwnTokenGridRowProps, OwnTokenGridRow } from "./OwnTokenGridRow";
import { OwnTokenGridRowMobile } from "./OwnTokenGridRowMobile";
import {TradeType} from "../domain/TradeType";
import {Asset} from "../domain/Asset";
import {PositionType} from "../domain/PositionType";
import { BigNumber } from "@0x/utils";
export interface IOwnTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;

  onShowMyTokensOnlyChange: (value: boolean) => void;
  onDetails: (key: TradeTokenKey) => void;
  onManageCollateral: (request: ManageCollateralRequest) => void;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
  isMobileMedia: boolean;
}

interface IOwnTokenGridState {
  tokenRowsData: IOwnTokenGridRowProps[];
}

export class OwnTokenGrid extends Component<IOwnTokenGridProps, IOwnTokenGridState> {
  constructor(props: IOwnTokenGridProps) {
    super(props);

    this.state = {
      tokenRowsData: []
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public async derivedUpdate() {
    const tokenRowsData = await OwnTokenGrid.getRowsData(this.props);
    this.setState({ ...this.state, tokenRowsData: tokenRowsData });
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IOwnTokenGridProps>,
    prevState: Readonly<IOwnTokenGridState>,
    snapshot?: any
  ): void {
    if (
      this.props.selectedKey !== prevProps.selectedKey ||
      this.props.showMyTokensOnly !== prevProps.showMyTokensOnly
    ) {
      this.derivedUpdate();
    }
  }

  public render() {

    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();

  }

  private renderDesktop = () => {
    const tokenRows = this.state.tokenRowsData.map(e => <OwnTokenGridRow key={`${e.currentKey.toString()}`} {...e} />);

    return (
      <div className="own-token-grid">
        <OwnTokenGridHeader

          showMyTokensOnly={this.props.showMyTokensOnly}
          onShowMyTokensOnlyChange={this.props.onShowMyTokensOnlyChange}
        />
        {tokenRows}
      </div>
    );
  }

  private renderMobile = () => {
    const tokenRows = this.state.tokenRowsData.map(e => <OwnTokenGridRowMobile key={`${e.currentKey.toString()}`} {...e} />);

    return (
      <div className="own-token-grid">
        <div className="own-token-grid-row__col-action-mb">
          {this.state.tokenRowsData.length > 0 ? (
          <button className="own-token-grid-row__sell-button" onClick={this.onSellClick}>
            {TradeType.SELL}
          </button>
          ) : null}
        </div>
        <OwnTokenGridHeaderMobile

          showMyTokensOnly={this.props.showMyTokensOnly}
          onShowMyTokensOnlyChange={this.props.onShowMyTokensOnlyChange}
        />
        {tokenRows}
      </div>
    );
  }
  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onTrade(
      new TradeRequest(
        TradeType.SELL,
        this.props.selectedKey.asset,
        this.props.selectedKey.unitOfAccount,
        this.props.selectedKey.positionType === PositionType.SHORT ? this.props.selectedKey.asset : Asset.USDC,
        this.props.selectedKey.positionType,
        this.props.selectedKey.leverage,
        new BigNumber(0),
        this.props.selectedKey.isTokenized,
        this.props.selectedKey.version
      )
    );
  };

  private static getRowsData = async (props: IOwnTokenGridProps): Promise<IOwnTokenGridRowProps[]> => {
    const rowsData: IOwnTokenGridRowProps[] = [];

    if (FulcrumProvider.Instance.web3Wrapper && FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite) {
      const pTokens = FulcrumProvider.Instance.getPTokensAvailable();

      const pTokenAddreses: string[] = FulcrumProvider.Instance.getPTokenErc20AddressList();
      const pTokenBalances = await FulcrumProvider.Instance.getErc20BalancesOfUser(pTokenAddreses);
      for (const pToken of pTokens) {
        // console.log(pToken);
        const balance = pTokenBalances.get(pToken.erc20Address);
        if (!balance) {
          continue;
        }

        rowsData.push({
          selectedKey: props.selectedKey,
          currentKey: pToken,
          // balance: balance,
          onDetails: props.onDetails,
          onManageCollateral: props.onManageCollateral,
          onSelect: props.onSelect,
          onTrade: props.onTrade
        });
      }
    }

    return rowsData;
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    await this.derivedUpdate();
  };
}
