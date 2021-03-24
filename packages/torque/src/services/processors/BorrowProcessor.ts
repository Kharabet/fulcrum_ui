import ethGasStation from 'bzx-common/src/lib/apis/ethGasStation'
import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { BorrowRequest } from '../../domain/BorrowRequest'
import { RequestTask } from 'app-lib/tasksQueue'
import { TorqueProvider } from '../TorqueProvider'
import { BorrowRequestAwaiting } from '../../domain/BorrowRequestAwaiting'
import { erc20Contract } from 'bzx-common/src/contracts/typescript-wrappers/erc20'
import providerUtils from 'bzx-common/src/lib/providerUtils'

export class BorrowProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (
      !(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)
    ) {
      throw new Error('No provider available!')
    }

    const taskRequest: BorrowRequest = task.request as BorrowRequest
    const isETHCollateralAsset = providerUtils.isETHAsset(taskRequest.collateralAsset)
    if (isETHCollateralAsset) {
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
    const iTokenContract = await TorqueProvider.Instance.contractsSource.getITokenContract(
      taskRequest.borrowAsset
    )
    const collateralAssetErc20Address =
      providerUtils.getErc20AddressOfAsset(taskRequest.collateralAsset) || ''

    if (!iTokenContract) {
      throw new Error('No iToken contract available!')
    }

    const loanPrecision = AssetsDictionary.assets.get(taskRequest.borrowAsset)!.decimals || 18
    const collateralPrecision =
      AssetsDictionary.assets.get(taskRequest.collateralAsset)!.decimals || 18
    const borrowAmountInBaseUnits = new BigNumber(
      taskRequest.borrowAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1)
    )
    const depositAmountInBaseUnits = new BigNumber(
      taskRequest.depositAmount.multipliedBy(10 ** collateralPrecision).toFixed(0, 1)
    )

    if (!isETHCollateralAsset) {
      let tokenErc20Contract: erc20Contract | null = null
      let assetErc20Address: string | null = ''
      let erc20allowance = new BigNumber(0)
      assetErc20Address = providerUtils.getErc20AddressOfAsset(taskRequest.collateralAsset)
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
        .allowance(account, iTokenContract.address)
        .callAsync()

      // Prompting token allowance
      task.processingStepNext()

      // Waiting for token allowance
      task.processingStepNext()
      if (depositAmountInBaseUnits.gt(erc20allowance)) {
        const spender = iTokenContract.address
        const approveHash = await TorqueProvider.Instance.setApproval(
          spender,
          taskRequest.collateralAsset,
          TorqueProvider.Instance.getLargeApprovalAmount(
            taskRequest.collateralAsset,
            depositAmountInBaseUnits
          )
        )
        await TorqueProvider.Instance.waitForTransactionMined(approveHash)
      }
    }

    //Submitting loan
    task.processingStepNext()

    let gasAmountBN = new BigNumber(0)
    let txHash = ''

    const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === 'true'
    const ChiTokenBalance = await providerUtils.getAssetTokenBalanceOfUser(
      TorqueProvider.Instance,
      Asset.CHI
    )

    try {
      const gasAmount =
        isGasTokenEnabled && ChiTokenBalance.gt(0)
          ? await iTokenContract
              .borrowWithGasToken(
                taskRequest.loanId,
                borrowAmountInBaseUnits,
                new BigNumber(7884000), // approximately 3 months
                depositAmountInBaseUnits,
                isETHCollateralAsset ? TorqueProvider.ZERO_ADDRESS : collateralAssetErc20Address,
                account,
                account,
                account,
                '0x'
              )
              .estimateGasAsync({
                from: account,
                value: isETHCollateralAsset ? depositAmountInBaseUnits : undefined,
                gas: TorqueProvider.Instance.gasLimit,
              })
          : await iTokenContract
              .borrow(
                taskRequest.loanId,
                borrowAmountInBaseUnits,
                new BigNumber(7884000), // approximately 3 months
                depositAmountInBaseUnits,
                isETHCollateralAsset ? TorqueProvider.ZERO_ADDRESS : collateralAssetErc20Address,
                account,
                account,
                '0x'
              )
              .estimateGasAsync({
                from: account,
                value: isETHCollateralAsset ? depositAmountInBaseUnits : undefined,
                gas: TorqueProvider.Instance.gasLimit,
              })
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(TorqueProvider.Instance.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      // throw e;
    }

    // console.log(
    //   iTokenContract.address,
    //   isGasTokenEnabled && ChiTokenBalance.gt(0)
    //     ? iTokenContract.borrowWithGasToken.getABIEncodedTransactionData(
    //         taskRequest.loanId,
    //         borrowAmountInBaseUnits, // borrowAmount
    //         new BigNumber(7884000), // initialLoanDuration (approximately 3 months)
    //         depositAmountInBaseUnits, // collateralTokenSent
    //         isETHCollateralAsset ? TorqueProvider.ZERO_ADDRESS : collateralAssetErc20Address, // collateralToken

    //         account, // borrower
    //         account, // borrower
    //         account, // gasTokenUser
    //         '0x'
    //       )
    //     : iTokenContract.borrow.getABIEncodedTransactionData(
    //         taskRequest.loanId,
    //         borrowAmountInBaseUnits, // borrowAmount
    //         new BigNumber(7884000), // initialLoanDuration (approximately 3 months)
    //         depositAmountInBaseUnits, // collateralTokenSent
    //         isETHCollateralAsset ? TorqueProvider.ZERO_ADDRESS : collateralAssetErc20Address, // collateralToken
    //         account, // borrower
    //         account, // receiver
    //         '0x'
    //       )
    // )

    try {
      txHash =
        isGasTokenEnabled && ChiTokenBalance.gt(0)
          ? await iTokenContract
              .borrowWithGasToken(
                taskRequest.loanId,
                borrowAmountInBaseUnits, // borrowAmount
                new BigNumber(7884000), // initialLoanDuration (approximately 3 months)
                depositAmountInBaseUnits, // collateralTokenSent
                isETHCollateralAsset ? TorqueProvider.ZERO_ADDRESS : collateralAssetErc20Address, // collateralToken

                account, // borrower
                account, // borrower
                account, // gasTokenUser
                '0x' // loanData
              )
              .sendTransactionAsync({
                from: account,
                value: isETHCollateralAsset ? depositAmountInBaseUnits : undefined,
                gas: gasAmountBN.gt(0) ? gasAmountBN.toString() : '3000000',
                gasPrice: await ethGasStation.getGasPrice(),
              })
          : await iTokenContract
              .borrow(
                taskRequest.loanId,
                borrowAmountInBaseUnits, // borrowAmount
                new BigNumber(7884000), // initialLoanDuration (approximately 3 months)
                depositAmountInBaseUnits, // collateralTokenSent
                isETHCollateralAsset ? TorqueProvider.ZERO_ADDRESS : collateralAssetErc20Address, // collateralToken
                account, // borrower
                account, // receiver
                '0x' // loanData
              )
              .sendTransactionAsync({
                from: account,
                value: isETHCollateralAsset ? depositAmountInBaseUnits : undefined,
                gas: gasAmountBN.gt(0) ? gasAmountBN.toString() : '3000000',
                gasPrice: await ethGasStation.getGasPrice(),
              })
      task.setTxHash(txHash)
    } catch (e) {
      throw e
    }

    //   receipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);
    if (
      TorqueProvider.Instance.borrowRequestAwaitingStore &&
      (await TorqueProvider.Instance.web3ProviderSettings)
    ) {
      // noinspection ES6MissingAwait
      await TorqueProvider.Instance.borrowRequestAwaitingStore.add(
        new BorrowRequestAwaiting(
          taskRequest,
          TorqueProvider.Instance.web3ProviderSettings.networkId,
          account,
          txHash
        )
      )
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
