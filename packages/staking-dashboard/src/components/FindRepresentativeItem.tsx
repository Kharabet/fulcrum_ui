import React from "react";

import { ReactComponent as BzrxIcon } from "../assets/images/token-bzrx.svg"
import { ReactComponent as VBzrxIcon } from "../assets/images/token-vbzrx.svg"
import { ReactComponent as BPTIcon } from "../assets/images/token-bpt.svg"
import { BigNumber } from "@0x/utils";
import { IRep } from "../domain/IRep";

export interface IFindRepresentativeItemProps {
  representative: IRep;
  onRepClick: () => void;
}


const networkName = process.env.REACT_APP_ETH_NETWORK;

export const FindRepresentativeItem = (props: IFindRepresentativeItemProps) => {

  const bzrxAmount = props.representative.BZRX.div(10 ** 18).toFixed(2);
  const vbzrxAmount = props.representative.vBZRX.div(10 ** 18).toFixed(2);
  //TODO: remove networkName
  const bptAmount = networkName === "kovan"
    ? props.representative.LPToken.div(10 ** 6).toFixed(2)
    : props.representative.LPToken.div(10 ** 18).toFixed(2);

  return (
    <li className="item-find-representative" onClick={() => props.onRepClick()}>
      <img className="photo" src={props.representative.imageSrc} alt={`Representative ${props.representative.index}`} />
      <div className="name">{props.representative.name}</div>
      {props.representative.BZRX.gt(0) &&
        <div className="token">
          <BzrxIcon />
          <span>{bzrxAmount}</span>
        </div>
      }
      {props.representative.vBZRX.gt(0) &&
        <div className="token">
          <VBzrxIcon />
          <span>{vbzrxAmount}</span>
        </div>
      }
      {props.representative.LPToken.gt(0) &&
        <div className="token">
          <BPTIcon />
          <span>{bptAmount}</span>
        </div>
      }
    </li>
  );

}