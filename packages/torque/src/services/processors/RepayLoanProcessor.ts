import { BigNumber } from '@0x/utils'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { RepayLoanRequest } from '../../domain/RepayLoanRequest'
import { RequestTask } from '../../domain/RequestTask'
import { TorqueProvider } from '../TorqueProvider'
import { erc20Contract } from 'bzx-common/src/contracts/typescript-wrappers/erc20'
import Asset from 'bzx-common/src/assets/Asset'

export class RepayLoanProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (
      !(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)
    ) {
      throw new Error('No provider available!')
    }

    const taskRequest: RepayLoanRequest = task.request as RepayLoanRequest
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

    if (account && bZxContract) {
      const loanPrecision = AssetsDictionary.assets.get(taskRequest.borrowAsset)!.decimals || 18
      let closeAmountInBaseUnits = taskRequest.repayAmount.multipliedBy(10 ** loanPrecision)
      const closeAmountInBaseUnitsValue = new BigNumber(closeAmountInBaseUnits.toFixed(0, 1))

      // don't allow 0 payback if more is owed
      if (closeAmountInBaseUnits.eq(0)) throw new Error('Close amount is 0')
      closeAmountInBaseUnits = new BigNumber(closeAmountInBaseUnits.toFixed(0, 1))

      if (!isETHBorrowAsset) {
        let tokenErc20Contract: erc20Contract | null = null
        let assetErc20Address: string | null = ''
        let erc20allowance = new BigNumber(0)
        assetErc20Address = TorqueProvider.Instance.getErc20AddressOfAsset(taskRequest.borrowAsset)
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
        if (closeAmountInBaseUnits.gt(erc20allowance)) {
          const spender = TorqueProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase()
          const approveHash = await TorqueProvider.Instance.setApproval(
            spender,
            taskRequest.borrowAsset,
            TorqueProvider.Instance.getLargeApprovalAmount(
              taskRequest.borrowAsset,
              closeAmountInBaseUnits
            )
          )
          await TorqueProvider.Instance.waitForTransactionMined(approveHash)
        }
      }

      if (taskRequest.repayAmount.gte(taskRequest.amountOwed)) {
        // send a large amount to close entire loan
        closeAmountInBaseUnits = closeAmountInBaseUnits.multipliedBy(10 ** 50)
        if (closeAmountInBaseUnits.eq(0)) closeAmountInBaseUnits = new BigNumber(10 ** 50)
      }

      const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === 'true'
      const ChiTokenBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(Asset.CHI)

      let gasAmountBN = new BigNumber(0)
      try {
        const gasAmount =
          isGasTokenEnabled && ChiTokenBalance.gt(0)
            ? await bZxContract
                .closeWithDepositWithGasToken(
                  taskRequest.loanId,
                  account,
                  account,
                  closeAmountInBaseUnits
                )
                .estimateGasAsync({
                  from: account,
                  value: isETHBorrowAsset ? closeAmountInBaseUnitsValue : undefined,
                  gas: TorqueProvider.Instance.gasLimit,
                })
            : await bZxContract
                .closeWithDeposit(taskRequest.loanId, account, closeAmountInBaseUnits)
                .estimateGasAsync({
                  from: account,
                  value: isETHBorrowAsset ? closeAmountInBaseUnitsValue : undefined,
                  gas: TorqueProvider.Instance.gasLimit,
                })
        gasAmountBN = new BigNumber(gasAmount)
          .multipliedBy(TorqueProvider.Instance.gasBufferCoeff)
          .integerValue(BigNumber.ROUND_UP)
      } catch (e) {
        // throw e
      }

      //Submitting loan
      task.processingStepNext()
      let txHash = ''

      try {
        txHash =
          isGasTokenEnabled && ChiTokenBalance.gt(0)
            ? await bZxContract
                .closeWithDepositWithGasToken(
                  taskRequest.loanId, // loanId
                  account, // borrower
                  account, // gasTokenUser
                  closeAmountInBaseUnits // depositAmount
                )
                .sendTransactionAsync({
                  from: account,
                  value: isETHBorrowAsset ? closeAmountInBaseUnitsValue : undefined,
                  gas: !gasAmountBN.eq(0) ? gasAmountBN.toString() : '3000000',
                  gasPrice: await TorqueProvider.Instance.gasPrice(),
                })
            : await bZxContract
                .closeWithDeposit(
                  taskRequest.loanId, // loanId
                  account, // borrower
                  closeAmountInBaseUnits // depositAmount
                )
                .sendTransactionAsync({
                  from: account,
                  value: isETHBorrowAsset ? closeAmountInBaseUnitsValue : undefined,
                  gas: !gasAmountBN.eq(0) ? gasAmountBN.toString() : '3000000',
                  gasPrice: await TorqueProvider.Instance.gasPrice(),
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
}
