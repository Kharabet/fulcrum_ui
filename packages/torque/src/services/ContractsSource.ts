import * as _ from "lodash";

import { erc20Contract } from "../contracts/erc20";
import { iBZxContract } from "../contracts/iBZxContract";

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export class ContractsSource {
  private readonly provider: any;

  private erc20Json: any;
  private iBZxJson: any;

  public networkId: number;
  public canWrite: boolean;

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider;
    this.networkId = networkId;
    this.canWrite = canWrite;
  }

  private getiBZxAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 42:
        address = "0x9009e85a687b55b5d6C314363C228803fAd32d01";
        break;
    }

    return address;
  }

  private async getiBZxContractRaw(): Promise<iBZxContract> {
    return new iBZxContract(
      this.iBZxJson.abi,
      this.getiBZxAddress().toLowerCase(),
      this.provider
    );
  }

  public async Init() {
    this.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`);
    this.iBZxJson = await import(`./../assets/artifacts/${ethNetwork}/iBZx.json`);
  }

  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    return new erc20Contract(this.erc20Json.abi, addressErc20.toLowerCase(), this.provider);
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw);
  public getiBZxContract = _.memoize(this.getiBZxContractRaw);
}
