import { getErrorMessage, } from './helpers';
function getBarsInfo(response, isVolume) {
    if (isVolume === void 0) { isVolume = true; }
    var bars = [];
    var meta = {
        noData: false,
    };
    if (response.s === 'no_data') {
        meta.noData = true;
        meta.nextTime = response.nextTime;
    }
    else {
        var volumePresent = isVolume && response.v !== undefined;
        var ohlPresent = response.o !== undefined;
        for (var i = 0; i < response.t.length; ++i) {
            var barValue = {
                time: response.t[i] * 1000,
                close: Number(response.c[i]),
                open: Number(response.c[i]),
                high: Number(response.c[i]),
                low: Number(response.c[i]),
            };
            if (ohlPresent) {
                barValue.open = Number(response.o[i]);
                barValue.high = Number(response.h[i]);
                barValue.low = Number(response.l[i]);
            }
            if (volumePresent) {
                barValue.volume = Number(response.v[i]);
            }
            bars.push(barValue);
        }
    }
    return {
        bars: bars,
        meta: meta
    };
}
var HistoryProvider = /** @class */ (function () {
    function HistoryProvider(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
    }
    HistoryProvider.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate) {
        var _this = this;
        var requestParams = {
            symbol: symbolInfo.ticker || '',
            resolution: resolution,
            from: rangeStartDate,
            to: rangeEndDate,
        };
        return new Promise(function (resolve, reject) {
            _this._requester.sendRequest(_this._datafeedUrl, 'history', requestParams)
                .then(function (response) {
                if (response.s !== 'ok' && response.s !== 'no_data') {
                    reject(response.errmsg);
                    return;
                }
                var barsInfo = getBarsInfo(response);
                if (barsInfo.meta.noData) {
                    var symbol_1 = requestParams.symbol.toString().split('_');
                    if (symbol_1[0] === 'ETH') {
                        requestParams.symbol = symbol_1[1] + '_ETH';
                        _this._requester.sendRequest(_this._datafeedUrl, 'history', requestParams)
                            .then(function (response) {
                            if (response.s !== 'ok' && response.s !== 'no_data') {
                                reject(response.errmsg);
                                return;
                            }
                            var firstBarsInfo = getBarsInfo(response, false);
                            if (!firstBarsInfo.meta.noData) {
                                barsInfo.bars = firstBarsInfo.bars.map(function (bar) { return ({
                                    time: bar.time,
                                    close: 1 / bar.close,
                                    open: 1 / bar.open,
                                    high: 1 / bar.high,
                                    low: 1 / bar.low,
                                }); });
                            }
                            resolve({
                                bars: barsInfo.bars,
                                meta: barsInfo.meta,
                            });
                        });
                    }
                    else {
                        requestParams.symbol = symbol_1[0] + '_ETH';
                        _this._requester.sendRequest(_this._datafeedUrl, 'history', requestParams)
                            .then(function (response) {
                            if (response.s !== 'ok' && response.s !== 'no_data') {
                                reject(response.errmsg);
                                return;
                            }
                            var firstBarsInfo = getBarsInfo(response, false);
                            if (!firstBarsInfo.meta.noData) {
                                requestParams.symbol = symbol_1[1] + '_ETH';
                                _this._requester.sendRequest(_this._datafeedUrl, 'history', requestParams)
                                    .then(function (response) {
                                    if (response.s !== 'ok' && response.s !== 'no_data') {
                                        reject(response.errmsg);
                                        return;
                                    }
                                    var secondBarsInfo = getBarsInfo(response, false);
                                    if (!secondBarsInfo.meta.noData) {
                                        barsInfo.bars = secondBarsInfo.bars.map(function (bar, index) { return ({
                                            time: bar.time,
                                            close: firstBarsInfo.bars[index].close / bar.close,
                                            open: firstBarsInfo.bars[index].open / bar.open,
                                            high: firstBarsInfo.bars[index].high / bar.high,
                                            low: firstBarsInfo.bars[index].low / bar.low,
                                        }); });
                                    }
                                    resolve({
                                        bars: barsInfo.bars,
                                        meta: barsInfo.meta,
                                    });
                                });
                            }
                        });
                    }
                }
                else {
                    resolve({
                        bars: barsInfo.bars,
                        meta: barsInfo.meta,
                    });
                }
            })
                .catch(function (reason) {
                var reasonString = getErrorMessage(reason);
                // tslint:disable-next-line:no-console
                console.warn("HistoryProvider: getBars() failed, error=" + reasonString);
                reject(reasonString);
            });
        });
    };
    return HistoryProvider;
}());
export { HistoryProvider };
