import { Asset } from './Asset'
import { AssetDetails } from './AssetDetails'

import aave_logo, { ReactComponent as AAVELogo } from '../assets/images/ic_token_aave.svg'
import bat_logo, { ReactComponent as BATLogo } from '../assets/images/ic_token_bat.svg'
import btc_logo, { ReactComponent as BTCLogo } from '../assets/images/ic_token_btc.svg'
import bzrx_logo, { ReactComponent as BZRXLogo } from '../assets/images/ic_token_bzrx.svg'
import chai_logo, { ReactComponent as CHAILogo } from '../assets/images/ic_token_chai.svg'
import chi_logo, { ReactComponent as CHILogo } from '../assets/images/ic_token_chi.svg'
import dai_logo, { ReactComponent as DAILogo } from '../assets/images/ic_token_dai.svg'
import eth_logo, { ReactComponent as ETHLogo } from '../assets/images/ic_token_eth.svg'
import knc_logo, { ReactComponent as KNCLogo } from '../assets/images/ic_token_knc.svg'
import lend_logo, { ReactComponent as LENDLogo } from '../assets/images/ic_token_lend.svg'
import link_logo, { ReactComponent as LINKLogo } from '../assets/images/ic_token_link.svg'
import mkr_logo, { ReactComponent as MKRLogo } from '../assets/images/ic_token_mkr.svg'
import rep_logo, { ReactComponent as REPLogo } from '../assets/images/ic_token_rep.svg'
import sai_logo, { ReactComponent as SAILogo } from '../assets/images/ic_token_sai.svg'
import susd_logo, { ReactComponent as SUSDLogo } from '../assets/images/ic_token_susd.svg'
import uni_logo, { ReactComponent as UNILogo } from '../assets/images/ic_token_uni.svg'
import usdc_logo, { ReactComponent as USDCLogo } from '../assets/images/ic_token_usdc.svg'
import usdt_logo, { ReactComponent as USDTLogo } from '../assets/images/ic_token_usdt.svg'
import weth_logo, { ReactComponent as WETHLogo } from '../assets/images/ic_token_weth.svg'
import yfi_logo, { ReactComponent as YFILogo } from '../assets/images/ic_token_yfi.svg'
import zrx_logo, { ReactComponent as ZRXLogo } from '../assets/images/ic_token_zrx.svg'

import bat_bg from '../assets/images/popup_left_token_bat.svg'
import btc_bg from '../assets/images/popup_left_token_btc.svg'
import bzrx_bg from '../assets/images/popup_left_token_bzrx.svg'
import dai_bg from '../assets/images/popup_left_token_dai.svg'
import eth_bg from '../assets/images/popup_left_token_eth.svg'
import knc_bg from '../assets/images/popup_left_token_knc.svg'
import lend_bg from '../assets/images/popup_left_token_lend.svg'
import link_bg from '../assets/images/popup_left_token_link.svg'
import mkr_bg from '../assets/images/popup_left_token_mkr.svg'
import rep_bg from '../assets/images/popup_left_token_rep.svg'
import sai_bg from '../assets/images/popup_left_token_sai.svg'
import susd_bg from '../assets/images/popup_left_token_susd.svg'
import usdc_bg from '../assets/images/popup_left_token_usdc.svg'
import usdt_bg from '../assets/images/popup_left_token_usdt.svg'
import yfi_bg from '../assets/images/popup_left_token_yfi.svg'
import zrx_bg from '../assets/images/popup_left_token_zrx.svg'

// import btc_bg_btm from "../assets/images/popup_bottom_token_btc.svg";
import eth_bg_btm from '../assets/images/popup_bottom_token_eth.svg'
// import usdt_bg_btm from "../assets/images/popup_bottom_token_susd.svg";

