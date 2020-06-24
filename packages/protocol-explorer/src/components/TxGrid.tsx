import React, { Component } from "react";
import { TxRow, ITxRowProps } from "./TxRow";
import { IconSort } from "./IconSort";
import { Asset } from "../domain/Asset";
import configProviders from "../config/providers.json";
import { ContractsSource } from "../services/ContractsSource";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { BigNumber } from "@0x/utils";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";
import { TradeEvent } from "../domain/TradeEvent";


const getNetworkIdByString = (networkName: string | undefined) => {
  switch (networkName) {
    case 'mainnet':
      return 1;
    case 'ropsten':
      return 3;
    case 'rinkeby':
      return 4;
    case 'kovan':
      return 42;
    default:
      return 0;
  }
}
const networkName = process.env.REACT_APP_ETH_NETWORK;
const initialNetworkId = getNetworkIdByString(networkName);

interface ITxGridProps {
  asset: Asset;
}

interface ITxGridState {
  isSort: boolean;
  typeSort: string;
  events: (LiquidationEvent | TradeEvent | CloseWithSwapEvent)[]
}

export class TxGrid extends Component<ITxGridProps, ITxGridState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isSort: false,
      typeSort: 'default',
      events: []
    };
  }
  getLiquidationHistory = async (): Promise<LiquidationEvent[]> => {
    let result: LiquidationEvent[] = [];
    const contractsSource = new ContractsSource(initialNetworkId)
    await contractsSource.Init()
    const bzxContractAddress = contractsSource.getiBZxAddress()
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${LiquidationEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    //@ts-ignore
    result = events.reverse().map(event => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const liquidatorAddress = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loanId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const lender = dataSegments[0].replace("000000000000000000000000", "0x");

      const baseTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const quoteTokenAddress = dataSegments[2].replace("000000000000000000000000", "0x");
      const baseToken = contractsSource!.getAssetFromAddress(baseTokenAddress);
      const quoteToken = contractsSource!.getAssetFromAddress(quoteTokenAddress);
      const repayAmount = new BigNumber(parseInt(dataSegments[3], 16));
      const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16));
      const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16));
      const currentMargin = new BigNumber(parseInt(dataSegments[6], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      return new LiquidationEvent(
        userAddress,
        liquidatorAddress,
        loanId,
        lender,
        baseToken,
        quoteToken,
        repayAmount,
        collateralWithdrawAmount,
        collateralToLoanRate,
        currentMargin,
        timeStamp,
        txHash
      )

    })
    return result
  }

  componentDidMount = async () => {
    const events = await this.getLiquidationHistory()
    this.setState({
      ...this.state,
      events
    })
  }

  public render() {
    const itemsTable = this.state.events.map(e => {
      return {
        hash: e.txHash,
        age: new Date(new Date().getTime() - e.timeStamp.getTime()),
        account: e.user,
        quantity: e instanceof LiquidationEvent
          ? e.repayAmount.div(10**18)
          : new BigNumber(0),
        action: "Liquidation"
      }
    });
    const assetItems = itemsTable
    //@ts-ignore
      .sort((a, b) => { return this.state.isSort ? (this.state.typeSort === 'up' ? a.age - b.age : b.age - a.age) : 0 })
      .map((e: ITxRowProps) => <TxRow key={e.hash} {...e} />);
    return (
      <React.Fragment>
        <div className="table">
          <div className="table-header">
            <div className="table-header__hash">Txn Hash</div>
            <div className="table-header__age" onClick={this.sortAge}>
              <span>Age</span>
              <IconSort sort={this.state.typeSort} />
            </div>
            <div className="table-header__from">From</div>
            <div className="table-header__quantity">Quantity</div>
            <div className="table-header__action">Action</div>
          </div>
          {assetItems}
        </div>
      </React.Fragment>
    );
  }

  public sortAge = () => {
    switch (this.state.typeSort) {
      case 'down':
        return this.setState({ ...this.state, isSort: true, typeSort: 'up' });
      case 'up':
        return this.setState({ ...this.state, isSort: true, typeSort: 'down' });
      default:
        return this.setState({ ...this.state, isSort: true, typeSort: 'down' });
    }
  }
}