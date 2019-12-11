import { BigNumber } from "@0x/utils";
import * as _ from "lodash";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { TradeTokenKey } from "../domain/TradeTokenKey";

import { erc20Contract } from "../contracts/erc20";
import { FulcrumMcdBridgeContract } from "../contracts/FulcrumMcdBridgeContract";
import { iTokenContract } from "../contracts/iTokenContract";
import { oracleContract } from "../contracts/oracle";
import { pTokenContract } from "../contracts/pTokenContract";

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

  private static isInit = false;

  private iTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();
  private pTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();
  private pTokensContractInfosBurnOnly: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();

  private erc20Json: any;
  private iTokenJson: any;
  private pTokenJson: any;
  private oracleJson: any;
  private mcdBridgeJson: any;

  public networkId: number;
  public canWrite: boolean;

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider;
    this.networkId = networkId;
    this.canWrite = canWrite;
  }

  public async Init() {
    if (ContractsSource.isInit) {
      return;
    }
    this.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`);
    this.iTokenJson = await import(`./../assets/artifacts/${ethNetwork}/iToken.json`);
    this.pTokenJson = await import(`./../assets/artifacts/${ethNetwork}/pToken.json`);
    this.oracleJson = await import(`./../assets/artifacts/${ethNetwork}/oracle.json`);
    this.mcdBridgeJson = await import(`./../assets/artifacts/${ethNetwork}/FulcrumMcdBridge.json`);
    
    const iTokenList = (await import(`../assets/artifacts/${ethNetwork}/iTokenList.js`)).iTokenList;
    const pTokenList = (await import(`../assets/artifacts/${ethNetwork}/pTokenList.js`)).pTokenList;
    const pTokenListBurnOnly = (await import(`../assets/artifacts/${ethNetwork}/pTokenListBurnOnly.js`)).pTokenListBurnOnly;


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

      this.iTokensContractInfos.set(val[4], t);
    });

    // tslint:disable:no-console
    // console.log(`--- start of token list ---`);
    pTokenList.forEach((val: any, index: any) => {
      // tslint:disable:no-console
      // console.log(val);

      const version = parseInt(val["version"], 10);

      let baseAsset;      
      if (val["direction"] === "SHORT") {
        baseAsset = version === 2 ? val["unit"] : val["asset"];
      } else {
        baseAsset = version === 2 ? val["asset"] : val["unit"];
      }

      const t = {
        token: val["address"],
        asset: AssetsDictionary.assets.get(baseAsset)!.addressErc20.get(this.networkId)!,
        name: val["symbol"],
        symbol: val["symbol"],
        index: new BigNumber(index),
        version: version
      };
      // tslint:disable:no-console
      // console.log(t);

      this.pTokensContractInfos.set(val["symbol"], t);
    });
    // console.log(this.pTokensContractInfos);

    // tslint:disable:no-console
    // console.log(`--- start of token list ---`);
    pTokenListBurnOnly.forEach((val: any, index: any) => {
      // tslint:disable:no-console
      // console.log(val);

      const version = parseInt(val["version"], 10);

      let baseAsset;      
      if (val["direction"] === "SHORT") {
        baseAsset = version === 2 ? val["unit"] : val["asset"];
      } else {
        baseAsset = version === 2 ? val["asset"] : val["unit"];
      }

      const t = {
        token: val["address"],
        asset: AssetsDictionary.assets.get(baseAsset)!.addressErc20.get(this.networkId)!,
        name: val["symbol"],
        symbol: val["symbol"],
        index: new BigNumber(index),
        version: version
      };
      // tslint:disable:no-console
      // console.log(t);

      this.pTokensContractInfosBurnOnly.set(val["symbol"], t);
    });
    // console.log(this.pTokensContractInfosBurnOnly);

    // tslint:disable:no-console
    console.log(`Loaded ${iTokenList.length} Fulcrum iTokens.`);

    // tslint:disable:no-console
    console.log(`Loaded ${pTokenList.length + pTokenListBurnOnly.length} Fulcrum pTokens.`);

    ContractsSource.isInit = true;
  }

  /*private getTokenizedRegistryAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0xd8dc30d298ccf40042991cb4b96a540d8affe73a";
        break;
      case 3:
        address = "0xd03eea21041a19672e451bcbb413ce8be72d0381";
        break;
      case 4:
        address = "";
        break;
      case 42:
        address = "0xF1C87dD61BF8a4e21978487e2705D52AA687F97E";
        break;
    }

    return address;
  }*/

  public getBZxVaultAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633";
        break;
      case 3:
        address = "0xbab325bc2e78ea080f46c1a2bf9bf25f8a3c4d69";
        break;
      case 4:
        address = "0xef52dd2d03d7a44f9dda8d450f806fa84571cf84";
        break;
      case 42:
        address = "0xce069b35ae99762bee444c81dec1728aa99afd4b";
        break;
    }

    return address;
  }

  private getOracleAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0xee14de2e67e1ec23c8561a6fad2635ff1b618db6";
        break;
      case 3:
        address = "0x818e6fecd516ecc3849daf6845e3ec868087b755";
        break;
      case 4:
        address = "0x76de3d406fee6c3316558406b17ff785c978e98c";
        break;
      case 42:
        address = "0x692f391bCc85cefCe8C237C01e1f636BbD70EA4D";
        break;
    }

    return address;
  }

  private getFulcrumMcdBridgeAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0x512b9ad4764cc18f6ce414d0df2ecc00fe9481ee";
        break;
      case 3:
        address = "";
        break;
      case 4:
        address = "";
        break;
      case 42:
        address = "0xe6d0007423D5085D37306BA4657123989E9E2880";
        break;
    }

    return address;
  }
  

  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    await this.Init();
    return new erc20Contract(this.erc20Json.abi, addressErc20.toLowerCase(), this.provider);
  }


  private async getITokenContractRaw(asset: Asset): Promise<iTokenContract | null> {
    await this.Init();
    const symbol = asset === Asset.WETH ? `iETH` : `i${asset}`
    const tokenContractInfo = this.iTokensContractInfos.get(symbol) || null;
    return tokenContractInfo ? new iTokenContract(this.iTokenJson.abi, tokenContractInfo.token, this.provider) : null;
  }

  private async getPTokenContractRaw(key: TradeTokenKey): Promise<pTokenContract | null> {
    await this.Init();
    let tokenContractInfo = this.pTokensContractInfos.get(key.toString()) || null;
    if (tokenContractInfo === null) {
      tokenContractInfo = this.pTokensContractInfosBurnOnly.get(key.toString()) || null;
    }
    return tokenContractInfo ? new pTokenContract(this.pTokenJson.abi, tokenContractInfo.token, this.provider) : null;
  }

  private async getOracleContractRaw(): Promise<oracleContract> {
    await this.Init();
    return new oracleContract(
      this.oracleJson.abi,
      this.getOracleAddress().toLowerCase(),
      this.provider
    );
  }

  private async getFulcrumMcdBridgeContractRaw(): Promise<FulcrumMcdBridgeContract> {
    await this.Init();
    return new FulcrumMcdBridgeContract(
      this.mcdBridgeJson.abi,
      this.getFulcrumMcdBridgeAddress().toLowerCase(),
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
    this.pTokensContractInfosBurnOnly.forEach(e => {
      const tradeTokenKey = TradeTokenKey.fromString(e.symbol);
      if (tradeTokenKey) {
        result.push(tradeTokenKey);
      }
    });

    return result;
  }

  public getPTokenAddresses(): string[] {
    const result: string[] = [];
    this.pTokensContractInfos.forEach(e => {
      result.push(e.token);
    });
    this.pTokensContractInfosBurnOnly.forEach(e => {
      result.push(e.token);
    });

    return result;
  }

  public getITokenErc20Address(asset: Asset): string | null {
    const tokenContractInfo = this.iTokensContractInfos.get(`i${asset}`) || null;
    return tokenContractInfo ? tokenContractInfo.token : null;
  }

  public getPTokenErc20Address(key: TradeTokenKey): string | null {
    let tokenContractInfo = this.pTokensContractInfos.get(key.toString()) || null;
    if (tokenContractInfo === null) {
      tokenContractInfo = this.pTokensContractInfosBurnOnly.get(key.toString()) || null;
    }
    return tokenContractInfo ? tokenContractInfo.token : null;
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw);
  public getITokenContract = _.memoize(this.getITokenContractRaw);
  public getPTokenContract = _.memoize(this.getPTokenContractRaw);
  public getOracleContract = _.memoize(this.getOracleContractRaw);
  public getFulcrumMcdBridgeContract = _.memoize(this.getFulcrumMcdBridgeContractRaw);
}
