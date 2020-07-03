import React, { Component } from "react";

interface ILoaderProps {
    quantityDots: number,
    sizeDots: string,
    title: string,
    isOverlay: boolean,
    isWarningTitle?: boolean
}

export class Loader extends Component<ILoaderProps> {
    public constructor(props: ILoaderProps, context?: any) {
        super(props, context);
    }
    public renderDots = () => {
        const animationDuration = 0.35 * this.props.quantityDots;
        let wrapperDots = [];
        for (var i = 0; i < this.props.quantityDots; i++) {
            wrapperDots.push(<span key={i} className={`${this.props.sizeDots}-dots`} style={{ animationDuration: `${animationDuration}s` }}></span>)
        }
        return wrapperDots;
    }

    public componentDidMount(): void {
        const loaderWrapper = document.querySelector(".loader-wrapper") as HTMLElement;
        // if (loaderWrapper) {
        //   const boundingClient = loaderWrapper.getBoundingClientRect();
        //   loaderWrapper!.style.top = -1 * boundingClient!.top + "px";
        //   loaderWrapper!.style.left = -1 * (boundingClient!.left + 20) + "px";
        // }
    }

    public render() {
        return (
            <React.Fragment>
                <div className="loader">
                    {this.props.isOverlay ? <div className="loader-wrapper"></div> : null}
                    <div className={`${this.props.isOverlay ? `loader-overlay` : ``}`}>
                        <div className={`loader-content loader-content-${this.props.sizeDots}`}>
                            {this.props.title.length !== 0
                                ? <p className={`loader-text loader-text-${this.props.sizeDots} ${this.props.isWarningTitle ? "warning" : ""}`}>{this.props.title}</p>
                                : null
                            }
                            <div className="loader-dots">
                                {this.renderDots()}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}