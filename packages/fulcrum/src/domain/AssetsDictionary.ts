import { Asset } from "./Asset";
import { AssetDetails } from "./AssetDetails";

import bat_logo from "../assets/images/ic_token_bat.svg";
import btc_logo from "../assets/images/ic_token_btc.svg";
import dai_logo from "../assets/images/ic_token_dai.svg";
import eth_logo from "../assets/images/ic_token_eth.svg";
import knc_logo from "../assets/images/ic_token_knc.svg";
import link_logo from "../assets/images/ic_token_link.svg";
import mkr_logo from "../assets/images/ic_token_mkr.svg";
import rep_logo from "../assets/images/ic_token_rep.svg";
import usdc_logo from "../assets/images/ic_token_usdc.svg";
import zrx_logo from "../assets/images/ic_token_zrx.svg";

import bat_bg from "../assets/images/popup_left_token_bat.svg";
import btc_bg from "../assets/images/popup_left_token_btc.svg";
import dai_bg from "../assets/images/popup_left_token_dai.svg";
import eth_bg from "../assets/images/popup_left_token_eth.svg";
import knc_bg from "../assets/images/popup_left_token_knc.svg";
import link_bg from "../assets/images/popup_left_token_link.svg";
import mkr_bg from "../assets/images/popup_left_token_mkr.svg";
import rep_bg from "../assets/images/popup_left_token_rep.svg";
import usdc_bg from "../assets/images/popup_left_token_usdc.svg";
import zrx_bg from "../assets/images/popup_left_token_zrx.svg";

