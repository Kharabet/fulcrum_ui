import React from 'react'
import { observer } from 'mobx-react'
import AssetBalance from 'shared-components/AssetBalance'
import { TokenBalances } from 'src/stores/StakingStore/UserBalances'

export function Balances({
  wallet,
  etherscanURL,
}: {
  wallet: TokenBalances
  etherscanURL: string
}) {
  return (
    <>
      <AssetBalance
        className="margin-bottom-2"
        link={`${etherscanURL}token/0x56d811088235F11C8920698a204A5010a788f4b3`}
        balance={wallet.bzrx}
        name="BZRX"
        id="bzrx"
      />

      <AssetBalance
        className="margin-bottom-2"
        link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
        balance={wallet.vbzrx}
        name="vBZRX"
        id="vbzrx"
      />

      <AssetBalance
        className="margin-bottom-2"
        link={`${etherscanURL}token/0x18240BD9C07fA6156Ce3F3f61921cC82b2619157`}
        balance={wallet.ibzrx}
        name="iBZRX"
        id="ibzrx"
      />

      <AssetBalance
        link={`${etherscanURL}token/0xe26A220a341EAca116bDa64cF9D5638A935ae629`}
        balance={wallet.bpt}
        name="BPT"
        id="bpt"
      />
    </>
  )
}

export default observer(Balances)
