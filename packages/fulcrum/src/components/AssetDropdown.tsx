import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";

export interface IAssetDropdownProps {
  assets: Asset[];
  selectedAsset: Asset;
  onAssetChange?: (asset: Asset) => void;
}

export interface IAssetDropdownState {
  isOpened: boolean;
}

export class AssetDropdown extends Component<IAssetDropdownProps, IAssetDropdownState> {
  constructor(props: IAssetDropdownProps) {
    super(props);

    this.state = { isOpened: false };
  }

  componentDidUpdate(prevProps: Readonly<IAssetDropdownProps>, prevState: Readonly<IAssetDropdownState>, snapshot?: any): void {
    if (prevState.isOpened !== this.state.isOpened) {
      if (document.querySelector(".asset-dropdown__wrapper")) {
        const assetDropdownSelector = document.querySelector(".asset-dropdown__wrapper") as HTMLElement;
        const boundingClient = assetDropdownSelector.getBoundingClientRect();
        assetDropdownSelector!.style.left = -1 * boundingClient!.left + "px";
      }
    }
  }
  tokenItems() {
    return this.props.assets.filter(asset => asset !== this.props.selectedAsset).map(e => {
      const assetDetails = AssetsDictionary.assets.get(e);

      if (!assetDetails) {
        return null;
      }
      return (
        <div
          key={e}
          className="asset-dropdown-item"
          onClick={() => this.onSelect(e)}
        >

          <div className="asset-dropdown-item__image-container">
            {assetDetails.reactLogoSvg.render()}
          </div>
          <div className="asset-dropdown-item__description-container">
            <div className="asset-dropdown-item__name">{assetDetails.displayName}</div>
          </div>
        </div >
      )
    })
  };

  private onSelect = (asset: Asset) => {
    if (this.props.onAssetChange)
      this.props.onAssetChange(asset);
    this.onClose();
  }

  private onOpenClick = () => {
    this.setState({ ...this.state, isOpened: true })
  }
  private onClose = () => {
    this.setState({ ...this.state, isOpened: false })

  }

  public render() {

    const activeAssetDetails = AssetsDictionary.assets.get(this.props.selectedAsset);
    if (!activeAssetDetails) return null;
    return (
      <div className="asset-dropdown-container">
        <div className={`asset-dropdown-button ${this.state.isOpened ? "opened" : "closed"} ${this.props.assets.length === 1 ? "empty" : ""}`} onClick={this.onOpenClick}>
          {activeAssetDetails.reactLogoSvg.render()}
          <span>{activeAssetDetails.displayName}</span>
        </div>
        {this.state.isOpened ?
          <React.Fragment>
            <div className="asset-dropdown__wrapper" onClick={this.onClose}></div>
            <div className="asset-dropdown">
              <div className="asset-dropdown__items">{this.tokenItems()}</div>
            </div>
          </React.Fragment> : null}
      </div>
    );
  }
}
