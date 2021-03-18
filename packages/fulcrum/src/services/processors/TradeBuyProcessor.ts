import ethGasStation from 'bzx-common/src/lib/apis/ethGasStation'
import { BigNumber } from '@0x/utils'
import { RequestTask } from '../../domain/RequestTask'
import { TradeRequest } from '../../domain/TradeRequest'
import { FulcrumProvider } from '../FulcrumProvider'
import { PositionType } from '../../domain/PositionType'
import Asset from 'bzx-common/src/assets/Asset'

import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'

import { erc20Contract } from 'bzx-common/src/contracts/typescript-wrappers/erc20'
import { getErc20AddressOfAsset } from 'bzx-common/src/utils'

export class TradeBuyProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (FulcrumProvider.Instance.unsupportedNetwork) {
      throw new Error('You are connected to the wrong network!')
    }
    if (
      !(
        FulcrumProvider.Instance.contractsSource &&
        FulcrumProvider.Instance.contractsSource.canWrite
      )
    ) {
      throw new Error('No provider available!')
    }

    // Initializing loan
    const taskRequest: TradeRequest = task.request as TradeRequest
    const isLong = taskRequest.positionType === PositionType.LONG

    const loanToken = isLong ? taskRequest.quoteToken : taskRequest.asset
    const depositToken = taskRequest.depositToken
    const collateralToken = isLong ? taskRequest.asset : taskRequest.quoteToken

    const decimals: number = AssetsDictionary.assets.get(depositToken)!.decimals || 18

    const amountInBaseUnits = new BigNumber(
      taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1)
    )

    const tokenContract = await FulcrumProvider.Instance.contractsSource.getITokenContract(
      loanToken
    )
    if (!tokenContract) {
      throw new Error('No iToken contract available!')
    }

    let tokenErc20Contract: erc20Contract | null = null
    let assetErc20Address: string | null = ''
    let erc20allowance = new BigNumber(0)
    if (
      (process.env.REACT_APP_ETH_NETWORK === 'mainnet' &&
        (taskRequest.depositToken === Asset.WETH || taskRequest.depositToken === Asset.ETH)) ||
      (process.env.REACT_APP_ETH_NETWORK === 'bsc' && taskRequest.depositToken === Asset.BNB)
    ) {
      task.processingStart([
        'Initializing',
        'Submitting trade',
        'Updating the blockchain',
        'Transaction completed',
      ])

      assetErc20Address = '0x0000000000000000000000000000000000000000'
    } else {
      //Initializing
      task.processingStart([
        'Initializing',
        'Detecting token allowance',
        'Prompting token allowance',
        'Waiting for token allowance',
        'Submitting trade',
        'Updating the blockchain',
        'Transaction completed',
      ])

      assetErc20Address = getErc20AddressOfAsset(taskRequest.depositToken)
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

      erc20allowance = await tokenErc20Contract
        .allowance(account, tokenContract.address)
        .callAsync()

      // Prompting token allowance
      task.processingStepNext()

      try {
        //FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

        // Prompting token allowance
        if (amountInBaseUnits.gt(erc20allowance)) {
          const approvePromise = await FulcrumProvider.Instance.setApproval(
            tokenContract.address,
            taskRequest.depositToken,
            FulcrumProvider.Instance.getLargeApprovalAmount(
              taskRequest.depositToken,
              amountInBaseUnits
            )
          )
        }
        // Waiting for token allowance
        task.processingStepNext()
      } catch (e) {
        //console.log(e);
      }
    }
    //Submitting loan
    task.processingStepNext()

    let gasAmountBN

    const leverageAmount =
      taskRequest.positionType === PositionType.LONG
        ? new BigNumber(taskRequest.leverage - 1).times(10 ** 18)
        : new BigNumber(taskRequest.leverage).times(10 ** 18)

    const loanTokenSent = depositToken === loanToken ? amountInBaseUnits : new BigNumber(0)

    const collateralTokenSent =
      depositToken === collateralToken ? amountInBaseUnits : new BigNumber(0)

    //const depositTokenAddress = getErc20AddressOfAsset(depositToken);
    const collateralTokenAddress =
      (process.env.REACT_APP_ETH_NETWORK === 'mainnet' && collateralToken === Asset.ETH) ||
      (process.env.REACT_APP_ETH_NETWORK === 'bsc' && collateralToken === Asset.BNB)
        ? FulcrumProvider.ZERO_ADDRESS
        : getErc20AddressOfAsset(collateralToken)
    const loanData = '0x'

    const sendAmountForValue =
      (process.env.REACT_APP_ETH_NETWORK === 'mainnet' &&
        (taskRequest.depositToken === Asset.WETH || taskRequest.depositToken === Asset.ETH)) ||
      (process.env.REACT_APP_ETH_NETWORK === 'bsc' && taskRequest.depositToken === Asset.BNB)
        ? amountInBaseUnits
        : new BigNumber(0)

    const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === 'true'
    const ChiTokenBalance = await FulcrumProvider.Instance.getAssetTokenBalanceOfUser(Asset.CHI)
    // Waiting for token allowance
    if (skipGas) {
      gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit)
    } else {
      const gasAmount =
        isGasTokenEnabled && ChiTokenBalance.gt(0)
          ? await tokenContract
              .marginTradeWithGasToken(
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                collateralTokenAddress!,
                account,
                account,
                loanData
              )
              .estimateGasAsync({
                from: account,
                value: sendAmountForValue,
                gas: FulcrumProvider.Instance.gasLimit,
              })
          : await tokenContract
              .marginTrade(
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                collateralTokenAddress!,
                account,
                loanData
              )
              .estimateGasAsync({
                from: account,
                value: sendAmountForValue,
                gas: FulcrumProvider.Instance.gasLimit,
              })
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(FulcrumProvider.Instance.gasBufferCoeffForTrade)
        .integerValue(BigNumber.ROUND_UP)
    }

    let txHash: string = ''
    try {
      //FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

      // Submitting trade
      txHash =
        isGasTokenEnabled && ChiTokenBalance.gt(0)
          ? await tokenContract
              .marginTradeWithGasToken(
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                collateralTokenAddress!,
                account,
                account,
                loanData
              )
              .sendTransactionAsync({
                from: account,
                value: sendAmountForValue,
                gas: gasAmountBN.toString(),
                gasPrice: await ethGasStation.getGasPrice(),
              })
          : await tokenContract
              .marginTrade(
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                collateralTokenAddress!,
                account,
                loanData
              )
              .sendTransactionAsync({
                from: account,
                value: sendAmountForValue,
                gas: gasAmountBN.toString(),
                gasPrice: await ethGasStation.getGasPrice(),
              })
      task.setTxHash(txHash)
    } catch (e) {
      throw e
    }
    //Updating the blockchain
    task.processingStepNext()
    const txReceipt = await FulcrumProvider.Instance.waitForTransactionMined(txHash, task.request)
    if (!txReceipt.status) {
      throw new Error('Reverted by EVM')
    }
    //Transaction completed
    task.processingStepNext()
    await FulcrumProvider.Instance.sleep(FulcrumProvider.Instance.successDisplayTimeout)
  }
}
