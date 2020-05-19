export const mainnetAddress = "0xee14de2e67e1ec23c8561a6fad2635ff1b618db6";

export const oracleJson = {
    "name": "Oracle",
    "address": "",
    "abi": [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "src",
                    "type": "address"
                },
                {
                    "name": "dest",
                    "type": "address"
                },
                {
                    "name": "srcQty",
                    "type": "uint256"
                }
            ],
            "name": "getTradeData",
            "outputs": [
                {
                    "name": "sourceToDestRate",
                    "type": "uint256"
                },
                {
                    "name": "sourceToDestPrecision",
                    "type": "uint256"
                },
                {
                    "name": "destTokenAmount",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "src",
                    "type": "address"
                },
                {
                    "name": "dest",
                    "type": "address"
                },
                {
                    "name": "srcQty",
                    "type": "uint256"
                }
            ],
            "name": "getExpectedRate",
            "outputs": [
                {
                    "name": "expectedRate",
                    "type": "uint256"
                },
                {
                    "name": "slippageRate",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
}