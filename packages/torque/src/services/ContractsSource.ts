import { BigNumber } from '@0x/utils'
import * as _ from 'lodash'

import { cdpManagerContract } from '../contracts/cdpManager'
import { CompoundBridgeContract } from '../contracts/CompoundBridge'
import { CompoundComptrollerContract } from '../contracts/CompoundComptroller'
import { CTokenContract } from '../contracts/CToken'
import { dsProxyJsonContract } from '../contracts/dsProxyJson'
import { erc20Contract } from '../contracts/erc20'
import { GetCdpsContract } from '../contracts/getCdps'
import { iBZxContract } from '../contracts/iBZxContract'
import { instaRegistryContract } from '../contracts/instaRegistry'
import { iTokenContract } from '../contracts/iTokenContract'
import { makerBridgeContract } from '../contracts/makerBridge'
import { oracleContract } from '../contracts/oracle'
import { proxyRegistryContract } from '../contracts/proxyRegistry'
import { saiToDAIBridgeContract } from '../contracts/saiToDaiBridge'
import { SoloContract } from '../contracts/solo'
import { SoloBridgeContract } from '../contracts/SoloBridge'
import { vatContract } from '../contracts/vat'

import { Asset } from '../domain/Asset'

const ethNetwork = process.env.REACT_APP_ETH_NETWORK

interface ITokenContractInfo {
  token: string
  asset: string
  name: string
  symbol: string
  index: BigNumber
  version?: number
}
export class ContractsSource {
  private readonly provider: any

  private static isInit = false

