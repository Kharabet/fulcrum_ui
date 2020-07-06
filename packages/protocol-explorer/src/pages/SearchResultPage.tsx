import React, { Component } from "react";
import { Header } from "../layout/Header";
import { ContractsSource } from "../services/ContractsSource";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { BigNumber } from "@0x/utils";
import { ITxRowProps } from "../components/TxRow";
import configProviders from "../config/providers.json";
import { TxGrid } from "../components/TxGrid";
import { LoanGrid } from "../components/LoanGrid";
import { Asset } from "../domain/Asset";
import { Bar } from "react-chartjs-2";
import { Search } from "../components/Search";
import { UnhealthyChart } from "../components/UnhealthyChart";
import { RouteComponentProps } from "react-router";
import { TradeEvent } from "../domain/TradeEvent";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";
import { CloseWithDepositEvent } from "../domain/CloseWithDepositEvent";
import { BorrowEvent } from "../domain/BorrowEvent";
import { BurnEvent } from "../domain/BurnEvent";
import { MintEvent } from "../domain/MintEvent";
import { ExplorerProvider } from "../services/ExplorerProvider";
import { ExplorerProviderEvents } from "../services/events/ExplorerProviderEvents";



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
  filter: string;
}

interface ISearchResultPageProps extends RouteComponentProps<MatchParams> {
  doNetworkConnect: () => void;
  isMobileMedia: boolean;
}

