import { Asset } from "./Asset";
import { AssetDetails } from "./AssetDetails";

import { ReactComponent as BZRX } from "../assets/images/token-bzrx.svg";
import { ReactComponent as vBZRX } from "../assets/images/token-vbzrx.svg";
import {ReactComponent as ETHLogo} from "../assets/images/ic_token_eth.svg";

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
    ]
  ]);
}
