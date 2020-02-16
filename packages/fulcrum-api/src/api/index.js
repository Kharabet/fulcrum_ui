import { Router } from 'express';
import Fulcrum from "../fulcrum";
import NodeCache from "node-cache";
import Web3 from 'web3';


export default ({ config}) => {

	let api = Router();
	const cache = new NodeCache({ stdTTL: config.cache_ttl_sec, checkperiod: config.cache_ttl_sec });
	var web3 = new Web3(new Web3.providers.HttpProvider(config.web3_provider_url));


	var fulcrum = new Fulcrum(web3,cache);
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

	return api;
}
