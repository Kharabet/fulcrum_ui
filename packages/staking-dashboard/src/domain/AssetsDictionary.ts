import { Asset } from "./Asset";
import { AssetDetails } from "./AssetDetails";

import { ReactComponent as BZRX } from "../assets/images/token-bzrx.svg";
import { ReactComponent as vBZRX } from "../assets/images/token-vbzrx.svg";
import { ReactComponent as BPT } from "../assets/images/token-bpt.svg";
import { ReactComponent as ETHLogo } from "../assets/images/ic_token_eth.svg";

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>([
    [
      Asset.BZRXv1,
      new AssetDetails(
        "BZRXv1",
        "bZx Protocol Token v1 (BZRXv1)",
        BZRX,
        18,
        new Map<number, string | null>([
          [1, "0x1c74cFF0376FB4031Cd7492cD6dB2D66c3f2c6B9"],
          [42, "0xe3e682A8Fc7EFec410E4099cc09EfCC0743C634a"]
        ])
      )
    ],
    [
      Asset.BZRX,
      new AssetDetails(
        "BZRX",
        "bZx Protocol Token v1 (BZRXv1)",
        BZRX,
        18,
        new Map<number, string | null>([
          [1, "0x56d811088235F11C8920698a204A5010a788f4b3"],
          [42, "0xB54Fc2F2ea17d798Ad5C7Aba2491055BCeb7C6b2"]
        ])
      )
    ],
    [
      Asset.vBZRX,
      new AssetDetails(
        "vBZRX",
        "bZx Vesting Token (vBZRX)",
        vBZRX,
        18,
        new Map<number, string | null>([
          [1, "0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F"],
          [42, "0x6F8304039f34fd6A6acDd511988DCf5f62128a32"]
        ])
      )
    ],
    [
      Asset.BPT,
      new AssetDetails(
        "BPT",
        "Balancer Pool Token (BPT)",
        BPT,
        18,
        new Map<number, string | null>([
          [1, "0xe26A220a341EAca116bDa64cF9D5638A935ae629"],
          [42, "0x4c4462c6bca4c92bf41c40f9a4047f35fd296996"]
        ])
      )
    ],
    [
      Asset.ETH,
      new AssetDetails(
        "ETH",
        "Ethereum (ETH)",
        ETHLogo,
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
      Asset.WBTC,
      new AssetDetails(
        "WBTC",
        "Bitcoin (BTC)",
        "",
        8,
        new Map<number, string | null>([
          [1, "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"],
          [3, "0x95cc8d8f29d0f7fcc425e8708893e759d1599c97"], // using ENG token instead
          [42, "0x5ae55494ccda82f1f7c653bc2b6ebb4ad3c77dac"],
        ])
      )
    ],

    [
      Asset.LINK,
      new AssetDetails(
        "LINK",
        "ChainLink Token (LINK)",
        "",
        18,
        new Map<number, string | null>([
          [1, "0x514910771af9ca656af840dff83e8264ecf986ca"],
          [3, ""],
          [42, "0xfb9325e5f4fc9629525427a1c92c0f4d723500cf"],
        ])
      )
    ],
    [
      Asset.USDT,
      new AssetDetails(
        "USDT",
        "Tether USD (USDT)",
        "",
        6,
        new Map<number, string | null>([
          [1, "0xdac17f958d2ee523a2206206994597c13d831ec7"],
          [3, ""],
          [42, "0x4c4462c6bca4c92bf41c40f9a4047f35fd296996"]
        ])
      )
    ],

    [
      Asset.DAI,
      new AssetDetails(
        "DAI",
        "Dai Stablecoin (DAI)",
        "",
        18,
        new Map<number, string | null>([
          [1, "0x6b175474e89094c44da98b954eedeac495271d0f"],
          [3, "0xf80a32a835f79d7787e8a8ee5721d0feafd78108"],
          [4, "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea"],
          [42, "0x8f746ec7ed5cc265b90e7af0f5b07b4406c9dda8"]
        ])
      )
    ],
    [
      Asset.USDC,
      new AssetDetails(
        "USDC",
        "USD Coin (USDC)",
        "",
        6,
        new Map<number, string | null>([
          [1, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
          [3, "0x95cc8d8f29d0f7fcc425e8708893e759d1599c97"], // using eng
          [42, "0xb443f30cdd6076b1a5269dbc08b774f222d4db4e"],
        ])
      )
    ],
    [
      Asset.SUSD,
      new AssetDetails(
        "SUSD",
        "Synth sUSD (sUSD)",
        "",
        18,
        new Map<number, string | null>([
          [1, "0x57ab1ec28d129707052df4df418d58a2d46d5f51"],
          [3, ""],
          [42, "0xfcfa14dbc71bee2a2188431fa15e1f8d57d93c62"],
        ])
      )
    ],
    [
      Asset.ETH,
      new AssetDetails(
        "ETH",
        "Ethereum (ETH)",
        "",
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
        "WETH",
        "Wrapped Ether (WETH)",
        "",
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
        "",
        18,
        new Map<number, string | null>([
          [1, "0xdd974d5c2e2928dea5f71b9825b8b646686bd200"],
          [3, "0x4e470dc7321e84ca96fcaedd0c8abcebbaeb68c6"],
          [42, "0x02357164ba33f299f7654cbb29da29db38ae1f44"],
        ])
      )
    ],

    [
      Asset.REP,
      new AssetDetails(
        "REP",
        "Augur (REP)",
        "",
        18,
        new Map<number, string | null>([
          [1, "0x1985365e9f78359a9b6ad760e32412f4a445e862"],
          [3, "0xbf5d8683b9be6c43fca607eb2a6f2626a18837a6"], // using snt token instead
          [4, "0x6e894660985207feb7cf89faf048998c71e8ee89"],
          [42, "0x39ac2818e08d285abe548f77a0819651b8b5d213"],
        ])
      )
    ],
    [
      Asset.ZRX,
      new AssetDetails(
        "ZRX",
        "0x (ZRX)",
        "",
        18,
        new Map<number, string | null>([
          [1, "0xe41d2489571d322189246dafa5ebde1f4699f498"],
          [3, "0xb4f7332ed719eb4839f091eddb2a3ba309739521"], // using link token instead
          [42, "0x629b28c5aa5c953df2511d2e48d316a07eafb3e3"],
        ])
      )
    ],
    [
      Asset.MKR,
      new AssetDetails(
        "MKR",
        "Maker (MKR)",
        "",
        18,
        new Map<number, string | null>([
          [1, "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"],
          [3, "0x4bfba4a8f28755cb2061c413459ee562c6b9c51b"], // using OMG token instead
          [42, "0x4893919982648ffefe4324538d54402387c20198"],
        ])
      )
    ],
  ]);
}
