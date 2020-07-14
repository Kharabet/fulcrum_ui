import * as _ from "lodash";
import { convertContract } from "../contracts/convert";
import { erc20Contract } from "../contracts/erc20";
import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

interface ITokenContractInfo {
  token: string;
  asset: string;
  name: string;
  symbol: string;
  index: BigNumber;
  version?: number;
}
export class ContractsSource {
  private readonly provider: any;
  private static iTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();

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
    const iTokenList = (await import(`../assets/artifacts/${ethNetwork}/iTokenList.js`)).iTokenList;
    iTokenList.forEach((val: any, index: any) => {
      // tslint:disable:no-console
      // console.log(val);
      const t = {
        token: val[1],
        asset: val[2],
        name: val[3],
        symbol: val[4],
        index: new BigNumber(index),
        version: parseInt(val[5], 10)
      };
      // tslint:disable:no-console
      // console.log(t);

      ContractsSource.iTokensContractInfos.set(val[4], t);
    });
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


  public getVBzrxAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "";
        break;
      case 3:
        address = "";
        break;
      case 4:
        address = "";
        break;
      case 42:
        address = "0x6F8304039f34fd6A6acDd511988DCf5f62128a32";
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

  public getITokenErc20Address(asset: Asset): string | null {
    let symbol;
    symbol = `i${asset}`;
    const tokenContractInfo = ContractsSource.iTokensContractInfos.get(symbol) || null;
    return tokenContractInfo ? tokenContractInfo.token : null;
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
