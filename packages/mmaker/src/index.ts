// @ts-ignore
import EFX from "efx-api-node";
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";

import contract from "./marketMakerProvision.json";

// @ts-ignore
import { ContractsSource } from "@bzxnetwork/mmaker-wrappers";
import { checkPass } from "./watcher";

const walletAddress = "";
const walletPrivateKey = "6390F8AC2E44732417E0C154963B9601CD91D300A1770DD6A9019966BEC6FD35";
const infuraProjectId = "61cf375118244082a90463ecee7a9f08";
const infuraURL = `https://kovan.infura.io/v3/${infuraProjectId}`;
const fulcrumNetwork = "kovan";
const fulcrumNetworkId = 42;
const deversiFiApiEndpoint = "https://staging-api.deversifi.com/v1/trading";
// const deversiFiApiEndpoint = "https://api.ethfinex.com/trustless/v1";

const provider = new HDWalletProvider(walletPrivateKey, infuraURL);
const web3 = new Web3(provider);

// const nameContract = new (web3.eth as any).Contract(contract.abi, "0xE41B37de302c41235b5aB5249Cdb965DCc81f573");
// nameContract.methods.mint("-2xETH", "0", "24").send({
//   from: (web3.currentProvider as any).addresses[0],
//   value: "9347704005278205",
//   gas: 2000000
// }).then((value: any) => {
//   console.dir(value);
// }, (e: any) => {
//   console.dir(e);
// });

const gasPrice = (web3: any) => {
  return web3.utils.toWei("3", "gwei");
};

const main = async () => {
  const contractsSource = new ContractsSource(provider, fulcrumNetworkId, true);
  await contractsSource.Init(fulcrumNetwork);
  const efxConfig = { api: deversiFiApiEndpoint };
  const efx = await EFX(web3, efxConfig);
  efx.set("gasPrice", gasPrice(web3));

  // Set the account and credentials (from example: https://docs.ethfinex.com/?version=latest#locking-tokens)
  // It seems like it's not needed
  // await efx.web3.eth.accounts.wallet.add(walletPrivateKey);
  // await efx.web3.eth.accounts.privateKeyToAccount(walletPrivateKey);
  // await efx.account.select();
  // efx.set("account", walletAddress);

  // 10 000 is 10 000 hours to lock contracts. weird parameter on deversiFi
  // in general - should not influence anything
  // 10 000 works, but 24 doesn't. why? nobody knows.
  await checkPass(efx, contractsSource, fulcrumNetworkId, 38000000, "MLN", "ETH");
  // await checkPass(efx, contractsSource, fulcrumNetworkId, 24, "dsETH2x_v2", "ETH");
};

main().then(() => {
  console.log("finished");
});
