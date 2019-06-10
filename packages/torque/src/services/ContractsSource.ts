import * as _ from "lodash";

import { erc20Contract } from "../contracts/erc20";

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export class ContractsSource {
  private readonly provider: any;

  private erc20Json: any;

  public networkId: number;
  public canWrite: boolean;

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider;
    this.networkId = networkId;
    this.canWrite = canWrite;
  }

  public async Init() {
    this.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`);
  }

  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    return new erc20Contract(this.erc20Json.abi, addressErc20.toLowerCase(), this.provider);
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw);
}
