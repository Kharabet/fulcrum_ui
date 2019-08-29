export class ExtendLoanRequest {
  public loanOrderHash: string;
  public daysToAdd: number;

  constructor(loanOrderHash: string, daysToAdd: number) {
    this.loanOrderHash = loanOrderHash;
    this.daysToAdd = daysToAdd;
  }
}
