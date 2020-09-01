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

  const bzrxAmount = props.representative.BZRX.div(10 ** 18);
  const vbzrxAmount = props.representative.vBZRX.div(10 ** 18);
  //TODO: remove networkName
  const bptAmount = networkName === "kovan"
    ? props.representative.LPToken.div(10 ** 6)
    : props.representative.LPToken.div(10 ** 18);

  return (
    <li className="item-find-representative" onClick={() => props.onRepClick()}>
      <img className="photo" src={props.representative.imageSrc} alt={`Representative ${props.representative.index}`} />
      <div className="name">{props.representative.name}</div>
      {props.representative.BZRX.gt(0) ?
        <div className="token" title={bzrxAmount.toFixed(18)}>
          <BzrxIcon />
          <span>{bzrxAmount.toFixed(2)}</span>
        </div>
        : <div className="token"></div>
      }
      {props.representative.vBZRX.gt(0) ?
        <div className="token" title={vbzrxAmount.toFixed(18)}>
          <VBzrxIcon />
          <span>{vbzrxAmount.toFixed(2)}</span>
        </div>
        : <div className="token"></div>
      }
      {props.representative.LPToken.gt(0) ?
        <div className="token" title={bptAmount.toFixed(18)}>
          <BPTIcon />
          <span>{bptAmount.toFixed(2)}</span>
        </div>
        : <div className="token"></div>
      }
    </li>
  );

}