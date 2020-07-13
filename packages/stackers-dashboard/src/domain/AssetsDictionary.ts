import { Asset } from "./Asset";
import { AssetDetails } from "./AssetDetails";

import { ReactComponent as BZRX } from "../assets/images/token-bzrx.svg";

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
    ]
  ]);
}
