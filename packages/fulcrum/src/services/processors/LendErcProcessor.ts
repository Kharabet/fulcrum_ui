import { BigNumber } from "@0x/utils";
import { erc20Contract } from "../../contracts/erc20";
import { iTokenContract } from "../../contracts/iTokenContract";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { LendRequest } from "../../domain/LendRequest";
import { RequestTask } from "../../domain/RequestTask";
import { FulcrumProviderEvents } from "../events/FulcrumProviderEvents";
import { FulcrumProvider } from "../FulcrumProvider";
import { Asset } from "../../domain/Asset";

export class LendErcProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: LendRequest = (task.request as LendRequest);
    const decimals: number = AssetsDictionary.assets.get(taskRequest.asset)!.decimals || 18;
    const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1));
    const tokenContract: iTokenContract | null = await FulcrumProvider.Instance.contractsSource.getITokenContract(taskRequest.asset);
    if (!tokenContract) {
      throw new Error("No iToken contract available!");
    }

    task.processingStart([
      "Initializing",
      "Detecting token allowance",
      "Prompting token allowance",
      "Waiting for token allowance",
      "Submitting loan",
      "Updating the blockchain",
      "Transaction completed"
    ]);

    // init erc20 contract for base token
    let tokenErc20Contract: erc20Contract | null = null;
    const assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(taskRequest.asset);
    if (assetErc20Address) {
      tokenErc20Contract = await FulcrumProvider.Instance.contractsSource.getErc20Contract(assetErc20Address);
    }

    if (!tokenErc20Contract) {
      throw new Error("No ERC20 contract available!");
    }
    task.processingStepNext();

    // Detecting token allowance
    let approvePromise: Promise<string> | null = null;
    const erc20allowance = await tokenErc20Contract.allowance.callAsync(account, tokenContract.address);
    task.processingStepNext();

    let txHash: string = "";
    try {
      FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

      // Prompting token allowance
      if (amountInBaseUnits.gt(erc20allowance)) {
        approvePromise = tokenErc20Contract.approve.sendTransactionAsync(tokenContract.address, FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS, { from: account });
      }
      task.processingStepNext();
      task.processingStepNext();

      let gasAmountBN;

      if (taskRequest.asset === Asset.DAI) {
        skipGas = true;
      }

      // Waiting for token allowance
      if (approvePromise || skipGas) {
        await approvePromise;
        gasAmountBN = new BigNumber(600000);
      } else {
        // estimating gas amount
        const gasAmount = await tokenContract.mint.estimateGasAsync(account, amountInBaseUnits, { from: account, gas: FulcrumProvider.Instance.gasLimit });
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
      }

      // Submitting loan
      txHash = await tokenContract.mint.sendTransactionAsync(account, amountInBaseUnits, { 
        from: account,
        gas: gasAmountBN.toString(),
        gasPrice: await FulcrumProvider.Instance.gasPrice()
      });
      task.setTxHash(txHash);

      await FulcrumProvider.Instance.addTokenToMetaMask(task);
    }
    finally {
      FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToCloseProgressDlg);
    }

    task.processingStepNext();
    const txReceipt = await FulcrumProvider.Instance.waitForTransactionMined(txHash, task.request);
    if (!txReceipt.status) {
      throw new Error("Reverted by EVM");
    }

    task.processingStepNext();
    await FulcrumProvider.Instance.sleep(FulcrumProvider.Instance.successDisplayTimeout);
  }
}
