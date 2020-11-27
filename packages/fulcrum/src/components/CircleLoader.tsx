import React, { Component } from 'react'

interface ICircleLoaderProps {
  // quantityDots: number,
  // sizeDots: string,
  // title: string,
  // isOverlay: boolean,
  // isWarningTitle?: boolean
}

export class CircleLoader extends Component<ICircleLoaderProps> {
  public constructor(props: ICircleLoaderProps, context?: any) {
    super(props, context)
  }
  // public renderDots = () => {
  //   const animationDuration = 0.35 * this.props.quantityDots;
  //   let wrapperDots = [];
  //   for (var i = 0; i < this.props.quantityDots; i++) {
  //     wrapperDots.push(<span key={i} className={`${this.props.sizeDots}-dots`} style={{animationDuration : `${animationDuration}s`}}></span>)
  //   }
  //   return wrapperDots;
  // }

  public componentDidMount(): void {
    const loaderWrapper = document.querySelector('.loader-wrapper') as HTMLElement
    // if (loaderWrapper) {
    //   const boundingClient = loaderWrapper.getBoundingClientRect();
    //   loaderWrapper!.style.top = -1 * boundingClient!.top + "px";
    //   loaderWrapper!.style.left = -1 * (boundingClient!.left + 20) + "px";
    // }
  }

  public render() {
    return (
      <div className="circle-loader">
        <div className="circle-main"></div>
        <div className="circle-background"></div>
        {this.props.children}
      </div>
    )
  }
}
