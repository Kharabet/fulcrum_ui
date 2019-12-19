import Web3 from "web3";

export const waitForTransactionMined = async (
  web3: Web3,
  txHash: string): Promise<any> => {

  return new Promise((resolve, reject) => {
    try {
      waitForTransactionMinedRecursive(txHash, web3, resolve, reject);
    } catch (e) {
      throw e;
    }
  });
};

const waitForTransactionMinedRecursive = async (
  txHash: string,
  web3: Web3,
  resolve: (value: any) => void,
  reject: (value: any) => void) => {

  try {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (receipt) {
      if (receipt.status) {
        resolve(receipt);
      } else {
        reject(new Error("Transaction has been reverted by the EVM"));
      }
    } else {
      setTimeout(() => {
        waitForTransactionMinedRecursive(txHash, web3, resolve, reject);
      }, 5000);
    }
  }
  catch (e) {
    reject(e);
  }
};
