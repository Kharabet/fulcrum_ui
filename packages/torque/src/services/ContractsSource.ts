import * as _ from "lodash";

import { erc20Contract } from "../contracts/erc20";
import { iBZxContract } from "../contracts/iBZxContract";
import { iENSOwnerContract } from "../contracts/iENSOwnerContract";
import { iTokenContract } from "../contracts/iTokenContract";
import { oracleContract } from "../contracts/oracle";
import { Asset } from "../domain/Asset";

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export class ContractsSource {
  private readonly provider: any;

  private erc20Json: any;
  private iBZxJson: any;
  private iTokenJson: any;
  private oracleJson: any;
  private iENSJson: any;

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
      case 1:
        address = "0x1cf226e9413addaf22412a2e182f9c0de44af002";
        break;
      case 42:
        address = "0x9009e85a687b55b5d6C314363C228803fAd32d01";
        break;
    }

    return address;
  }

  public getVaultAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633";
        break;
      case 3:
        address = "";
        break;
      case 42:
        address = "";
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

  private getiTokenAddress(asset: Asset): string {
    let address: string = "";
    switch (asset) {
      case Asset.ETH:
      case Asset.WETH:
        switch (this.networkId) {
          case 1:
            address = "0x77f973fcaf871459aa58cd81881ce453759281bc";
            break;
          case 42:
            address = "0x54be07007c680ba087b3fcd8e675d1c929b6aaf5";
            break;
        }
        break;
      case Asset.DAI:
        switch (this.networkId) {
          case 1:
            address = "0x14094949152eddbfcd073717200da82fed8dc960";
            break;
          case 42:
            address = "0xa1e58f3b1927743393b25f261471e1f2d3d9f0f6";
            break;
        }
        break;
      case Asset.BAT:
        switch (this.networkId) {
          case 1:
            address = "0xA8b65249DE7f85494BC1fe75F525f568aa7dfa39";
            break;
          case 42:
            address = "";
            break;
        }
        break;
      case Asset.KNC:
        switch (this.networkId) {
          case 1:
            address = "0x1cC9567EA2eB740824a45F8026cCF8e46973234D";
            break;
          case 42:
            address = "";
            break;
        }
        break;
      case Asset.LINK:
        switch (this.networkId) {
          case 1:
            address = "0x1D496da96caf6b518b133736beca85D5C4F9cBc5";
            break;
          case 42:
            address = "";
            break;
        }
        break;
      case Asset.MKR:
        switch (this.networkId) {
          case 1:
            address = "";
            break;
          case 42:
            address = "";
            break;
        }
        break;
      case Asset.REP:
        switch (this.networkId) {
          case 1:
            address = "0xBd56E9477Fc6997609Cf45F84795eFbDAC642Ff1";
            break;
        }
        break;
      case Asset.USDC:
        switch (this.networkId) {
          case 1:
            address = "0xf013406a0b1d544238083df0b93ad0d2cbe0f65f";
            break;
        }
        break;
      case Asset.WBTC:
        switch (this.networkId) {
          case 1:
            address = "0xBA9262578EFef8b3aFf7F60Cd629d6CC8859C8b5";
            break;
        }
        break;        
      case Asset.ZRX:
        switch (this.networkId) {
          case 1:
            address = "0xA7Eb2bc82df18013ecC2A6C533fc29446442EDEe";
            break;
        }
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
      case 42:
        address = "0x692f391bCc85cefCe8C237C01e1f636BbD70EA4D";
        break;
    }

    return address;
  }

  private getiENSOwnerAddress(): string {
    let address: string = "";
    switch (this.networkId) {
      case 1:
        address = "0x100157a893503b3b27112ab602f8d80e6d0df9a8";
        break;
    }

    return address;
  }

  private getAssetFromAddressRaw(addressErc20: string): Asset {
    let asset: Asset = Asset.UNKNOWN;

    switch (this.networkId) {
      case 1:
        switch (addressErc20) {
          case "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2":
            asset = Asset.WETH;
            break;
          case "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359":
            asset = Asset.DAI;
            break;
          case "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48":
            asset = Asset.USDC;
            break;
        }
        break;
      case 42:
        switch (addressErc20) {
          case "0xd0a1e359811322d97991e03f863a0c30c2cf029c":
            asset = Asset.WETH;
            break;
          case "0xc4375b7de8af5a38a93548eb8453a498222c4ff2":
            asset = Asset.DAI;
            break;
        }
        break;
    }

    return asset;
  }

  private async getiTokenContractRaw(asset: Asset): Promise<iTokenContract> {
    return new iTokenContract(
      this.iTokenJson.abi,
      this.getiTokenAddress(asset).toLowerCase(),
      this.provider
    );
  }

  private async getOracleContractRaw(): Promise<oracleContract> {
    return new oracleContract(
      this.oracleJson.abi,
      this.getOracleAddress().toLowerCase(),
      this.provider
    );
  }

  private async getiENSOwnerContractRaw(): Promise<iENSOwnerContract> {
    return new iENSOwnerContract(
      this.iENSJson.abi,
      this.getiENSOwnerAddress().toLowerCase(),
      this.provider
    );
  }

  public async Init() {
    this.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`);
    this.iBZxJson = await import(`./../assets/artifacts/${ethNetwork}/iBZx.json`);
    this.iTokenJson = await import(`./../assets/artifacts/${ethNetwork}/iToken.json`);
    this.oracleJson = await import(`./../assets/artifacts/${ethNetwork}/oracle.json`);
    this.iENSJson = await import(`./../assets/artifacts/${ethNetwork}/iENSOwner.json`);
  }

  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    return new erc20Contract(this.erc20Json.abi, addressErc20.toLowerCase(), this.provider);
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw);
  public getiBZxContract = _.memoize(this.getiBZxContractRaw);
  public getiTokenContract = _.memoize(this.getiTokenContractRaw);
  public getAssetFromAddress = _.memoize(this.getAssetFromAddressRaw);
  public getOracleContract = _.memoize(this.getOracleContractRaw);
  public getiENSOwnerContract = _.memoize(this.getiENSOwnerContractRaw);
}
