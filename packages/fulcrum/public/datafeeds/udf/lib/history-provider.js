import * as tslib_1 from "tslib";
import { getErrorMessage, } from './helpers';
import axios from 'axios';
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
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this._requester.sendRequest(this._datafeedUrl, 'history', requestParams)
                    .then(function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var bars, meta, volumePresent, ohlPresent, rate, i, barValue;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (response.s !== 'ok' && response.s !== 'no_data') {
                                    reject(response.errmsg);
                                    return [2 /*return*/];
                                }
                                bars = [];
                                meta = {
                                    noData: false,
                                };
                                if (!(response.s === 'no_data')) return [3 /*break*/, 1];
                                meta.noData = true;
                                meta.nextTime = response.nextTime;
                                return [3 /*break*/, 3];
                            case 1:
                                volumePresent = response.v !== undefined;
                                ohlPresent = response.o !== undefined;
                                return [4 /*yield*/, axios.get("https://production-cache.kyber.network/rateETH").then(function (response) {
                                        console.log(response);
                                        return response.data.data;
                                    })];
                            case 2:
                                rate = _a.sent();
                                for (i = 0; i < response.t.length; ++i) {
                                    barValue = {
                                        time: response.t[i] * 1000,
                                        close: Number(response.c[i] * rate),
                                        open: Number(response.c[i] * rate),
                                        high: Number(response.c[i] * rate),
                                        low: Number(response.c[i] * rate),
                                    };
                                    if (ohlPresent) {
                                        barValue.open = Number(response.o[i] * rate);
                                        barValue.high = Number(response.h[i] * rate);
                                        barValue.low = Number(response.l[i]) * rate;
                                    }
                                    if (volumePresent) {
                                        barValue.volume = Number(response.v[i]);
                                    }
                                    bars.push(barValue);
                                }
                                _a.label = 3;
                            case 3:
                                resolve({
                                    bars: bars,
                                    meta: meta,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .catch(function (reason) {
                    var reasonString = getErrorMessage(reason);
                    // tslint:disable-next-line:no-console
                    console.warn("HistoryProvider: getBars() failed, error=" + reasonString);
                    reject(reasonString);
                });
                return [2 /*return*/];
            });
        }); });
    };
    return HistoryProvider;
}());
export { HistoryProvider };
