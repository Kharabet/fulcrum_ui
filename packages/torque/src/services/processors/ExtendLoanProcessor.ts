import { BigNumber } from "@0x/utils";
import { iTokenContract } from "../../contracts/iTokenContract";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { BorrowRequest } from "../../domain/BorrowRequest";
import { RequestTask } from "../../domain/RequestTask";
import { TorqueProviderEvents } from "../events/TorqueProviderEvents";
import { TorqueProvider } from "../TorqueProvider";
import { BorrowRequestAwaiting } from "../../domain/BorrowRequestAwaiting";
import { erc20Contract } from "../../contracts/erc20";
import { ExtendLoanRequest } from "../../domain/ExtendLoanRequest";
import { Asset } from "../../domain/Asset";

export class ExtendLoanProcessor {
    public run = async (task: RequestTask, account: string, skipGas: boolean) => {
        if (!(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)) {
            throw new Error("No provider available!");
        }

        const taskRequest: ExtendLoanRequest = (task.request as ExtendLoanRequest);
        const isETHBorrowAsset = taskRequest.borrowAsset === Asset.ETH;

        if (isETHBorrowAsset) {
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
        const bZxContract = await TorqueProvider.Instance.contractsSource.getiBZxContract();

        if (!bZxContract) {
            throw new Error("No bZxContract contract available!");
        }

        const loanPrecision = AssetsDictionary.assets.get(taskRequest.borrowAsset)!.decimals || 18;
        const depositAmountInBaseUnits = new BigNumber(taskRequest.depositAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1));

       

        if (!isETHBorrowAsset) {

            let tokenErc20Contract: erc20Contract | null = null;
            let assetErc20Address: string | null = "";
            let erc20allowance = new BigNumber(0);
            assetErc20Address = TorqueProvider.Instance.getErc20AddressOfAsset(taskRequest.borrowAsset);
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
            erc20allowance = await tokenErc20Contract.allowance.callAsync(account, TorqueProvider.Instance.contractsSource.getVaultAddress().toLowerCase());

            // Prompting token allowance
            task.processingStepNext();

            // Waiting for token allowance
            task.processingStepNext();
            if (depositAmountInBaseUnits.gt(erc20allowance)) {
                await tokenErc20Contract!.approve.sendTransactionAsync(TorqueProvider.Instance.contractsSource.getVaultAddress().toLowerCase(), TorqueProvider.MAX_UINT, { from: account });
            } 
        }

        //Submitting loan
        task.processingStepNext();

        let gasAmountBN;
        let txHash: string = "";

        try {
            const gasAmount = await bZxContract.extendLoanByInterest.estimateGasAsync(
                taskRequest.loanOrderHash,
                account,
                account,
                depositAmountInBaseUnits,
                false,
                {
                  from: account,
                  value: isETHBorrowAsset ?
                    depositAmountInBaseUnits :
                    undefined,
                  gas: TorqueProvider.Instance.gasLimit
                }
              );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(TorqueProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
        } catch (e) {
            console.log(e);
        }

        try {
            txHash = await bZxContract.extendLoanByInterest.sendTransactionAsync(
                taskRequest.loanOrderHash,                      // loanOrderHash
                account,                                              // borrower
                account,                                              // payer
                depositAmountInBaseUnits,                             // depositAmount
                false,                                                // useCollateral
                {
                  from: account,
                  value: isETHBorrowAsset ?
                    depositAmountInBaseUnits :
                    undefined,
                  gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
                  gasPrice: await TorqueProvider.Instance.gasPrice()
                }
              );
        } catch (e) {
            console.log(e);
            throw e;
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
