import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { ReactComponent as WalletSvg } from "../assets/images/wallet-icon.svg";

export interface ITokenGridTabsProps {
  selectedKey: TradeTokenKey;
  isMobile: boolean;
  assets: Asset[];
  defaultUnitOfAccount: Asset;
  isShowMyTokensOnly: boolean;
  defaultLeverageShort: number;
  defaultLeverageLong: number;
  isLong: boolean;
  onSelect: (key: TradeTokenKey) => void;

  onTabSelect: (key: Asset) => void;
  onShowMyTokensOnlyChange: (value: boolean) => void;
}

interface ITokenGridTabsState {
  leverage: number;
  positionType: PositionType;

  isShowMyTokensOnly: boolean;
}

export class TokenGridTabs extends Component<ITokenGridTabsProps, ITokenGridTabsState> {
  constructor(props: ITokenGridTabsProps, context?: any) {
    super(props, context);
    this.state = {
      positionType: props.isLong ? PositionType.SHORT : PositionType.SHORT,
      leverage: props.isLong ? props.defaultLeverageLong : props.defaultLeverageShort,
      isShowMyTokensOnly: props.isShowMyTokensOnly
    };

  }


  private renderAsset = (asset: Asset) => {
    const assetDetails = AssetsDictionary.assets.get(asset);
    if (!assetDetails) return;

    const isActiveClassName = asset === this.props.selectedKey.asset && !this.state.isShowMyTokensOnly
      ? "trade-token-grid-tab-item--active"
      : "";

    const classNamePrefix = "trade-token-grid-tab-item";




    return (
      <div key={`${assetDetails.displayName}`}
        className={`${classNamePrefix} ${isActiveClassName} ${asset.toLowerCase()}-tab`}
        onClick={(e) => { this.onSelectClick(e, asset) }}
      >
        <div className={`${classNamePrefix}__col-token-image`}>
          {assetDetails.reactLogoSvg.render()}
          <span >{assetDetails.displayName}</span>
        </div>
      </div>
    );
  }


  private async onSelectClick(event: React.MouseEvent<HTMLElement>, asset: Asset) {
    event.stopPropagation();

    await this.setState({ ...this.state, isShowMyTokensOnly: false })
    await this.props.onShowMyTokensOnlyChange(false);
    await this.props.onSelect(this.getTradeTokenGridRowSelectionKey(asset));
  };

  private async onDropdownSelect(value: string) {
    if (value === "manage") {
      this.showMyTokensOnlyChange();
      return;
    }
    const asset = value as Asset;

    await this.props.onShowMyTokensOnlyChange(false);
    await this.props.onSelect(this.getTradeTokenGridRowSelectionKey(asset));
  }


  public render() {
    var selectedAsset = AssetsDictionary.assets.get(this.props.selectedKey.asset);
    var displayName = !!selectedAsset ? selectedAsset.displayName : "manage"

    return (
      <div className={`trade-token-grid-tab ${displayName && !this.state.isShowMyTokensOnly ? displayName.toLowerCase() : "manage"}`} >
        <div className="trade-token-grid-tab__container">
          <div className="trade-token-grid-tab__selector">
            {this.renderDropdown()}
          </div>
          {this.props.assets.map(asset => (this.renderAsset(asset)))}
          <div className={`trade-token-grid-tab-item ${this.state.isShowMyTokensOnly ? "trade-token-grid-tab-item--active" : ""}`} onClick={this.showMyTokensOnlyChange}>
            <div className={`trade-token-grid-tab-item__col-token-image wallet-img-div`} >
              {<WalletSvg />}
              <span>Manage</span>
            </div>
          </div>

        </div>
      </div>
    )
  }

  public showMyTokensOnlyChange = async () => {
    await this.props.onShowMyTokensOnlyChange(true);
    await this.setState({ ...this.state, isShowMyTokensOnly: true })
  }

  private getTradeTokenGridRowSelectionKeyRaw(asset: Asset) {
    const key = new TradeTokenKey(asset, this.props.defaultUnitOfAccount, this.state.positionType, this.state.leverage, true, 2);

    // check for version 2, and revert back to version if not found
    if (key.erc20Address === "") {
      key.setVersion(1);
    }

    return key;
  }

  private getTradeTokenGridRowSelectionKey(asset: Asset) {
    return this.getTradeTokenGridRowSelectionKeyRaw(asset);
  }

  private onStyledSelectClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    const select = e.currentTarget.closest(".select") as HTMLElement;
    const ul = select.querySelector("ul.select-options") as HTMLElement;
    const selectStyled = e.currentTarget;

    if (selectStyled.classList.contains("active")) {
      selectStyled.classList.remove("active");
      ul.style.display = 'none';
    } else {
      selectStyled.classList.add("active");
      ul.style.display = 'block';
    }
  }
  private onLiClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    const li = e.currentTarget;
    const select = e.currentTarget.closest(".select") as HTMLElement;
    const ul = select.querySelector("ul.select-options") as HTMLElement;
    const selectStyled = select.querySelector(".styled-select") as HTMLElement;
    const selectNative = select.querySelector("select[name='tabs_selector']") as HTMLSelectElement
    selectStyled.textContent = li.textContent
    selectStyled.classList.remove('active');
    selectNative.selectedIndex = parseInt(li.dataset.index!);
    ul.style.display = 'none';
    this.onDropdownSelect(li.dataset.value!);
  }

  private renderDropdown() {

    // document.addEventListener("click", function (e) {
    //   const ul = document.querySelector("ul.select-options") as HTMLElement;
    //   const selectStyled = document.querySelector(".styled-select") as HTMLElement;

    //   selectStyled.classList.remove('active');
    //   ul.style.display = "none";
    // });
    return (<div className="select">
      <select className="select-hidden" name="tabs_selector" value={!this.state.isShowMyTokensOnly ? this.props.selectedKey.asset : "manage"}>
        {this.props.assets.map(asset => (<option value={asset}>{`${asset}-DAI`}</option>))}
        <option value="manage">Manage</option>
      </select>
      <div className="styled-select" onClick={this.onStyledSelectClick}>
        {!this.state.isShowMyTokensOnly ? this.props.selectedKey.asset + "-DAI" : "Manage"}
      </div>
      <ul className="select-options">
        {this.props.assets.map((asset, i) => (<li data-value={asset} data-index={i} onClick={this.onLiClick.bind(this)}>{`${asset}-DAI`}</li>))}
        <li data-value="manage" data-index={this.props.assets.length} onClick={this.onLiClick.bind(this)}>Manage</li>

      </ul>
    </div>);
  }

}
