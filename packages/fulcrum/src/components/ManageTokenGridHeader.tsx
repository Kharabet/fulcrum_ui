import React, { Component } from 'react'

export interface IManageTokenGridHeaderProps {
  isShowHistory: boolean
  isShowMyTokensOnly: boolean
  openedPositionsCount: number
  updateStateisShowHistory: (updatedState: boolean) => void
}

export interface IManageTokenGridHeaderState {
  isShowHistory: boolean
}

export class ManageTokenGridHeader extends Component<
  IManageTokenGridHeaderProps,
  IManageTokenGridHeaderState
> {
  constructor(props: IManageTokenGridHeaderProps) {
    super(props)
    this._isMounted = false
    this.state = {
      isShowHistory: props.isShowHistory
    }
  }

  private _isMounted: boolean

  public componentDidMount(): void {
    this._isMounted = true
  }

  public componentWillUnmount(): void {
    this._isMounted = false
  }

  public render() {
    return (
      <div className="manage-token-grid__group-tabs">
        <div
          className={`tab ${
            this.props.isShowMyTokensOnly && !this.props.isShowHistory ? `active` : ``
          }`}
          onClick={this.onShowOpenPositions}>
          <div className="manage-tab">
            <div className={`trade-token-grid-tab-item__col-token-image`}>
              <span>Open Positions</span>
              <span className="opened-positions-count">{this.props.openedPositionsCount}</span>
            </div>
          </div>
        </div>
        <div
          className={`tab ${this.props.isShowHistory ? `active` : ``}`}
          onClick={this.onShowHistory}>
          Trade history
        </div>
      </div>
    )
  }
  private onShowHistory = () => {
    this.props.updateStateisShowHistory(true)
    this._isMounted && this.setState({ ...this.state, isShowHistory: true })
  }

  private onShowOpenPositions = () => {
    this.props.updateStateisShowHistory(false)
    this._isMounted && this.setState({ ...this.state, isShowHistory: false })
  }
}
