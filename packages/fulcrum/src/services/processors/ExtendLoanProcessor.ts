import { BigNumber } from '@0x/utils'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { RequestTask } from '../../domain/RequestTask'
import { FulcrumProvider } from '../FulcrumProvider'
import { erc20Contract } from 'bzx-common/src/contracts/typescript-wrappers/erc20'
import { ExtendLoanRequest } from '../../domain/ExtendLoanRequest'
import Asset from 'bzx-common/src/assets/Asset'

export class ExtendLoanProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (
      !(
        FulcrumProvider.Instance.contractsSource &&
        FulcrumProvider.Instance.contractsSource.canWrite
      )
    ) {
      throw new Error('No provider available!')
    }

    const taskRequest: ExtendLoanRequest = task.request as ExtendLoanRequest
    const isETHBorrowAsset = FulcrumProvider.Instance.isETHAsset(taskRequest.borrowAsset)

    if (isETHBorrowAsset) {
      //Initializing
      task.processingStart([
        'Initializing',
        'Submitting loan',
        'Updating the blockchain',
        'Transaction completed'
      ])
    } else {
      //Initializing
      task.processingStart([
        'Initializing',
        'Detecting token allowance',
        'Prompting token allowance',
        'Waiting for token allowance',
        'Submitting loan',
        'Updating the blockchain',
        'Transaction completed'
      ])
    }
    // Initializing loan
    const bZxContract = await FulcrumProvider.Instance.contractsSource.getiBZxContract()

    if (!bZxContract) {
      throw new Error('No bZxContract contract available!')
    }

    const loanPrecision = AssetsDictionary.assets.get(taskRequest.borrowAsset)!.decimals || 18
    const depositAmountInBaseUnits = new BigNumber(
      taskRequest.depositAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1)
    )

    if (!isETHBorrowAsset) {
      let tokenErc20Contract: erc20Contract | null = null
      let assetErc20Address: string | null = ''
      let erc20allowance = new BigNumber(0)
      assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(taskRequest.borrowAsset)
      if (assetErc20Address) {
        tokenErc20Contract = await FulcrumProvider.Instance.contractsSource.getErc20Contract(
          assetErc20Address
        )
      } else {
        throw new Error('No ERC20 contract available!')
      }

      if (!tokenErc20Contract) {
        throw new Error('No ERC20 contract available!')
      }
      // Detecting token allowance
      task.processingStepNext()
      erc20allowance = await tokenErc20Contract.allowance.callAsync(
        account,
        FulcrumProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase()
      )

      // Prompting token allowance
      task.processingStepNext()

      // Waiting for token allowance
      task.processingStepNext()
      if (depositAmountInBaseUnits.gt(erc20allowance)) {
        const spender = FulcrumProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase()
        const approveHash = await FulcrumProvider.Instance.setApproval(
          spender,
          taskRequest.borrowAsset,
          FulcrumProvider.Instance.getLargeApprovalAmount(
            taskRequest.borrowAsset,
            depositAmountInBaseUnits
          )
        )
        await FulcrumProvider.Instance.waitForTransactionMined(approveHash)
      }
    }

    //Submitting loan
    task.processingStepNext()

    let gasAmountBN = new BigNumber(0)
    let txHash: string = ''
    const loanData = '0x'

    try {
      const gasAmount = await bZxContract.extendLoanDuration.estimateGasAsync(
        taskRequest.loanId,
        depositAmountInBaseUnits,
        false,
        loanData,
        {
          from: account,
          value: isETHBorrowAsset ? depositAmountInBaseUnits : undefined,
          gas: FulcrumProvider.Instance.gasLimit
        }
      )
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(FulcrumProvider.Instance.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      console.log(e)
      throw e
    }
    
    const gasLimit = FulcrumProvider.Instance.gasLimit
    try {
      txHash = await bZxContract.extendLoanDuration.sendTransactionAsync(
        taskRequest.loanId, // loanId
        depositAmountInBaseUnits, // depositAmount
        false, // useCollateral
        loanData,
        {
          from: account,
          value: isETHBorrowAsset ? depositAmountInBaseUnits : undefined,
          gas:  !gasAmountBN.eq(0) ? gasAmountBN.toString() : gasLimit,
          gasPrice: await FulcrumProvider.Instance.gasPrice()
        }
      )
      task.setTxHash(txHash)
    } catch (e) {
      console.log(e)
      throw e
    }

    //Updating the blockchain
    task.processingStepNext()
    const txReceipt = await FulcrumProvider.Instance.waitForTransactionMined(txHash)
    if (!txReceipt.status) {
      throw new Error('Reverted by EVM')
    }

    //Transaction completed
    task.processingStepNext()
    await FulcrumProvider.Instance.sleep(FulcrumProvider.Instance.successDisplayTimeout)
  }
}
