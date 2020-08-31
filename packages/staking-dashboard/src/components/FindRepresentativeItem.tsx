import React from "react";

import { ReactComponent as BzrxIcon } from "../assets/images/token-bzrx.svg"
import { ReactComponent as VBzrxIcon } from "../assets/images/token-vbzrx.svg"
import { ReactComponent as BPTIcon } from "../assets/images/token-bpt.svg"
import Representative1 from "../assets/images/representative1.png"
import Representative2 from "../assets/images/representative2.png"
import Representative3 from "../assets/images/representative3.png"
import { BigNumber } from "@0x/utils";

export interface IFindRepresentativeItemProps {
  urlPhoto: string;
  address: string;
  name: string;
  bzrxAmount: BigNumber;
  vbzrxAmount: BigNumber;
  bptAmount: BigNumber;
  index: number;
}
const getShortHash = (address: string, count: number) => {
  return address.substring(0, 8) + '...' + address.substring(address.length - count);
}

const networkName = process.env.REACT_APP_ETH_NETWORK;

export const FindRepresentativeItem = (props: IFindRepresentativeItemProps) => {
  const bzrxAmount = props.bzrxAmount.div(10 ** 18).toFixed();
  const vbzrxAmount = props.vbzrxAmount.div(10 ** 18).toFixed();
  const representative = props.index % 3 === 0 ? Representative1 : props.index % 2 === 0 ? Representative2 : Representative3;
  //TODO: remove networkName
  const bptAmount = networkName === "kovan"
    ? props.bptAmount.div(10 ** 6).toFixed()
    : props.bptAmount.div(10 ** 18).toFixed();

  return (
    <li className="item-find-representative">
      <img className="photo" src={representative} alt={`Representative ${props.index}`} />
      <div className="name">{getShortHash(props.name, 4)}</div>
      {props.bzrxAmount.gt(0) &&
        <div className="token">
          <BzrxIcon />
          <span>{bzrxAmount}</span>
        </div>
      }
      {props.vbzrxAmount.gt(0) &&
        <div className="token">
          <VBzrxIcon />
          <span>{vbzrxAmount}</span>
        </div>
      }
      {props.bptAmount.gt(0) &&
        <div className="token">
          <BPTIcon />
          <span>{bptAmount}</span>
        </div>
      }
    </li>
  );
}