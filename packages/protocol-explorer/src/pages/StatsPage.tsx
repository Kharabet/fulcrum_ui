import React, { Component } from "react";
import { Search } from "../components/Search";
import { StatsChart } from "../components/StatsChart";
import { TxGrid } from "../components/TxGrid";
import { Header } from "../layout/Header";
import { RouteComponentProps } from "react-router";
import { Asset } from "../domain/Asset";
import { ContractsSource } from "../services/ContractsSource";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { BigNumber } from "@0x/utils";
import { TradeEvent } from "../domain/TradeEvent";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";
import { ITxRowProps } from "../components/TxRow";
import configProviders from "../config/providers.json";


const getWeb3ProviderSettings = (networkId: number): string => {
  let etherscanURL = "";
  switch (networkId) {
    case 1:
      etherscanURL = "https://etherscan.io/";
      break;
    case 3:
      etherscanURL = "https://ropsten.etherscan.io/";
      break;
    case 4:
      etherscanURL = "https://rinkeby.etherscan.io/";
      break;
    case 42:
      etherscanURL = "https://kovan.etherscan.io/";
      break;
    default:
      etherscanURL = "";
      break;
  }
  return etherscanURL
}

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
interface MatchParams {
  token: string;
}

interface IStatsPageProps extends RouteComponentProps<MatchParams> {
}

interface IStatsPageState {
  asset: Asset,
  events: ITxRowProps[]
}

