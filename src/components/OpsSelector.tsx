import React, { Component } from "react";
import OpsSelectorItem from "./OpsSelectorItem";

class OpsSelector extends Component {
  render() {
    return (
      <div className="ops-selector">
        <OpsSelectorItem operationName="Lend" operationImageSrc="" operationAddress="/lend" >
          Make money on assets using<br/>
          tokenized loans. Sell or burn the<br/>
          tokens when you're done lending.
        </OpsSelectorItem>
        <OpsSelectorItem operationName="Trade" operationImageSrc="" operationAddress="/trade">
          Trade up to 4x leverage by just<br/>
          Buying a token. ETH, WBTC and 70+<br/>
          ERC20 supported.
        </OpsSelectorItem>
      </div>
    );
  }
}

export default OpsSelector;
