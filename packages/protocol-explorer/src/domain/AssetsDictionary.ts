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
        BAT
      )
    ],
    [
      Asset.WBTC,
      new AssetDetails(
        "WBTC",
        "Bitcoin (BTC)",
        WBTC
      )
    ],
    [
      Asset.LINK,
      new AssetDetails(
        "LINK",
        "ChainLink Token (LINK)",
        LINK
      )
    ],
    [
      Asset.USDT,
      new AssetDetails(
        "USDT",
        "Tether USD (USDT)",
        USDT
      )
    ],
    [
      Asset.SAI,
      new AssetDetails(
        "SAI",
        "Sai Stablecoin (SAI)",
        SAI
      )
    ],
    [
      Asset.DAI,
      new AssetDetails(
        "DAI",
        "Dai Stablecoin (DAI)",
        DAI
      )
    ],
    [
      Asset.USDC,
      new AssetDetails(
        "USDC",
        "USD Coin (USDC)",
        USDC
      )
    ],
    [
      Asset.SUSD,
      new AssetDetails(
        "SUSD",
        "Synth sUSD (sUSD)",
        SUSD
      )
    ],
    [
      Asset.ETH,
      new AssetDetails(
        "ETH",
        "Ethereum (ETH)",
        ETH
      )
    ],
    [
      Asset.WETH,
      new AssetDetails(
        "ETH", // "WETH",
        "Ethereum (ETH)", // "Wrapped Ether (WETH)",
        ETH
      )
    ],
    [
      Asset.KNC,
      new AssetDetails(
        "KNC",
        "Kyber Network (KNC)",
        KNC
      )
    ],
    [
      Asset.MKR,
      new AssetDetails(
        "MKR",
        "Maker (MKR)",
        MKR
      )
    ],
    [
      Asset.REP,
      new AssetDetails(
        "REP",
        "Augur (REP)",
        REP
      )
    ],
    [
      Asset.ZRX,
      new AssetDetails(
        "ZRX",
        "0x (ZRX)",
        ZRX
      )
    ]
  ]);
}
