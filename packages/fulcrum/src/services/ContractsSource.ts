import { BigNumber } from "@0x/utils";
import * as _ from "lodash";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { TradeTokenKey } from "../domain/TradeTokenKey";

import { erc20Contract } from "../contracts/erc20";
import { iTokenContract } from "../contracts/iTokenContract";
import { oracleContract } from "../contracts/oracle";
import { pTokenContract } from "../contracts/pTokenContract";
import { DAppHelperContract } from "../contracts/DAppHelper";
import { iBZxContract } from "../contracts/iBZxContract";

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

  private static iTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();
  private static pTokensContractInfos: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();
  private static pTokensContractInfosBurnOnly: Map<string, ITokenContractInfo> = new Map<string, ITokenContractInfo>();

  private static erc20Json: any;
  private static iTokenJson: any;
  private static pTokenJson: any;
  private static oracleJson: any;
  private static mcdBridgeJson: any;
  private static DAppHelperJson: any;
  private static iBZxJson: any;

  public networkId: number;
  public canWrite: boolean;

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    console.log("init source with canwrite: " + canWrite)
    this.provider = provider;
    this.networkId = networkId;
    this.canWrite = canWrite;
  }

  public async Init() {
    if (ContractsSource.isInit) {
      return;
    }
    ContractsSource.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`);
    ContractsSource.iTokenJson = await import(`./../assets/artifacts/${ethNetwork}/iToken.json`);
    ContractsSource.pTokenJson = await import(`./../assets/artifacts/${ethNetwork}/pToken.json`);
    ContractsSource.oracleJson = await import(`./../assets/artifacts/${ethNetwork}/oracle.json`);
    ContractsSource.DAppHelperJson = await import(`./../assets/artifacts/${ethNetwork}/DAppHelper.json`);
    ContractsSource.iBZxJson = await import(`./../assets/artifacts/${ethNetwork}/iBZx.json`);



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

      ContractsSource.iTokensContractInfos.set(val[4], t);
    });

    // tslint:disable:no-console
    // console.log(`--- start of token list ---`);
    pTokenList.forEach((val: any, index: any) => {
      // tslint:disable:no-console
      // console.log(val);

      const version = parseInt(val.version, 10);

      let baseAsset;
      if (val.direction === "SHORT") {
        baseAsset = version === 2 ? val.unit : val.asset;
      } else {
        baseAsset = version === 2 ? val.asset : val.unit;
      }

      const t = {
        token: val.address,
        asset: AssetsDictionary.assets.get(baseAsset)!.addressErc20.get(this.networkId)!,
        name: val.symbol,
        symbol: val.symbol,
        index: new BigNumber(index),
        version: version
      };
      // tslint:disable:no-console
      // console.log(t);

      ContractsSource.pTokensContractInfos.set(val.symbol, t);
    });
    // console.log(ContractsSource.pTokensContractInfos);

    // tslint:disable:no-console
    // console.log(`--- start of token list ---`);
    pTokenListBurnOnly.forEach((val: any, index: any) => {
      // tslint:disable:no-console
      // console.log(val);

      const version = parseInt(val.version, 10);

      let baseAsset;
      if (val.direction === "SHORT") {
        baseAsset = version === 2 ? val.unit : val.asset;
      } else {
        baseAsset = version === 2 ? val.asset : val.unit;
      }

      const t = {
        token: val.address,
        asset: AssetsDictionary.assets.get(baseAsset)!.addressErc20.get(this.networkId)!,
        name: val.symbol,
        symbol: val.symbol,
        index: new BigNumber(index),
        version: version
      };
      // tslint:disable:no-console
      // console.log(t);

      ContractsSource.pTokensContractInfosBurnOnly.set(val.symbol, t);
    });
    // console.log(ContractsSource.pTokensContractInfosBurnOnly);

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

  public getiBZxAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f";
        break;
      case 3:
        address = "0xbe49f4cd73041cdf24a7b721627de577b3bab000";
        break;
      case 4:
        address = "0xc45755a7cfc9385290e6fece1f040c0453e7b0e5";
        break;
      case 42:
        address = "0x5cfba2639a3db0D9Cc264Aa27B2E6d134EeA486a";
        break;
    }

    return address;
  }

  public getBZxVaultAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f";
        break;
      case 3:
        address = "0xbab325bc2e78ea080f46c1a2bf9bf25f8a3c4d69";
        break;
      case 4:
        address = "0xef52dd2d03d7a44f9dda8d450f806fa84571cf84";
        break;
      case 42:
        address = "0x5cfba2639a3db0D9Cc264Aa27B2E6d134EeA486a";
        break;
    }

    return address;
  }

  public getOracleAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0xaaA601aE20077F9fae80494DDC36BB39C952c2d0";
        break;
      case 3:
        address = "0x4330762418df3555ddd1d732200b317c9239b941";
        break;
      case 4:
        address = "0x76de3d406fee6c3316558406b17ff785c978e98c";
        break;
      case 42:
        address = "0x2F27c07D888751109753533BF299ea5813A6479D";
        break;
    }

    return address;
  }


  private getDAppHelperAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0x3B55369bfeA51822eb3E85868c299E8127E13c56";
        break;
      case 3:
        address = "0x2B2db1E0bDf6485C87Bc2DddEd17E7E3D9ba675E";
        break;
      case 4:
        address = "";
        break;
      case 42:
        address = "0xa40cDd78BFBe0E8ca643081Df43A45ED8C2C12bB";
        break;
    }

    return address;
  }


  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    await this.Init();
    return new erc20Contract(ContractsSource.erc20Json.abi, addressErc20.toLowerCase(), this.provider);
  }


  private async getITokenContractRaw(asset: Asset): Promise<iTokenContract | null> {
    await this.Init();
    let symbol;
    if (asset === Asset.WETH) {
      symbol = `iETH`;
    } else if (asset === Asset.CHAI) {
      symbol = `iDAI`;
    } else {
      symbol = `i${asset}`;
    }
    const tokenContractInfo = ContractsSource.iTokensContractInfos.get(symbol) || null;
    return tokenContractInfo ? new iTokenContract(ContractsSource.iTokenJson.abi, tokenContractInfo.token, this.provider) : null;
  }

  private async getPTokenContractRaw(key: TradeTokenKey): Promise<pTokenContract | null> {
    await this.Init();
    let tokenContractInfo = ContractsSource.pTokensContractInfos.get(key.toString()) || null;
    if (tokenContractInfo === null) {
      tokenContractInfo = ContractsSource.pTokensContractInfosBurnOnly.get(key.toString()) || null;
    }
    return tokenContractInfo ? new pTokenContract(ContractsSource.pTokenJson.abi, tokenContractInfo.token, this.provider) : null;
  }

  private async getOracleContractRaw(): Promise<oracleContract> {
    await this.Init();
    return new oracleContract(
      ContractsSource.oracleJson.abi,
      this.getOracleAddress().toLowerCase(),
      this.provider
    );
  }

  private async getDAppHelperContractRaw(): Promise<DAppHelperContract> {
    await this.Init();
    return new DAppHelperContract(
      ContractsSource.DAppHelperJson.abi,
      this.getDAppHelperAddress().toLowerCase(),
      this.provider
    );
  }


  public getPTokensAvailable(): TradeTokenKey[] {
    const result = new Array<TradeTokenKey>();
    ContractsSource.pTokensContractInfos.forEach(e => {
      const tradeTokenKey = TradeTokenKey.fromString(e.symbol);
      if (tradeTokenKey) {
        result.push(tradeTokenKey);
      }
    });
    ContractsSource.pTokensContractInfosBurnOnly.forEach(e => {
      const tradeTokenKey = TradeTokenKey.fromString(e.symbol);
      if (tradeTokenKey) {
        result.push(tradeTokenKey);
      }
    });

    return result;
  }

  public getITokenAddresses(assets: Asset[]): string[] {
    const result: string[] = [];
    assets.forEach(e => {
      result.push(this.getITokenErc20Address(e)!);
    });

    return result;
  }

  public getITokenAddressesAndReduce(assets: Asset[]): [Asset[], string[]] {
    const assetList: Asset[] = [];
    const addressList: string[] = [];
    assets.forEach(e => {
      let addr = this.getITokenErc20Address(e)!;
      if (addr) {
        assetList.push(e);
        addressList.push(addr!);
      }
    });
    // console.log(assetList, addressList);

    return [assetList, addressList];
  }

  public getITokenErc20Address(asset: Asset): string | null {
    let symbol;
    if (asset === Asset.WETH) {
      symbol = `iETH`;
    } else if (asset === Asset.CHAI) {
      symbol = `iDAI`;
    } else {
      symbol = `i${asset}`;
    }
    const tokenContractInfo = ContractsSource.iTokensContractInfos.get(symbol) || null;
    return tokenContractInfo ? tokenContractInfo.token : null;
  }

  public getPTokenErc20Address(key: TradeTokenKey): string | null {
    let tokenContractInfo = ContractsSource.pTokensContractInfos.get(key.toString()) || null;
    if (tokenContractInfo === null) {
      tokenContractInfo = ContractsSource.pTokensContractInfosBurnOnly.get(key.toString()) || null;
    }
    return tokenContractInfo ? tokenContractInfo.token : null;
  }
  
  private getAssetFromAddressRaw(addressErc20: string): Asset {
    let asset: Asset = Asset.UNKNOWN;

    addressErc20 = addressErc20.toLowerCase();

    switch (this.networkId) {
      case 1:
        // noinspection SpellCheckingInspection
        switch (addressErc20) {
          case "0x77f973FCaF871459aa58cd81881Ce453759281bC":
            asset = Asset.ETHv1;
            break;
          case "0x56d811088235f11c8920698a204a5010a788f4b3":
            asset = Asset.BZRX;
            break;
          case "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e":
            asset = Asset.YFI;
            break;
          case "0x80fb784b7ed66730e8b1dbd9820afd29931aab03":
            asset = Asset.LEND;
            break;
          case "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2":
            asset = Asset.ETH;
            break;
          case "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359":
            asset = Asset.SAI;
            break;
          case "0x6b175474e89094c44da98b954eedeac495271d0f":
            asset = Asset.DAI;
            break;
          case "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48":
            asset = Asset.USDC;
            break;
          case "0xdac17f958d2ee523a2206206994597c13d831ec7":
            asset = Asset.USDT;
            break;
          case "0x57ab1ec28d129707052df4df418d58a2d46d5f51":
            asset = Asset.SUSD;
            break;
          case "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599":
            asset = Asset.WBTC;
            break;
          case "0x514910771af9ca656af840dff83e8264ecf986ca":
            asset = Asset.LINK;
            break;
          case "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2":
            asset = Asset.MKR;
            break;
          case "0xe41d2489571d322189246dafa5ebde1f4699f498":
            asset = Asset.ZRX;
            break;
          case "0x0d8775f648430679a709e98d2b0cb6250d2887ef":
            asset = Asset.BAT;
            break;
          case "0x1985365e9f78359a9b6ad760e32412f4a445e862":
            asset = Asset.REP;
            break;
          case "0xdd974d5c2e2928dea5f71b9825b8b646686bd200":
            asset = Asset.KNC;
            break;
          case "0x0000000000004946c0e9f43f4dee607b0ef1fa1c":
            asset = Asset.CHI;
            break;
        }
        break;
      case 3:
        switch (addressErc20) {
          case "0xc778417e063141139fce010982780140aa0cd5ab":
            asset = Asset.WETH;
            break;
          case "0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108":
            asset = Asset.DAI;
            break;
        }
        break;
      case 4:
        switch (addressErc20) {
          case "0xc778417e063141139fce010982780140aa0cd5ab":
            asset = Asset.WETH;
            break;
          case "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea":
            asset = Asset.DAI;
            break;
          case "0x6e894660985207feb7cf89faf048998c71e8ee89":
            asset = Asset.REP;
            break;
        }
        break;
      case 42:
        /*switch (addressErc20) {
          case "0xd0a1e359811322d97991e03f863a0c30c2cf029c":
            asset = Asset.ETH;
            break;
          case "0xc4375b7de8af5a38a93548eb8453a498222c4ff2":
            asset = Asset.SAI;
            break;
          case "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa":
            asset = Asset.DAI;
            break;
          case "0x75b0622cec14130172eae9cf166b92e5c112faff":
            asset = Asset.USDC;
            break;
          case "0xad67cb4d63c9da94aca37fdf2761aadf780ff4a2":
            asset = Asset.KNC;
            break;
        }*/
        switch (addressErc20) {
          case "0xfbe16ba4e8029b759d3c5ef8844124893f3ae470":
            asset = Asset.fWETH;
            break;
          case "0x7143e05608c4bc7e83a3b72a28de2497f62b7e59":
            asset = Asset.SAI;
            break;
          case "0x8f746ec7ed5cc265b90e7af0f5b07b4406c9dda8":
            asset = Asset.DAI;
            break;
          case "0xb443f30cdd6076b1a5269dbc08b774f222d4db4e":
            asset = Asset.USDC;
            break;
          case "0x4c4462c6bca4c92bf41c40f9a4047f35fd296996":
            asset = Asset.USDT;
            break;
          case "0xfcfa14dbc71bee2a2188431fa15e1f8d57d93c62":
            asset = Asset.SUSD;
            break;
          case "0x5ae55494ccda82f1f7c653bc2b6ebb4ad3c77dac":
            asset = Asset.WBTC;
            break;
          case "0xfb9325e5f4fc9629525427a1c92c0f4d723500cf":
            asset = Asset.LINK;
            break;
          case "0x4893919982648ffefe4324538d54402387c20198":
            asset = Asset.MKR;
            break;
          case "0x629b28c5aa5c953df2511d2e48d316a07eafb3e3":
            asset = Asset.ZRX;
            break;
          case "0xac091ccf1b0c601182f3ccf3eb20f291aba39029":
            asset = Asset.BAT;
            break;
          case "0x39ac2818e08d285abe548f77a0819651b8b5d213":
            asset = Asset.REP;
            break;
          case "0x02357164ba33f299f7654cbb29da29db38ae1f44":
            asset = Asset.KNC;
            break;
          case "0x0000000000004946c0e9f43f4dee607b0ef1fa1c":
            asset = Asset.CHI;
            break;
        }
        break;
    }

    return asset;
  }

  private async getiBZxContractRaw(): Promise<iBZxContract> {
    await this.Init();
    return new iBZxContract(
      ContractsSource.iBZxJson.abi,
      this.getiBZxAddress().toLowerCase(),
      this.provider
    );
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw);
  public getITokenContract = _.memoize(this.getITokenContractRaw);
  public getPTokenContract = _.memoize(this.getPTokenContractRaw);
  public getOracleContract = _.memoize(this.getOracleContractRaw);
  public getDAppHelperContract = _.memoize(this.getDAppHelperContractRaw);
  public getAssetFromAddress = _.memoize(this.getAssetFromAddressRaw);
  public getiBZxContract = _.memoize(this.getiBZxContractRaw);
}
