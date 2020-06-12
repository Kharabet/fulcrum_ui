import React, { useState } from 'react';
import { ReactComponent as WalletSvg } from "../assets/images/wallet-icon.svg";

export interface IManageButtonProps {
  isMobile: boolean;
  openedPositionsCount: number;
  isShowMyTokensOnly: boolean;
  onShowMyTokensOnlyChange: (value: boolean) => void;
}

export const ManageButton = (props: IManageButtonProps) => {

  const showMyTokensOnlyChange = async () => {
    await props.onShowMyTokensOnlyChange(true);
  }
  return (
    <div className={`trade-token-grid-tab-item manage-tab ${props.isShowMyTokensOnly ? "trade-token-grid-tab-item--active" : ""}`} onClick={showMyTokensOnlyChange}>
      <div className={`trade-token-grid-tab-item__col-token-image`} >
        {<WalletSvg />}
        {!props.isMobile ? <span>Manage</span> : null}
        <span className="opened-positions-count">{props.openedPositionsCount}</span>
      </div>
    </div>
  )
}