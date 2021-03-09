import Asset from './Asset'
import AssetDetails from './AssetDetails'

import aave_logo, { ReactComponent as AAVELogo } from './images/ic_token_aave.svg'
import bat_logo, { ReactComponent as BATLogo } from './images/ic_token_bat.svg'
import wbtc_logo, { ReactComponent as WBTCLogo } from './images/ic_token_wbtc.svg'
import btc_logo, { ReactComponent as BTCLogo } from './images/ic_token_btc.svg'
import bnb_logo, { ReactComponent as BNBLogo } from './images/ic_token_bnb.svg'
import busd_logo, { ReactComponent as BUSDLogo } from './images/ic_token_busd.svg'
import bzrx_logo, { ReactComponent as BZRXLogo } from './images/ic_token_bzrx.svg'
import chai_logo, { ReactComponent as CHAILogo } from './images/ic_token_chai.svg'
import chi_logo, { ReactComponent as CHILogo } from './images/ic_token_chi.svg'
import comp_logo, { ReactComponent as COMPLogo } from './images/ic_token_comp.svg'
import dai_logo, { ReactComponent as DAILogo } from './images/ic_token_dai.svg'
import eth_logo, { ReactComponent as ETHLogo } from './images/ic_token_eth.svg'
import knc_logo, { ReactComponent as KNCLogo } from './images/ic_token_knc.svg'
import link_logo, { ReactComponent as LINKLogo } from './images/ic_token_link.svg'
import lrc_logo, { ReactComponent as LRCLogo } from './images/ic_token_lrc.svg'
import mkr_logo, { ReactComponent as MKRLogo } from './images/ic_token_mkr.svg'
import rep_logo, { ReactComponent as REPLogo } from './images/ic_token_rep.svg'
import sai_logo, { ReactComponent as SAILogo } from './images/ic_token_sai.svg'
import susd_logo, { ReactComponent as SUSDLogo } from './images/ic_token_susd.svg'
import uni_logo, { ReactComponent as UNILogo } from './images/ic_token_uni.svg'
import usdc_logo, { ReactComponent as USDCLogo } from './images/ic_token_usdc.svg'
import usdt_logo, { ReactComponent as USDTLogo } from './images/ic_token_usdt.svg'
import weth_logo, { ReactComponent as WETHLogo } from './images/ic_token_weth.svg'
import yfi_logo, { ReactComponent as YFILogo } from './images/ic_token_yfi.svg'
import zrx_logo, { ReactComponent as ZRXLogo } from './images/ic_token_zrx.svg'
import vbzrx_logo, { ReactComponent as vBZRXLogo } from './images/ic_token_vbzrx.svg'

