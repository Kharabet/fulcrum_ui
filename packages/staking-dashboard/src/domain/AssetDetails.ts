export default class AssetDetails {
  public displayName: string = ''
  public labelName: string = ''
  public logoSvg: any = null
  public decimals: number = 18
  public addressErc20: Map<number, string | null> = new Map<number, string>()

  constructor(
    displayName: string,
    labelName: string,
    logoSvg: any,
    decimals: number,
    addressErc20: Map<number, string | null>
  ) {
    this.displayName = displayName
    this.labelName = labelName
    this.logoSvg = logoSvg
    this.decimals = decimals
    this.addressErc20 = addressErc20
  }
}
