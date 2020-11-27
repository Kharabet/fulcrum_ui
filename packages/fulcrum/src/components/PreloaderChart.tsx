import React, { Component } from 'react'

interface IPreloaderChartProps {
  quantityDots: number
  sizeDots: string
  title: string
  isOverlay: boolean
}

export class PreloaderChart extends Component<IPreloaderChartProps> {
  public constructor(props: IPreloaderChartProps, context?: any) {
    super(props, context)
  }

  public render() {
    return (
      <React.Fragment>
        <div className={`loader`}>
          {this.props.isOverlay && <div className="loader-wrapper"></div>}
          <div className={`${this.props.isOverlay ? `loader-overlay` : ``}`}>
            <div className="loader-content">
              {this.props.title.length !== 0 && (
                <p className={`loader-text loader-text-${this.props.sizeDots}`}>
                  {this.props.title}
                </p>
              )}
              <div className={`loader-dots`}>
                <span className={`${this.props.sizeDots}-dots`}></span>
                <span className={`${this.props.sizeDots}-dots`}></span>
                <span className={`${this.props.sizeDots}-dots`}></span>
                <span className={`${this.props.sizeDots}-dots`}></span>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
