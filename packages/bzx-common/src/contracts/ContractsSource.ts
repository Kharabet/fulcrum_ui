import { BigNumber } from '@0x/utils'
import * as _ from 'lodash'
import Asset from '../assets/Asset'

import { DAppHelperContract } from './typescript-wrappers/DAppHelper'
import { erc20Contract } from './typescript-wrappers/erc20'
import { iBZxContract } from './typescript-wrappers/iBZxContract'
import { iTokenContract } from './typescript-wrappers/iTokenContract'
import { oracleContract } from './typescript-wrappers/oracle'
import AssetsDictionary from '../assets/AssetsDictionary'
import { cdpManagerContract } from './typescript-wrappers/cdpManager'
import { CompoundBridgeContract } from './typescript-wrappers/CompoundBridge'
import { CompoundComptrollerContract } from './typescript-wrappers/CompoundComptroller'
import { CTokenContract } from './typescript-wrappers/CToken'
import { dsProxyJsonContract } from './typescript-wrappers/dsProxyJson'
import { GetCdpsContract } from './typescript-wrappers/getCdps'
import { instaRegistryContract } from './typescript-wrappers/instaRegistry'
import { makerBridgeContract } from './typescript-wrappers/makerBridge'
import { proxyRegistryContract } from './typescript-wrappers/proxyRegistry'
import { saiToDAIBridgeContract } from './typescript-wrappers/saiToDaiBridge'
import { SoloContract } from './typescript-wrappers/solo'
import { SoloBridgeContract } from './typescript-wrappers/SoloBridge'
import { vatContract } from './typescript-wrappers/vat'
import { IKyberNetworkProxyContract } from './typescript-wrappers/IKyberNetworkProxy'
import { BZRXVestingTokenContract } from './typescript-wrappers/BZRXVestingToken'
import { ThreePoolContract } from './typescript-wrappers/ThreePool'
import { StakingV1Contract } from './typescript-wrappers/stakingV1'
import { HelperImplContract } from './typescript-wrappers/helper'
import { CompoundGovernorAlphaContract } from './typescript-wrappers/CompoundGovernorAlpha'

// @ts-ignore
import stakingV1Json from './artifacts/BUILD_APP_NETWORK/StakingV1.json'
// @ts-ignore
import iBZxJson from './artifacts/BUILD_APP_NETWORK/iBZx.json'
// @ts-ignore
import bzrxVestingJson from './artifacts/BUILD_APP_NETWORK/BZRXVestingToken.json'
// @ts-ignore
import HelperImplJson from './artifacts/BUILD_APP_NETWORK/HelperImpl.json'
// @ts-ignore
import compoundGovernorAlphaJson from './artifacts/BUILD_APP_NETWORK/CompoundGovernorAlpha.json'

const ibzxAddresses = new Map([
  [1, '0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f'],
  [3, '0xbe49f4cd73041cdf24a7b721627de577b3bab000'],
  [4, '0xc45755a7cfc9385290e6fece1f040c0453e7b0e5'],
  [42, '0x5cfba2639a3db0D9Cc264Aa27B2E6d134EeA486a']
])

const stakingV1Addresses = new Map([
  [1, '0xe95ebce2b02ee07def5ed6b53289801f7fc137a4'],
  [42, '0xE7eD6747FaC5360f88a2EFC03E00d25789F69291']
])

const vbzrxAddresses = new Map([
  [1, '0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F'],
  [42, '0x6F8304039f34fd6A6acDd511988DCf5f62128a32']
])

const governanceAddresses = new Map([
  [1, '0xc0dA01a04C3f3E0be433606045bB7017A7323E38'],
  [3, '0xc5bfed3bb38a3c4078d4f130f57ca4c560551d45']
])

const helperAddresses = new Map([[1, '0xFad79f3922cCef7AeB8A5674f36E45B6E81A10C7']])

