import { BigNumber } from "@0x/utils";

export class RepayLoanRequest {
  public loanOrderHash: string;
  public repayPercent: BigNumber;

  constructor(loanOrderHash: string, repayPercent: BigNumber) {
    this.loanOrderHash = loanOrderHash;
    this.repayPercent = repayPercent;
  }
}
