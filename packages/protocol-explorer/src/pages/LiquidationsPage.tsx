import React, { Component } from "react";
import { Header } from "../layout/Header";
import { ContractsSource } from "../services/ContractsSource";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { BigNumber } from "@0x/utils";
import { ITxRowProps } from "../components/TxRow";
import configProviders from "../config/providers.json";
import { TxGrid } from "../components/TxGrid";



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

interface ILiquidationsPageState {
  events: ITxRowProps[]
}
export class LiquidationsPage extends Component<{},ILiquidationsPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
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


  public getGridItems = (events: LiquidationEvent[]): ITxRowProps[] => {
    if (events.length === 0) return [];
    const etherscanUrl = getWeb3ProviderSettings(initialNetworkId);
    return events.map(e => {
      return {
        hash: e.txHash,
        etherscanTxUrl: `${etherscanUrl}/tx/${e.txHash}`,
        age: e.timeStamp,
        account: e.user,
        etherscanAddressUrl: `${etherscanUrl}/address/${e.user}`,
        quantity: e.repayAmount.div(10 ** 18),
        action: "Liquidation"
      }
    });
  }

  componentDidMount = async () => {
    await this.contractsSource.Init()
    const liquidationEvents = this.getGridItems(await this.getLiquidationHistory());

    this.setState({
      ...this.state,
      events: liquidationEvents
    })
  }


  public render() {
    return (
      <React.Fragment>
        <Header />
        <div className="container">
          <h1>Liquidations</h1>
        </div>
        <section className="pt-90">
          <div className="container">
            <TxGrid events={this.state.events} />
          </div>
        </section>
      </React.Fragment>
    );
  }
}
