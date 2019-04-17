import { BigNumber } from "@0x/utils";
import * as _ from "lodash";
import { Provider } from "web3/providers";
import { Asset } from "../domain/Asset";
import { TradeTokenKey } from "../domain/TradeTokenKey";

import { iTokenContract } from "../contracts/iTokenContract";
import { pTokenContract } from "../contracts/pTokenContract";
import { TokenizedRegistryContract } from "../contracts/TokenizedRegistryContract";

import iTokenJson from "./../assets/artifacts/kovan/iToken.json";
import pTokenJson from "./../assets/artifacts/kovan/pToken.json";

interface ITokenContractInfo {
  token: string;
  asset: string;
  name: string;
  symbol: string;
  tokenType: BigNumber;
  index: BigNumber;
}

export class ContractsSource {
  private readonly provider: Provider;
  private readonly tokenizedRegistryContract: TokenizedRegistryContract;
  private readonly networkName: string;

  private iTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();
  private pTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();

  public constructor(provider: Provider, networkName: string) {
    this.provider = provider;
    this.tokenizedRegistryContract = new TokenizedRegistryContract(provider);
    this.networkName = networkName;
  }

  public async Init() {
    const step = 100;
    let pos = 0;
    let next: ITokenContractInfo[] = [];
    do {
      next = await this.tokenizedRegistryContract.getTokens.callAsync(
        new BigNumber(pos),
        new BigNumber(step),
        new BigNumber(1)
      );
      next.forEach(e => {
        this.iTokensContractInfos.set(e.symbol, e);
      });
      pos += step;
    } while (next.length > 0);

    pos = 0;
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
    } while (next.length > 0);
  }

  private getITokenContractRaw(asset: Asset): iTokenContract | null {
    const tokenContractInfo = this.iTokensContractInfos.get(`i${asset}`) || null;
    return tokenContractInfo ? new iTokenContract(iTokenJson.abi, tokenContractInfo.token, this.provider) : null;
  }

  private getPTokenContractRaw(key: TradeTokenKey): pTokenContract | null {
    const tokenContractInfo = this.pTokensContractInfos.get(key.toString()) || null;
    return tokenContractInfo ? new pTokenContract(pTokenJson.abi, tokenContractInfo.token, this.provider) : null;
  }

  public getITokenContract = _.memoize(this.getITokenContractRaw);
  public getPTokenContract = _.memoize(this.getPTokenContractRaw);
}
