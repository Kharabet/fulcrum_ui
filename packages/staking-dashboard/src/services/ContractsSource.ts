import _ from 'lodash'
import { BZRXStakingInterimContract } from '../contracts/BZRXStakingInterim'
import { erc20Contract } from '../contracts/erc20'
import { iBZxContract } from '../contracts/iBZxContract'
import { oracleContract } from '../contracts/oracle'
import { StakingV1Contract } from '../contracts/stakingV1'
// @ts-ignore
import erc20Json from '../assets/artifacts/BUILD_APP_NETWORK/erc20.json'
// @ts-ignore
import BZRXStakingInterimJson from '../assets/artifacts/BUILD_APP_NETWORK/BZRXStakingInterim.json'
// @ts-ignore
import stakingV1Json from '../assets/artifacts/BUILD_APP_NETWORK/stakingV1.json'
// @ts-ignore
import iBZxJson from '../assets/artifacts/BUILD_APP_NETWORK/iBZx.json'
// @ts-ignore
import oracleJson from '../assets/artifacts/BUILD_APP_NETWORK/oracle.json'

export class ContractsSource {
  private readonly provider: any
  private static BZRXStakingInterimJson = BZRXStakingInterimJson
  private static erc20Json = erc20Json
  private static iBZxJson = iBZxJson
  private static oracleJson = oracleJson
  private static stakingV1Json = stakingV1Json

  public networkId: number
  public canWrite: boolean

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider
    this.networkId = networkId
    this.canWrite = canWrite
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

  public getStakingV1Address(): string {
    let address: string = ''
    switch (this.networkId) {
      case 1:
        address = '0xE7eD6747FaC5360f88a2EFC03E00d25789F69291'
        break
      case 3:
        address = ''
        break
      case 4:
        address = ''
        break
      case 42:
        address = '0xE7eD6747FaC5360f88a2EFC03E00d25789F69291'
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

  private getErc20ContractRaw(addressErc20: string): erc20Contract {
    return new erc20Contract(
      ContractsSource.erc20Json.abi,
      addressErc20.toLowerCase(),
      this.provider
    )
  }

  private getOracleContractRaw(): oracleContract {
    return new oracleContract(
      ContractsSource.oracleJson.abi,
      this.getOracleAddress().toLowerCase(),
      this.provider
    )
  }

  private getStakingV1ContractRaw(): StakingV1Contract {
    return new StakingV1Contract(
      ContractsSource.stakingV1Json.abi,
      this.getStakingV1Address().toLowerCase(),
      this.provider
    )
  }

  private getBZRXStakingInterimContractRaw(): BZRXStakingInterimContract {
    return new BZRXStakingInterimContract(
      ContractsSource.BZRXStakingInterimJson.abi,
      this.getBZRXStakingInterimAddress().toLowerCase(),
      this.provider
    )
  }

  private getiBZxContractRaw(): iBZxContract {
    return new iBZxContract(
      ContractsSource.iBZxJson.abi,
      this.getiBZxAddress().toLowerCase(),
      this.provider
    )
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw)
  public getBZRXStakingInterimContract = _.memoize(this.getBZRXStakingInterimContractRaw)
  public getiBZxContract = _.memoize(this.getiBZxContractRaw)
  public getOracleContract = _.memoize(this.getOracleContractRaw)
  public getStakingV1Contract = _.memoize(this.getStakingV1ContractRaw)
}
