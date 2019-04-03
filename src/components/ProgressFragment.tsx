import BigNumber from "bignumber.js";
import React, { Component } from "react";
import Modal from "react-modal";
import { Asset } from "../domain/Asset";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { PositionType } from "../domain/PositionType";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { ProgressBar } from "./ProgressBar";
import { ProgressDetails } from "./ProgressDetails";

export interface IProgressFragmentState {
  requestTasks: RequestTask[];
  isProgressDetailsModalOpen: boolean;
}

export class ProgressFragment extends Component<any, IProgressFragmentState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isProgressDetailsModalOpen: false,
      requestTasks: [
        new RequestTask(new LendRequest(LendType.LEND, Asset.wBTC, new BigNumber(5)), RequestStatus.IN_PROGRESS),
        new RequestTask(new LendRequest(LendType.UNLEND, Asset.ETH, new BigNumber(5)), RequestStatus.AWAITING),
        new RequestTask(
          new TradeRequest(TradeType.BUY, Asset.KNC, PositionType.SHORT, 2, new BigNumber(5)),
          RequestStatus.AWAITING
        )
      ]
    };
  }

  public render() {
    return this.state.requestTasks.length === 0 ? null : (
      <React.Fragment>
        <ProgressBar requestTask={this.state.requestTasks[0]} onViewMore={this.onViewMore} />
        <Modal
          isOpen={this.state.isProgressDetailsModalOpen}
          onRequestClose={this.onRequestClose}
          className="modal-content-div"
          overlayClassName="modal-overlay-div"
        >
          <ProgressDetails tasks={this.state.requestTasks} onRequestClose={this.onRequestClose} />
        </Modal>
      </React.Fragment>
    );
  }

  public onViewMore = () => {
    this.setState({ ...this.state, isProgressDetailsModalOpen: true });
  };

  public onRequestClose = () => {
    this.setState({ ...this.state, isProgressDetailsModalOpen: false });
  };
}