const getNetworkNameById = (networkId: number): string => {
  let networkName
  switch (networkId) {
    case 1:
      networkName = 'mainnet'
      break
    case 3:
      networkName = 'ropsten'
      break
    case 4:
      networkName = 'rinkeby'
      break
    case 42:
      networkName = 'kovan'
      break
    default:
      networkName = 'local'
      break
  }
  return networkName
}

interface ITokenContractInfo {
  token: string
  asset: string
  name: string
  symbol: string
  index: BigNumber
  version?: number
}

export default class ContractsSource {
  private readonly provider: any

  private static isInit = false
  private static iTokenList: any

  private static iTokensContractInfos: Map<string, ITokenContractInfo> = new Map<
    string,
    ITokenContractInfo
  >()

  private erc20Json: any
  private iTokenJson: any
  private oracleJson: any
  private DAppHelperJson: any
  private IKyberNetworkProxyJson: any
  private iBZxJson: any

  private cdpsJson: any
  private compoundComptrollerJson: any
  private cTokenJson: any
  private compoundBridgeJson: any
  private soloJson: any
  private soloBridgeJson: any
  private vatJson: any
  private cdpJson: any
  private makerBridgeJson: any
  private proxyRegistryJson: any
  private dsProxyIsAllowJson: any
  private dsProxyJson: any
  private proxyMigrationsJson: any
  public saiToDAIBridgeJson: any
  public instaRegistryJson: any
  public bzrxVestingJson: any
  public threePoolJson: any

