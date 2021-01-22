import _ from 'lodash'
import { erc20Contract } from '../contracts/erc20'
import { iBZxContract } from '../contracts/iBZxContract'
import { StakingV1Contract } from '../contracts/stakingV1'
import { BZRXVestingTokenContract } from '../contracts/BZRXVestingToken'
import { HelperImplContract } from '../contracts/helper'
// @ts-ignore
import erc20Json from '../assets/artifacts/BUILD_APP_NETWORK/erc20.json'
// @ts-ignore
import stakingV1Json from '../assets/artifacts/BUILD_APP_NETWORK/stakingV1.json'
// @ts-ignore
import iBZxJson from '../assets/artifacts/BUILD_APP_NETWORK/iBZx.json'
// @ts-ignore
import bzrxVestingJson from '../assets/artifacts/BUILD_APP_NETWORK/BZRXVestingToken.json'
// @ts-ignore
import HelperImplJson from '../assets/artifacts/BUILD_APP_NETWORK/HelperImpl.json'

const ibzxAddresses = new Map([
  [1, '0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f'],
  [3, '0xbe49f4cd73041cdf24a7b721627de577b3bab000'],
  [4, '0xc45755a7cfc9385290e6fece1f040c0453e7b0e5'],
  [42, '0x5cfba2639a3db0D9Cc264Aa27B2E6d134EeA486a']
])

const stakingV1Addresses = new Map([
  [1, '0xE7eD6747FaC5360f88a2EFC03E00d25789F69291'],
  [42, '0xE7eD6747FaC5360f88a2EFC03E00d25789F69291']
])

const vbzrxAddresses = new Map([
  [1, '0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F'],
  [42, '0x6F8304039f34fd6A6acDd511988DCf5f62128a32']
])

const helperAddresses = new Map([[1, '0xFad79f3922cCef7AeB8A5674f36E45B6E81A10C7']])

export default class ContractsSource {
  private readonly provider: any
  public networkId: number
  public canWrite: boolean

  public constructor(provider: any, networkId: number, canWrite: boolean) {
    this.provider = provider
    this.networkId = networkId
    this.canWrite = canWrite
  }

  public getStakingV1Address () {
    const address = stakingV1Addresses.get(this.networkId)
    if (!address) {
      throw new Error('getStakingV1Address')
    }
    return address
  }

  private async getErc20ContractRaw(addressErc20: string) {
    return new erc20Contract(erc20Json.abi, addressErc20.toLowerCase(), this.provider)
  }

  private async getStakingV1ContractRaw() {
    const address = stakingV1Addresses.get(this.networkId) || ''
    return new StakingV1Contract(stakingV1Json.abi, address, this.provider)
  }

  private async getiBZxContractRaw() {
    const address = ibzxAddresses.get(this.networkId) || ''
    return new iBZxContract(iBZxJson.abi, address.toLowerCase(), this.provider)
  }

  private async getBzrxVestingContractRaw() {
    const address = vbzrxAddresses.get(this.networkId) || ''
    return new BZRXVestingTokenContract(bzrxVestingJson.abi, address.toLowerCase(), this.provider)
  }

  public async getHelperContractRaw() {
    const address = helperAddresses.get(this.networkId) || ''
    return new HelperImplContract(HelperImplJson.abi, address.toLowerCase(), this.provider)
  }

  public getErc20Contract = _.memoize(this.getErc20ContractRaw)
  public getiBZxContract = _.memoize(this.getiBZxContractRaw)
  public getStakingV1Contract = _.memoize(this.getStakingV1ContractRaw)
  public getBzrxVestingContract = _.memoize(this.getBzrxVestingContractRaw)
  public getHelperContract = _.memoize(this.getHelperContractRaw)
}
