import _ from 'lodash'
import { erc20Contract } from '../contracts/erc20'
import { iBZxContract } from '../contracts/iBZxContract'
import { StakingV1Contract } from '../contracts/stakingV1'
import { BZRXVestingTokenContract } from '../contracts/BZRXVestingToken'
// @ts-ignore
import erc20Json from '../assets/artifacts/BUILD_APP_NETWORK/erc20.json'
// @ts-ignore
import stakingV1Json from '../assets/artifacts/BUILD_APP_NETWORK/stakingV1.json'
// @ts-ignore
import iBZxJson from '../assets/artifacts/BUILD_APP_NETWORK/iBZx.json'
// @ts-ignore
import bzrxVestingJson from '../assets/artifacts/BUILD_APP_NETWORK/BZRXVestingToken.json'

export class ContractsSource {
  private readonly provider: any
  public networkId: number
  public canWrite: boolean

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

  public getVBZRXAddress(): string {
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

  private async getErc20ContractRaw(addressErc20: string) {
    return new erc20Contract(
      erc20Json.abi,
      addressErc20.toLowerCase(),
      this.provider
    )
  }

  private async getStakingV1ContractRaw() {
    return new StakingV1Contract(
      stakingV1Json.abi,
      this.getStakingV1Address().toLowerCase(),
      this.provider
    )
  }

  private async getiBZxContractRaw() {
    return new iBZxContract(
      iBZxJson.abi,
      this.getiBZxAddress().toLowerCase(),
      this.provider
    )
  }

  private async getBzrxVestingContractRaw() {
    return new BZRXVestingTokenContract(
      bzrxVestingJson.abi,
      this.getVBZRXAddress().toLowerCase(),
      this.provider
    )
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw)
  public getiBZxContract = _.memoize(this.getiBZxContractRaw)
  public getStakingV1Contract = _.memoize(this.getStakingV1ContractRaw)
  public getBzrxVestingContract = _.memoize(this.getBzrxVestingContractRaw)
}
