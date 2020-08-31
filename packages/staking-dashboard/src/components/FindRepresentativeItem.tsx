import React from "react";

import { ReactComponent as BzrxIcon } from "../assets/images/token-bzrx.svg"
import { ReactComponent as VBzrxIcon } from "../assets/images/token-vbzrx.svg"
import { ReactComponent as BPTIcon } from "../assets/images/token-bpt.svg"
import { BigNumber } from "@0x/utils";

export interface IFindRepresentativeItemProps {
  urlPhoto: string;
  address: string;
  name: string;
  bzrxAmount: BigNumber;
  vbzrxAmount: BigNumber;
  bptAmount: BigNumber;
}
const getShortHash = (address: string, count: number) => {
  return address.substring(0, 8) + '...' + address.substring(address.length - count);
}

export const FindRepresentativeItem = (props: IFindRepresentativeItemProps) => {
  return (
    <li className="item-find-representative">
      <div className="photo"></div>
      <div className="name">{getShortHash(props.name, 4)}</div>
      {props.bzrxAmount.gt(0) &&
        <div className="token">
          <BzrxIcon />
          <span>{props.bzrxAmount.div(10 ** 18).toFixed()}</span>
        </div>
      }
      {props.vbzrxAmount.gt(0) &&
        <div className="token">
          <VBzrxIcon />
          <span>{props.vbzrxAmount.div(10 ** 18).toFixed()}</span>
        </div>
      }
      {props.bptAmount.gt(0) &&
        <div className="token">
          <BPTIcon />
          <span>{props.bptAmount.div(10 ** 18).toFixed()}</span>
        </div>
      }
    </li>
  );
}