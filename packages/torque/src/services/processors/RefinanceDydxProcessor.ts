import { BigNumber } from '@0x/utils'
import { RequestTask } from 'app-lib/tasksQueue'
import { TorqueProvider } from '../TorqueProvider'
import { RefinanceDydxRequest } from '../../domain/RefinanceDydxRequest'

// export class RefinanceDydxProcessor {
//   public run = async (task: RequestTask, account: string, skipGas: boolean) => {
//     if (!(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)) {
//       throw new Error("No provider available!");
//     }

//     const taskRequest: RefinanceDydxRequest = (task.request as RefinanceDydxRequest);
//     const loan = taskRequest.refLoan;

//     //Initializing
//     task.processingStart([
//       "Initializing",
//       "Preparing loan refinance",
//       "Submitting loan refinance",
//       "Updating blockchain",
//       "Transaction completed"
//     ]);

//     const solo = await TorqueProvider.Instance.contractsSource.getSoloContract();
//     const soloBridge = await TorqueProvider.Instance.contractsSource.getSoloBridgeContract();
//     const isOperator = await solo.getIsLocalOperator.callAsync(account, soloBridge.address);

//     //Preparing loan refinance
//     task.processingStepNext();

//     let txHash: string = "";

//     if (!isOperator) {
//       try {
//         txHash = await solo.setOperators.sendTransactionAsync(
//           [
//             {
//               operator: soloBridge.address,
//               trusted: true
//             }
//           ],
//           { from: account }
//         );
//         task.setTxHash(txHash);
//       } catch (e) {
//         console.log(e)
//         throw e;
//       }

//       const txReceipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);

//       if (!txReceipt.status) {
//         throw new Error("Reverted by EVM");
//       }
//     }

//     const markets: BigNumber[] = [];
//     const amounts: BigNumber[] = [];
//     const borrowAmounts: BigNumber[] = [];

//     const divider = loan.balance.div(taskRequest.loanAmount);
//     let amount = taskRequest.loanAmount;

//     if (amount.isEqualTo(loan.balance)) {
//       amount = new BigNumber(0);
//     }

//     loan.usdValue = loan.usdValue.div(divider);
//     loan.balance = loan.balance.div(divider);

//     await TorqueProvider.Instance.assignCollateral([loan], TorqueProvider.Instance.soloDeposits);

//     for (const token of loan.collateral) {
//       markets.push(new BigNumber(token.market));
//       amounts.push(
//         token.amount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN)
//       );
//       borrowAmounts.push(
//         token.borrowAmount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN)
//       );
//     }

//     amount = amount.times(10 ** loan.decimals).integerValue(BigNumber.ROUND_DOWN);

//     //Submitting loan refinance
//     task.processingStepNext();
//     try {
//       txHash = await soloBridge.migrateLoan.sendTransactionAsync(
//         {
//           owner: account,
//           number: new BigNumber(0)
//         },
//         new BigNumber(loan.market),
//         amount,
//         markets,
//         amounts,
//         amounts,
//         borrowAmounts,
//         { from: account }
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
