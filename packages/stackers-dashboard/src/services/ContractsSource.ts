import * as _ from "lodash";
import { convertContract } from "../contracts/convert";
import { erc20Contract } from "../contracts/erc20";

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export class ContractsSource {
  private readonly provider: any;

  private static isInit = false;

  private static convertJson: any;
  private static erc20Json: any;
  public networkId: number;
  public canWrite: boolean;
  public saiToDAIBridgeJson: any;

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider;
    this.networkId = networkId;
    this.canWrite = canWrite;
  }

  public async Init() {
    if (ContractsSource.isInit) {
      return;
    }
    ContractsSource.convertJson = await import(`./../assets/artifacts/${ethNetwork}/convert.json`);
    ContractsSource.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`);

    ContractsSource.isInit = true;
  }

  
  public getBzrxV1Address(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0x1c74cFF0376FB4031Cd7492cD6dB2D66c3f2c6B9";
        break;
      case 3:
        address = "";
        break;
      case 4:
        address = "";
        break;
      case 42:
        address = "0xe3e682A8Fc7EFec410E4099cc09EfCC0743C634a";
        break;
    }
    return address;
  }
  
  public getBzrxAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0x56d811088235F11C8920698a204A5010a788f4b3";
        break;
      case 3:
        address = "";
        break;
      case 4:
        address = "";
        break;
      case 42:
        address = "0xB54Fc2F2ea17d798Ad5C7Aba2491055BCeb7C6b2";
        break;
    }
    return address;
  }
  
  public getConvertAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0x266732e2fC94227C4EE5EC0E8394E1c05709f7DF";
        break;
      case 3:
        address = "";
        break;
      case 4:
        address = "";
        break;
      case 42:
        address = "0x6E7E8545BF1182695d5095D005Fdb1C0D46EB0b3";
        break;
    }
    return address;
  }

  
  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    await this.Init();
    return new erc20Contract(ContractsSource.erc20Json.abi, addressErc20.toLowerCase(), this.provider);
  }

  private async getConvertContractRaw(): Promise<convertContract> {
    await this.Init();
    return new convertContract(
      ContractsSource.convertJson.abi,
      this.getConvertAddress().toLowerCase(),
      this.provider
    );
  }
  public getErc20Contract = _.memoize(this.getErc20ContractRaw);

  public getConvertContract = _.memoize(this.getConvertContractRaw);

}
