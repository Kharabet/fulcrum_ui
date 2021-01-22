import React from 'react'
export default class AssetDetails {
  public addressErc20: Map<number, string | null> = new Map<number, string>()
  public bgBrightColor: string = '#000000'
  public bgLightColor: string = '#FFFFFF'
  public decimals: number = 18
  public displayName: string = ''
  public logoSvg: any = null
  public reactLogoSvg: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined
  }
>

  constructor(
    displayName: string,
    decimals: number,
    logoSvg: any,
    reactLogoSvg: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  >,
    bgBrightColor: string,
    bgLightColor: string,
    addressErc20: Map<number, string | null>
  ) {
    this.addressErc20 = addressErc20
    this.displayName = displayName
    this.decimals = decimals
    this.logoSvg = logoSvg
    this.reactLogoSvg = reactLogoSvg
    this.bgBrightColor = bgBrightColor
    this.bgLightColor = bgLightColor
  }
}
