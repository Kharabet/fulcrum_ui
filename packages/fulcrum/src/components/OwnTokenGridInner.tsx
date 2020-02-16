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
import { IOwnTokenGridRowInnerProps, OwnTokenGridRowInner } from "./OwnTokenGridRowInner";
import { OwnTokenGridRowMobile } from "./OwnTokenGridRowMobile";
import { IOwnTokenCardMobileProps, OwnTokenCardMobile } from "./OwnTokenCardMobile";
import { TradeType } from "../domain/TradeType";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { BigNumber } from "@0x/utils";
export interface IOwnTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;
  asset: Asset;
  positionType: PositionType;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
  isMobileMedia: boolean;
}

interface IOwnTokenGridInnerState {
  tokenRowsData: IOwnTokenGridRowInnerProps[];
}

export class OwnTokenGridInner extends Component<IOwnTokenGridProps, IOwnTokenGridInnerState> {
  constructor(props: IOwnTokenGridProps) {
    super(props);

    this._isMounted = false;
    this.state = {
      tokenRowsData: []
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }
  private _isMounted: boolean;

  public async derivedUpdate() {
    const tokenRowsData = await OwnTokenGridInner.getRowsData(this.props);
    this._isMounted && this.setState({ ...this.state, tokenRowsData: tokenRowsData });
  }

  public componentWillUnmount(): void {
    this._isMounted = false;
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    this._isMounted = true;
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IOwnTokenGridProps>,
    prevState: Readonly<IOwnTokenGridInnerState>,
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

    return this.renderDesktop();

  }

  private renderDesktop = () => {
    const tokenRows = this.state.tokenRowsData.map(e => <OwnTokenGridRowInner key={`${e.currentKey.toString()}`} {...e} />);
    if (tokenRows.length === 0) return null;
    return (
      <div className="own-token-grid">
        <div className="own-token-grid-header-inner">
          <div className="own-token-grid-header-inner__col-token-image">
            <span className="own-token-grid-header-inner__text">Leverage</span>
          </div>
          <div className="own-token-grid-header-inner__col-asset-price">
            <span className="own-token-grid-header-inner__text">Unit of Account</span>
          </div>
          <div className="own-token-grid-header-inner__col-asset-price">
            <span className="own-token-grid-header-inner__text">Asset Price</span>
          </div>
          <div className="own-token-grid-header-inner__col-liquidation-price">
            <span className="own-token-grid-header-inner__text">Liquidation Price</span>
          </div>
          <div className="own-token-grid-header-inner__col-position-value">
            <span className="own-token-grid-header-inner__text">Position Value</span>
          </div>
          <div className="own-token-grid-header-inner__col-profit">
            <span className="own-token-grid-header-inner__text">Profit</span>
          </div>
        </div>
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

  private static getRowsData = async (props: IOwnTokenGridProps): Promise<IOwnTokenGridRowInnerProps[]> => {
    const rowsData: IOwnTokenGridRowInnerProps[] = [];

    if (FulcrumProvider.Instance.web3Wrapper && FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite) {
      const pTokens = FulcrumProvider.Instance.getPTokensAvailable().filter( tradeToken => tradeToken.asset == props.asset && tradeToken.positionType == props.positionType);

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
