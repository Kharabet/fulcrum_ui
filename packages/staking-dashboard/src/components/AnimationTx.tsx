import React, { Component } from 'react'
import Lottie from 'react-lottie'
import { TxLoaderStep } from './TxLoaderStep'
import { StakingProvider } from '../services/StakingProvider'

import animationData from '../config/animation-tx.json'

interface IAnimationTxProps {}

interface IAnimationTxState {
  txHash: string
}

export class AnimationTx extends Component<IAnimationTxProps, IAnimationTxState> {
  constructor(props: IAnimationTxProps) {
    super(props)
    this.state = {
      txHash: ''
    }
  }

  private onTxHash = (txHash: string) => {
    this.setState({ ...this.state, txHash })
  }

  public render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }

    return (
      <React.Fragment>
        <div className="animation-tx">
          {this.state.txHash ? (
            <a
              href={`${StakingProvider.Instance.web3ProviderSettings!.etherscanURL}tx/${
                this.state.txHash
              }`}
              target="_blank"
              rel="noopener noreferrer">
              <p className="animation-title">
                <TxLoaderStep onTxHash={this.onTxHash} />
              </p>
              <Lottie options={defaultOptions} height={370} width={370} />
            </a>
          ) : (
            <React.Fragment>
              <p className="animation-title">
                <TxLoaderStep onTxHash={this.onTxHash} />
              </p>
              <Lottie options={defaultOptions} height={370} width={370} />
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    )
  }
}
