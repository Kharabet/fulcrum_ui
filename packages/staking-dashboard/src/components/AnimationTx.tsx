import React, { Component } from "react";
import animationData from "../config/animation-tx.json";

import Lottie from 'react-lottie';

interface IAnimationTxProps {
}

export class AnimationTx extends Component<IAnimationTxProps> {
  public render() {

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
    return (
      <React.Fragment>
        <div className="animation-tx">
          <p className="animation-title">Processed Tokens</p>
          <Lottie options={defaultOptions} height={370} width={370} />
        </div>
      </React.Fragment>
    );
  }
}