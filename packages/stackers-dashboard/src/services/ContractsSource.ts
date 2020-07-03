import * as _ from "lodash";


const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export class ContractsSource {
  private readonly provider: any;

  private static isInit = false;

  private erc20Json: any;
  public networkId: number;
  public canWrite: boolean;
  public saiToDAIBridgeJson: any;

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider;
    this.networkId = networkId;
    this.canWrite = canWrite;
  }

  public async Init() {
    if (ContractsSource.isInit && this.erc20Json) {
      return;
    }
    const network = ethNetwork || "1";
    ContractsSource.isInit = true;
  }
}