export default class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>([
    [
      Asset.CHI,
      new AssetDetails(
        'CHI',
        0,
        chi_logo,
        CHILogo,
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
        18,
        bat_logo,
        BATLogo,
        '#CC3D84',
        '#FFE1D3',
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
        8,
        wbtc_logo,
        WBTCLogo,
        '#966AFF',
        '#E9CAEE',
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
        18,
        link_logo,
        LINKLogo,
        '#03288B',
        '#B9E9FF',
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
        6,
        usdt_logo,
        USDTLogo,
        '#70E000',
        '#E1FFC4',
        new Map<number, string | null>([
          [1, '0xdac17f958d2ee523a2206206994597c13d831ec7'],
          [3, ''],
          [42, '0x4c4462c6bca4c92bf41c40f9a4047f35fd296996'],
          [56, '0x55d398326f99059ff775485246999027b3197955']
        ])
      )
    ],
    [
      Asset.SAI,
      new AssetDetails(
        'SAI',
        18,
        sai_logo,
        SAILogo,
        '#8777B1',
        '#E3D9FF',
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
        18,
        dai_logo,
        DAILogo,
        '#F8A608',
        '#FFE9BE',
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
        18,
        chai_logo,
        CHAILogo,
        '#8777B1',
        '',
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
        6,
        usdc_logo,
        USDCLogo,
        '#85D3FF',
        '#C8E0FA',
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
        18,
        susd_logo,
        SUSDLogo,
        '#00000000',
        '#D9D5E9',
        new Map<number, string | null>([
          [1, '0x57ab1ec28d129707052df4df418d58a2d46d5f51'],
          [3, ''],
          [42, '0xfcfa14dbc71bee2a2188431fa15e1f8d57d93c62']
        ])
      )
    ],
    [
      Asset.ETH,
      new AssetDetails(
        'ETH',
        18,
        eth_logo,
        ETHLogo,
        '#B0B0B0',
        '#ECECEC',
        new Map<number, string | null>([
          [1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
          [3, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [4, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [42, '0xd0a1e359811322d97991e03f863a0c30c2cf029c'],
          [56, '0x2170ed0880ac9a755fd29b2688956bd959f933f8']
        ])
      )
    ],
    [
      Asset.WETH,
      new AssetDetails(
        'WETH',
        18,
        weth_logo,
        WETHLogo,
        '#FFFFFF',
        '#ECECEC',
        new Map<number, string | null>([
          [1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
          [3, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [4, '0xc778417e063141139fce010982780140aa0cd5ab'],
          [42, '0xd0a1e359811322d97991e03f863a0c30c2cf029c'],
          [56, '0x2170ed0880ac9a755fd29b2688956bd959f933f8']
        ])
      )
    ],
    [
      Asset.fWETH,
      new AssetDetails(
        'fWETH',
        18,
        weth_logo,
        WETHLogo,
        '#FFFFFF',
        '#B0B0B0',
        new Map<number, string | null>([[42, '0xfbe16ba4e8029b759d3c5ef8844124893f3ae470']])
      )
    ],
    [
      Asset.KNC,
      new AssetDetails(
        'KNC',
        18,
        knc_logo,
        KNCLogo,
        '#3BD8A7',
        '#B4EAD9',
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
        18,
        mkr_logo,
        MKRLogo,
        '#028858',
        '#CAF6D7',
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
        18,
        rep_logo,
        REPLogo,
        '#8D3F76',
        '#EACAE2',
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
        18,
        zrx_logo,
        ZRXLogo,
        '#000004',
        '#D8D3FF',
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
        18,
        bzrx_logo,
        BZRXLogo,
        '#0056D7',
        '#D8D3FF',
        new Map<number, string | null>([
          [1, '0x56d811088235F11C8920698a204A5010a788f4b3'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.vBZRX,
      new AssetDetails(
        'vBZRX',
        18,
        vbzrx_logo,
        vBZRXLogo,
        '#0056D7',
        '#D8D3FF',
        new Map<number, string | null>([
          [1, '0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F'],
          [42, '0x6F8304039f34fd6A6acDd511988DCf5f62128a32']
        ])
      )
    ],
    [
      Asset.YFI,
      new AssetDetails(
        'YFI',
        18,
        yfi_logo,
        YFILogo,
        '#3D97FF',
        '#D8D3FF',
        new Map<number, string | null>([
          [1, '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.AAVE,
      new AssetDetails(
        'AAVE',
        18,
        aave_logo,
        AAVELogo,
        '#2EBAC6',
        '#2EBAC6',
        new Map<number, string | null>([
          [1, '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.UNI,
      new AssetDetails(
        'UNI',
        18,
        uni_logo,
        UNILogo,
        '#FFE1EF',
        '#FFE1EF',
        new Map<number, string | null>([
          [1, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.LRC,
      new AssetDetails(
        'LRC',
        18,
        lrc_logo,
        LRCLogo,
        '#1E61FF',
        '#DCE7FF',
        new Map<number, string | null>([
          [1, '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.COMP,
      new AssetDetails(
        'COMP',
        18,
        comp_logo,
        COMPLogo,
        '#00F9B0',
        '#9DFBDF',
        new Map<number, string | null>([
          [1, '0xc00e94cb662c3520282e6f5717214004a7f26888'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.BPT,
      new AssetDetails(
        'BPT',
        18,
        null,
        null,
        '',
        '',
        new Map<number, string | null>([
          [1, '0xe26A220a341EAca116bDa64cF9D5638A935ae629'],
          [42, '0x4c4462c6bca4c92bf41c40f9a4047f35fd296996']
        ])
      )
    ],
    [
      Asset.CRV,
      new AssetDetails(
        'CRV',
        18,
        null,
        null,
        '',
        '',
        new Map<number, string | null>([
          [1, '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490'],
          [42, '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490']
        ])
      )
    ],
    [
      Asset.WBNB,
      new AssetDetails(
        'WBNB',
        18,
        bnb_logo,
        BNBLogo,
        '#F3BA2F',
        '#F3BA2F',
        new Map<number, string | null>([[56, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c']])
      )
    ],
    [
      Asset.BNB,
      new AssetDetails(
        'BNB',
        18,
        bnb_logo,
        BNBLogo,
        '#F3BA2F',
        '#F3BA2F',
        new Map<number, string | null>([[56, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c']])
      )
    ],
    [
      Asset.BUSD,
      new AssetDetails(
        'BUSD',
        18,
        busd_logo,
        BUSDLogo,
        '#F0B90B',
        '#F0B90B',
        new Map<number, string | null>([[56, '0xe9e7cea3dedca5984780bafc599bd69add087d56']])
      )
    ],
    [
      Asset.BTC,
      new AssetDetails(
        'BTC',
        18,
        btc_logo,
        BTCLogo,
        '#F7931A',
        '#F7931A',
        new Map<number, string | null>([[56, '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c']])
      )
    ]
  ])
}
