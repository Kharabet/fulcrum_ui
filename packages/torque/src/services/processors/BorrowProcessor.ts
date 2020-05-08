import { BigNumber } from "@0x/utils";
import { iTokenContract } from "../../contracts/iTokenContract";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { BorrowRequest } from "../../domain/BorrowRequest";
import { RequestTask } from "../../domain/RequestTask";
import { TorqueProviderEvents } from "../events/TorqueProviderEvents";
import { TorqueProvider } from "../TorqueProvider";
import { BorrowRequestAwaiting } from "../../domain/BorrowRequestAwaiting";
import { erc20Contract } from "../../contracts/erc20";

export class BorrowProcessor {
    public run = async (task: RequestTask, account: string, skipGas: boolean) => {
        if (!(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)) {
            throw new Error("No provider available!");
        }

        // Initializing loan
        const taskRequest: BorrowRequest = (task.request as BorrowRequest);
        const iTokenContract = await TorqueProvider.Instance.contractsSource.getiTokenContract(taskRequest.borrowAsset);
        const collateralAssetErc20Address = TorqueProvider.Instance.getErc20AddressOfAsset(taskRequest.collateralAsset) || "";

        if (!iTokenContract) {
            throw new Error("No iToken contract available!");
        }


        const loanPrecision = AssetsDictionary.assets.get(taskRequest.borrowAsset)!.decimals || 18;
        const collateralPrecision = AssetsDictionary.assets.get(taskRequest.collateralAsset)!.decimals || 18;
        const borrowAmountInBaseUnits = new BigNumber(taskRequest.borrowAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1));
        const depositAmountInBaseUnits = new BigNumber(taskRequest.depositAmount.multipliedBy(10 ** collateralPrecision).toFixed(0, 1));


        if (TorqueProvider.Instance.isETHAsset(taskRequest.collateralAsset)) {
            task.processingStart([
                "Initializing",
                "Submitting loan",
                "Updating the blockchain",
                "Transaction completed"
            ]);
        } else {
            task.processingStart([
                "Initializing",
                "Detecting token allowance",
                "Prompting token allowance",
                "Waiting for token allowance",
                "Submitting loan",
                "Updating the blockchain",
                "Transaction completed"
            ]);

            let tokenErc20Contract: erc20Contract | null = null;
            let assetErc20Address: string | null = "";
            let erc20allowance = new BigNumber(0);
            assetErc20Address = TorqueProvider.Instance.getErc20AddressOfAsset(taskRequest.collateralAsset);
            if (assetErc20Address) {
                tokenErc20Contract = await TorqueProvider.Instance.contractsSource.getErc20Contract(assetErc20Address);
            } else {
                throw new Error("No ERC20 contract available!");
            }

            if (!tokenErc20Contract) {
                throw new Error("No ERC20 contract available!");
            }
            task.processingStepNext();

            // Detecting token allowance
            erc20allowance = await tokenErc20Contract.allowance.callAsync(account, iTokenContract.address);
            task.processingStepNext();
        }

        // no additional inits or checks
        task.processingStepNext();

        let gasAmountBN;
        let receipt;
        let txHash: string = "";

        if (TorqueProvider.Instance.isETHAsset(taskRequest.collateralAsset)) {
            try {
                const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
                    borrowAmountInBaseUnits,
                    new BigNumber(2 * 10 ** 18),
                    new BigNumber(7884000), // approximately 3 months
                    new BigNumber(0),
                    account,
                    account,
                    TorqueProvider.ZERO_ADDRESS,
                    "0x",
                    {
                        from: account,
                        value: depositAmountInBaseUnits,
                        gas: TorqueProvider.Instance.gasLimit
                    }
                );
                gasAmountBN = new BigNumber(gasAmount).multipliedBy(TorqueProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
            } catch (e) {
                console.log(e);
            }

            txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
                borrowAmountInBaseUnits,      // borrowAmount
                new BigNumber(2 * 10 ** 18),    // leverageAmount
                new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
                new BigNumber(0),             // collateralTokenSent
                account,                      // borrower
                account,                      // receiver
                TorqueProvider.ZERO_ADDRESS,  // collateralTokenAddress
                "0x",                         // loanData
                {
                    from: account,
                    value: depositAmountInBaseUnits,
                    gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
                    gasPrice: await TorqueProvider.Instance.gasPrice()
                }
            );
            //   receipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);
            if (await TorqueProvider.Instance.borrowRequestAwaitingStore && await TorqueProvider.Instance.web3ProviderSettings) {
                // noinspection ES6MissingAwait
                await TorqueProvider.Instance.borrowRequestAwaitingStore!.add(
                    new BorrowRequestAwaiting(
                        taskRequest,
                        await TorqueProvider.Instance.web3ProviderSettings.networkId,
                        account,
                        txHash
                    )
                );
            }
        } else {
            await TorqueProvider.Instance.checkAndSetApproval(
                taskRequest.collateralAsset,
                iTokenContract.address,
                depositAmountInBaseUnits
            );

            try {
                const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
                    borrowAmountInBaseUnits,
                    new BigNumber(2 * 10 ** 18),
                    new BigNumber(7884000), // approximately 3 months
                    depositAmountInBaseUnits,
                    account,
                    account,
                    collateralAssetErc20Address,
                    "0x",
                    {
                        from: account,
                        gas: TorqueProvider.Instance.gasLimit
                    }
                );
                gasAmountBN = new BigNumber(gasAmount).multipliedBy(TorqueProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
            } catch (e) {
                console.log(e);
            }

            txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
                borrowAmountInBaseUnits,      // borrowAmount
                new BigNumber(2 * 10 ** 18),    // leverageAmount
                new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
                depositAmountInBaseUnits,     // collateralTokenSent
                account,                      // borrower
                account,                      // receiver
                collateralAssetErc20Address,  // collateralTokenAddress
                "0x",                         // loanData
                {
                    from: account,
                    gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
                    gasPrice: await TorqueProvider.Instance.gasPrice()
                }
            );
            //   receipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);
            if (TorqueProvider.Instance.borrowRequestAwaitingStore && TorqueProvider.Instance.web3ProviderSettings) {
                // noinspection ES6MissingAwait
                TorqueProvider.Instance.borrowRequestAwaitingStore.add(
                    new BorrowRequestAwaiting(
                        taskRequest,
                        TorqueProvider.Instance.web3ProviderSettings.networkId,
                        account,
                        txHash
                    )
                );
            }
            // console.log(txHash);
        }



        task.processingStepNext();
        const txReceipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);
        if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
        }

        task.processingStepNext();
        await TorqueProvider.Instance.sleep(TorqueProvider.Instance.successDisplayTimeout);
    }
}
