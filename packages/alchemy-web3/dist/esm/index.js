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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import Web3 from "web3";
import { hexToNumberString, toHex } from "web3-utils";
import { callWhenDone } from "./util/promises";
import { makeAlchemyContext } from "./web3-adapter/alchemyContext";
import FullTransactionsSubscription from "./web3-adapter/fullTransactionsSubscription";
import { Subprovider, } from "@0x/subproviders";
import { makeHttpSender } from "./web3-adapter/alchemySendHttp";
import { makePayloadSender } from "./web3-adapter/sendPayload";
var DEFAULT_MAX_RETRIES = 3;
var DEFAULT_RETRY_INTERVAL = 1000;
var DEFAULT_RETRY_JITTER = 250;
export var AssetTransfersCategory;
(function (AssetTransfersCategory) {
    AssetTransfersCategory["EXTERNAL"] = "external";
    AssetTransfersCategory["INTERNAL"] = "internal";
    AssetTransfersCategory["TOKEN"] = "token";
})(AssetTransfersCategory || (AssetTransfersCategory = {}));
export function createAlchemyWeb3(alchemyUrl, config) {
    var fullConfig = fillInConfigDefaults(config);
    var _a = makeAlchemyContext(alchemyUrl, fullConfig), provider = _a.provider, setWriteProvider = _a.setWriteProvider;
    var alchemyWeb3 = new Web3(provider);
    alchemyWeb3.setProvider = function () {
        throw new Error("setProvider is not supported in Alchemy Web3. To change the provider used for writes, use setWriteProvider() instead.");
    };
    alchemyWeb3.setWriteProvider = setWriteProvider;
    var send = alchemyWeb3.currentProvider.send.bind(alchemyWeb3.currentProvider);
    alchemyWeb3.alchemy = {
        getTokenAllowance: function (params, callback) {
            return callAlchemyMethod({
                send: send,
                callback: callback,
                method: "alchemy_getTokenAllowance",
                params: [params],
            });
        },
        getTokenBalances: function (address, contractAddresses, callback) {
            return callAlchemyMethod({
                send: send,
                callback: callback,
                method: "alchemy_getTokenBalances",
                params: [address, contractAddresses],
                processResponse: processTokenBalanceResponse,
            });
        },
        getTokenMetadata: function (address, callback) {
            return callAlchemyMethod({
                send: send,
                callback: callback,
                params: [address],
                method: "alchemy_getTokenMetadata",
            });
        },
        getAssetTransfers: function (params, callback) {
            return callAlchemyMethod({
                send: send,
                callback: callback,
                params: [
                    __assign(__assign({}, params), { maxCount: params.maxCount != null ? toHex(params.maxCount) : undefined }),
                ],
                method: "alchemy_getAssetTransfers",
            });
        },
    };
    patchSubscriptions(alchemyWeb3);
    return alchemyWeb3;
}
function fillInConfigDefaults(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.writeProvider, writeProvider = _c === void 0 ? getWindowProvider() : _c, _d = _b.maxRetries, maxRetries = _d === void 0 ? DEFAULT_MAX_RETRIES : _d, _e = _b.retryInterval, retryInterval = _e === void 0 ? DEFAULT_RETRY_INTERVAL : _e, _f = _b.retryJitter, retryJitter = _f === void 0 ? DEFAULT_RETRY_JITTER : _f;
    return { writeProvider: writeProvider, maxRetries: maxRetries, retryInterval: retryInterval, retryJitter: retryJitter };
}
function getWindowProvider() {
    return typeof window !== "undefined" ? window.ethereum : null;
}
function callAlchemyMethod(_a) {
    var _this = this;
    var method = _a.method, params = _a.params, send = _a.send, _b = _a.callback, callback = _b === void 0 ? noop : _b, _c = _a.processResponse, processResponse = _c === void 0 ? identity : _c;
    var promise = (function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, send(method, params)];
                case 1:
                    result = _a.sent();
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
            ? __assign(__assign({}, balance), { tokenBalance: hexToNumberString(balance.tokenBalance) }) : balance;
    });
    return __assign(__assign({}, rawResponse), { tokenBalances: fixedTokenBalances });
}
/**
 * Updates Web3's internal subscription architecture to also handle Alchemy
 * specific subscriptions.
 */
