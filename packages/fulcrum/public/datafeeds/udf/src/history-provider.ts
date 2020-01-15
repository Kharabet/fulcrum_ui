import {
	Bar,
	HistoryMetadata,
	LibrarySymbolInfo,
} from '../../../charting_library/datafeed-api';

import {
	getErrorMessage,
	RequestParams,
	UdfErrorResponse,
	UdfOkResponse,
	UdfResponse,
} from './helpers';

import axios from 'axios';

import { Requester } from './requester';

interface HistoryPartialDataResponse extends UdfOkResponse {
	t: number[];
	c: number[];
	o?: never;
	h?: never;
	l?: never;
	v?: never;
}

interface HistoryFullDataResponse extends UdfOkResponse {
	t: number[];
	c: number[];
	o: number[];
	h: number[];
	l: number[];
	v: number[];
}

interface HistoryNoDataResponse extends UdfResponse {
	s: 'no_data';
	nextTime?: number;
}

type HistoryResponse = HistoryFullDataResponse | HistoryPartialDataResponse | HistoryNoDataResponse;

export interface GetBarsResult {
	bars: Bar[];
	meta: HistoryMetadata;
}

export class HistoryProvider {
	private _datafeedUrl: string;
	private readonly _requester: Requester;

	public constructor(datafeedUrl: string, requester: Requester) {
		this._datafeedUrl = datafeedUrl;
		this._requester = requester;
	}

	public getBars(symbolInfo: LibrarySymbolInfo, resolution: string, rangeStartDate: number, rangeEndDate: number): Promise<GetBarsResult> {
		const requestParams: RequestParams = {
			symbol: symbolInfo.ticker || '',
			resolution: resolution,
			from: rangeStartDate,
			to: rangeEndDate,
		};

		return new Promise(async (resolve: (result: GetBarsResult) => void, reject: (reason: string) => void) => {
			this._requester.sendRequest<HistoryResponse>(this._datafeedUrl, 'history', requestParams)
				.then( async (response: HistoryResponse | UdfErrorResponse) => {
					if (response.s !== 'ok' && response.s !== 'no_data') {
						reject(response.errmsg);
						return;
					}

					const bars: Bar[] = [];
					const meta: HistoryMetadata = {
						noData: false,
					};

					if (response.s === 'no_data') {
						meta.noData = true;
						meta.nextTime = response.nextTime;
					} else {
						const volumePresent = response.v !== undefined;
						const ohlPresent = response.o !== undefined;
						const rate = await axios.get("https://production-cache.kyber.network/rateETH").then((response: any) => {

							console.log(response);
							return response.data.data;
						});
						
						for (let i = 0; i < response.t.length; ++i) {
							const barValue: Bar = {
								time: response.t[i] * 1000,
								close: Number(response.c[i] * rate),
								open: Number(response.c[i] * rate),
								high: Number(response.c[i] * rate),
								low: Number(response.c[i] * rate),
							};

							if (ohlPresent) {
								barValue.open = Number((response as HistoryFullDataResponse).o[i]* rate);
								barValue.high = Number((response as HistoryFullDataResponse).h[i]* rate);
								barValue.low = Number((response as HistoryFullDataResponse).l[i])* rate;
							}

							if (volumePresent) {
								barValue.volume = Number((response as HistoryFullDataResponse).v[i]);
							}

							bars.push(barValue);
						}
					}

					resolve({
						bars: bars,
						meta: meta,
					});
				})
				.catch((reason?: string | Error) => {
					const reasonString = getErrorMessage(reason);
					// tslint:disable-next-line:no-console
					console.warn(`HistoryProvider: getBars() failed, error=${reasonString}`);
					reject(reasonString);
				});
		});
	}
}
