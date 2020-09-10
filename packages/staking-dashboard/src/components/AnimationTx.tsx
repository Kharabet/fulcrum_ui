import React, { Component } from "react";
import { ReactComponent as AnimationTxSvg } from "../assets/images/tx-animation.svg"

interface IAnimationTxProps {
}

export class AnimationTx extends Component<IAnimationTxProps> {

  public render() {
    return (
      <React.Fragment>
        <AnimationTxSvg />
      </React.Fragment>
    );
  }
}