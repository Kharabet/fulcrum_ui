import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { CollateralTokenSelectorItem } from "./CollateralTokenSelectorItem";

interface ICollateralTokenSelectorProps {
  updateStateActiveToggle: (state: boolean) => void;
}

interface ICollateralTokenSelectorState {
  isOpen: boolean;
  borrowAsset: Asset;
  collateralAsset: Asset;

  executorParams: { resolve: (value?: Asset) => void; reject: (reason?: any) => void } | null;
}

export class CollateralTokenSelector extends Component<ICollateralTokenSelectorProps, ICollateralTokenSelectorState> {
  private assets: Asset[];
  public constructor(props: any, context?: any) {
    super(props, context);

    this.state = {
      isOpen: false,
      borrowAsset: Asset.UNKNOWN,
      collateralAsset: Asset.UNKNOWN,
      executorParams: null
    };
    if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
      this.assets = [
        Asset.ETH,
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.SUSD,
        Asset.LINK,
        Asset.WBTC,
        Asset.MKR,
        Asset.ZRX,
        Asset.BAT,
        Asset.REP,
        Asset.KNC
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      this.assets = [
        Asset.ETH,
        Asset.SAI,
        Asset.DAI,
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      this.assets = [
        Asset.ETH,
        Asset.DAI,
      ];
    } else {
      this.assets = [];
    }
  }

  public componentDidUpdate(prevProps: Readonly<ICollateralTokenSelectorProps>, prevState: Readonly<ICollateralTokenSelectorState>, snapshot?: any) {
    if (prevState.isOpen !== this.state.isOpen) {
      const collateralTokenSelector = document.querySelector(".collateral-token-selector__wrapper") as HTMLElement;
      if (collateralTokenSelector) {
        const boundingClient = collateralTokenSelector.getBoundingClientRect();
        collateralTokenSelector!.style.top = -1 * boundingClient!.top + "px";
        collateralTokenSelector!.style.left = -1 * boundingClient!.left + "px";
      }
      this.props.updateStateActiveToggle(this.state.isOpen);
    }
  }

  public render() {
    const tokenItems = this.assets.filter(e => 
        !(e === this.state.borrowAsset
          //|| (e === Asset.SAI && this.props.borrowAsset === Asset.DAI)
          //|| (e === Asset.DAI && this.props.borrowAsset === Asset.SAI)
        )
      ).map(e => (
      <CollateralTokenSelectorItem
        key={e}
        asset={e}
        selectedCollateral={this.state.collateralAsset}
        onCollateralChange={this.onFormSubmit}
      />
    ));
    return (
      <React.Fragment>
        {this.state.isOpen
          ? <React.Fragment>
            <div className="collateral-token-selector__wrapper" onClick={this.onClose}></div>
            <div className="collateral-token-selector__container">
              <div className="collateral-token-selector__items">{tokenItems}</div>
            </div>
          </React.Fragment>
          : null
        }
      </React.Fragment>
    );
  }

  public getValue = async (borrowAsset: Asset, collateralAsset: Asset): Promise<Asset> => {
    if (this.state.isOpen) {
      return new Promise<Asset>((resolve, reject) => reject());
    }

    return new Promise<Asset>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        borrowAsset: borrowAsset,
        collateralAsset: collateralAsset
      });
    });
  };

  public onClose = () => {
    this.setState({ ...this.state, isOpen: false, executorParams: null });
  };

  private onFormSubmit = (value: Asset) => {
    if (this.state.executorParams) {
      this.state.executorParams.resolve(value);
    }
  };
}