interface ISearchResultPageState {
  events: ITxRowProps[];
  filter: string;
  filteredEvents: ITxRowProps[];
  showSearchResult: boolean;
}
export class SearchResultPage extends Component<ISearchResultPageProps, ISearchResultPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      events: [],
      filteredEvents: [],
      showSearchResult: false,
      filter: this.props.match.params.filter.toLowerCase(),
    };
    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);

  }
  
  private _isMounted: boolean;
  
  private onProviderChanged = () => {
    this.derivedUpdate();
  };

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };
  
  public componentWillUnmount(): void {
    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.removeListener(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.removeListener(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  getLiquidationHistory = async (): Promise<LiquidationEvent[]> => {
    let result: LiquidationEvent[] = [];
    if (!ExplorerProvider.Instance.contractsSource) return result;
    const bzxContractAddress = ExplorerProvider.Instance.contractsSource.getiBZxAddress()
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${LiquidationEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    result = events.reverse().map((event: any) => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const liquidatorAddress = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loanId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const lender = dataSegments[0].replace("000000000000000000000000", "0x");

      const baseTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const quoteTokenAddress = dataSegments[2].replace("000000000000000000000000", "0x");
      const baseToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(baseTokenAddress);
      const quoteToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(quoteTokenAddress);
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
    return result.filter(e => e)
  }

  
  public getTradeHistory = async (): Promise<TradeEvent[]> => {
    let result: TradeEvent[] = [];
    if (!ExplorerProvider.Instance.contractsSource) return result;
    const bzxContractAddress = ExplorerProvider.Instance.contractsSource.getiBZxAddress()
    if (!bzxContractAddress) return result
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${TradeEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    result = events.reverse().map((event: any) => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loandId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const loanTokenAddress = dataSegments[0].replace("000000000000000000000000", "0x");
      const collateralTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const loanToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(loanTokenAddress);
      const collateralToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(collateralTokenAddress);

      const positionSize = new BigNumber(parseInt(dataSegments[2], 16));
      const borrowedAmount = new BigNumber(parseInt(dataSegments[3], 16));
      const interestRate = new BigNumber(parseInt(dataSegments[4], 16));
      const settlementDate = new Date(parseInt(dataSegments[5], 16) * 1000);
      const entryPrice = new BigNumber(parseInt(dataSegments[6], 16));
      const entryLeverage = new BigNumber(parseInt(dataSegments[7], 16));
      const currentLeverage = new BigNumber(parseInt(dataSegments[8], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      
      return new TradeEvent(
        userAddress,
        lender,
        loandId,
        loanToken,
        collateralToken,
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
    if (!ExplorerProvider.Instance.contractsSource) return result;
    const bzxContractAddress = ExplorerProvider.Instance.contractsSource.getiBZxAddress()
    if (!bzxContractAddress) return result
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${CloseWithSwapEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    result = events.reverse().map((event: any) => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loandId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const collateralTokenAddress = dataSegments[0].replace("000000000000000000000000", "0x");
      const loanTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const collateralToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(collateralTokenAddress);
      const loanToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(loanTokenAddress);
      const closer = dataSegments[2].replace("000000000000000000000000", "0x");
      const positionCloseSize = new BigNumber(parseInt(dataSegments[3], 16));
      const loanCloseAmount = new BigNumber(parseInt(dataSegments[4], 16));
      const exitPrice = new BigNumber(parseInt(dataSegments[5], 16));
      const currentLeverage = new BigNumber(parseInt(dataSegments[6], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      
      return new CloseWithSwapEvent(
        userAddress,
        lender,
        loandId,
        collateralToken,
        loanToken,
        closer,
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

  public getCloseWithDepositHistory = async (): Promise<CloseWithDepositEvent[]> => {
    let result: CloseWithDepositEvent[] = [];
    if (!ExplorerProvider.Instance.contractsSource) return result;
    const bzxContractAddress = ExplorerProvider.Instance.contractsSource.getiBZxAddress()
    if (!bzxContractAddress) return result
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${CloseWithDepositEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    result = events.reverse().map((event: any) => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loandId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const closer = dataSegments[0].replace("000000000000000000000000", "0x");
      const loanTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const collateralTokenAddress = dataSegments[2].replace("000000000000000000000000", "0x");
      const loanToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(loanTokenAddress);
      const collateralToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(collateralTokenAddress);
      const repayAmount = new BigNumber(parseInt(dataSegments[3], 16));
      const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16));
      const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16));
      const currentMargin = new BigNumber(parseInt(dataSegments[6], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      
      return new CloseWithDepositEvent(
        userAddress,
        lender,
        loandId,
        closer,
        loanToken,
        collateralToken,
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

  public getBorrowHistory = async (): Promise<BorrowEvent[]> => {
    let result: BorrowEvent[] = [];
    if (!ExplorerProvider.Instance.contractsSource) return result;
    const bzxContractAddress = ExplorerProvider.Instance.contractsSource.getiBZxAddress()
    if (!bzxContractAddress) return result
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${BorrowEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    result = events.reverse().map((event: any) => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loandId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const loanTokenAddress = dataSegments[0].replace("000000000000000000000000", "0x");
      const collateralTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const loanToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(loanTokenAddress);
      const collateralToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(collateralTokenAddress);
      const newPrincipal = new BigNumber(parseInt(dataSegments[2], 16));
      const newCollateral = new BigNumber(parseInt(dataSegments[3], 16));
      const interestRate = new BigNumber(parseInt(dataSegments[4], 16));
      const interestDuration = new BigNumber(parseInt(dataSegments[5], 16));
      const collateralToLoanRate = new BigNumber(parseInt(dataSegments[6], 16));
      const currentMargin = new BigNumber(parseInt(dataSegments[7], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      
      return new BorrowEvent(
        userAddress,
        lender,
        loandId,
        loanToken,
        collateralToken,
        newPrincipal,
        newCollateral,
        interestRate,
        interestDuration,
        collateralToLoanRate,
        currentMargin,
        timeStamp,
        txHash
      )
    })
    return result.filter(e => e)
  }


  public getGridItems = (events: (LiquidationEvent | TradeEvent | CloseWithSwapEvent | BorrowEvent | BurnEvent | MintEvent | CloseWithDepositEvent)[]): ITxRowProps[] => {
    if (events.length === 0) return [];
    const etherscanUrl = getWeb3ProviderSettings(initialNetworkId);
    return events.map(e => {
      if (e instanceof TradeEvent) {
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          age: e.timeStamp,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}/address/${e.user}`,
          quantity: e.positionSize.div(10 ** 18),
          action: "Open Fulcrum Loan"
        } as ITxRowProps
      } else if (e instanceof CloseWithSwapEvent) {
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          age: e.timeStamp,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}/address/${e.user}`,
          quantity: e.loanCloseAmount.div(10 ** 18),
          action: "Close Fulcrum Loan"
        } as ITxRowProps
      } else if (e instanceof LiquidationEvent) {
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          age: e.timeStamp,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}/address/${e.user}`,
          quantity: e.repayAmount.div(10 ** 18),
          action: "Liquidate Fulcrum Loan"
        } as ITxRowProps
      } else if (e instanceof CloseWithDepositEvent) {
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          age: e.timeStamp,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}/address/${e.user}`,
          quantity: e.repayAmount.div(10 ** 18),
          action: "Close Torque Loan"
        } as ITxRowProps
      } else if (e instanceof BorrowEvent) {
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          age: e.timeStamp,
          account: e.user,
          etherscanAddressUrl: `${etherscanUrl}/address/${e.user}`,
          quantity: e.newPrincipal.div(10 ** 18),
          action: "Open Torque Loan"
        } as ITxRowProps
      } else if (e instanceof BurnEvent) {
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          age: e.timeStamp,
          account: e.burner,
          etherscanAddressUrl: `${etherscanUrl}/address/${e.burner}`,
          quantity: e.assetAmount.div(10 ** 18),
          action: "Burn Token"
        } as ITxRowProps
      } else {
        return {
          hash: e.txHash,
          etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
          age: e.timeStamp,
          account: e.minter,
          etherscanAddressUrl: `${etherscanUrl}/address/${e.minter}`,
          quantity: e.assetAmount.div(10 ** 18),
          action: "Mint iToken"
        }
      }
    });
  }

  private groupBy = function (xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };


  derivedUpdate = async () => {
    const liquidationEvents = this.getGridItems(await this.getLiquidationHistory());
    const tradeEvents = this.getGridItems(await this.getTradeHistory());
    const closeEvents = this.getGridItems(await this.getCloseWithSwapHistory());
    const events: ITxRowProps[] = liquidationEvents.concat(closeEvents).concat(tradeEvents);

    this._isMounted && this.setState({
      ...this.state,
      events
    })
    this.onSearch(this.state.filter);
  }

  public componentDidMount(): void {
    this._isMounted = true;
    this.derivedUpdate();
  }

  onSearch = (filter: string) => {
    if (filter === "") {
      this._isMounted && this.setState({
        ...this.state,
        showSearchResult: false,
        filteredEvents: []
      })
      return;
    }
    const filteredEvents = this.state.events.filter(e => e.hash === filter || e.account === filter)
    this._isMounted && this.setState({
      ...this.state,
      showSearchResult: true,
      filteredEvents,
      filter: filter
    })
  }

  public render() {
    
    return (
      <React.Fragment>
        <Header isMobileMedia={this.props.isMobileMedia} doNetworkConnect={this.props.doNetworkConnect} />
        <section className="pt-45">
          <Search onSearch={this.onSearch} initialFilter={this.state.filter}/>
        </section>
        <section className="pt-90">
          <div className="container">
              <h1>Result:</h1>
            <TxGrid events={!this.state.showSearchResult ? this.state.events : this.state.filteredEvents} />
          </div>
        </section>
      </React.Fragment>
    );
  }
}
