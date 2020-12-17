import { observer } from 'mobx-react'
import React from 'react'
import Lottie from 'react-lottie'
import animationData from 'src/config/animation-tx.json'
import TxLoaderStep from './TxLoaderStep'
import RootStore from 'src/stores/RootStore'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}

interface IAnimationTXProps {
  rootStore: RootStore
}

export function AnimationTx({ rootStore }: IAnimationTXProps) {
  const { transactionStatus } = rootStore.stakingStore
  const { txHash } = transactionStatus
  return (
    <div className="animation-tx">
      <p className="animation-title">
        <TxLoaderStep transactionStatus={transactionStatus} />
      </p>
      <Lottie options={defaultOptions} height={370} width={370} />
      {txHash &&
        <a className="animation-tx__link" href={`${rootStore.etherscanURL}tx/${txHash}`} target="_blank" rel="noopener noreferrer">
          View transaction on Etherscan
        </a>
      }
    </div>
  )
}

export default observer(AnimationTx)
