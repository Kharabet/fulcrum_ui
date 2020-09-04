export const iTokenJson = {
    "name": "iToken",
    "address": "",
    "abi": [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x06fdde03"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x095ea7b3"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "burntTokenReserved",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x0c4925fd"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x18160ddd"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "initialPrice",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x1d0806ae"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "baseRate",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x1f68f20a"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalAssetBorrow",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x20f6d07c"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "loanOrderData",
            "outputs": [
                {
                    "name": "loanOrderHash",
                    "type": "bytes32"
                },
                {
                    "name": "leverageAmount",
                    "type": "uint256"
                },
                {
                    "name": "initialMarginAmount",
                    "type": "uint256"
                },
                {
                    "name": "maintenanceMarginAmount",
                    "type": "uint256"
                },
                {
                    "name": "maxDurationUnixTimestampSec",
                    "type": "uint256"
                },
                {
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x2515aacd"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x313ce567"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "rateMultiplier",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x330691ac"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "wethContract",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x4780eac1"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseApproval",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x66188463"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x70a08231"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "tokenizedRegistry",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x736ee3d3"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "burntTokenReserveList",
            "outputs": [
                {
                    "name": "lender",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x7866c6c1"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "loanTokenAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x797bf385"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "checkpointSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x7b7933b4"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "bZxVault",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x894ca308"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x8da5cb5b"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x95d89b41"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "bZxOracle",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x96c7871b"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "bZxContract",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x995363d3"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "leverageList",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x9b3a54d1"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseApproval",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xd73dd623"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "spreadMultiplier",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xd84d2a47"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "name": "_spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xdd62ed3e"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xf2fde38b"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "burntTokenReserveListIndex",
            "outputs": [
                {
                    "name": "index",
                    "type": "uint256"
                },
                {
                    "name": "isSet",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xfbd9574d"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "loanOrderHashes",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xfe056342"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event",
            "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event",
            "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "minter",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "tokenAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "assetAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "Mint",
            "type": "event",
            "signature": "0xb4c03061fb5b7fed76389d5af8f2e0ddb09f8c70d1333abbb62582835e10accb"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "burner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "tokenAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "assetAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "Burn",
            "type": "event",
            "signature": "0x743033787f4738ff4d6a7225ce2bd0977ee5f86b91a902a58f5e4d0b297b4644"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "borrowAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "interestRate",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "collateralTokenAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "tradeTokenToFillAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "withdrawOnOpen",
                    "type": "bool"
                }
            ],
            "name": "Borrow",
            "type": "event",
            "signature": "0x86e15dd78cd784ab7788bcf5b96b9395e86030e048e5faedcfe752c700f6157e"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "claimant",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "tokenAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "assetAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "remainingTokenAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "Claim",
            "type": "event",
            "signature": "0x68e1caf97c4c29c1ac46024e9590f80b7a1f690d393703879cf66eea4e1e8421"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event",
            "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "receiver",
                    "type": "address"
                }
            ],
            "name": "mintWithEther",
            "outputs": [
                {
                    "name": "mintAmount",
                    "type": "uint256"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function",
            "signature": "0x8f6ede1f"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "name": "depositAmount",
                    "type": "uint256"
                }
            ],
            "name": "mintWithChai",
            "outputs": [
                {
                    "name": "mintAmount",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "name": "depositAmount",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [
                {
                    "name": "mintAmount",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x40c10f19"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "name": "burnAmount",
                    "type": "uint256"
                }
            ],
            "name": "burnToEther",
            "outputs": [
                {
                    "name": "loanAmountPaid",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x81a6b250"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "name": "burnAmount",
                    "type": "uint256"
                }
            ],
            "name": "burnToChai",
            "outputs": [
                {
                    "name": "loanAmountPaid",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "name": "burnAmount",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [
                {
                    "name": "loanAmountPaid",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x9dc29fac"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "borrowAmount",
                    "type": "uint256"
                },
                {
                    "name": "leverageAmount",
                    "type": "uint256"
                },
                {
                    "name": "initialLoanDuration",
                    "type": "uint256"
                },
                {
                    "name": "collateralTokenSent",
                    "type": "uint256"
                },
                {
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "name": "collateralTokenAddress",
                    "type": "address"
                }
            ],
            "name": "borrowTokenFromDeposit",
            "outputs": [
                {
                    "name": "loanOrderHash",
                    "type": "bytes32"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "borrowAmount",
                    "type": "uint256"
                },
                {
                    "name": "leverageAmount",
                    "type": "uint256"
                },
                {
                    "name": "initialLoanDuration",
                    "type": "uint256"
                },
                {
                    "name": "collateralTokenSent",
                    "type": "uint256"
                },
                {
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "name": "collateralTokenAddress",
                    "type": "address"
                }
            ],
            "name": "borrowTokenFromDeposit",
            "outputs": [
                {
                    "name": "loanOrderHash",
                    "type": "bytes32"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "borrowAmount",
                    "type": "uint256"
                },
                {
                    "name": "leverageAmount",
                    "type": "uint256"
                },
                {
                    "name": "interestInitialAmount",
                    "type": "uint256"
                },
                {
                    "name": "loanTokenSent",
                    "type": "uint256"
                },
                {
                    "name": "collateralTokenSent",
                    "type": "uint256"
                },
                {
                    "name": "tradeTokenSent",
                    "type": "uint256"
                },
                {
                    "name": "borrower",
                    "type": "address"
                },
                {
                    "name": "collateralTokenAddress",
                    "type": "address"
                },
                {
                    "name": "tradeTokenAddress",
                    "type": "address"
                }
            ],
            "name": "borrowTokenAndUse",
            "outputs": [
                {
                    "name": "loanOrderHash",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x2ddbfc19"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "depositAmount",
                    "type": "uint256"
                },
                {
                    "name": "leverageAmount",
                    "type": "uint256"
                },
                {
                    "name": "loanTokenSent",
                    "type": "uint256"
                },
                {
                    "name": "collateralTokenSent",
                    "type": "uint256"
                },
                {
                    "name": "tradeTokenSent",
                    "type": "uint256"
                },
                {
                    "name": "trader",
                    "type": "address"
                },
                {
                    "name": "depositTokenAddress",
                    "type": "address"
                },
                {
                    "name": "collateralTokenAddress",
                    "type": "address"
                },
                {
                    "name": "tradeTokenAddress",
                    "type": "address"
                }
            ],
            "name": "marginTradeFromDeposit",
            "outputs": [
                {
                    "name": "loanOrderHash",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xfecb8da3"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "claimLoanToken",
            "outputs": [
                {
                    "name": "claimedAmount",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x087fc48b"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "wrapEther",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x6f1296d2"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "tokenAddress",
                    "type": "address"
                }
            ],
            "name": "donateAsset",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x59e239af"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xa9059cbb"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_from",
                    "type": "address"
                },
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x23b872dd"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "tokenPrice",
            "outputs": [
                {
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x7ff9b596"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "chaiPrice",
            "outputs": [
                {
                    "name": "price",
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
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "checkpointPrice",
            "outputs": [
                {
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xeebc5081"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalReservedSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x674d13c8"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "marketLiquidity",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x612ef80b"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "supplyInterestRate",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x09ec6b6b"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "avgBorrowInterestRate",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x44a4a003"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "borrowInterestRate",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x8325a1c0"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "borrowAmount",
                    "type": "uint256"
                },
                {
                    "name": "useFixedInterestModel",
                    "type": "bool"
                }
            ],
            "name": "nextBorrowInterestRateWithOption",
            "outputs": [
                {
                    "name": "",
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
                    "name": "borrowAmount",
                    "type": "uint256"
                }
            ],
            "name": "nextLoanInterestRate",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xac9fd2b8"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "supplyAmount",
                    "type": "uint256"
                }
            ],
            "name": "nextSupplyInterestRate",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xd65a5021"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalAssetSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x8fb807c5"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "leverageAmount",
                    "type": "uint256"
                }
            ],
            "name": "getMaxEscrowAmount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x829b38f4"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getLeverageList",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x2ecae90a"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "assetBalanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x06b3efd6"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "borrowAmount",
                    "type": "uint256"
                },
                {
                    "name": "leverageAmount",
                    "type": "uint256"
                },
                {
                    "name": "initialLoanDuration",
                    "type": "uint256"
                },
                {
                    "name": "collateralTokenAddress",
                    "type": "address"
                }
            ],
            "name": "getDepositAmountForBorrow",
            "outputs": [
                {
                    "name": "depositAmount",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x8423acd6"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "depositAmount",
                    "type": "uint256"
                },
                {
                    "name": "leverageAmount",
                    "type": "uint256"
                },
                {
                    "name": "initialLoanDuration",
                    "type": "uint256"
                },
                {
                    "name": "collateralTokenAddress",
                    "type": "address"
                }
            ],
            "name": "getBorrowAmountForDeposit",
            "outputs": [
                {
                    "name": "borrowAmount",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x24d25f4a"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "assetSupply",
                    "type": "uint256"
                }
            ],
            "name": "_supplyInterestRate",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xf468697e"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "components": [
                        {
                            "name": "loanTokenAddress",
                            "type": "address"
                        },
                        {
                            "name": "interestTokenAddress",
                            "type": "address"
                        },
                        {
                            "name": "collateralTokenAddress",
                            "type": "address"
                        },
                        {
                            "name": "oracleAddress",
                            "type": "address"
                        },
                        {
                            "name": "loanTokenAmount",
                            "type": "uint256"
                        },
                        {
                            "name": "interestAmount",
                            "type": "uint256"
                        },
                        {
                            "name": "initialMarginAmount",
                            "type": "uint256"
                        },
                        {
                            "name": "maintenanceMarginAmount",
                            "type": "uint256"
                        },
                        {
                            "name": "maxDurationUnixTimestampSec",
                            "type": "uint256"
                        },
                        {
                            "name": "loanOrderHash",
                            "type": "bytes32"
                        }
                    ],
                    "name": "loanOrder",
                    "type": "tuple"
                },
                {
                    "components": [
                        {
                            "name": "trader",
                            "type": "address"
                        },
                        {
                            "name": "collateralTokenAddressFilled",
                            "type": "address"
                        },
                        {
                            "name": "positionTokenAddressFilled",
                            "type": "address"
                        },
                        {
                            "name": "loanTokenAmountFilled",
                            "type": "uint256"
                        },
                        {
                            "name": "loanTokenAmountUsed",
                            "type": "uint256"
                        },
                        {
                            "name": "collateralTokenAmountFilled",
                            "type": "uint256"
                        },
                        {
                            "name": "positionTokenAmountFilled",
                            "type": "uint256"
                        },
                        {
                            "name": "loanStartUnixTimestampSec",
                            "type": "uint256"
                        },
                        {
                            "name": "loanEndUnixTimestampSec",
                            "type": "uint256"
                        },
                        {
                            "name": "active",
                            "type": "bool"
                        },
                        {
                            "name": "positionId",
                            "type": "uint256"
                        }
                    ],
                    "name": "loanPosition",
                    "type": "tuple"
                },
                {
                    "name": "loanCloser",
                    "type": "address"
                },
                {
                    "name": "closeAmount",
                    "type": "uint256"
                },
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "name": "closeLoanNotifier",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xcd4fa66d"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "settingsTarget",
                    "type": "address"
                },
                {
                    "name": "txnData",
                    "type": "bytes"
                }
            ],
            "name": "updateSettings",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x284e2f56"
        }
    ]
}

