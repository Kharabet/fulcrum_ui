import { BigNumber } from '@0x/utils'
import * as _ from 'lodash'
import { Asset } from '../domain/Asset'

import { erc20Contract } from '../contracts/erc20'
import { DAppHelperContract } from '../contracts/DAppHelper'
import { iBZxContract } from '../contracts/iBZxContract'
import { iTokenContract } from '../contracts/iTokenContract'
import { oracleContract } from '../contracts/oracle'

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

  private static erc20Json: any
  private static iTokenJson: any
  private static iBZxJson: any
  private static oracleJson: any
  private static DAppHelperJson: any

  private static iTokenList: any

  public networkId: number
  public canWrite: boolean

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider
    this.networkId = networkId
    this.canWrite = canWrite
  }
  public async Init() {
    if (ContractsSource.isInit) {
      return
    }

    ContractsSource.iTokenJson = await import(`./../assets/artifacts/${ethNetwork}/iToken.json`)
    ContractsSource.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`)
    ContractsSource.iBZxJson = await import(`./../assets/artifacts/${ethNetwork}/iBZx.json`)
    ContractsSource.oracleJson = await import(`./../assets/artifacts/${ethNetwork}/oracle.json`)
    ContractsSource.DAppHelperJson = await import(
      `./../assets/artifacts/${ethNetwork}/DAppHelper.json`
    )

    ContractsSource.iTokenList = (
      await import(`../assets/artifacts/${ethNetwork}/iTokenList.js`)
    ).iTokenList

    ContractsSource.iTokenList.forEach((val: any, index: any) => {
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

  private async getITokenContractRaw(asset: Asset): Promise<iTokenContract | null> {
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
      ? new iTokenContract(ContractsSource.iTokenJson.abi, tokenContractInfo.token, this.provider)
      : null
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
  private async getErc20ContractRaw(addressErc20: string): Promise<erc20Contract> {
    await this.Init()
    return new erc20Contract(
      ContractsSource.erc20Json.abi,
      addressErc20.toLowerCase(),
      this.provider
    )
  }

  public getITokenByErc20Address(address: string): Asset {
    let result = Asset.UNKNOWN

    //@ts-ignore
    result = ContractsSource.iTokenList
      .filter((e: any) => e[1].toLowerCase() === address.toLowerCase())[0][4]
      .substr(1) as Asset
    return result
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
  private async getOracleContractRaw(): Promise<oracleContract> {
    await this.Init()
    return new oracleContract(
      ContractsSource.oracleJson.abi,
      this.getOracleAddress().toLowerCase(),
      this.provider
    )
  }
  private async getiBZxContractRaw(): Promise<iBZxContract> {
    await this.Init()
    return new iBZxContract(
      ContractsSource.iBZxJson.abi,
      this.getiBZxAddress().toLowerCase(),
      this.provider
    )
  }

  private async getDAppHelperContractRaw(): Promise<DAppHelperContract> {
    await this.Init()
    return new DAppHelperContract(
      ContractsSource.DAppHelperJson.abi,
      this.getDAppHelperAddress().toLowerCase(),
      this.provider
    )
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw)
  public getAssetFromAddress = _.memoize(this.getAssetFromAddressRaw)
  public getITokenContract = _.memoize(this.getITokenContractRaw)
  public getiBZxContract = _.memoize(this.getiBZxContractRaw)
  public getOracleContract = _.memoize(this.getOracleContractRaw)
  public getDAppHelperContract = _.memoize(this.getDAppHelperContractRaw)
}
