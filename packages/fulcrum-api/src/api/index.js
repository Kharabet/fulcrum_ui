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
	api.get('/apr', async (req, res) => {
		var apr = await fulcrum.getAPR();
		res.json(apr);
	});

	api.get('/tvl-usd', async (req, res) => {
		var tvl = await fulcrum.getTVL();
		res.json(tvl);
	});

	api.get('/usd-rates', async (req, res) => {
		var usdRates = await fulcrum.getUsdRates();
		res.json(usdRates);
	});
	api.get('/torque-borrow-rates', async (req, res) => {
		var torqueBorrowRates = await fulcrum.getTorqueBorrowRates();
		res.json(torqueBorrowRates);
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
