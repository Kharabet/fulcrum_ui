import { Router } from 'express';
import Fulcrum from "../fulcrum";
import Torque from "../torque";
import NodeCache from "node-cache";
import Web3 from 'web3';

import { query, oneOf, validationResult } from 'express-validator';
import { iTokens } from '../config/iTokens';


export default ({ config }) => {

	let api = Router();
	const cache = new NodeCache({ stdTTL: config.cache_ttl_sec, checkperiod: config.cache_ttl_sec });
	var web3 = new Web3(new Web3.providers.HttpProvider(config.web3_provider_url));


	var fulcrum = new Fulcrum(web3, cache);
	var torque = new Torque(web3, cache);

	api.get('/total-asset-supply', async (req, res) => {
		const totalAssetSupply = await fulcrum.getTotalAssetSupply();
		res.json(totalAssetSupply);
	});

	api.get('/total-asset-borrow', async (req, res) => {
		const totalAssetBorrow = await fulcrum.getTotalAssetBorrow();
		res.json(totalAssetBorrow);
	});

	//TODO: replace with supply-rate-apr endpoint
	api.get('/apr', async (req, res) => {
		const apr = await fulcrum.getSupplyRateAPR();
		res.json(apr);
	});

	api.get('/supply-rate-apr', async (req, res) => {
		const apr = await fulcrum.getSupplyRateAPR();
		res.json(apr);
	});

	api.get('/borrow-rate-apr', async (req, res) => {
		const apr = await fulcrum.getBorrowRateAPR();
		res.json(apr);
	});
	
	api.get('/torque-borrow-rate-apr', async (req, res) => {
		const torqueBorrowRates = await fulcrum.getTorqueBorrowRateAPR();
		res.json(torqueBorrowRates);
	});

	api.get('/vault-balance', async (req, res) => {
		const vaultBalance = await fulcrum.getVaultBalance();
		res.json(vaultBalance);
	});
	
	api.get('/liquidity', async (req, res) => {
		const liquidity = await fulcrum.getFreeLiquidity();
		res.json(liquidity);
	});

	//TODO: replace with vault-balance-usd endpoint
	api.get('/tvl-usd', async (req, res) => {
		const tvl = await fulcrum.getTVL();
		res.json(tvl);
	});

	api.get('/vault-balance-usd', async (req, res) => {
		const tvl = await fulcrum.getTVL();
		res.json(tvl);
	});

	//TODO: replace with assets-usd-rates endpoint
	api.get('/usd-rates', async (req, res) => {
		const usdRates = await fulcrum.getUsdRates();
		res.json(usdRates);
	});

	api.get('/assets-usd-rates', async (req, res) => {
		const usdRates = await fulcrum.getUsdRates();
		res.json(usdRates);
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
		var borrowDepositEstimate = await torque.getBorrowDepositEstimate(borrowAsset, collateralAsset, amount);
		res.json(borrowDepositEstimate);


	});

	return api;
}
