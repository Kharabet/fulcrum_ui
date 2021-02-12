import Asset from 'bzx-common/src/assets/Asset'
import React, { Component } from 'react'
import { ReactComponent as IconSwitch } from '../assets/images/icon_switch.svg'
import ReactTooltip from 'react-tooltip'

export interface ILiquidationDropdownProps {
  loanAsset: Asset
  collateralAsset: Asset
  selectedAsset: Asset
  onAssetChange?: (asset: Asset) => void
}

export interface ILiquidationDropdownState {
  isOpened: boolean
}

export class LiquidationDropdown extends Component<ILiquidationDropdownProps, ILiquidationDropdownState> {
  constructor(props: ILiquidationDropdownProps) {
    super(props)

    this.state = { isOpened: false }
  }

  public componentDidUpdate(
    prevProps: Readonly<ILiquidationDropdownProps>,
    prevState: Readonly<ILiquidationDropdownState>,
    snapshot?: any
  ): void {
    if (prevState.isOpened !== this.state.isOpened) {
      if (document.querySelector('.liquidation-dropdown__wrapper')) {
        const LiquidationDropdownSelector = document.querySelector(
          '.liquidation-dropdown__wrapper'
        ) as HTMLElement
        const boundingClient = LiquidationDropdownSelector.getBoundingClientRect()
        LiquidationDropdownSelector!.style.left = -1 * boundingClient!.left + 'px'
      }
    }
  }

  private onSelect = (asset: Asset) => {
    if (this.props.onAssetChange) this.props.onAssetChange(asset)
    this.onClose()
  }

  private onOpenClick = () => {
    this.setState({ ...this.state, isOpened: true })
  }
  private onClose = () => {
    this.setState({ ...this.state, isOpened: false })
  }

  public render() {
    const unselectedAsset =
      this.props.selectedAsset === this.props.loanAsset
        ? this.props.collateralAsset
        : this.props.loanAsset

    return (
      <React.Fragment>
      
        <div className="liquidation-dropdown-container">
        {this.state.isOpened ? (
          <div className="liquidation-dropdown__wrapper" onClick={this.onClose} />
        ) : null}
          <div className="liquidation-dropdown-container">
            <div
              className={`liquidation-dropdown-button ${this.state.isOpened ? 'opened' : 'closed'}`}
              onClick={this.onOpenClick}>
              <span>
                {this.props.selectedAsset}/{unselectedAsset}
              </span>
              <span className="liquidation-dropdown-button__arrow">
                <IconSwitch 
                 data-tip="Click to toggle quote currency. Liq is the price at which your position is liquidated."
                 data-for="covert"/>
                <ReactTooltip id="covert" className="tooltip__info" place="top" effect="solid" />
              </span>
            </div>
            {this.state.isOpened ? (
              <React.Fragment>
                <div className="liquidation-dropdown">
                  <div className="liquidation-dropdown__items">
                    <div
                      className="liquidation-dropdown-item"
                      onClick={() => this.onSelect(unselectedAsset)}>
                      <div className="liquidation-dropdown-item__description-container">
                        <div className="liquidation-dropdown-item__name">
                          {unselectedAsset}/{this.props.selectedAsset}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
