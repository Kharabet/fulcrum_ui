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


function getBarsInfo(response: HistoryResponse, isVolume: boolean = true) {

	const bars: Bar[] = [];
	const meta: HistoryMetadata = {
		noData: false,
	};

	if (response.s === 'no_data') {
		meta.noData = true;
		meta.nextTime = response.nextTime;
	} else {
		const volumePresent = isVolume && response.v !== undefined;
		const ohlPresent = response.o !== undefined;


		for (let i = 0; i < response.t.length; ++i) {
			const barValue: Bar = {
				time: response.t[i] * 1000,
				close: Number(response.c[i]),
				open: Number(response.c[i]),
				high: Number(response.c[i]),
				low: Number(response.c[i]),
			};

			if (ohlPresent) {
				barValue.open = Number((response as HistoryFullDataResponse).o[i]);
				barValue.high = Number((response as HistoryFullDataResponse).h[i]);
				barValue.low = Number((response as HistoryFullDataResponse).l[i]);
			}

			if (volumePresent) {
				barValue.volume = Number((response as HistoryFullDataResponse).v[i]);
			}

			bars.push(barValue);
		}


	}
	return {
		bars: bars,
		meta: meta
	}
}

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

		return new Promise((resolve: (result: GetBarsResult) => void, reject: (reason: string) => void) => {
			this._requester.sendRequest<HistoryResponse>(this._datafeedUrl, 'history', requestParams)
				.then((response: HistoryResponse | UdfErrorResponse) => {

					if (response.s !== 'ok' && response.s !== 'no_data') {
						reject(response.errmsg);
						return;
					}

					let barsInfo = getBarsInfo(response);

					if (barsInfo.meta.noData) {
						const symbol = requestParams.symbol.toString().split('_');

						if (symbol[0] === 'ETH') {
							requestParams.symbol = symbol[1] + '_ETH';
							this._requester.sendRequest<HistoryResponse>(this._datafeedUrl, 'history', requestParams)
								.then((response: HistoryResponse | UdfErrorResponse) => {
									if (response.s !== 'ok' && response.s !== 'no_data') {
										reject(response.errmsg);
										return;
									}
									const firstBarsInfo = getBarsInfo(response, false);
									if (!firstBarsInfo.meta.noData) {

										barsInfo.bars = firstBarsInfo.bars.map((bar) => ({
											time: bar.time,
											close: 1 / bar.close,
											open: 1 / bar.open,
											high: 1 / bar.high,
											low: 1 / bar.low,
										}));
										resolve({
											bars: barsInfo.bars,
											meta: barsInfo.meta,
										});
									}
								});
						}
						else {
							requestParams.symbol = symbol[0] + '_ETH';
							this._requester.sendRequest<HistoryResponse>(this._datafeedUrl, 'history', requestParams)
								.then((response: HistoryResponse | UdfErrorResponse) => {
									if (response.s !== 'ok' && response.s !== 'no_data') {
										reject(response.errmsg);
										return;
									}

									const firstBarsInfo = getBarsInfo(response, false);
									if (!firstBarsInfo.meta.noData) {
										requestParams.symbol = symbol[1] + '_ETH';
										this._requester.sendRequest<HistoryResponse>(this._datafeedUrl, 'history', requestParams)
											.then((response: HistoryResponse | UdfErrorResponse) => {
												if (response.s !== 'ok' && response.s !== 'no_data') {
													reject(response.errmsg);
													return;
												}
												const secondBarsInfo = getBarsInfo(response, false);
												if (!secondBarsInfo.meta.noData) {

													barsInfo.bars = secondBarsInfo.bars.map((bar, index) => ({
														time: bar.time,
														close: firstBarsInfo.bars[index].close / bar.close,
														open: firstBarsInfo.bars[index].open / bar.open,
														high: firstBarsInfo.bars[index].high / bar.high,
														low: firstBarsInfo.bars[index].low / bar.low,
													}));

													resolve({
														bars: barsInfo.bars,
														meta: barsInfo.meta,
													});

												}
											});

									}

								});

						}
					} else {
						resolve({
							bars: barsInfo.bars,
							meta: barsInfo.meta,
						});
					}

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
