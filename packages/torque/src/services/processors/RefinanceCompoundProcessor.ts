import { BigNumber } from '@0x/utils'
import { RequestTask } from '../../domain/RequestTask'
import { TorqueProvider } from '../TorqueProvider'
import { RefinanceCompoundRequest } from '../../domain/RefinanceCompoundRequest'

// export class RefinanceCompoundProcessor {
//   public run = async (task: RequestTask, account: string, skipGas: boolean) => {
//     if (!(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)) {
//       throw new Error("No provider available!");
//     }

//     const taskRequest: RefinanceCompoundRequest = (task.request as RefinanceCompoundRequest);
//     const loan = taskRequest.refLoan;

//     //Initializing
//     task.processingStart([
//       "Initializing",
//       "Preparing loan refinance",
//       "Submitting loan refinance",
//       "Updating blockchain",
//       "Transaction completed"
//     ]);

//     const compoundBridge = await TorqueProvider.Instance.contractsSource.getCompoundBridgeContract();
//     const promises = [];

//     //Preparing loan refinance
//     task.processingStepNext();
//     for (const token of loan.collateral) {

//       const allowance = (await token.contract!.allowance.callAsync(account, compoundBridge.address)).div(10 ** token.decimals);
//       if (allowance.lt(token.amount)) {
//         try {
//           const txHash = await token.contract!.approve.sendTransactionAsync(
//             compoundBridge.address, (new BigNumber(100000000000)).times(10 ** token.decimals),
//             { from: account }
//           );
//           promises.push(TorqueProvider.Instance.waitForTransactionMined(txHash));
//           task.setTxHash(txHash);
//         } catch (e) {
//           if (!e.code) {
//             alert("approve for " + token.asset + " failed: " + e.message);
//           }
//           console.log(e)
//         }
//       }
//     }

//     await Promise.all(promises);

//     const divider = loan.balance.div(taskRequest.loanAmount);
//     loan.usdValue = loan.usdValue.div(divider);
//     loan.balance = loan.balance.div(divider);

//     await TorqueProvider.Instance.assignCollateral([loan], TorqueProvider.Instance.compoundDeposits);

//     const assets: string[] = [];
//     const amounts: BigNumber[] = [];
//     const borrowAmounts: BigNumber[] = [];

//     let borrowAmountsSum = new BigNumber(0);
//     for (const token of loan.collateral) {
//       assets.push(token.market.toString());
//       amounts.push(
//         token.amount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN)
//       );
//       const borrowAmount = token.borrowAmount.times(10 ** loan.decimals).integerValue(BigNumber.ROUND_DOWN);
//       borrowAmounts.push(borrowAmount);
//       borrowAmountsSum = borrowAmountsSum.plus(borrowAmount);
//     }

//     const loanAmount = taskRequest.loanAmount.times(10 ** loan.decimals).integerValue(BigNumber.ROUND_DOWN);

//     borrowAmounts[0] = borrowAmounts[0].plus(loanAmount.minus(borrowAmountsSum));

//     let txHash = "";

//     //Submitting loan refinance
//     task.processingStepNext();
//     try {
//       txHash = await compoundBridge.migrateLoan.sendTransactionAsync(
//         String(loan.market),
//         loanAmount,
//         assets,
//         amounts,
//         amounts,
//         borrowAmounts,
//         {
//           from: account,
//           gas: skipGas ? TorqueProvider.Instance.gasLimit : undefined
//         }
//       );
//       task.setTxHash(txHash);
//     } catch (e) {
//       console.log(e)
//       throw e;
//     }

//     //Updating the blockchain
//     task.processingStepNext();
//     const txReceipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);
//     if (!txReceipt.status) {
//       throw new Error("Reverted by EVM");
//     }

//     //Transaction completed
//     task.processingStepNext();
//     await TorqueProvider.Instance.sleep(TorqueProvider.Instance.successDisplayTimeout);
//   }
// }