import bat_ts from '../assets/images/ic___token_selector___bat.svg'
import bzrx_ts from '../assets/images/ic___token_selector___bzrx.svg'
import dai_ts from '../assets/images/ic___token_selector___dai.svg'
import eth_ts from '../assets/images/ic___token_selector___eth.svg'
import knc_ts from '../assets/images/ic___token_selector___knc.svg'
import lend_ts from '../assets/images/ic___token_selector___lend.svg'
import link_ts from '../assets/images/ic___token_selector___link.svg'
import mkr_ts from '../assets/images/ic___token_selector___mkr.svg'
import rep_ts from '../assets/images/ic___token_selector___rep.svg'
import sai_ts from '../assets/images/ic___token_selector___sai.svg'
import susd_ts from '../assets/images/ic___token_selector___susd.svg'
import usdc_ts from '../assets/images/ic___token_selector___usdc.svg'
import btc_ts from '../assets/images/ic___token_selector___wbtc.svg'
import yfi_ts from '../assets/images/ic___token_selector___yfi.svg'
import zrx_ts from '../assets/images/ic___token_selector___zrx.svg'

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>([
    [
      Asset.CHI,
      new AssetDetails(
        'CHI',
        'Chi Gastoken by 1inch',
        '',
        '',
        0,
        chi_logo,
        CHILogo,
        '',
        '',
        '',
        '',
        '',
        new Map<number, string | null>([
          [1, '0x0000000000004946c0e9f43f4dee607b0ef1fa1c'],
          [42, '0x0000000000004946c0e9f43f4dee607b0ef1fa1c']
        ])
      )
    ],
    [
      Asset.BAT,
      new AssetDetails(
        'BAT',
        'Basic Attention Token (BAT)',
        'iBAT',
        'https://fulcrum.trade/images/iBAT.svg',
        18,
        bat_logo,
        BATLogo,
        bat_bg,
        bat_ts,
        '#CC3D84',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x0d8775f648430679a709e98d2b0cb6250d2887ef'],
          [3, '0xdb0040451f373949a4be60dcd7b6b8d6e42658b6'],
          [42, '0xac091ccf1b0c601182f3ccf3eb20f291aba39029']
        ])
      )
    ],
    [
      Asset.WBTC,
      new AssetDetails(
        'WBTC',
        'Bitcoin (BTC)',
        'iWBTC',
        'https://fulcrum.trade/images/iWBTC.svg',
        8,
        btc_logo,
        BTCLogo,
        btc_bg,
        btc_ts,
        '#884294',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'],
          [3, '0x95cc8d8f29d0f7fcc425e8708893e759d1599c97'], // using ENG token instead
          [42, '0x5ae55494ccda82f1f7c653bc2b6ebb4ad3c77dac']
        ])
      )
    ],

    [
      Asset.LINK,
      new AssetDetails(
        'LINK',
        'ChainLink Token (LINK)',
        'iLINK',
        'https://fulcrum.trade/images/iLINK.svg',
        18,
        link_logo,
        LINKLogo,
        link_bg,
        link_ts,
        '#2A5ADA',
        '#ffffff',
        '#ffffff',
        new Map<number, string | null>([
          [1, '0x514910771af9ca656af840dff83e8264ecf986ca'],
          [3, ''],
          [42, '0xfb9325e5f4fc9629525427a1c92c0f4d723500cf']
        ])
      )
    ],
    [
      Asset.USDT,
      new AssetDetails(
        'USDT',
        'Tether USD (USDT)',
        'iUSDT',
        'https://fulcrum.trade/images/iUSDT.svg',
        6,
        usdt_logo,
        USDTLogo,
        usdt_bg,
        '',
        '#8777B1',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0xdac17f958d2ee523a2206206994597c13d831ec7'],
          [3, ''],
          [42, '0x4c4462c6bca4c92bf41c40f9a4047f35fd296996']
        ])
      )
    ],
    [
      Asset.SAI,
      new AssetDetails(
        'SAI',
        'Sai Stablecoin (SAI)',
        'iSAI',
        'https://fulcrum.trade/images/iSAI.svg',
        18,
        sai_logo,
        SAILogo,
        sai_bg,
        sai_ts,
        '#8777B1',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'],
          [3, '0xad6d458402f60fd3bd25163575031acdce07538d'],
          [42, '0xc4375b7de8af5a38a93548eb8453a498222c4ff2']
        ])
      )
    ],
    [
      Asset.DAI,
      new AssetDetails(
        'DAI',
        'Dai Stablecoin (DAI)',
        'iDAI',
        'https://fulcrum.trade/images/iDAI.svg',
        18,
        dai_logo,
        DAILogo,
        dai_bg,
        dai_ts,
        '#8777B1',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x6b175474e89094c44da98b954eedeac495271d0f'],
          [3, '0xf80a32a835f79d7787e8a8ee5721d0feafd78108'],
          [4, '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea'],
          [42, '0x8f746ec7ed5cc265b90e7af0f5b07b4406c9dda8']
        ])
      )
    ],
    [
      Asset.CHAI,
      new AssetDetails(
        'CHAI',
        'CHai',
        'iDAI',
        'https://fulcrum.trade/images/iDAI.svg',
        18,
        chai_logo,
        CHAILogo,
        dai_bg,
        dai_ts,
        '#8777B1',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x06af07097c9eeb7fd685c692751d5c66db49c215'],
          [3, ''],
          [4, ''],
          [42, '0x71dd45d9579a499b58aa85f50e5e3b241ca2d10d']
        ])
      )
    ],
    [
      Asset.USDC,
      new AssetDetails(
        'USDC',
        'USD Coin (USDC)',
        'iUSDC',
        'https://fulcrum.trade/images/iUSDC.svg',
        6,
        usdc_logo,
        USDCLogo,
        usdc_bg,
        usdc_ts,
        '#00000000',
        '#444e5a',
        '#acb5c2',
        new Map<number, string | null>([
          [1, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'],
          [3, '0x95cc8d8f29d0f7fcc425e8708893e759d1599c97'], // using eng
          [42, '0xb443f30cdd6076b1a5269dbc08b774f222d4db4e']
        ])
      )
    ],
    [
      Asset.SUSD,
      new AssetDetails(
        'SUSD',
        'Synth sUSD (sUSD)',
        'iSUSD',
        'https://fulcrum.trade/images/iSUSD.svg',
        18,
        susd_logo,
        SUSDLogo,
        susd_bg,
        susd_ts,
        '#00000000',
        '#444e5a',
        '#acb5c2',
        new Map<number, string | null>([
          [1, '0x57ab1ec28d129707052df4df418d58a2d46d5f51'],
          [3, ''],
          [42, '0xfcfa14dbc71bee2a2188431fa15e1f8d57d93c62']
        ])
      )
    ],
    [
      Asset.ETHv1,
      new AssetDetails(
        'ETH',
        'Ethereum (ETH)',
        'iETHv1',
        'https://fulcrum.trade/images/iETH.svg',
        18,
        eth_logo,
        ETHLogo,
        eth_bg_btm,
        eth_ts,
        '#FFFFFF',
        '#444e5a',
        '#333',
        new Map<number, string | null>([
          [1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
          [3, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [4, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [42, '0xd0a1e359811322d97991e03f863a0c30c2cf029c']
        ])
      )
    ],
    [
      Asset.ETH,
      new AssetDetails(
        'ETH',
        'Ethereum (ETH)',
        'iETH',
        'https://fulcrum.trade/images/iETH.svg',
        18,
        eth_logo,
        ETHLogo,
        eth_bg,
        eth_ts,
        '#FFFFFF',
        '#444e5a',
        '#acb5c2',
        new Map<number, string | null>([
          [1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
          [3, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [4, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [42, '0xd0a1e359811322d97991e03f863a0c30c2cf029c']
        ])
      )
    ],
    [
      Asset.WETH,
      new AssetDetails(
        'WETH',
        'Wrapped Ether (WETH)',
        'iETH',
        'https://fulcrum.trade/images/iETH.svg',
        18,
        weth_logo,
        WETHLogo,
        eth_bg,
        eth_ts,
        '#FFFFFF',
        '#444e5a',
        '#acb5c2',
        new Map<number, string | null>([
          [1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
          [3, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [4, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [42, '0xd0a1e359811322d97991e03f863a0c30c2cf029c']
        ])
      )
    ],

    [
      Asset.fWETH,
      new AssetDetails(
        'fWETH',
        'Fake Wrapped Ether (fWETH)',
        'ifWETH',
        'https://fulcrum.trade/images/iETH.svg',
        18,
        weth_logo,
        WETHLogo,
        eth_bg,
        eth_ts,
        '#FFFFFF',
        '#444e5a',
        '#acb5c2',
        new Map<number, string | null>([[42, '0xfbe16ba4e8029b759d3c5ef8844124893f3ae470']])
      )
    ],

    [
      Asset.KNC,
      new AssetDetails(
        'KNC',
        'Kyber Network (KNC)',
        'iKNC',
        'https://fulcrum.trade/images/iKNC.svg',
        18,
        knc_logo,
        KNCLogo,
        knc_bg,
        knc_ts,
        '#49BC98',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0xdd974d5c2e2928dea5f71b9825b8b646686bd200'],
          [3, '0x4e470dc7321e84ca96fcaedd0c8abcebbaeb68c6'],
          [42, '0x02357164ba33f299f7654cbb29da29db38ae1f44']
        ])
      )
    ],
    [
      Asset.MKR,
      new AssetDetails(
        'MKR',
        'Maker (MKR)',
        'iMKR',
        '',
        18,
        mkr_logo,
        MKRLogo,
        mkr_bg,
        mkr_ts,
        '#00BB99',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'],
          [3, '0x4bfba4a8f28755cb2061c413459ee562c6b9c51b'], // using omg token instead
          [42, '0x4893919982648ffefe4324538d54402387c20198']
        ])
      )
    ],
    [
      Asset.REP,
      new AssetDetails(
        'REP',
        'Augur (REP)',
        'iREP',
        'https://fulcrum.trade/images/iREP.svg',
        18,
        rep_logo,
        REPLogo,
        rep_bg,
        rep_ts,
        '#8D3F76',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x1985365e9f78359a9b6ad760e32412f4a445e862'],
          [3, '0xbf5d8683b9be6c43fca607eb2a6f2626a18837a6'], // using snt token instead
          [4, '0x6e894660985207feb7cf89faf048998c71e8ee89'],
          [42, '0x39ac2818e08d285abe548f77a0819651b8b5d213']
        ])
      )
    ],
    [
      Asset.ZRX,
      new AssetDetails(
        'ZRX',
        '0x (ZRX)',
        'iZRX',
        'https://fulcrum.trade/images/iZRX.svg',
        18,
        zrx_logo,
        ZRXLogo,
        zrx_bg,
        zrx_ts,
        '#000004',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0xe41d2489571d322189246dafa5ebde1f4699f498'],
          [3, '0xb4f7332ed719eb4839f091eddb2a3ba309739521'], // using link token instead
          [42, '0x629b28c5aa5c953df2511d2e48d316a07eafb3e3']
        ])
      )
    ],

    [
      Asset.BZRX,
      new AssetDetails(
        'BZRX',
        'bZx Protocol Token',
        'iBZRX',
        'https://fulcrum.trade/images/iBZRX.svg',
        18,
        bzrx_logo,
        BZRXLogo,
        bzrx_bg,
        bzrx_ts,
        '#7368D0',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x56d811088235F11C8920698a204A5010a788f4b3'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.YFI,
      new AssetDetails(
        'YFI',
        'YFI',
        'iYFI',
        'https://fulcrum.trade/images/iYFI.svg',
        18,
        yfi_logo,
        YFILogo,
        yfi_bg,
        yfi_ts,
        '#7368D0',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.LEND,
      new AssetDetails(
        'LEND',
        'LEND',
        'iLEND',
        'https://fulcrum.trade/images/iLEND.svg',
        18,
        lend_logo,
        LENDLogo,
        lend_bg,
        lend_ts,
        '#7368D0',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.AAVE,
      new AssetDetails(
        'AAVE',
        'AAVE',
        'iAAVE',
        'https://fulcrum.trade/images/iAAVE.svg',
        18,
        aave_logo,
        AAVELogo,
        '',
        '',
        '',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, ''],
          [3, ''],
          [42, '']
        ])
      )
    ],
     [
      Asset.UNI,
      new AssetDetails(
        'UNI',
        'UNI',
        'iUNI',
        'https://fulcrum.trade/images/iUNI.svg',
        18,
        uni_logo,
        UNILogo,
        '',
        '',
        '',
        '#FFFFFF',
        '#FFFFFF',
        new Map<number, string | null>([
          [1, ''],
          [3, ''],
          [42, '']
        ])
      )
    ]
  ])
}