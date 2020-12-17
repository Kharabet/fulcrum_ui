import { Asset } from './Asset'
import { AssetDetails } from './AssetDetails'

import { ReactComponent as AAVE } from '../assets/images/token-aave.svg'
import { ReactComponent as BAT } from '../assets/images/token-bat.svg'
import { ReactComponent as BZRX } from '../assets/images/token-bzrx.svg'
import { ReactComponent as COMP } from '../assets/images/ic_token_comp.svg'
import { ReactComponent as CHI } from '../assets/images/token-chi.svg'
import { ReactComponent as DAI } from '../assets/images/token-dai.svg'
import { ReactComponent as ETH } from '../assets/images/token-eth.svg'
import { ReactComponent as KNC } from '../assets/images/token-knc.svg'
import { ReactComponent as LEND } from '../assets/images/token-lend.svg'
import { ReactComponent as LINK } from '../assets/images/token-link.svg'
import { ReactComponent as LRC } from '../assets/images/ic_token_lrc.svg'
import { ReactComponent as MKR } from '../assets/images/token-mkr.svg'
import { ReactComponent as REP } from '../assets/images/token-rep.svg'
import { ReactComponent as SAI } from '../assets/images/token-sai.svg'
import { ReactComponent as SUSD } from '../assets/images/token-susd.svg'
import { ReactComponent as UNI } from '../assets/images/token-uni.svg'
import { ReactComponent as USDC } from '../assets/images/token-usdc.svg'
import { ReactComponent as USDT } from '../assets/images/token-usdt.svg'
import { ReactComponent as WBTC } from '../assets/images/token-btc.svg'
import { ReactComponent as WETH } from '../assets/images/token-weth.svg'
import { ReactComponent as YFI } from '../assets/images/token-yfi.svg'
import { ReactComponent as ZRX } from '../assets/images/token-zrx.svg'
import { ReactComponent as BNB } from '../assets/images/token-bnb.svg'

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>([
    [
      Asset.BZRX,
      new AssetDetails(
        'BZRX',
        'bZx Protocol Token (BZRX)',
        BZRX,
        18,
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
        'Yearn Finance (YFI)',
        YFI,
        18,
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
        'Aave (LEND)',
        LEND,
        18,
        new Map<number, string | null>([
          [1, '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.BAT,
      new AssetDetails(
        'BAT',
        'Basic Attention Token (BAT)',
        BAT,
        18,
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
        WBTC,
        8,
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
        LINK,
        18,
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
        USDT,
        6,
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
        SAI,
        18,
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
        DAI,
        18,
        new Map<number, string | null>([
          [1, '0x6b175474e89094c44da98b954eedeac495271d0f'],
          [3, '0xf80a32a835f79d7787e8a8ee5721d0feafd78108'],
          [4, '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea'],
          [42, '0x8f746ec7ed5cc265b90e7af0f5b07b4406c9dda8']
        ])
      )
    ],
    [
      Asset.USDC,
      new AssetDetails(
        'USDC',
        'USD Coin (USDC)',
        USDC,
        6,
        new Map<number, string | null>([
          [1, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'],
          [3, '0x95cc8d8f29d0f7fcc425e8708893e759d1599c97'], // using eng
          [42, '0xB443f30CDd6076b1A5269dbc08b774F222d4Db4e']
        ])
      )
    ],
    [
      Asset.SUSD,
      new AssetDetails(
        'SUSD',
        'Synth sUSD (sUSD)',
        SUSD,
        18,
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
        'Ethereum (ETH)',
        ETH,
        18,
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
        'ETH', // "WETH",
        'Ethereum (ETH)', // "Wrapped Ether (WETH)",
        ETH,
        18,
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
        WETH,
        18,
        new Map<number, string | null>([[42, '0xfbe16ba4e8029b759d3c5ef8844124893f3ae470']])
      )
    ],
    [
      Asset.KNC,
      new AssetDetails(
        'KNC',
        'Kyber Network (KNC)',
        KNC,
        18,
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
        MKR,
        18,
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
        REP,
        18,
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
        ZRX,
        18,
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
        BZRX,
        18,
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
        YFI,
        18,
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
        LEND,
        18,
        new Map<number, string | null>([
          [1, '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03'],
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
        UNI,
        18,
        new Map<number, string | null>([
          [1, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'],
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
        AAVE,
        18,
        new Map<number, string | null>([
          [1, '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.CHI,
      new AssetDetails(
        'CHI',
        'CHI',
        CHI,
        0,
        new Map<number, string | null>([
          [1, '0x0000000000004946c0e9f43f4dee607b0ef1fa1c'],
          [42, '0x0000000000004946c0e9f43f4dee607b0ef1fa1c']
        ])
      )
    ],
    [
      Asset.LRC,
      new AssetDetails(
        'LRC',
        'LRC',
        LRC,
        18,
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
        'COMP',
        COMP,
        18,
        new Map<number, string | null>([
          [1, '0xc00e94cb662c3520282e6f5717214004a7f26888'],
          [3, ''],
          [42, '']
        ])
      )
    ],
    [
      Asset.BNB,
      new AssetDetails(
        'BNB',
        'BNB',
        BNB,
        18,
        new Map<number, string | null>([
          [1, '0xb8c77482e45f1f44de1745f52c74426c631bdd52'],
          [3, ''],
          [42, '']
        ])
      )
    ]
  ])
}
