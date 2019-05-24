import { BigNumber } from "@0x/utils";
import * as _ from "lodash";
import { Asset } from "../domain/Asset";
import { TradeTokenKey } from "../domain/TradeTokenKey";

import { erc20Contract } from "../contracts/erc20";
import { iTokenContract } from "../contracts/iTokenContract";
import { pTokenContract } from "../contracts/pTokenContract";
import { ReferencePriceFeedContract } from "../contracts/ReferencePriceFeedContract";
import { TokenizedRegistryContract } from "../contracts/TokenizedRegistryContract";

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

interface ITokenContractInfo {
  token: string;
  asset: string;
  name: string;
  symbol: string;
  tokenType: BigNumber;
  index: BigNumber;
}

export class ContractsSource {
  private readonly provider: any;
  private tokenizedRegistryContract: TokenizedRegistryContract | null;

  private iTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();
  private pTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();

  private erc20Json: any;
  private iTokenJson: any;
  private pTokenJson: any;
  private ReferencePriceFeedJson: any;
  private TokenizedRegistryJson: any;

  public networkId: number;
  public canWrite: boolean;

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider;
    this.tokenizedRegistryContract = null;
    this.networkId = networkId;
    this.canWrite = canWrite;
  }

  public async Init() {
    this.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`);
    this.iTokenJson = await import(`./../assets/artifacts/${ethNetwork}/iToken.json`);
    this.pTokenJson = await import(`./../assets/artifacts/${ethNetwork}/pToken.json`);
    this.ReferencePriceFeedJson = await import(`./../assets/artifacts/${ethNetwork}/ReferencePriceFeed.json`);
    this.TokenizedRegistryJson = await import(`./../assets/artifacts/${ethNetwork}/TokenizedRegistry.json`);

    this.tokenizedRegistryContract = new TokenizedRegistryContract(
      this.TokenizedRegistryJson.abi,
      this.getTokenizedRegistryAddress().toLowerCase(),
      this.provider
    );

    const step = 100;
    const pos = 0;
    let next: ITokenContractInfo[] = [];
    // do {
    next = await this.tokenizedRegistryContract.getTokens.callAsync(
      new BigNumber(pos),
      new BigNumber(step),
      new BigNumber(0) // this loads all the tokens at once
    );

    // tslint:disable:no-console
    console.log(`--- start of token list ---`);
    next.forEach(e => {
      // tslint:disable:no-console
      console.log(e);
      if (e.tokenType.eq(1)) {
        this.iTokensContractInfos.set(e.symbol, e);
      } else if (e.tokenType.eq(2)) {
        this.pTokensContractInfos.set(e.symbol, e);
      }
    });
    // tslint:disable:no-console
    console.log(`--- end of token list ---`);
    //  pos += step;
    // } while (next.length > 0);

    /*pos = 0;
    next = [];
    do {
      next = await this.tokenizedRegistryContract.getTokens.callAsync(
        new BigNumber(pos),
        new BigNumber(step),
        new BigNumber(2)
      );
      next.forEach(e => {
        this.pTokensContractInfos.set(e.symbol, e);
      });
      pos += step;
    } while (next.length > 0);*/
  }

  private getTokenizedRegistryAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 3:
        address = "0xD3A04EC94B32Dc4EDBFc8D3bE4cd44850E6Df246";
        break;
      case 42:
        address = "0x730df5c1e0a4b6ba7a982a585c1ec55187fbb3ca";
        break;
    }

    return address;
  }

  private getReferencePriceFeedAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 3:
        address = "0x207056a6acB2727F834C9Bc987722B08628e5943";
        break;
      case 42:
        address = "0x325946B0ed8c5993E36BfCA1f218E22c2b10adf9";
        break;
    }

    return address;
  }

  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    return new erc20Contract(this.erc20Json.abi, addressErc20.toLowerCase(), this.provider);
  }

  private async getITokenContractRaw(asset: Asset): Promise<iTokenContract | null> {
    const tokenContractInfo = this.iTokensContractInfos.get(`i${asset}`) || null;
    return tokenContractInfo ? new iTokenContract(this.iTokenJson.abi, tokenContractInfo.token, this.provider) : null;
  }

  private async getPTokenContractRaw(key: TradeTokenKey): Promise<pTokenContract | null> {
    const tokenContractInfo = this.pTokensContractInfos.get(key.toString()) || null;
    return tokenContractInfo ? new pTokenContract(this.pTokenJson.abi, tokenContractInfo.token, this.provider) : null;
  }

  private async getReferencePriceFeedContractRaw(): Promise<ReferencePriceFeedContract> {
    return new ReferencePriceFeedContract(
      this.ReferencePriceFeedJson.abi,
      this.getReferencePriceFeedAddress().toLowerCase(),
      this.provider
    );
  }

  public getPTokensAvailable(): TradeTokenKey[] {
    const result = new Array<TradeTokenKey>();
    this.pTokensContractInfos.forEach(e => {
      const tradeTokenKey = TradeTokenKey.fromString(e.symbol);
      if (tradeTokenKey) {
        result.push(tradeTokenKey);
      }
    });

    return result;
  }

  public getITokenErc20Address(asset: Asset): string | null {
    const tokenContractInfo = this.iTokensContractInfos.get(`i${asset}`) || null;
    return tokenContractInfo ? tokenContractInfo.token : null;
  }

  public getPTokenErc20Address(key: TradeTokenKey): string | null {
    const tokenContractInfo = this.pTokensContractInfos.get(key.toString()) || null;
    return tokenContractInfo ? tokenContractInfo.token : null;
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw);
  public getITokenContract = _.memoize(this.getITokenContractRaw);
  public getPTokenContract = _.memoize(this.getPTokenContractRaw);
  public getReferencePriceFeedContract = _.memoize(this.getReferencePriceFeedContractRaw);
}
