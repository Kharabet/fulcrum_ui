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

        const taskRequest: BorrowRequest = (task.request as BorrowRequest);
        const isETHCollateralAsset = TorqueProvider.Instance.isETHAsset(taskRequest.collateralAsset);
        if (isETHCollateralAsset) {
            //Initializing
            task.processingStart([
                "Initializing",
                "Submitting loan",
                "Updating the blockchain",
                "Transaction completed"
            ]);
        } else {
            //Initializing
            task.processingStart([
                "Initializing",
                "Detecting token allowance",
                "Prompting token allowance",
                "Waiting for token allowance",
                "Submitting loan",
                "Updating the blockchain",
                "Transaction completed"
            ]);
        }
        // Initializing loan
        const iTokenContract = await TorqueProvider.Instance.contractsSource.getiTokenContract(taskRequest.borrowAsset);
        const collateralAssetErc20Address = TorqueProvider.Instance.getErc20AddressOfAsset(taskRequest.collateralAsset) || "";

        if (!iTokenContract) {
            throw new Error("No iToken contract available!");
        }


        const loanPrecision = AssetsDictionary.assets.get(taskRequest.borrowAsset)!.decimals || 18;
        const collateralPrecision = AssetsDictionary.assets.get(taskRequest.collateralAsset)!.decimals || 18;
        const borrowAmountInBaseUnits = new BigNumber(taskRequest.borrowAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1));
        const depositAmountInBaseUnits = new BigNumber(taskRequest.depositAmount.multipliedBy(10 ** collateralPrecision).toFixed(0, 1));


        if (!isETHCollateralAsset) {

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
            // Detecting token allowance
            task.processingStepNext();
            erc20allowance = await tokenErc20Contract.allowance.callAsync(account, iTokenContract.address);

            // Prompting token allowance
            task.processingStepNext();

            // Waiting for token allowance
            task.processingStepNext();
            if (depositAmountInBaseUnits.gt(erc20allowance)) {
                await tokenErc20Contract!.approve.sendTransactionAsync(iTokenContract.address, TorqueProvider.MAX_UINT, { from: account });
            } 
        }

        //Submitting loan
        task.processingStepNext();

        let gasAmountBN;
        let txHash: string = "";

        try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
                borrowAmountInBaseUnits,
                new BigNumber(2 * 10 ** 18),
                new BigNumber(7884000), // approximately 3 months
                isETHCollateralAsset
                    ? new BigNumber(0)
                    : depositAmountInBaseUnits,
                account,
                account,
                isETHCollateralAsset
                    ? TorqueProvider.ZERO_ADDRESS
                    : collateralAssetErc20Address,
                "0x",
                {
                    from: account,
                    value: isETHCollateralAsset
                        ? depositAmountInBaseUnits
                        : undefined,
                    gas: TorqueProvider.Instance.gasLimit
                }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(TorqueProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
        } catch (e) {
            console.log(e);
        }

        try {
            txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
                borrowAmountInBaseUnits,      // borrowAmount
                new BigNumber(2 * 10 ** 18),    // leverageAmount
                new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
                isETHCollateralAsset
                    ? new BigNumber(0)
                    : depositAmountInBaseUnits,   // collateralTokenSent
                account,                      // borrower
                account,                      // receiver
                isETHCollateralAsset
                    ? TorqueProvider.ZERO_ADDRESS
                    : collateralAssetErc20Address, // collateralTokenAddress
                "0x",                         // loanData
                {
                    from: account,
                    value: isETHCollateralAsset
                        ? depositAmountInBaseUnits
                        : undefined,
                    gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
                    gasPrice: await TorqueProvider.Instance.gasPrice()
                }
            );
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }

        //   receipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);
        if (TorqueProvider.Instance.borrowRequestAwaitingStore && await TorqueProvider.Instance.web3ProviderSettings) {
            // noinspection ES6MissingAwait
            await TorqueProvider.Instance.borrowRequestAwaitingStore.add(
                new BorrowRequestAwaiting(
                    taskRequest,
                    TorqueProvider.Instance.web3ProviderSettings.networkId,
                    account,
                    txHash
                )
            );
        }

        //Updating the blockchain
        task.processingStepNext();
        const txReceipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);
        if (!txReceipt.status) {
            throw new Error("Reverted by EVM");
        }

        //Transaction completed
        task.processingStepNext();
        await TorqueProvider.Instance.sleep(TorqueProvider.Instance.successDisplayTimeout);
    }
}
