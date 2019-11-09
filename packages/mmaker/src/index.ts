// @ts-ignore
import EFX from "efx-api-node";
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";

// @ts-ignore
import { ContractsSource } from "@bzxnetwork/mmaker-wrappers";
import { checkPass } from "./watcher";

const walletAddress = "";
const walletPrivateKey = "";
const infuraKey = "";
const infuraURL = `https://kovan.infura.io/v3/${infuraKey}`;
const fulcrumNetwork = "kovan";
const fulcrumNetworkId = 42;
const deversiFiApiEndpoint = "https://staging-api.deversifi.com/v1/trading";
// const deversiFiApiEndpoint = "https://api.ethfinex.com/trustless/v1";

const provider = new HDWalletProvider(walletPrivateKey, infuraURL);
const web3 = new Web3(provider);

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

  // 24 is 24 hours to lock contracts. weird parameter on deversiFi
  // in general - should not influence anything
  await checkPass(efx, contractsSource, fulcrumNetworkId, 24, "ETH", "USD");
  // await checkPass(efx, contractsSource, fulcrumNetworkId, 24, "MLN", "ETH");
  // await checkPass(efx, contractsSource, fulcrumNetworkId, 24, "ETH", "dsETH2x");
};

main().then(() => {
  console.log("finished");
});
