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
    [Asset.BAT, new AssetDetails("0x0d8775f648430679a709e98d2b0cb6250d2887ef", "BAT", bat_logo, bat_bg, "#CC3D84")],
    [Asset.wBTC, new AssetDetails("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "wBTC", btc_logo, btc_bg, "#F9B134")],
    [Asset.DAI, new AssetDetails("0xb2f3dd487708ca7794f633d9df57fdb9347a7aff", "DAI", dai_logo, dai_bg, "#8777B1")], // 0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359
    [Asset.ETH, new AssetDetails("0xd0a1e359811322d97991e03f863a0c30c2cf029c", "ETH", eth_logo, eth_bg, "#FFFFFF")], // 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    [Asset.KNC, new AssetDetails("0xdd974d5c2e2928dea5f71b9825b8b646686bd200", "KNC", knc_logo, knc_bg, "#31766E")],
    [Asset.MKR, new AssetDetails("0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2", "MKR", mkr_logo, mkr_bg, "#00BB99")],
    [Asset.REP, new AssetDetails("0xe94327d07fc17907b4db788e5adf2ed424addff6", "REP", rep_logo, rep_bg, "#8D3F76")],
    [Asset.ZRX, new AssetDetails("0xe41d2489571d322189246dafa5ebde1f4699f498", "ZRX", zrx_logo, zrx_bg, "#7368D0")]
  ]);
}
