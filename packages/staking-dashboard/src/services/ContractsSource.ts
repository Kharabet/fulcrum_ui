import * as _ from 'lodash'
import { convertContract } from '../contracts/convert'
import { erc20Contract } from '../contracts/erc20'
import { BZRXStakingInterimContract } from '../contracts/BZRXStakingInterim'
import { BigNumber } from '@0x/utils'
import { traderCompensationContract } from '../contracts/traderCompensation'
import { iBZxContract } from '../contracts/iBZxContract'

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

  private static convertJson: any
  private static erc20Json: any
  private static BZRXStakingInterimJson: any
  private static traderCompensation: any
  private static iBZxJson: any
  private static oracleJson: any

  public networkId: number
  public canWrite: boolean
  public saiToDAIBridgeJson: any

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider
    this.networkId = networkId
    this.canWrite = canWrite
  }

  public async Init() {
    if (ContractsSource.isInit) {
      return
    }
    ContractsSource.convertJson = await import(`./../assets/artifacts/${ethNetwork}/convert.json`)
    ContractsSource.erc20Json = await import(`./../assets/artifacts/${ethNetwork}/erc20.json`)
    ContractsSource.BZRXStakingInterimJson = await import(
      `./../assets/artifacts/${ethNetwork}/BZRXStakingInterim.json`
    )
    ContractsSource.traderCompensation = await import(
      `./../assets/artifacts/${ethNetwork}/traderCompensation.json`
    )
    ContractsSource.iBZxJson = await import(`./../assets/artifacts/${ethNetwork}/iBZx.json`)
    ContractsSource.oracleJson = await import(`./../assets/artifacts/${ethNetwork}/oracle.json`)

    ContractsSource.isInit = true
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

  public getBzrxV1Address(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x1c74cFF0376FB4031Cd7492cD6dB2D66c3f2c6B9'
        break
      case 3:
        address = ''
        break
      case 4:
        address = ''
        break
      case 42:
        address = '0xe3e682A8Fc7EFec410E4099cc09EfCC0743C634a'
        break
    }
    return address
  }

  public getBzrxAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x56d811088235F11C8920698a204A5010a788f4b3'
        break
      case 3:
        address = ''
        break
      case 4:
        address = ''
        break
      case 42:
        address = '0xB54Fc2F2ea17d798Ad5C7Aba2491055BCeb7C6b2'
        break
    }
    return address
  }

  public getVBzrxAddress(): string {
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

  public getConvertAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x266732e2fC94227C4EE5EC0E8394E1c05709f7DF'
        break
      case 3:
        address = ''
        break
      case 4:
        address = ''
        break
      case 42:
        address = '0x6E7E8545BF1182695d5095D005Fdb1C0D46EB0b3'
        break
    }
    return address
  }

  public getBZRXStakingInterimAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0x576773CD0B51294997Ec4E4ff96c93d5E3AE9038'
        break
      case 3:
        address = ''
        break
      case 4:
        address = ''
        break
      case 42:
        address = '0xe5E888586Da6B5D05071ff387c646Ce6F907b293'
        break
    }
    return address
  }

  public getTraderCompensationAddress(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0xeAC0b322Dc88cF708608B3FFAe1e9fB484A6A542'
        break
      case 3:
        address = ''
        break
      case 4:
        address = ''
        break
      case 42:
        address = '0x11603cD5eEf6B308339d97e5428a085A2c4D4c08'
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

  private async getConvertContractRaw(): Promise<convertContract> {
    await this.Init()
    return new convertContract(
      ContractsSource.convertJson.abi,
      this.getConvertAddress().toLowerCase(),
      this.provider
    )
  }

  private async getOracleContractRaw(): Promise<oracleContract> {
    await this.Init()
    return new oracleContract(
      ContractsSource.oracleJson.abi,
      this.getOracleAddress().toLowerCase(),
      this.provider
    )
  }

  private async getBZRXStakingInterimContractRaw(): Promise<BZRXStakingInterimContract> {
    await this.Init()
    return new BZRXStakingInterimContract(
      ContractsSource.BZRXStakingInterimJson.abi,
      this.getBZRXStakingInterimAddress().toLowerCase(),
      this.provider
    )
  }

  private async getTraderCompensationContractRaw(): Promise<traderCompensationContract> {
    await this.Init()
    return new traderCompensationContract(
      ContractsSource.traderCompensation.abi,
      this.getTraderCompensationAddress().toLowerCase(),
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

  public getErc20Contract = _.memoize(this.getErc20ContractRaw)
  public getTraderCompensationContract = _.memoize(this.getTraderCompensationContractRaw)
  public getConvertContract = _.memoize(this.getConvertContractRaw)
  public getBZRXStakingInterimContract = _.memoize(this.getBZRXStakingInterimContractRaw)
  public getiBZxContract = _.memoize(this.getiBZxContractRaw)
  public getOracleContract = _.memoize(this.getOracleContractRaw)
}
