# Blockchain events representation in the UI

All these events are come from solidity contracts. For example, [here](https://github.com/bZxNetwork/contractsV2/blob/ffe4007416cea5535cf62db62ece8076b9452a42/contracts/events/LoanOpeningsEvents.sol) you can find solidity origins for `TradeEvent.ts` and `BorrowEvent.ts`.

To get events from blockchain [eth_getLogs](https://eth.wiki/json-rpc/API#eth_getlogs) method is used. It could be done via web3 or 3rd party APIs like [etherscan developers API](https://etherscan.io/apis#logs). As search params you should pass:

- `fromBlock` and `toBlock`: the blocks range where you want to find events. Values could be passed as decimal or hex numbers depending on tool/library
- `address`: the contract address that emmited these events
- `topics` array, that could consist of following elements:
- `topic0`: the uniqe id of each event that is calculated as keccak256 hash of event's signature (for example for Trade event `heccak256("Trade(address,address,bytes32,address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256)") = "0xf640c1cfe1a912a0b0152b5a542e5c2403142eed75b06cde526cee54b1580e5c"`). For simplicity we pre-calculate it and put as `topic0` field of the UI typescript file for the event. Here you can find [online keccaak-256 calculator](https://emn178.github.io/online-tools/keccak_256.html).
- `topic1`, `topic2`, `topic3` etc.: fields for filtering. In the solidity code they are marked as `indexed`. So here for the [Trade](https://github.com/bZxNetwork/contractsV2/blob/ffe4007416cea5535cf62db62ece8076b9452a42/contracts/events/LoanOpeningsEvents.sol#L26-L28) event, you could set `topic3` as some `loanId` and you will receive all Trade events related to the certain loan.
