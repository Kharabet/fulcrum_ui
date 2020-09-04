export const DappHelperJson = {
    "name": "DAppHelper",
    "address": "",
    "abi": [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "usdTokenAddress",
                    "type": "address"
                },
                {
                    "internalType": "address[]",
                    "name": "tokens",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "name": "assetRates",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "rates",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "precisions",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "destAmounts",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "tokenAddresses",
                    "type": "address[]"
                }
            ],
            "name": "reserveDetails",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "totalAssetSupply",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "totalAssetBorrow",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "supplyInterestRate",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "borrowInterestRate",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "torqueBorrowInterestRate",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "vaultBalance",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
}

export const mainnetAddress = "0x3B55369bfeA51822eb3E85868c299E8127E13c56";