  private static iTokensContractInfos: Map<string, ITokenContractInfo> = new Map<
    string,
    ITokenContractInfo
  >()
  private erc20Json: any
  private cdpsJson: any
  private compoundComptrollerJson: any
  private cTokenJson: any
  private compoundBridgeJson: any
  private soloJson: any
  private soloBridgeJson: any
  private iBZxJson: any
  private iTokenJson: any
  private oracleJson: any
  private vatJson: any
  private cdpJson: any
  private makerBridgeJson: any
  private proxyRegistryJson: any
  private dsProxyIsAllowJson: any
  private dsProxyJson: any
  private proxyMigrationsJson: any
  public networkId: number
  public canWrite: boolean
  public saiToDAIBridgeJson: any
  public instaRegistryJson: any

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider
    this.networkId = networkId
    this.canWrite = canWrite
  }

  public getiBZxAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f'
        break
      case 3:
        address = '0xbe49f4cd73041cdf24a7b721627de577b3bab000'
        break
      case 4:
        address = '0xc45755a7cfc9385290e6fece1f040c0453e7b0e5'
        break
      case 42:
        address = '0x5cfba2639a3db0D9Cc264Aa27B2E6d134EeA486a'
        break
    }

    return address
  }

  public getVaultAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f'
        break
      case 3:
        address = '0xbab325bc2e78ea080f46c1a2bf9bf25f8a3c4d69'
        break
      case 4:
        address = '0xef52dd2d03d7a44f9dda8d450f806fa84571cf84'
        break
      case 42:
        address = '0x5cfba2639a3db0D9Cc264Aa27B2E6d134EeA486a'
        break
    }

    return address
  }

  private async getiBZxContractRaw(): Promise<iBZxContract> {
    await this.Init()
    return new iBZxContract(this.iBZxJson.abi, this.getiBZxAddress().toLowerCase(), this.provider)
  }

  private getOracleAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x5AbC9e082Bf6e4F930Bbc79742DA3f6259c4aD1d'
        break
      case 3:
        address = '0x115338e77339d64b3d58181aa9c0518df9d18022'
        break
      case 4:
        address = '0x76de3d406fee6c3316558406b17ff785c978e98c'
        break
      case 42:
        address = '0x17aEef301D3db36f79A4a9A2D05138148b22C200'
        break
    }

    return address
  }

  private getAssetFromAddressRaw(addressErc20: string): Asset {
    let asset: Asset = Asset.UNKNOWN

    addressErc20 = addressErc20.toLowerCase()

    switch (this.networkId) {
      case 1:
        // noinspection SpellCheckingInspection
        switch (addressErc20) {
          case '0x56d811088235f11c8920698a204a5010a788f4b3':
            asset = Asset.BZRX
            break
          case '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e':
            asset = Asset.YFI
            break
          case '0x80fb784b7ed66730e8b1dbd9820afd29931aab03':
            asset = Asset.LEND
            break
          case '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
            asset = Asset.WETH
            break
          case '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359':
            asset = Asset.SAI
            break
          case '0x6b175474e89094c44da98b954eedeac495271d0f':
            asset = Asset.DAI
            break
          case '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48':
            asset = Asset.USDC
            break
          case '0xdac17f958d2ee523a2206206994597c13d831ec7':
            asset = Asset.USDT
            break
          case '0x57ab1ec28d129707052df4df418d58a2d46d5f51':
            asset = Asset.SUSD
            break
          case '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599':
            asset = Asset.WBTC
            break
          case '0x514910771af9ca656af840dff83e8264ecf986ca':
            asset = Asset.LINK
            break
          case '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2':
            asset = Asset.MKR
            break
          case '0xe41d2489571d322189246dafa5ebde1f4699f498':
            asset = Asset.ZRX
            break
          case '0x0d8775f648430679a709e98d2b0cb6250d2887ef':
            asset = Asset.BAT
            break
          case '0x1985365e9f78359a9b6ad760e32412f4a445e862':
            asset = Asset.REP
            break
          case '0xdd974d5c2e2928dea5f71b9825b8b646686bd200':
            asset = Asset.KNC
            break
          case '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9':
            asset = Asset.AAVE
            break
          case '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984':
            asset = Asset.UNI
            break
          case '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd':
            asset = Asset.LRC
            break
          case '0xc00e94cb662c3520282e6f5717214004a7f26888':
            asset = Asset.COMP
            break
          case '0x0000000000004946c0e9f43f4dee607b0ef1fa1c':
            asset = Asset.CHI
            break
          case '0xB8c77482e45F1F44dE1745F52C74426C631bDD52':
            asset = Asset.BNB
            break
        }
        break
      case 3:
        switch (addressErc20) {
          case '0xc778417e063141139fce010982780140aa0cd5ab':
            asset = Asset.WETH
            break
          case '0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108':
            asset = Asset.DAI
            break
        }
        break
      case 4:
        switch (addressErc20) {
          case '0xc778417e063141139fce010982780140aa0cd5ab':
            asset = Asset.WETH
            break
          case '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea':
            asset = Asset.DAI
            break
          case '0x6e894660985207feb7cf89faf048998c71e8ee89':
            asset = Asset.REP
            break
        }
        break
      case 42:
        switch (addressErc20) {
          case '0xfbe16ba4e8029b759d3c5ef8844124893f3ae470':
            asset = Asset.fWETH
            break
          case '0xb443f30cdd6076b1a5269dbc08b774f222d4db4e':
            asset = Asset.USDC
            break
          case '0x5ae55494ccda82f1f7c653bc2b6ebb4ad3c77dac':
            asset = Asset.WBTC
            break
          case '0x0000000000004946c0e9f43f4dee607b0ef1fa1c':
            asset = Asset.CHI
            break
        }
        break
    }

    return asset
  }

  private getAddressFromAssetRaw(asset: Asset): string {
    let address: string = ''

    switch (this.networkId) {
      case 1:
        // noinspection SpellCheckingInspection
        switch (asset) {
          case Asset.ETH:
          case Asset.WETH:
            address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
            break
          case Asset.SAI:
            address = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
            break
          case Asset.DAI:
            address = '0x6b175474e89094c44da98b954eedeac495271d0f'
            break
          case Asset.USDC:
            address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
            break
          case Asset.SUSD:
            address = '0x57ab1ec28d129707052df4df418d58a2d46d5f51'
            break
          case Asset.WBTC:
            address = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
            break
          case Asset.LINK:
            address = '0x514910771af9ca656af840dff83e8264ecf986ca'
            break
          case Asset.MKR:
            address = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
            break
          case Asset.ZRX:
            address = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            break
          case Asset.BAT:
            address = '0x0d8775f648430679a709e98d2b0cb6250d2887ef'
            break
          case Asset.REP:
            address = '0x1985365e9f78359a9b6ad760e32412f4a445e862'
            break
          case Asset.KNC:
            address = '0xdd974d5c2e2928dea5f71b9825b8b646686bd200'
            break
          case Asset.CHI:
            address = '0x0000000000004946c0e9f43f4dee607b0ef1fa1c'
            break
          case Asset.YFI:
            address = '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e'
            break
          case Asset.USDT:
            address = '0xdac17f958d2ee523a2206206994597c13d831ec7'
            break
          case Asset.BZRX:
            address = '0x56d811088235F11C8920698a204A5010a788f4b3'
            break
          case Asset.LEND:
            address = '0x80fb784b7ed66730e8b1dbd9820afd29931aab03'
            break
          case Asset.UNI:
            address = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
            break
          case Asset.AAVE:
            address = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'
            break
          case Asset.LRC:
            address = '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd'
            break
          case Asset.COMP:
            address = '0xc00e94cb662c3520282e6f5717214004a7f26888'
            break
          case Asset.BNB:
            address = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
            break
        }
        break
      case 4:
        switch (asset) {
          case Asset.ETH:
          case Asset.WETH:
            address = '0xc778417e063141139fce010982780140aa0cd5ab'
            break
          case Asset.DAI:
            address = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea'
            break
          case Asset.REP:
            address = '0x6e894660985207feb7cf89faf048998c71e8ee89'
            break
        }
        break
      case 42:
        switch (asset) {
          case Asset.ETH:
          case Asset.WETH:
            address = '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
            break
          case Asset.SAI:
            address = '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
            break
          case Asset.DAI:
            address = '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa'
            break
          case Asset.USDC:
            address = '0x75b0622cec14130172eae9cf166b92e5c112faff'
            break
          case Asset.KNC:
            address = '0xad67cb4d63c9da94aca37fdf2761aadf780ff4a2'
            break
          case Asset.CHI:
            address = '0x0000000000004946c0e9f43f4dee607b0ef1fa1c'
            break
        }
        break
    }

    return address
  }

  private static getAssetFromIlkRaw(ilk: string): Asset {
    const hex = ilk.toString() // force conversion
    let str = ''
    for (let i = 0; i < hex.length && hex.substr(i, 2) !== '00'; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    const symbol = str.split('-')[0].substring(1)
    // @ts-ignore
    return Asset[symbol]
  }

  private async getiTokenContractRaw(asset: Asset): Promise<iTokenContract | null> {
    await this.Init()
    let symbol
    if (asset === Asset.WETH) {
      symbol = `iETH`
    } else if (asset === Asset.CHAI) {
      symbol = `iDAI`
    } else {
      symbol = `i${asset}`
    }
    const tokenContractInfo = ContractsSource.iTokensContractInfos.get(symbol) || null
    return tokenContractInfo
      ? new iTokenContract(this.iTokenJson.abi, tokenContractInfo.token, this.provider)
      : null
  }

  private async getOracleContractRaw(): Promise<oracleContract> {
    await this.Init()
    return new oracleContract(
      this.oracleJson.abi,
      this.getOracleAddress().toLowerCase(),
      this.provider
    )
  }

  private getCompoundComptrollerAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b'
        break
      case 42:
        address = '0x1f5D7F3CaAC149fE41b8bd62A3673FE6eC0AB73b'
        break
    }
    return address
  }

  private async getCompoundComptrollerContractRaw(): Promise<CompoundComptrollerContract> {
    await this.Init()
    return new CompoundComptrollerContract(
      this.compoundComptrollerJson.abi,
      this.getCompoundComptrollerAddress().toLowerCase(),
      this.provider
    )
  }

  private async getCTokenContractRaw(address: string): Promise<CTokenContract> {
    await this.Init()
    return new CTokenContract(this.cTokenJson.abi, address.toLowerCase(), this.provider)
  }

  private getSoloAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x1e0447b19bb6ecfdae1e4ae1694b0c3659614e4e'
        break
      case 42:
        address = '0x4EC3570cADaAEE08Ae384779B0f3A45EF85289DE'
        break
    }
    return address
  }

  private async getSoloContractRaw(): Promise<SoloContract> {
    await this.Init()
    return new SoloContract(this.soloJson.abi, this.getSoloAddress().toLowerCase(), this.provider)
  }

  private static getSoloMarketRaw(asset: Asset): number {
    switch (asset) {
      case Asset.WETH:
        return 0
      case Asset.DAI:
        return 1
      case Asset.SAI:
        return 1
      case Asset.USDC:
        return 2
      default:
        return -1
    }
  }

  private getCompoundBridgeAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '' // TODO
        break
      case 42:
        address = '0xF8F41d2E18B0200cF655fe4094E3dB7D622b9eC3' // "0x3A4a525d6B4609A9d01B156eEB9B7FCD3df2D37c";
        break
    }
    return address
  }

  private async getCompoundBridgeContractRaw(): Promise<CompoundBridgeContract> {
    await this.Init()
    return new CompoundBridgeContract(
      this.compoundBridgeJson.abi,
      this.getCompoundBridgeAddress().toLowerCase(),
      this.provider
    )
  }

  private getSoloBridgeAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '' // TODO
        break
      case 42:
        address = '0xc0307024fEBCAA79af9f1155b1A45FDfFbA41B03'
        break
    }
    return address
  }

  private async getSoloBridgeContractRaw(): Promise<SoloBridgeContract> {
    await this.Init()
    return new SoloBridgeContract(
      this.soloBridgeJson.abi,
      this.getSoloBridgeAddress().toLowerCase(),
      this.provider
    )
  }

  public async Init() {
    if (ContractsSource.isInit && this.erc20Json) {
      return
    }
    const network = ethNetwork || '1'
    this.erc20Json = await import(`./../assets/artifacts/${network}/erc20.json`)
    this.cdpsJson = await import(`./../assets/artifacts/${network}/GetCdps.json`)
    this.compoundComptrollerJson = await import(
      `./../assets/artifacts/${network}/CompoundComptroller.json`
    )
    this.cTokenJson = await import(`./../assets/artifacts/${network}/CToken.json`)
    this.compoundBridgeJson = await import(`./../assets/artifacts/${network}/CompoundBridge.json`)
    this.soloJson = await import(`./../assets/artifacts/${network}/Solo.json`)
    this.soloBridgeJson = await import(`./../assets/artifacts/${network}/SoloBridge.json`)
    this.iBZxJson = await import(`./../assets/artifacts/${network}/iBZx.json`)
    this.iTokenJson = await import(`./../assets/artifacts/${network}/iToken.json`)
    this.oracleJson = await import(`./../assets/artifacts/${network}/oracle.json`)
    this.vatJson = await import(`./../assets/artifacts/${network}/vat.json`)
    this.cdpJson = await import(`./../assets/artifacts/${network}/cdpManager.json`)
    this.makerBridgeJson = await import(`./../assets/artifacts/${network}/makerBridge.json`)
    this.proxyRegistryJson = await import(`./../assets/artifacts/${network}/proxyRegistry.json`)
    this.dsProxyJson = await import(`./../assets/artifacts/${network}/dsProxyJson.json`)
    this.proxyMigrationsJson = await import(`./../assets/artifacts/${network}/proxyMigrations.json`)
    this.dsProxyIsAllowJson = await import(`./../assets/artifacts/${network}/dsProxyIsAllow.json`)
    this.saiToDAIBridgeJson = await import(`./../assets/artifacts/${network}/saiToDAIBridge.json`)
    this.instaRegistryJson = await import(`./../assets/artifacts/${network}/instaRegistry.json`)
    const iTokenList = (await import(`../assets/artifacts/${ethNetwork}/iTokenList.js`)).iTokenList

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
      }
      // tslint:disable:no-console
      // console.log(t);

      ContractsSource.iTokensContractInfos.set(val[4], t)
    })
    ContractsSource.isInit = true
  }

  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    await this.Init()
    return new erc20Contract(this.erc20Json.abi, addressErc20.toLowerCase(), this.provider)
  }

  private async getCdpContractRaw(addressCdp: string): Promise<GetCdpsContract> {
    await this.Init()
    return new GetCdpsContract(this.cdpsJson.abi, addressCdp.toLowerCase(), this.provider)
  }

  private async getVatContractRaw(addressVat: string): Promise<vatContract> {
    await this.Init()
    return new vatContract(this.vatJson.abi, addressVat.toLowerCase(), this.provider)
  }

  private async getCdpManagerRaw(addressCdp: string): Promise<cdpManagerContract> {
    await this.Init()
    return new cdpManagerContract(this.cdpJson.abi, addressCdp.toLowerCase(), this.provider)
  }

  private async getMakerBridgeRaw(address: string): Promise<makerBridgeContract> {
    await this.Init()
    return new makerBridgeContract(this.makerBridgeJson.abi, address.toLowerCase(), this.provider)
  }

  private async getProxyRegistryRaw(address: string): Promise<proxyRegistryContract> {
    await this.Init()
    return new proxyRegistryContract(
      this.proxyRegistryJson.abi,
      address.toLowerCase(),
      this.provider
    )
  }

  private async getDsProxyRaw(address: string): Promise<dsProxyJsonContract> {
    await this.Init()
    return new dsProxyJsonContract(this.dsProxyJson.abi, address.toLowerCase(), this.provider)
  }

  private async getSaiToDaiBridgeRaw(address: string): Promise<saiToDAIBridgeContract> {
    await this.Init()
    return new saiToDAIBridgeContract(
      this.saiToDAIBridgeJson.abi,
      address.toLowerCase(),
      this.provider
    )
  }

  private async getInstaRegistryRaw(address: string): Promise<instaRegistryContract> {
    await this.Init()
    return new instaRegistryContract(
      this.instaRegistryJson.abi,
      address.toLowerCase(),
      this.provider
    )
  }

  private async getDsProxyAllowJSON() {
    return this.dsProxyIsAllowJson
  }

  private async getProxyMigrationJSON() {
    return this.proxyMigrationsJson
  }

  public getProxyMigration = _.memoize(this.getProxyMigrationJSON)
  public dsProxyAllowJson = _.memoize(this.getDsProxyAllowJSON)
  public getInstaRegistry = _.memoize(this.getInstaRegistryRaw)
  public getSaiToDaiBridge = _.memoize(this.getSaiToDaiBridgeRaw)
  public getProxyRegistry = _.memoize(this.getProxyRegistryRaw)
  public getDsProxy = _.memoize(this.getDsProxyRaw)
  public getMakerBridge = _.memoize(this.getMakerBridgeRaw)
  public getCdpManager = _.memoize(this.getCdpManagerRaw)
  public getVatContract = _.memoize(this.getVatContractRaw)
  public getCdpContract = _.memoize(this.getCdpContractRaw)
  public getCompoundComptrollerContract = _.memoize(this.getCompoundComptrollerContractRaw)
  public getCTokenContract = _.memoize(this.getCTokenContractRaw)
  public getCompoundBridgeContract = _.memoize(this.getCompoundBridgeContractRaw)
  public getSoloContract = _.memoize(this.getSoloContractRaw)
  public getSoloBridgeContract = _.memoize(this.getSoloBridgeContractRaw)
  public getSoloMarket = _.memoize(ContractsSource.getSoloMarketRaw)
  public getErc20Contract = _.memoize(this.getErc20ContractRaw)
  public getiBZxContract = _.memoize(this.getiBZxContractRaw)
  public getiTokenContract = _.memoize(this.getiTokenContractRaw)
  public getAssetFromAddress = _.memoize(this.getAssetFromAddressRaw)
  public getAssetFromIlk = _.memoize(ContractsSource.getAssetFromIlkRaw)
  public getAddressFromAsset = _.memoize(this.getAddressFromAssetRaw)
  public getOracleContract = _.memoize(this.getOracleContractRaw)
}