  public networkId: number
  public canWrite: boolean

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider
    this.networkId = networkId
    this.canWrite = canWrite
  }

  public async Init() {
    if (ContractsSource.isInit && this.erc20Json) {
      return
    }
    const networkName = getNetworkNameById(this.networkId)
    this.erc20Json = await import(`./artifacts/${networkName}/erc20.json`)
    this.iTokenJson = await import(`./artifacts/${networkName}/iToken.json`)
    this.oracleJson = await import(`./artifacts/${networkName}/oracle.json`)
    this.DAppHelperJson = await import(`./artifacts/${networkName}/DAppHelper.json`)
    this.IKyberNetworkProxyJson = await import(`./artifacts/${networkName}/IKyberNetworkProxy.json`)
    this.iBZxJson = await import(`./artifacts/${networkName}/iBZx.json`)

    this.cdpsJson = await import(`./artifacts/${networkName}/GetCdps.json`)
    this.compoundComptrollerJson = await import(
      `./artifacts/${networkName}/CompoundComptroller.json`
    )
    this.cTokenJson = await import(`./artifacts/${networkName}/CToken.json`)
    this.compoundBridgeJson = await import(`./artifacts/${networkName}/CompoundBridge.json`)
    this.soloJson = await import(`./artifacts/${networkName}/Solo.json`)
    this.soloBridgeJson = await import(`./artifacts/${networkName}/SoloBridge.json`)
    this.vatJson = await import(`./artifacts/${networkName}/vat.json`)
    this.cdpJson = await import(`./artifacts/${networkName}/cdpManager.json`)
    this.makerBridgeJson = await import(`./artifacts/${networkName}/makerBridge.json`)
    this.proxyRegistryJson = await import(`./artifacts/${networkName}/proxyRegistry.json`)
    this.dsProxyJson = await import(`./artifacts/${networkName}/dsProxyJson.json`)
    this.proxyMigrationsJson = await import(`./artifacts/${networkName}/proxyMigrations.json`)
    this.dsProxyIsAllowJson = await import(`./artifacts/${networkName}/dsProxyIsAllow.json`)
    this.saiToDAIBridgeJson = await import(`./artifacts/${networkName}/saiToDAIBridge.json`)
    this.instaRegistryJson = await import(`./artifacts/${networkName}/instaRegistry.json`)
    this.bzrxVestingJson = await import(`./artifacts/${networkName}/BZRXVestingToken.json`)
    this.threePoolJson = await import(`./artifacts/${networkName}/threePool.json`)

    ContractsSource.iTokenList = (
      await import(`./artifacts/${networkName}/iTokenList.js`)
    ).iTokenList

    ContractsSource.iTokenList.forEach((val: any, index: any) => {
      const t = {
        token: val[1],
        asset: val[2],
        name: val[3],
        symbol: val[4],
        index: new BigNumber(index),
        version: parseInt(val[5], 10)
      }

      ContractsSource.iTokensContractInfos.set(val[4], t)
    })

    ContractsSource.isInit = true
  }

  public getCompoundGovernorAlphaAddress(): string {
    return governanceAddresses.get(this.networkId) || ''
  }

  private getCompoundGovernorAlphaContractRaw(): CompoundGovernorAlphaContract {
    return new CompoundGovernorAlphaContract(
      compoundGovernorAlphaJson.abi,
      this.getCompoundGovernorAlphaAddress().toLowerCase(),
      this.provider
    )
  }

  public getStakingV1Address() {
    const address = stakingV1Addresses.get(this.networkId)
    if (!address) {
      throw new Error('getStakingV1Address')
    }
    return address
  }

  private async getStakingV1ContractRaw() {
    const address = stakingV1Addresses.get(this.networkId) || ''
    return new StakingV1Contract(stakingV1Json.abi, address, this.provider)
  }

  private async getBzrxVestingContractRaw() {
    const address = vbzrxAddresses.get(this.networkId) || ''
    return new BZRXVestingTokenContract(bzrxVestingJson.abi, address.toLowerCase(), this.provider)
  }

  public async getHelperContractRaw() {
    const address = helperAddresses.get(this.networkId) || ''
    return new HelperImplContract(HelperImplJson.abi, address.toLowerCase(), this.provider)
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

  public getBzrxVestingTokenAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F'
        break
      case 3:
        address = ''
        break
      case 4:
        address = ''
        break
      case 42:
        address = '0x6F8304039f34fd6A6acDd511988DCf5f62128a32'
        break
    }

    return address
  }

  public getBZxVaultAddress(): string {
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

  public getOracleAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x5AbC9e082Bf6e4F930Bbc79742DA3f6259c4aD1d'
        break
      case 3:
        address = '0x4330762418df3555ddd1d732200b317c9239b941'
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

  private getDAppHelperAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x3B55369bfeA51822eb3E85868c299E8127E13c56'
        break
      case 3:
        address = '0x2B2db1E0bDf6485C87Bc2DddEd17E7E3D9ba675E'
        break
      case 4:
        address = ''
        break
      case 42:
        address = '0xa40cDd78BFBe0E8ca643081Df43A45ED8C2C12bB'
        break
    }

    return address
  }

  private getIKyberNetworkProxyContractAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x9AAb3f75489902f3a48495025729a0AF77d4b11e'
        break
      case 3:
        address = '0xd719c34261e099Fdb33030ac8909d5788D3039C4'
        break
      case 4:
        address = '0x0d5371e5EE23dec7DF251A8957279629aa79E9C5'
        break
      case 42:
        address = '0xc153eeAD19e0DBbDb3462Dcc2B703cC6D738A37c'
        break
    }

    return address
  }

  private getThreePoolContractAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'
        break
      case 3:
        address = ''
        break
      case 4:
        address = ''
        break
      case 42:
        address = ''
        break
    }

    return address
  }

  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    await this.Init()
    return new erc20Contract(this.erc20Json.abi, addressErc20.toLowerCase(), this.provider)
  }

  private getITokenContractRaw(asset: Asset): iTokenContract | null {
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

  private async getDAppHelperContractRaw(): Promise<DAppHelperContract> {
    await this.Init()
    return new DAppHelperContract(
      this.DAppHelperJson.abi,
      this.getDAppHelperAddress().toLowerCase(),
      this.provider
    )
  }
  private async getIKyberNetworkProxyContractRaw(): Promise<IKyberNetworkProxyContract> {
    await this.Init()
    return new IKyberNetworkProxyContract(
      this.IKyberNetworkProxyJson.abi,
      this.getIKyberNetworkProxyContractAddress().toLowerCase(),
      this.provider
    )
  }

  public getITokenAddresses(assets: Asset[]): string[] {
    const result: string[] = []
    assets.forEach((e) => {
      result.push(this.getITokenErc20Address(e)!)
    })

    return result
  }

  public getITokenAddressesAndReduce(assets: Asset[]): [Asset[], string[]] {
    const assetList: Asset[] = []
    const addressList: string[] = []
    assets.forEach((e) => {
      const addr = this.getITokenErc20Address(e)!
      if (addr) {
        assetList.push(e)
        addressList.push(addr)
      }
    })
    return [assetList, addressList]
  }

  public getITokenByErc20Address(address: string): Asset {
    const iToken = ContractsSource.iTokenList.find(
      (e: any) => e[1].toLowerCase() === address.toLowerCase()
    )
    const asset = (iToken[4].substr(1) as Asset) || Asset.UNKNOWN
    return asset
  }

  public getITokenErc20Address(asset: Asset): string | null {
    let symbol
    if (asset === Asset.WETH) {
      symbol = `iETH`
    } else if (asset === Asset.CHAI) {
      symbol = `iDAI`
    } else {
      symbol = `i${asset}`
    }
    const tokenContractInfo = ContractsSource.iTokensContractInfos.get(symbol) || null
    return tokenContractInfo ? tokenContractInfo.token : null
  }

  private getAssetFromAddressRaw(addressErc20: string): Asset {
    const asset = Array.from(AssetsDictionary.assets.keys()).find((assetKey: Asset) => {
      const assetDetails = AssetsDictionary.assets.get(assetKey)
      return (
        assetDetails &&
        assetDetails.addressErc20.get(this.networkId) !== undefined &&
        assetDetails.addressErc20.get(this.networkId)!.toLowerCase() === addressErc20.toLowerCase()
      )
    })
    return asset ? asset : Asset.UNKNOWN
  }

  private getAddressFromAssetRaw(asset: Asset): string {
    const assetDetails = AssetsDictionary.assets.get(asset)
    const address = assetDetails?.addressErc20.get(this.networkId) || ''
    return address
  }

  private async getiBZxContractRaw() {
    const address = ibzxAddresses.get(this.networkId) || ''
    return new iBZxContract(iBZxJson.abi, address.toLowerCase(), this.provider)
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

  private async getThreePoolContractRaw() {
    return new ThreePoolContract(
      this.threePoolJson.abi,
      this.getThreePoolContractAddress().toLowerCase(),
      this.provider
    )
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

  public getErc20Contract = _.memoize(this.getErc20ContractRaw)
  public getITokenContract = _.memoize(this.getITokenContractRaw)
  public getOracleContract = _.memoize(this.getOracleContractRaw)
  public getDAppHelperContract = _.memoize(this.getDAppHelperContractRaw)
  public getIKyberNetworkProxyContract = _.memoize(this.getIKyberNetworkProxyContractRaw)
  public getAssetFromAddress = _.memoize(this.getAssetFromAddressRaw)
  public getiBZxContract = _.memoize(this.getiBZxContractRaw)
  public getAddressFromAsset = _.memoize(this.getAddressFromAssetRaw)

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
  public getAssetFromIlk = _.memoize(ContractsSource.getAssetFromIlkRaw)
  public getBzrxVestingContract = _.memoize(this.getBzrxVestingContractRaw)
  public getThreePoolContract = _.memoize(this.getThreePoolContractRaw)
  public getStakingV1Contract = _.memoize(this.getStakingV1ContractRaw)
  public getHelperContract = _.memoize(this.getHelperContractRaw)
  public getCompoundGovernorAlphaContract = _.memoize(this.getCompoundGovernorAlphaContractRaw)
}
