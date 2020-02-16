var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import fetchPonyfill from "fetch-ponyfill";
import Web3 from "web3";
import { Subprovider } from "@0x/subproviders";
//import { VERSION } from "./version";
var _a = fetchPonyfill(), fetch = _a.fetch, Headers = _a.Headers;
var RATE_LIMIT_STATUS = 429;
var DEFAULT_MAX_RETRIES = 3;
var DEFAULT_RETRY_INTERVAL = 1000;
var DEFAULT_RETRY_JITTER = 250;
var ALCHEMY_DISALLOWED_METHODS = [
    "eth_accounts",
    "eth_sendRawTransaction",
    "eth_sendTransaction",
    "eth_sign",
    "eth_signTypedData_v3",
    "eth_signTypedData",
    "personal_sign",
];
var ALCHEMY_HEADERS = new Headers({
//"Accept": "application/json",
//"Content-Type": "text/plain"
//"Content-Type": "application/json",
//"Alchemy-Web3-Version": VERSION, // causes excessive OPTIONS requests
});
export function createAlchemyWeb3(alchemyUrl, config) {
    var fullConfig = fillInConfigDefaults(config);
    var currentProvider = fullConfig.writeProvider;
    function sendAsync(payload, callback) {
        callWhenDone(promisedSend(payload, alchemyUrl, currentProvider, fullConfig), callback);
    }
    var alchemyWeb3 = new Web3({ sendAsync: sendAsync });
    alchemyWeb3.setProvider = function () {
        throw new Error("setProvider is not supported in Alchemy Web3. To change the provider used for writes, use setWriteProvider() instead.");
    };
    alchemyWeb3.setWriteProvider = function (provider) { return (currentProvider = provider); };
    alchemyWeb3.alchemy = {
        getTokenAllowance: function (params, callback) {
            return callAlchemyMethod({
                alchemyUrl: alchemyUrl,
                callback: callback,
                params: [params],
                method: "alchemy_getTokenAllowance",
                config: fullConfig,
            });
        },
        getTokenBalances: function (address, contractAddresses, callback) {
            return callAlchemyMethod({
                alchemyUrl: alchemyUrl,
                callback: callback,
                method: "alchemy_getTokenBalances",
                params: [address, contractAddresses],
                processResponse: processTokenBalanceResponse,
                config: fullConfig,
            });
        },
        getTokenMetadata: function (address, callback) {
            return callAlchemyMethod({
                alchemyUrl: alchemyUrl,
                callback: callback,
                params: [address],
                method: "alchemy_getTokenMetadata",
                config: fullConfig,
            });
        },
    };
    return alchemyWeb3;
}
var AlchemySubprovider = /** @class */ (function (_super) {
    __extends(AlchemySubprovider, _super);
    /**
     * Instantiates a new AlchemySubprovider
     */
    function AlchemySubprovider(alchemyUrl, config) {
        var _this = _super.call(this) || this;
        _this.alchemyUrl = alchemyUrl;
        _this.config = fillInConfigDefaults(config);
        _this.alchemy = {
            getTokenAllowance: function (params, callback) {
                return callAlchemyMethod({
                    alchemyUrl: alchemyUrl,
                    callback: callback,
                    params: [params],
                    method: "alchemy_getTokenAllowance",
                    config: _this.config,
                });
            },
            getTokenBalances: function (address, contractAddresses, callback) {
                return callAlchemyMethod({
                    alchemyUrl: alchemyUrl,
                    callback: callback,
                    method: "alchemy_getTokenBalances",
                    params: [address, contractAddresses],
                    processResponse: processTokenBalanceResponse,
                    config: _this.config,
                });
            },
            getTokenMetadata: function (address, callback) {
                return callAlchemyMethod({
                    alchemyUrl: alchemyUrl,
                    callback: callback,
                    params: [address],
                    method: "alchemy_getTokenMetadata",
                    config: _this.config,
                });
            },
        };
        return _this;
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    AlchemySubprovider.prototype.handleRequest = function (payload, next, end) {
        return __awaiter(this, void 0, void 0, function () {
            var data, alchemyError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(ALCHEMY_DISALLOWED_METHODS.indexOf(payload.method) === -1)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sendToAlchemyWithRetries(payload, this.alchemyUrl, this.config)];
                    case 2:
                        data = _a.sent();
                        if (data.error) {
                            next();
                            return [2 /*return*/];
                        }
                        end(null, data.result);
                        return [2 /*return*/];
                    case 3:
                        alchemyError_1 = _a.sent();
                        next();
                        return [2 /*return*/];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        next();
                        return [2 /*return*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return AlchemySubprovider;
}(Subprovider));
export { AlchemySubprovider };
function fillInConfigDefaults(_a) {
    var _b = _a.writeProvider, writeProvider = _b === void 0 ? getWindowProvider() : _b, _c = _a.maxRetries, maxRetries = _c === void 0 ? DEFAULT_MAX_RETRIES : _c, _d = _a.retryInterval, retryInterval = _d === void 0 ? DEFAULT_RETRY_INTERVAL : _d, _e = _a.retryJitter, retryJitter = _e === void 0 ? DEFAULT_RETRY_JITTER : _e;
    return { writeProvider: writeProvider, maxRetries: maxRetries, retryInterval: retryInterval, retryJitter: retryJitter };
}
function promisedSend(payload, alchemyUrl, writeProvider, config) {
    return __awaiter(this, void 0, void 0, function () {
        var alchemyError_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(ALCHEMY_DISALLOWED_METHODS.indexOf(payload.method) === -1)) return [3 /*break*/, 9];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, sendToAlchemyWithRetries(payload, alchemyUrl, config)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    alchemyError_2 = _b.sent();
                    // Fallback to write provider, but if both fail throw the error from
                    // Alchemy.
                    if (!writeProvider) {
                        throw alchemyError_2;
                    }
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, sendToProvider(payload, writeProvider)];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    _a = _b.sent();
                    throw alchemyError_2;
                case 7: return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    if (!writeProvider) {
                        throw new Error("No provider available for method \"" + payload.method + "\"");
                    }
                    return [2 /*return*/, sendToProvider(payload, writeProvider)];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function sendToAlchemyWithRetries(payload, alchemyUrl, _a) {
    var maxRetries = _a.maxRetries, retryInterval = _a.retryInterval, retryJitter = _a.retryJitter;
    return __awaiter(this, void 0, void 0, function () {
        var lastResponse, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < maxRetries + 1)) return [3 /*break*/, 5];
                    return [4 /*yield*/, sendToAlchemyOnce(payload, alchemyUrl)];
                case 2:
                    lastResponse = _b.sent();
                    if (lastResponse.status !== RATE_LIMIT_STATUS) {
                        return [2 /*return*/, lastResponse.json()];
                    }
                    return [4 /*yield*/, delay(retryInterval + ((retryJitter * Math.random()) | 0))];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, lastResponse.json()];
            }
        });
    });
}
function sendToAlchemyOnce(payload, alchemyUrl) {
    return fetch(alchemyUrl, {
        method: "POST",
        headers: ALCHEMY_HEADERS,
        body: JSON.stringify(payload),
    });
}
function sendToProvider(payload, provider) {
    var anyProvider = provider;
    if (anyProvider.sendAsync) {
        return promisify(function (callback) { return anyProvider.sendAsync(payload, callback); });
    }
    else {
        return promisify(function (callback) { return anyProvider.send(payload, callback); });
    }
}
function getWindowProvider() {
    return typeof window !== "undefined" ? window.ethereum : null;
}
function callAlchemyMethod(_a) {
    var _this = this;
    var method = _a.method, params = _a.params, alchemyUrl = _a.alchemyUrl, config = _a.config, _b = _a.callback, callback = _b === void 0 ? noop : _b, _c = _a.processResponse, processResponse = _c === void 0 ? identity : _c;
    var promise = (function () { return __awaiter(_this, void 0, void 0, function () {
        var payload, _a, error, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    payload = { method: method, params: params, jsonrpc: "2.0", id: 0 };
                    return [4 /*yield*/, sendToAlchemyWithRetries(payload, alchemyUrl, config)];
                case 1:
                    _a = _b.sent(), error = _a.error, result = _a.result;
                    if (error != null) {
                        throw new Error(error);
                    }
                    return [2 /*return*/, processResponse(result)];
            }
        });
    }); })();
    callWhenDone(promise, callback);
    return promise;
}
function processTokenBalanceResponse(rawResponse) {
    // Convert token balance fields from hex-string to decimal-string.
    var fixedTokenBalances = rawResponse.tokenBalances.map(function (balance) {
        return balance.tokenBalance != null
            ? __assign(__assign({}, balance), { tokenBalance: hexToDecimal(balance.tokenBalance) }) : balance;
    });
    return __assign(__assign({}, rawResponse), { tokenBalances: fixedTokenBalances });
}
/**
 * Helper for converting functions which take a callback as their final argument
 * to functions which return a promise.
 */
function promisify(f) {
    return new Promise(function (resolve, reject) {
        return f(function (error, result) {
            if (error != null) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
/**
 * Helper for converting functions which return a promise to functions which
 * take a callback as their final argument.
 */
function callWhenDone(promise, callback) {
    promise.then(function (result) { return callback(null, result); }, function (error) { return callback(error); });
}
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
/**
 * Converts a hex string to a string of a decimal number. Works even with
 * numbers so large that they cannot fit into a double without losing precision.
 */
function hexToDecimal(hex) {
    if (hex.startsWith("0x")) {
        return hexToDecimal(hex.slice(2));
    }
    // https://stackoverflow.com/a/21675915/2695248
    var digits = [0];
    for (var i = 0; i < hex.length; i += 1) {
        var carry = parseInt(hex.charAt(i), 16);
        for (var j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = (digits[j] / 10e16) | 0;
            digits[j] %= 10e16;
        }
        while (carry > 0) {
            digits.push(carry % 10e16);
            carry = (carry / 10e16) | 0;
        }
    }
    return digits.reverse().join("");
}
function noop() {
    // Nothing.
}
function identity(x) {
    return x;
}
//# sourceMappingURL=index.js.map