import React, { Component, RefObject } from 'react'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { CollateralTokenSelector } from './CollateralTokenSelector'
import { ReactComponent as ArrowSelect } from '../assets/images/arrow-select.svg'

export interface ICollateralTokenSelectorToggleProps {
  borrowAsset: Asset
  collateralAsset: Asset
  readonly: boolean

  onChange: (value: Asset) => void
}

interface IAssetSelectorItemState {
  assetDetails: AssetDetails | null
  activeToggle: boolean
}

export class CollateralTokenSelectorToggle extends Component<
  ICollateralTokenSelectorToggleProps,
  IAssetSelectorItemState
> {
  private CollateralTokenSelectorRef: RefObject<CollateralTokenSelector>

  constructor(props: ICollateralTokenSelectorToggleProps) {
    super(props)

    this.CollateralTokenSelectorRef = React.createRef()

    this.state = {
      assetDetails: null,
      activeToggle: false
    }
  }

  public componentDidMount(): void {
    this.derivedUpdate()
  }

  public componentDidUpdate(
    prevProps: Readonly<ICollateralTokenSelectorToggleProps>,
    prevState: Readonly<IAssetSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.collateralAsset !== prevProps.collateralAsset) {
      this.derivedUpdate()
    }
  }

  private derivedUpdate = async () => {
    const assetDetails = AssetsDictionary.assets.get(this.props.collateralAsset) || null
    this.setState({ ...this.state, assetDetails: assetDetails })
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null
    }

    return (
      <React.Fragment>
        <div
          className={`collateral-token-selector-toggle ${this.state.activeToggle ? `active` : ``}`}>
          <div className="collateral-token-selector-toggle__logo-container">
            {this.state.assetDetails.reactLogoSvg.render()}
          </div>
          <div
            className="collateral-token-selector-toggle__info-container"
            onClick={this.onChangeClick}>
            <div className="collateral-token-selector-toggle__info-title">
              Collateral {this.props.collateralAsset}
            </div>
            <span className="collateral-token-selector-toggle__arrow">
              <ArrowSelect />
            </span>
          </div>
          <CollateralTokenSelector
            ref={this.CollateralTokenSelectorRef}
            updateStateActiveToggle={this.updateStateActiveToggle}
          />
        </div>
      </React.Fragment>
    )
  }

  private onChangeClick = async () => {
    if (this.CollateralTokenSelectorRef.current) {
      try {
        const collateralAsset = await this.CollateralTokenSelectorRef.current.getValue(
          this.props.borrowAsset,
          this.props.collateralAsset
        )
        this.props.onChange(collateralAsset)
      } finally {
        await this.CollateralTokenSelectorRef.current.onClose()
      }
    }
  }

  public updateStateActiveToggle = (activeToggle: boolean) => {
    this.setState({ ...this.state, activeToggle: activeToggle })
  }
}
