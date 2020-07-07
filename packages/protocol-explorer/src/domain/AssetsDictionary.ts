import { Asset } from "./Asset";
import { AssetDetails } from "./AssetDetails";

import { ReactComponent as BAT } from "../assets/images/token-bat.svg";
import { ReactComponent as WBTC } from "../assets/images/token-btc.svg";
import { ReactComponent as DAI } from "../assets/images/token-dai.svg";
import { ReactComponent as ETH } from "../assets/images/token-eth.svg";
import { ReactComponent as KNC } from "../assets/images/token-knc.svg";
import { ReactComponent as LINK } from "../assets/images/token-link.svg";
import { ReactComponent as MKR } from "../assets/images/token-mkr.svg";
import { ReactComponent as REP } from "../assets/images/token-rep.svg";
import { ReactComponent as SAI } from "../assets/images/token-sai.svg";
import { ReactComponent as SUSD } from "../assets/images/token-susd.svg";
import { ReactComponent as USDT } from "../assets/images/token-usdt.svg";
import { ReactComponent as USDC } from "../assets/images/token-usdc.svg";
import { ReactComponent as ZRX } from "../assets/images/token-zrx.svg";

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>([
    [
      Asset.BAT,
      new AssetDetails(
        "BAT",
        "Basic Attention Token (BAT)",
        BAT,
        18,
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
        WBTC,
        8,
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
        LINK,
        18,
        new Map<number, string | null>([
          [1, "0x514910771af9ca656af840dff83e8264ecf986ca"],
          [3, ""]
        ])
      )
    ],
    [
      Asset.USDT,
      new AssetDetails(
        "USDT",
        "Tether USD (USDT)",
        USDT,
        6,
        new Map<number, string | null>([
          [1, "0xdac17f958d2ee523a2206206994597c13d831ec7"],
          [3, ""],
          [42, ""]
        ])
      )
    ],
    [
      Asset.SAI,
      new AssetDetails(
        "SAI",
        "Sai Stablecoin (SAI)",
        SAI,
        18,
        new Map<number, string | null>([
          [1, "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"],
          [3, "0xad6d458402f60fd3bd25163575031acdce07538d"],
          [42, "0xC4375B7De8af5a38a93548eb8453a498222C4fF2"]
        ])
      )
    ],
    [
      Asset.DAI,
      new AssetDetails(
        "DAI",
        "Dai Stablecoin (DAI)",
        DAI,
        18,
        new Map<number, string | null>([
          [1, "0x6b175474e89094c44da98b954eedeac495271d0f"],
          [3, "0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108"],
          [4, "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea"],
          [42, "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa"]
        ])
      )
    ],
    [
      Asset.USDC,
      new AssetDetails(
        "USDC",
        "USD Coin (USDC)",
        USDC,
        6,
        new Map<number, string | null>([
          [1, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
          [3, "0x95cc8d8f29d0f7fcc425e8708893e759d1599c97"] // using ENG
        ])
      )
    ],
    [
      Asset.SUSD,
      new AssetDetails(
        "SUSD",
        "Synth sUSD (sUSD)",
        SUSD,
        18,
        new Map<number, string | null>([
          [1, "0x57ab1ec28d129707052df4df418d58a2d46d5f51"],
          [3, ""]
        ])
      )
    ],
    [
      Asset.ETH,
      new AssetDetails(
        "ETH",
        "Ethereum (ETH)",
        ETH,
        18,
        new Map<number, string | null>([
          [1, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          [3, "0xc778417e063141139fce010982780140aa0cd5ab"],
          [4, "0xc778417e063141139fce010982780140aa0cd5ab"],
          [42, "0xd0a1e359811322d97991e03f863a0c30c2cf029c"]
        ])
      )
    ],
    [
      Asset.WETH,
      new AssetDetails(
        "ETH", // "WETH",
        "Ethereum (ETH)", // "Wrapped Ether (WETH)",
        ETH,
        18,
        new Map<number, string | null>([
          [1, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
          [3, "0xc778417e063141139fce010982780140aa0cd5ab"],
          [4, "0xc778417e063141139fce010982780140aa0cd5ab"],
          [42, "0xd0a1e359811322d97991e03f863a0c30c2cf029c"]
        ])
      )
    ],
    [
      Asset.KNC,
      new AssetDetails(
        "KNC",
        "Kyber Network (KNC)",
        KNC,
        18,
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
        MKR,
        18,
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
        REP,
        18,
        new Map<number, string | null>([
          [1, "0x1985365e9f78359a9b6ad760e32412f4a445e862"],
          [3, "0xbf5d8683b9be6c43fca607eb2a6f2626a18837a6"], // using SNT token instead
          [4, "0x6e894660985207feb7cf89faf048998c71e8ee89"]
        ])
      )
    ],
    [
      Asset.ZRX,
      new AssetDetails(
        "ZRX",
        "0x (ZRX)",
        ZRX,
        18,
        new Map<number, string | null>([
          [1, "0xe41d2489571d322189246dafa5ebde1f4699f498"],
          [3, "0xb4f7332ed719eb4839f091eddb2a3ba309739521"] // using LINK token instead
        ])
      )
    ]
  ]);
}
