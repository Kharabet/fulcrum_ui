### Build typescript wrapper for contract using abi-gen

```yarn abi-gen --abis './src/contracts/artifacts/mainnet/<ContractABI>.json' --out "./src/contracts/typescript-wrappers/" --partials "./src/contracts/  abi-gen-templates/**/*.handlebars" --template "./src/contracts/abi-gen-templates/contract.handlebars"```

This command will create snake_case_named.ts file. It should be renamed to CamelCase naming style.