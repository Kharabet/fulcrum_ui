import ethGasStation from 'bzx-common/src/lib/apis/ethGasStation'
import { BigNumber } from '@0x/utils'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { RequestTask } from '../../domain/RequestTask'
import { TorqueProvider } from '../TorqueProvider'
import { erc20Contract } from 'bzx-common/src/contracts/typescript-wrappers/erc20'
import { ExtendLoanRequest } from '../../domain/ExtendLoanRequest'
import { getErc20AddressOfAsset } from 'bzx-common/src/utils'

export class ExtendLoanProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (
      !(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)
    ) {
      throw new Error('No provider available!')
    }

    const taskRequest: ExtendLoanRequest = task.request as ExtendLoanRequest
    const isETHBorrowAsset = TorqueProvider.Instance.isETHAsset(taskRequest.borrowAsset)

    if (isETHBorrowAsset) {
      //Initializing
      task.processingStart([
        'Initializing',
        'Submitting loan',
        'Updating the blockchain',
        'Transaction completed',
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
        'Transaction completed',
      ])
    }
    // Initializing loan
    const bZxContract = await TorqueProvider.Instance.contractsSource.getiBZxContract()

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
      assetErc20Address = getErc20AddressOfAsset(taskRequest.borrowAsset)
      if (assetErc20Address) {
        tokenErc20Contract = await TorqueProvider.Instance.contractsSource.getErc20Contract(
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
      erc20allowance = await tokenErc20Contract
        .allowance(
          account,
          TorqueProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase()
        )
        .callAsync()

      // Prompting token allowance
      task.processingStepNext()

      // Waiting for token allowance
      task.processingStepNext()
      if (depositAmountInBaseUnits.gt(erc20allowance)) {
        const spender = TorqueProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase()
        const approveHash = await TorqueProvider.Instance.setApproval(
          spender,
          taskRequest.borrowAsset,
          TorqueProvider.Instance.getLargeApprovalAmount(
            taskRequest.borrowAsset,
            depositAmountInBaseUnits
          )
        )
        await TorqueProvider.Instance.waitForTransactionMined(approveHash)
      }
    }

    //Submitting loan
    task.processingStepNext()

    let gasAmountBN = new BigNumber(0)
    let txHash: string = ''
    const loanData = '0x'

    try {
      const gasAmount = await bZxContract
        .extendLoanDuration(taskRequest.loanId, depositAmountInBaseUnits, false, loanData)
        .estimateGasAsync({
          from: account,
          value: isETHBorrowAsset ? depositAmountInBaseUnits : undefined,
          gas: TorqueProvider.Instance.gasLimit,
        })
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(TorqueProvider.Instance.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      // throw e
    }

    try {
      txHash = await bZxContract
        .extendLoanDuration(
          taskRequest.loanId, // loanId
          depositAmountInBaseUnits, // depositAmount
          false, // useCollateral
          loanData
        )
        .sendTransactionAsync({
          from: account,
          value: isETHBorrowAsset ? depositAmountInBaseUnits : undefined,
          gas: !gasAmountBN.eq(0) ? gasAmountBN.toString() : '3000000',
          gasPrice: await ethGasStation.getGasPrice(),
        })
      task.setTxHash(txHash)
    } catch (e) {
      throw e
    }

    //Updating the blockchain
    task.processingStepNext()
    const txReceipt = await TorqueProvider.Instance.waitForTransactionMined(txHash)
    if (!txReceipt.status) {
      throw new Error('Reverted by EVM')
    }

    //Transaction completed
    task.processingStepNext()
    await TorqueProvider.Instance.sleep(TorqueProvider.Instance.successDisplayTimeout)
  }
}
