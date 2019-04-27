import React, { Component } from "react";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { OwnTokenGridHeader } from "./OwnTokenGridHeader";
import { IOwnTokenGridRowProps, OwnTokenGridRow } from "./OwnTokenGridRow";

export interface IOwnTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;

  onShowMyTokensOnlyChange: (value: boolean) => void;
  onSelect: (key: TradeTokenKey) => void;
  onDetails: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
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
  }

  public async derivedUpdate() {
    const tokenRowsData = await OwnTokenGrid.getRowsData(this.props);
    this.setState({ ...this.state, tokenRowsData: tokenRowsData });
  }

  public componentDidMount(): void {
    this.derivedUpdate().then(() => {
      if (this.state.tokenRowsData.length > 0) {
        const e = this.state.tokenRowsData[0];
        this.props.onSelect(e.currentKey);
      }
    });
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
    const tokenRows = this.state.tokenRowsData.map(e => <OwnTokenGridRow key={`${e.currentKey.toString()}`} {...e} />);

    return (
      <div className="trade-token-grid">
        <OwnTokenGridHeader
          showMyTokensOnly={this.props.showMyTokensOnly}
          onShowMyTokensOnlyChange={this.props.onShowMyTokensOnlyChange}
        />
        {tokenRows}
      </div>
    );
  }

  private static getRowsData = async (props: IOwnTokenGridProps): Promise<IOwnTokenGridRowProps[]> => {
    const rowsData: IOwnTokenGridRowProps[] = [];

    const pTokens = await FulcrumProvider.Instance.getPTokensAvailable();
    for (const pToken of pTokens) {
      const balance = await FulcrumProvider.Instance.getTradeTokenBalance(pToken);

      if (balance.gt(0)) {
        rowsData.push({
          selectedKey: props.selectedKey,
          currentKey: pToken,
          balance: balance,
          onSelect: props.onSelect,
          onDetails: props.onDetails,
          onTrade: props.onTrade
        });
      }
    }

    return rowsData;
  };
}
