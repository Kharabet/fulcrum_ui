import { Asset } from "./Asset";
import { AssetDetails } from "./AssetDetails";

import bat_logo from "../assets/images/ic_token_bat.svg";
import btc_logo from "../assets/images/ic_token_btc.svg";
import dai_logo from "../assets/images/ic_token_dai.svg";
import eth_logo from "../assets/images/ic_token_eth.svg";
import knc_logo from "../assets/images/ic_token_knc.svg";
import mkr_logo from "../assets/images/ic_token_mkr.svg";
import rep_logo from "../assets/images/ic_token_rep.svg";
import zrx_logo from "../assets/images/ic_token_zrx.svg";

import bat_bg from "../assets/images/popup_left_token_bat.svg";
import btc_bg from "../assets/images/popup_left_token_btc.svg";
import dai_bg from "../assets/images/popup_left_token_dai.svg";
import eth_bg from "../assets/images/popup_left_token_eth.svg";
import knc_bg from "../assets/images/popup_left_token_knc.svg";
import mkr_bg from "../assets/images/popup_left_token_mkr.svg";
import rep_bg from "../assets/images/popup_left_token_rep.svg";
import zrx_bg from "../assets/images/popup_left_token_zrx.svg";

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>([
    [
      Asset.BAT,
      new AssetDetails(
        "BAT",
        bat_logo,
        bat_bg,
        "#CC3D84",
        new Map<number, string | null>([
          [1, "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
          [3, null] // 0xfc67a5421156b29ac073f62861c097b56225a4f8
        ])
      )
    ],
    [
      Asset.wBTC,
      new AssetDetails(
        "wBTC",
        btc_logo,
        btc_bg,
        "#F9B134",
        new Map<number, string | null>([
          [1, "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"],
          [3, "0xc55f20a1bb0fdaf619226317ad870c5931c99ae8"]
        ])
      )
    ],
    [
      Asset.DAI,
      new AssetDetails(
        "DAI",
        dai_logo,
        dai_bg,
        "#8777B1",
        new Map<number, string | null>([
          [1, "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"],
          [3, "0xad6d458402f60fd3bd25163575031acdce07538d"]
        ])
      )
    ],
    [
      Asset.ETH,
      new AssetDetails(
        "ETH",
        eth_logo,
        eth_bg,
        "#FFFFFF",
        new Map<number, string | null>([
          [1, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          [3, "0xc778417e063141139fce010982780140aa0cd5ab"],
          [42, "0xd0a1e359811322d97991e03f863a0c30c2cf029c"]
        ])
      )
    ], //
    [
      Asset.KNC,
      new AssetDetails(
        "KNC",
        knc_logo,
        knc_bg,
        "#31766E",
        new Map<number, string | null>([
          [1, "0xdd974d5c2e2928dea5f71b9825b8b646686bd200"],
          [3, "0x4e470dc7321e84ca96fcaedd0c8abcebbaeb68c6"],
          [42, "0xb2f3dd487708ca7794f633d9df57fdb9347a7aff"]
        ])
      )
    ],
    [
      Asset.MKR,
      new AssetDetails(
        "MKR",
        mkr_logo,
        mkr_bg,
        "#00BB99",
        new Map<number, string | null>([
          [1, "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"],
          [3, "0x06732516acd125b6e83c127752ed5f027e1b276e"]
        ])
      )
    ],
    [
      Asset.REP,
      new AssetDetails(
        "REP",
        rep_logo,
        rep_bg,
        "#8D3F76",
        new Map<number, string | null>([[1, "0x1985365e9f78359a9b6ad760e32412f4a445e862"], [3, null]])
      )
    ],
    [
      Asset.ZRX,
      new AssetDetails(
        "ZRX",
        zrx_logo,
        zrx_bg,
        "#7368D0",
        new Map<number, string | null>([[1, "0xe41d2489571d322189246dafa5ebde1f4699f498"], [3, null]])
      )
    ]
  ]);
}