function patchSubscriptions(web3) {
    var subscriptionsFactory = web3.eth.subscriptionsFactory;
    var oldGetSubscription = subscriptionsFactory.getSubscription.bind(subscriptionsFactory);
    subscriptionsFactory.getSubscription = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = __read(args, 2), moduleInstance = _a[0], type = _a[1];
        if (type === "alchemy_fullPendingTransactions") {
            return new FullTransactionsSubscription(subscriptionsFactory.utils, subscriptionsFactory.formatters, moduleInstance);
        }
        else {
            return oldGetSubscription.apply(void 0, __spread(args));
        }
    };
}
function noop() {
    // Nothing.
}
function identity(x) {
    return x;
}
var AlchemySubprovider = /** @class */ (function (_super) {
    __extends(AlchemySubprovider, _super);
    /**
     * Instantiates a new AlchemySubprovider
     */
    function AlchemySubprovider(alchemyUrl, config) {
        var _this = _super.call(this) || this;
        var fullConfig = fillInConfigDefaults(config);
        _this.alchemyWeb3 = createAlchemyWeb3(alchemyUrl, config);
        var alchemySend = makeHttpSender(alchemyUrl);
        _this.payloadSender = makePayloadSender(alchemySend, fullConfig);
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
            var _a, _b, contract, owner, spender, tokenAllowanceParams, tokenAllowanceResponse, _c, address, tokenAddresses, tokenBalancesResponse, _d, contract, tokenMetadataResponse, _e, fromBlock, toBlock, fromAddress, toAddress, contractAddresses, excludeZeroValue, maxCount, category, pageKey, assetTransfersParams, assetTransfersResponse, params, method, id, alchemyPayload, data, e_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = payload.method;
                        switch (_a) {
                            case "alchemy_getTokenAllowance": return [3 /*break*/, 1];
                            case "alchemy_getTokenBalances": return [3 /*break*/, 3];
                            case "alchemy_getTokenMetadata": return [3 /*break*/, 5];
                            case "alchemy_getAssetTransfers": return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        _b = __read(payload.params, 3), contract = _b[0], owner = _b[1], spender = _b[2];
                        tokenAllowanceParams = {
                            contract: contract,
                            owner: owner,
                            spender: spender,
                        };
                        return [4 /*yield*/, this.alchemyWeb3.alchemy.getTokenAllowance(tokenAllowanceParams)];
                    case 2:
                        tokenAllowanceResponse = _f.sent();
                        end(null, tokenAllowanceResponse);
                        return [3 /*break*/, 14];
                    case 3:
                        _c = __read(payload.params, 2), address = _c[0], tokenAddresses = _c[1];
                        return [4 /*yield*/, this.alchemyWeb3.alchemy.getTokenBalances(address, tokenAddresses)];
                    case 4:
                        tokenBalancesResponse = _f.sent();
                        end(null, tokenBalancesResponse);
                        return [3 /*break*/, 14];
                    case 5:
                        _d = __read(payload.params, 1), contract = _d[0];
                        return [4 /*yield*/, this.alchemyWeb3.alchemy.getTokenMetadata(contract)];
                    case 6:
                        tokenMetadataResponse = _f.sent();
                        end(null, tokenMetadataResponse);
                        return [3 /*break*/, 14];
                    case 7:
                        _e = __read(payload.params, 9), fromBlock = _e[0], toBlock = _e[1], fromAddress = _e[2], toAddress = _e[3], contractAddresses = _e[4], excludeZeroValue = _e[5], maxCount = _e[6], category = _e[7], pageKey = _e[8];
                        assetTransfersParams = {
                            fromBlock: fromBlock,
                            toBlock: toBlock,
                            fromAddress: fromAddress,
                            toAddress: toAddress,
                            contractAddresses: contractAddresses,
                            excludeZeroValue: excludeZeroValue,
                            maxCount: maxCount,
                            category: category,
                            pageKey: pageKey,
                        };
                        return [4 /*yield*/, this.alchemyWeb3.alchemy.getAssetTransfers(assetTransfersParams)];
                    case 8:
                        assetTransfersResponse = _f.sent();
                        end(null, assetTransfersResponse);
                        return [3 /*break*/, 14];
                    case 9:
                        params = payload.params, method = payload.method, id = payload.id;
                        alchemyPayload = {
                            params: params,
                            method: method,
                            id: id,
                            jsonrpc: "2.0",
                        };
                        _f.label = 10;
                    case 10:
                        _f.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, this.payloadSender.sendPayload(alchemyPayload)];
                    case 11:
                        data = _f.sent();
                        if (data.error) {
                            // @ts-ignore
                            end(data.error, data);
                            return [3 /*break*/, 14];
                        }
                        end(null, data.result);
                        return [3 /*break*/, 13];
                    case 12:
                        e_1 = _f.sent();
                        next();
                        return [3 /*break*/, 13];
                    case 13: return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    return AlchemySubprovider;
}(Subprovider));
export { AlchemySubprovider };
//# sourceMappingURL=index.js.map