export class StatsPage extends Component<IStatsPageProps, IStatsPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      asset: this.props.match.params.token.toUpperCase() as Asset,
      events: []
    };
  }


  private contractsSource: ContractsSource = new ContractsSource(initialNetworkId);

  getLiquidationHistory = async (): Promise<LiquidationEvent[]> => {
    let result: LiquidationEvent[] = [];
    const bzxContractAddress = this.contractsSource.getiBZxAddress()
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
      const baseToken = this.contractsSource!.getAssetFromAddress(baseTokenAddress);
      const quoteToken = this.contractsSource!.getAssetFromAddress(quoteTokenAddress);
      const repayAmount = new BigNumber(parseInt(dataSegments[3], 16));
      const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16));
      const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16));
      const currentMargin = new BigNumber(parseInt(dataSegments[6], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      if (baseToken !== this.state.asset && quoteToken !== this.state.asset)
        return;
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
    return result.filter(e => e)
  }

  public getTradeHistory = async (): Promise<TradeEvent[]> => {
    let result: TradeEvent[] = [];
    if (!this.contractsSource) return result;
    const bzxContractAddress = this.contractsSource.getiBZxAddress()
    if (!bzxContractAddress) return result
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${TradeEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    //@ts-ignore
    result = events.reverse().map(event => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loandId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const baseTokenAddress = dataSegments[0].replace("000000000000000000000000", "0x");
      const quoteTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const baseToken = this.contractsSource!.getAssetFromAddress(baseTokenAddress);
      const quoteToken = this.contractsSource!.getAssetFromAddress(quoteTokenAddress);

      const positionSize = new BigNumber(parseInt(dataSegments[2], 16));
      const borrowedAmount = new BigNumber(parseInt(dataSegments[3], 16));
      const interestRate = new BigNumber(parseInt(dataSegments[4], 16));
      const settlementDate = new Date(parseInt(dataSegments[5], 16) * 1000);
      const entryPrice = new BigNumber(parseInt(dataSegments[6], 16));
      const entryLeverage = new BigNumber(parseInt(dataSegments[7], 16));
      const currentLeverage = new BigNumber(parseInt(dataSegments[8], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      if (baseToken !== this.state.asset && quoteToken !== this.state.asset)
        return;
      return new TradeEvent(
        userAddress,
        lender,
        loandId,
        baseToken,
        quoteToken,
        positionSize,
        borrowedAmount,
        interestRate,
        settlementDate,
        entryPrice,
        entryLeverage,
        currentLeverage,
        timeStamp,
        txHash
      )

    })
    return result.filter(e => e)

  }

  public getCloseWithSwapHistory = async (): Promise<CloseWithSwapEvent[]> => {
    let result: CloseWithSwapEvent[] = [];
    const bzxContractAddress = this.contractsSource.getiBZxAddress()
    if (!bzxContractAddress) return result
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${CloseWithSwapEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    //@ts-ignore
    result = events.reverse().map(event => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loandId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const baseTokenAddress = dataSegments[0].replace("000000000000000000000000", "0x");
      const quoteTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const baseToken = this.contractsSource!.getAssetFromAddress(baseTokenAddress);
      const quoteToken = this.contractsSource!.getAssetFromAddress(quoteTokenAddress);
      const closer = dataSegments[2].replace("000000000000000000000000", "0x");
      const positionCloseSize = new BigNumber(parseInt(dataSegments[3], 16));
      const loanCloseAmount = new BigNumber(parseInt(dataSegments[4], 16));
      const exitPrice = new BigNumber(parseInt(dataSegments[5], 16));
      const currentLeverage = new BigNumber(parseInt(dataSegments[6], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      if (baseToken !== this.state.asset && quoteToken !== this.state.asset)
        return;
      return new CloseWithSwapEvent(
        userAddress,
        baseToken,
        quoteToken,
        lender,
        closer,
        loandId,
        positionCloseSize,
        loanCloseAmount,
        exitPrice,
        currentLeverage,
        timeStamp,
        txHash
      )

    })
    return result.filter(e => e)

  }

  public getGridItems = (events: (LiquidationEvent | TradeEvent | CloseWithSwapEvent)[]): ITxRowProps[] => {
    if (events.length === 0) return [];
    const etherscanUrl = getWeb3ProviderSettings(initialNetworkId);
    return events.map(e => {
      return {
        hash: e.txHash,
        etherscanTxUrl: `${etherscanUrl}/tx/${e.txHash}`,
        age: e.timeStamp,
        account: e.user,
        etherscanAddressUrl: `${etherscanUrl}/address/${e.user}`,
        quantity: e instanceof LiquidationEvent
          ? e.repayAmount.div(10 ** 18)
          : e instanceof TradeEvent
            ? e.positionSize.div(10 ** 18)
            : e instanceof CloseWithSwapEvent
              ? e.positionCloseSize.div(10 ** 18)
              : new BigNumber(0),
        action: e instanceof LiquidationEvent
          ? "Liquidatioan"
          : e instanceof TradeEvent
            ? "Trade"
            : e instanceof CloseWithSwapEvent
              ? "Close"
              : "Other action",
      }
    });
  }

  componentDidMount = async () => {
    await this.contractsSource.Init()
    const liquidationEvents = this.getGridItems(await this.getLiquidationHistory());
    const tradeEvents = this.getGridItems(await this.getTradeHistory());
    const closeEvents = this.getGridItems(await this.getCloseWithSwapHistory());
    const events: ITxRowProps[] = liquidationEvents.concat(closeEvents).concat(tradeEvents);

    this.setState({
      ...this.state,
      events
    })
  }


  public render() {
    return (
      <React.Fragment>
        <Header />
        <section>
          <div className="container">
            <StatsChart />
            <div className="flex jc-c labels-container">
              <div className="label-chart"><span className="bg-green"></span>Supply APR, %</div>
              <div className="label-chart"><span className="bg-primary"></span>TVL</div>
              <div className="label-chart"><span className="bg-secondary"></span>Utilization, %</div>
            </div>
          </div>
        </section>
        <section className="pt-75">
          <Search />
        </section>
        <section className="pt-90">
          <div className="container">
            <TxGrid asset={this.state.asset} events={this.state.events} />
          </div>
        </section>
      </React.Fragment>
    );
  }
} 
