export default class RolloverRequest {
  public id: number
  public loanId: string

  constructor(loanId: string) {
    this.id = Math.round(new Date().getTime() / 1000)
    this.loanId = loanId
  }
}