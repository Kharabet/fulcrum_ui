import React, { Component } from "react";
import { OpsSelectorItem } from "./OpsSelectorItem";

import lend_svg from "../assets/images/ic_big___lend_(dark).svg";
import trade_svg from "../assets/images/ic_big___trade_(dark).svg";

export class OpsSelector extends Component {
  public render() {
    return (
      <div className="ops-selector">
        <OpsSelectorItem operationName="Lend" operationImageSrc={lend_svg} operationAddress="/lend">
          Make money on assets using tokenized loans. Sell or burn the tokens when you're done lending.
        </OpsSelectorItem>
        <OpsSelectorItem operationName="Trade" operationImageSrc={trade_svg} operationAddress="/trade">
          Trade up to 4x leverage by just Buying a token. ETH, WBTC and 70+ ERC20 supported.
        </OpsSelectorItem>
      </div>
    );
  }
}
