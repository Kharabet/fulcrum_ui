import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";

import { ReactComponent as ArrowRight } from "../assets/images/ic_arrow_right.svg";
import { Loader } from "./Loader";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";
import { BorrowDlg } from "./BorrowDlg";
import { ProviderType } from "../domain/ProviderType";
import { BorrowRequest } from "../domain/BorrowRequest";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { NavService } from "../services/NavService";
import { ProgressFragment } from "./ProgressFragment";

export interface IAssetSelectorItemProps {
  asset: Asset;
  selectedAsset: Asset;
  isLoadingTransaction: boolean;
  borrowDlgRef: React.RefObject<BorrowDlg>;
  doNetworkConnect: () => void;
}

interface IAssetSelectorItemState {
  interestRate: BigNumber;
  isLoadingTransaction: boolean;
  request: BorrowRequest | undefined;
}

export class AssetSelectorItem extends Component<IAssetSelectorItemProps, IAssetSelectorItemState> {
  constructor(props: IAssetSelectorItemProps) {
    super(props);

    this.state = {
      interestRate: new BigNumber(0),
      isLoadingTransaction: false,
      request: undefined
    };
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
  }
  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true })
  }
  private onAskToCloseProgressDlg = async (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        TorqueProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false })
      }, 5000)
      return;
    }
    // await this.derivedUpdate();
    await this.setState({ ...this.state, isLoadingTransaction: false });
    NavService.Instance.History.push("/dashboard");
  }

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);

    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IAssetSelectorItemProps>,
    prevState: Readonly<IAssetSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.asset !== prevProps.asset) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(this.props.asset);
    this.setState({ ...this.state, interestRate: interestRate });
  };

  public render() {
    let asset = AssetsDictionary.assets.get(this.props.asset) as AssetDetails;
    return (
      !this.state.interestRate.gt(0)
        ? <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
        : <React.Fragment>
          <div className="asset-selector-item">
            {
              this.state.isLoadingTransaction && this.state.request && <ProgressFragment quantityDots={3} sizeDots={'small'} isOverlay={true} taskId={this.state.request.id} />
            }
            <div className="asset-selector-item-content" onClick={this.onClick}>
              <div className="asset-selector-body">
                <div className="asset-selector-row">
                  <div className="asset-selector__interest-rate">
                    <span className="asset-selector__interest-rate-value">{this.state.interestRate.gt(0) ? `${this.state.interestRate.toFixed(2)}` : `0`}</span>%
                  </div>
                </div>
                <div className="asset-selector-row">
                  <div className="asset-selector__apr">APR</div>
                  <div className="asset-selector__fixed">FIXED</div>
                </div>
              </div>
              <div className="asset-selector-footer">
                <div className="asset-selector__title">
                  {this.props.asset}
                </div>
                <div className="asset-selector__icon">
                  {asset.reactLogoSvg.render()}
                </div>
                <div className="asset-selector__arrow">
                  <ArrowRight />
                </div>
              </div>
            </div>
            <div className="asset-selector-item-bg" style={{ backgroundColor: asset.bgColor }}></div>
          </div>
        </React.Fragment>
    )
  }

  private onClick = async () => {

    if (!this.props.borrowDlgRef.current) return;

    if (TorqueProvider.Instance.providerType === ProviderType.None || !TorqueProvider.Instance.contractsSource || !TorqueProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect()
      return
    }

    try {
      const borrowRequest = await this.props.borrowDlgRef.current.getValue(this.props.asset);
      await this.setState({ ...this.state, request: borrowRequest });
      await TorqueProvider.Instance.onDoBorrow(borrowRequest);
      // if (receipt.status === 1) {
      // this.setState({ ...this.state, isLoadingTransaction: false, selectedAsset: asset });
      //NavService.Instance.History.push("/dashboard");
      // }
    } catch (error) {
      if (error.message !== "Form closed")
        console.error(error);
      // this.setState({ ...this.state, isLoadingTransaction: false, selectedAsset: asset });
    }
    // this.props.onSelectAsset(this.props.asset);
  };
}
