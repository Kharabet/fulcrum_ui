export class ClaimRequest {
  public id: number
  public name: string
  constructor() {
    this.id = Math.round(new Date().getTime() / 1000)
    this.name = 'Claim'
  }
}