import bat_ts from "../assets/images/ic___token_selector___bat.svg";
import dai_ts from "../assets/images/ic___token_selector___dai.svg";
import eth_ts from "../assets/images/ic___token_selector___eth.svg";
import knc_ts from "../assets/images/ic___token_selector___knc.svg";
import link_ts from "../assets/images/ic___token_selector___link.svg";
import mkr_ts from "../assets/images/ic___token_selector___mkr.svg";
import rep_ts from "../assets/images/ic___token_selector___rep.svg";
import usdc_ts from "../assets/images/ic___token_selector___usdc.svg";
import btc_ts from "../assets/images/ic___token_selector___wbtc.svg";
import zrx_ts from "../assets/images/ic___token_selector___zrx.svg";

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>([
    [
      Asset.BAT,
      new AssetDetails(
        "BAT",
        "Basic Attention Token (BAT)",
        18,
        bat_logo,
        bat_bg,
        bat_ts,
        "#CC3D84",
        "#FFFFFF",
        "#FFFFFF",
        new Map<number, string | null>([
          [1, "0x0d8775f648430679a709e98d2b0cb6250d2887ef"],
          [3, "0xdb0040451f373949a4be60dcd7b6b8d6e42658b6"]
        ])
      )
    ],
    [
      Asset.WBTC,
      new AssetDetails(
        "WBTC",
        "Bitcoin (BTC)",
        8,
        btc_logo,
        btc_bg,
        btc_ts,
        "#F9B134",
        "#FFFFFF",
        "#FFFFFF",
        new Map<number, string | null>([
          [1, "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"],
          [3, "0x95cc8d8f29d0f7fcc425e8708893e759d1599c97"] // using ENG token instead
        ])
      )
    ],

    [
      Asset.LINK,
      new AssetDetails(
        "LINK",
        "ChainLink Token (LINK)",
        18,
        link_logo,
        link_bg,
        link_ts,
        "#FFFFFF",
        "#444e5a",
        "#acb5c2",
        new Map<number, string | null>([
          [1, "0x514910771af9ca656af840dff83e8264ecf986ca"],
          [3, ""]
        ])
      )
    ],

    [
      Asset.DAI,
      new AssetDetails(
        "DAI",
        "Dai Stablecoin (DAI)",
        18,
        dai_logo,
        dai_bg,
        dai_ts,
        "#8777B1",
        "#FFFFFF",
        "#FFFFFF",
        new Map<number, string | null>([
          [1, "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"],
          [3, "0xad6d458402f60fd3bd25163575031acdce07538d"],
          [42, "0xC4375B7De8af5a38a93548eb8453a498222C4fF2"]
        ])
      )
    ],
    [
      Asset.USDC,
      new AssetDetails(
        "USDC",
        "USD Coin (USDC)",
        6,
        usdc_logo,
        usdc_bg,
        usdc_ts,
        "#00000000",
        "#444e5a",
        "#acb5c2",
        new Map<number, string | null>([
          [1, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
          [3, "0x95cc8d8f29d0f7fcc425e8708893e759d1599c97"] // using ENG
        ])
      )
    ],
    [
      Asset.ETH,
      new AssetDetails(
        "ETH",
        "Ethereum (ETH)",
        18,
        eth_logo,
        eth_bg,
        eth_ts,
        "#FFFFFF",
        "#444e5a",
        "#acb5c2",
        new Map<number, string | null>([
          [1, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          [3, "0xc778417e063141139fce010982780140aa0cd5ab"],
          [42, "0xd0a1e359811322d97991e03f863a0c30c2cf029c"]
        ])
      )
    ],
    [
      Asset.WETH,
      new AssetDetails(
        "WETH",
        "Wrapped Ether (WETH)",
        18,
        eth_logo,
        eth_bg,
        eth_ts,
        "#FFFFFF",
        "#444e5a",
        "#acb5c2",
        new Map<number, string | null>([
          [1, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          [3, "0xc778417e063141139fce010982780140aa0cd5ab"],
          [42, "0xd0a1e359811322d97991e03f863a0c30c2cf029c"]
        ])
      )
    ],
    [
      Asset.KNC,
      new AssetDetails(
        "KNC",
        "Kyber Network (KNC)",
        18,
        knc_logo,
        knc_bg,
        knc_ts,
        "#31766E",
        "#FFFFFF",
        "#FFFFFF",
        new Map<number, string | null>([
          [1, "0xdd974d5c2e2928dea5f71b9825b8b646686bd200"],
          [3, "0x4e470dc7321e84ca96fcaedd0c8abcebbaeb68c6"],
          [42, "0xad67cB4d63C9da94AcA37fDF2761AaDF780ff4a2"]
        ])
      )
    ],
    [
      Asset.MKR,
      new AssetDetails(
        "MKR",
        "Maker (MKR)",
        18,
        mkr_logo,
        mkr_bg,
        mkr_ts,
        "#00BB99",
        "#FFFFFF",
        "#FFFFFF",
        new Map<number, string | null>([
          [1, "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"],
          [3, "0x4bfba4a8f28755cb2061c413459ee562c6b9c51b"] // using OMG token instead
        ])
      )
    ],
    [
      Asset.REP,
      new AssetDetails(
        "REP",
        "Augur (REP)",
        18,
        rep_logo,
        rep_bg,
        rep_ts,
        "#8D3F76",
        "#FFFFFF",
        "#FFFFFF",
        new Map<number, string | null>([
          [1, "0x1985365e9f78359a9b6ad760e32412f4a445e862"],
          [3, "0xbf5d8683b9be6c43fca607eb2a6f2626a18837a6"] // using SNT token instead
        ])
      )
    ],
    [
      Asset.ZRX,
      new AssetDetails(
        "ZRX",
        "0x (ZRX)",
        18,
        zrx_logo,
        zrx_bg,
        zrx_ts,
        "#7368D0",
        "#FFFFFF",
        "#FFFFFF",
        new Map<number, string | null>([
          [1, "0xe41d2489571d322189246dafa5ebde1f4699f498"],
          [3, "0xb4f7332ed719eb4839f091eddb2a3ba309739521"] // using LINK token instead
        ])
      )
    ]
  ]);
}
