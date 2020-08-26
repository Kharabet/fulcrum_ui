import React from "react";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"

import { ReactComponent as BzrxIcon } from "../assets/images/token-bzrx.svg"
import { ReactComponent as VBzrxIcon } from "../assets/images/token-vbzrx.svg"
import { ReactComponent as BPTIcon } from "../assets/images/token-bpt.svg"
import { ReactComponent as Search } from "../assets/images/icon-search.svg"

export interface IFindRepresentativeProps {
  onFindRepresentativeClose: () => void;
}

export const FindRepresentative = (props: IFindRepresentativeProps) => {
  return (
    <div className="modal find-representative">
      <div className="modal__title">
        Find a Representative
        <div onClick={props.onFindRepresentativeClose}>
          <CloseIcon className="modal__close" />
        </div>
      </div>
      <div>
        <div className="input-wrapper">
          <Search />
          <input placeholder="Search" />
        </div>
        <div className="header-find-representative">
          <span className="representative">Representative</span>
          <span className="stake">Stake</span>
        </div>
        <ul>
          <li className="item-find-representative">
            <div className="photo"></div>
            <div className="name">Chris Bronson</div>
            <div className="token">
              <BzrxIcon />
              <span>254,540.30</span>
            </div>
            <div className="token">
              <VBzrxIcon />
              <span>254,540.30</span>
            </div>
            <div className="token">
              <BPTIcon />
              <span>0.30</span>
            </div>
          </li>
          <li className="item-find-representative">
            <div className="photo"></div>
            <div className="name">Chris Bronson</div>
            <div className="token">
              <BzrxIcon />
              <span>21,540.30</span>
            </div>
            <div className="token">
              <VBzrxIcon />
              <span>540.30</span>
            </div>
            <div className="token">
              <BPTIcon />
              <span>0.3</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}