import { BigNumber } from '@0x/utils'

export default class ProposalCreated {
  public static readonly topic0: string =  "0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0"
  public readonly id: BigNumber
  public readonly proposer: string
  public readonly targets: string[]
  public readonly values: BigNumber[]
  public readonly signatures: string[]
  public readonly callDatas: string[]
  public readonly startBlock: BigNumber
  public readonly endBlock: BigNumber
  public readonly description: string
  constructor(
    id: BigNumber,
    proposer: string,
    targets: string[],
    values: BigNumber[],
    signatures: string[],
    callDatas: string[],
    startBlock: BigNumber,
    endBlock: BigNumber,
    description: string
  ) {
    this.id = id
    this.proposer = proposer
    this.targets = targets
    this.values = values
    this.signatures = signatures
    this.callDatas = callDatas
    this.startBlock = startBlock
    this.endBlock = endBlock
    this.description = description
  }
}
