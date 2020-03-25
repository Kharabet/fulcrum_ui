import { Router } from 'express';
import Fulcrum from "../fulcrum";
import Torque from "../torque";
import Web3 from 'web3';

import { query, oneOf, validationResult } from 'express-validator';
import { iTokens } from '../config/iTokens';

import storage from 'node-persist';

export default ({ config }) => {

	const api = Router();

	// (async () => {
	// 	await storage.init({
	// 		dir: 'persist-storage'
	// 	});
	// })()

	const web3 = new Web3(new Web3.providers.HttpProvider(config.web3_provider_url));


	const fulcrum = new Fulcrum(web3);
	const torque = new Torque(web3);

	api.get('/total-asset-supply', async (req, res) => {
		const totalAssetSupply = await fulcrum.getTotalAssetSupply();
		res.json({data: totalAssetSupply, success: true});
	});

	api.get('/total-asset-borrow', async (req, res) => {
		const totalAssetBorrow = await fulcrum.getTotalAssetBorrow();
		res.json({data: totalAssetBorrow, success: true});
	});

	//TODO: replace with supply-rate-apr endpoint
	api.get('/apr', async (req, res) => {
		const apr = await fulcrum.getSupplyRateAPR();
		res.json({data: apr, success: true});
	});

	api.get('/supply-rate-apr', async (req, res) => {
		const apr = await fulcrum.getSupplyRateAPR();
		res.json({data: apr, success: true});
	});

	api.get('/borrow-rate-apr', async (req, res) => {
		const apr = await fulcrum.getBorrowRateAPR();
		res.json({data: apr, success: true});
	});

	api.get('/torque-borrow-rate-apr', async (req, res) => {
		const torqueBorrowRates = await fulcrum.getTorqueBorrowRateAPR();
		res.json({data: torqueBorrowRates, success: true});
	});

	api.get('/vault-balance', async (req, res) => {
		const vaultBalance = await fulcrum.getVaultBalance();
		res.json({data: vaultBalance, success: true});
	});

	api.get('/liquidity', async (req, res) => {
		const liquidity = await fulcrum.getFreeLiquidity();
		res.json({data: liquidity, success: true});
	});

	//TODO: replace with vault-balance-usd endpoint
	api.get('/tvl-usd', async (req, res) => {
		const tvl = await fulcrum.getTVL();
		res.json({data: tvl, success: true});
	});

	api.get('/vault-balance-usd', async (req, res) => {
		const tvl = await fulcrum.getTVL();
		res.json({data: tvl, success: true});
	});

	//TODO: replace with assets-usd-rates endpoint
	api.get('/usd-rates', async (req, res) => {
		const usdRates = await fulcrum.getUsdRates();
		res.json({ data: usdRates, success: true});
	});

	api.get('/oracle-rates-usd', async (req, res) => {
		const usdRates = await fulcrum.getUsdRates();
		res.json({ data: usdRates, success: true});
	});

	api.get('/itoken-prices-usd', async (req, res) => {
		const usdRates = await fulcrum.getITokensPricesUsd();
		res.json({ data: usdRates, success: true});
	});
	api.get('/ptoken-prices-usd', async (req, res) => {
		const usdRates = await fulcrum.getPTokensPricesUsd();
		res.json({ data: usdRates, success: true});
	});

	api.get('/borrow-deposit-estimate', [
		query('borrow_asset').isIn(iTokens.map(token => token.name)),
		query('borrow_asset').isIn(iTokens.map(token => token.name)),
		query('amount').isFloat({ gt: 0 })
	], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let borrowAsset = req.query.borrow_asset;
		let collateralAsset = req.query.collateral_asset;
		let amount = req.query.amount;
		const borrowDepositEstimate = await torque.getBorrowDepositEstimate(borrowAsset, collateralAsset, amount);
		if (parseFloat(borrowDepositEstimate.depositAmount) === 0 && amount > 0) {

			res.json({ message: "You entered too large amount", success: false, });
		}
		else {
			res.json({ data: borrowDepositEstimate, success: true });
		}
	});

	return api;
}
