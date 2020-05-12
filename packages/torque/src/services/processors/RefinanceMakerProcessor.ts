import { BigNumber } from "@0x/utils";
import { RequestTask } from "../../domain/RequestTask";
import { TorqueProvider } from "../TorqueProvider";
import { RefinanceMakerRequest } from "../../domain/RefinanceMakerRequest";
import { cdpManagerContract } from "../../contracts/cdpManager";
import { dsProxyJsonContract } from "../../contracts/dsProxyJson";
import { makerBridgeContract } from "../../contracts/makerBridge";
import Web3 from "web3";

export class RefinanceMakerProcessor {
    public run = async (task: RequestTask, account: string, skipGas: boolean, configAddress: any, web3: Web3) => {
        if (!(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)) {
            throw new Error("No provider available!");
        }

        const taskRequest: RefinanceMakerRequest = (task.request as RefinanceMakerRequest);

        //Initializing
        task.processingStart([
            "Initializing",
            "Preparing loan refinance",
            "Submitting loan refinance",
            "Updating blockchain",
            "Transaction completed"
        ]);

        const left = taskRequest.refLoan.debt.minus(taskRequest.loanAmount);
        const isDust = !(
            taskRequest.loanAmount.dp(3, BigNumber.ROUND_DOWN)
                .isEqualTo(taskRequest.refLoan.debt.dp(3, BigNumber.ROUND_DOWN))
            ||
            left.gt(taskRequest.refLoan.dust)
        );

        if (isDust) {
            if (!window.confirm("Remaining debt should be zero or more than " + taskRequest.refLoan.dust.toString(10) + " DAI. Do you want to continue with total amount?")) {
                throw new Error("No provider available!");
            }
            taskRequest.loanAmount = taskRequest.refLoan.debt;
        }


        const cdpManagerAddress = configAddress.CDP_MANAGER;
        const cdpManager: cdpManagerContract = await TorqueProvider.Instance.contractsSource.getCdpManager(cdpManagerAddress);

        const collateralAmount = taskRequest.refLoan.collateralAmount//.dividedBy(taskRequest.refLoan.debt.dividedBy(taskRequest.loanAmount));
        // @ts-ignore
        const dart = web3.utils.toWei(taskRequest.loanAmount.dp(18, BigNumber.ROUND_UP).toString());
        // @ts-ignore
        const dink = web3.utils.toWei(collateralAmount.dp(18, BigNumber.ROUND_FLOOR).toString());

        let txHash = "";
        const isCdpCan = await cdpManager.cdpCan.callAsync(taskRequest.refLoan.proxyAddress, taskRequest.refLoan.cdpId, configAddress.Maker_Bridge_Address);

        //Preparing loan refinance
        task.processingStepNext();
        if (taskRequest.refLoan.isProxy) {
            const proxy: dsProxyJsonContract = await TorqueProvider.Instance.contractsSource.getDsProxy(taskRequest.refLoan.proxyAddress);
            if (!isCdpCan.gt(0)) {
                const dsProxyAllowABI = await TorqueProvider.Instance.contractsSource.dsProxyAllowJson();
                // @ts-ignore
                const allowData = web3.eth.abi.encodeFunctionCall(
                    dsProxyAllowABI.default, [
                    cdpManagerAddress,
                    taskRequest.refLoan.cdpId.toString(),
                    configAddress.Maker_Bridge_Address,
                    1
                ]
                );
                const proxyActionsAddress = taskRequest.refLoan.isInstaProxy ?
                    configAddress.Insta_Proxy_Actions : configAddress.proxy_Actions_Address;

                //Submitting loan refinance          
                task.processingStepNext();
                // if proxy use then use this function for cdpAllow
                try {


                    txHash = await proxy.execute.sendTransactionAsync(proxyActionsAddress, allowData, {
                        from: taskRequest.refLoan.accountAddress,
                        isInstaProxy: taskRequest.refLoan.isInstaProxy
                    });
                } catch (e) {
                    if (!e.code) {
                        throw new Error("Dry run failed");

                    }
                }

            } else {

                const proxyMigrationABI = await TorqueProvider.Instance.contractsSource.getProxyMigration();
                const params = [
                    configAddress.Maker_Bridge_Address,
                    [taskRequest.refLoan.cdpId.toString()],
                    [dart],
                    [dink],
                    [dink],
                    [dart]
                ];

                // @ts-ignore
                const data = web3.eth.abi.encodeFunctionCall(proxyMigrationABI.default, params);
                const bridgeActionsAddress = configAddress.Bridge_Action_Address;
                //Submitting loan refinance          
                task.processingStepNext();
                try {
                    if (taskRequest.refLoan.isInstaProxy) {
                        const makerBridge: makerBridgeContract = await TorqueProvider.Instance.contractsSource.getMakerBridge(configAddress.Maker_Bridge_Address);
                        txHash = await makerBridge.migrateLoan.sendTransactionAsync(
                            params[1], params[2], params[3], params[4], params[5],
                            { from: taskRequest.refLoan.accountAddress }
                        );
                    } else {
                        txHash = await proxy.execute.sendTransactionAsync(bridgeActionsAddress, data, {
                            from: taskRequest.refLoan.accountAddress
                        });
                    }
                } catch (e) {
                    if (!e.code) {
                        throw new Error("Dry run failed");

                    }
                }
            }
        } else {
            if (!isCdpCan.gt(0)) {
                const cdpsResp = await cdpManager.cdpAllow.sendTransactionAsync(taskRequest.refLoan.cdpId, configAddress.Maker_Bridge_Address, new BigNumber(1), { from: taskRequest.refLoan.accountAddress }); // 0x2252d3b2c12455d564abc21e328a1122679f8352
                const receipt = await TorqueProvider.Instance.waitForTransactionMined(cdpsResp);
                if (!receipt.status) {
                    throw new Error("Reverted by EVM");
                }
            }
            const makerBridge: makerBridgeContract = await TorqueProvider.Instance.contractsSource.getMakerBridge(configAddress.Maker_Bridge_Address);

            //Submitting loan refinance          
            task.processingStepNext();
            try {
                txHash = await makerBridge.migrateLoan.sendTransactionAsync([taskRequest.refLoan.cdpId], [new BigNumber(dart)], [new BigNumber(dink)], [new BigNumber(dink)], [new BigNumber(dart)], { from: taskRequest.refLoan.accountAddress });
            } catch (e) {
                if (!e.code) {
                    throw new Error("Dry run failed");
                }
            }
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
