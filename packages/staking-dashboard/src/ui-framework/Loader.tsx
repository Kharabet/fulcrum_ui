import React, { PureComponent } from 'react'

interface ILoaderProps {
  quantityDots: number
  sizeDots: string
  title: string
  isOverlay: boolean
  isWarningTitle?: boolean
  className?: string
}

export default class Loader extends PureComponent<ILoaderProps> {
  public constructor(props: ILoaderProps, context?: any) {
    super(props, context)
  }

  public renderDots = () => {
    const animationDuration = 0.35 * this.props.quantityDots
    const wrapperDots = []
    for (let i = 0; i < this.props.quantityDots; i++) {
      wrapperDots.push(
        <span
          key={i}
          className={`${this.props.sizeDots}-dots`}
          style={{ animationDuration: `${animationDuration}s` }}
        />
      )
    }
    return wrapperDots
  }

  public render() {
    return (
      <React.Fragment>
        <div className={`loader ${this.props.className || ''}`}>
          {this.props.isOverlay ? <div className="loader-wrapper" /> : null}
          <div className={`${this.props.isOverlay ? `loader-overlay` : ``}`}>
            <div className={`loader-content loader-content-${this.props.sizeDots}`}>
              {this.props.title.length !== 0 ? (
                <p
                  className={`loader-text loader-text-${this.props.sizeDots} ${
                    this.props.isWarningTitle ? 'warning' : ''
                  }`}>
                  {this.props.title}
                </p>
              ) : null}
              <div className="loader-dots">{this.renderDots()}</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
