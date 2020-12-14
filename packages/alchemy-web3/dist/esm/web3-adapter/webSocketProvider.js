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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
import EventEmitter from "eventemitter3";
import { dedupeLogs, dedupeNewHeads, makeBackfiller, } from "../subscriptions/subscriptionBackfill";
import { isSubscriptionEvent, } from "../types";
import { fromHex } from "../util/hex";
import { makePayloadFactory, makeSenders, } from "../util/jsonRpc";
import { makeCancelToken, throwIfCancelled, withBackoffRetries, withTimeout, } from "../util/promises";
var HEARTBEAT_INTERVAL = 30000;
var HEARTBEAT_WAIT_TIME = 10000;
var BACKFILL_TIMEOUT = 60000;
var BACKFILL_RETRIES = 5;
/**
 * Subscriptions have a memory of recent events they have sent so that in the
 * event that they disconnect and need to backfill, they can detect re-orgs.
 * Keep a buffer that goes back at least these many blocks, the maximum amount
 * at which we might conceivably see a re-org.
 *
 * Note that while our buffer goes back this many blocks, it may contain more
 * than this many elements, since in the case of logs subscriptions more than
 * one event may be emitted for a block.
 */
var RETAINED_EVENT_BLOCK_COUNT = 10;
var AlchemyWebSocketProvider = /** @class */ (function (_super) {
    __extends(AlchemyWebSocketProvider, _super);
    function AlchemyWebSocketProvider(ws, sendPayload) {
        var _this = _super.call(this) || this;
        _this.ws = ws;
        _this.sendPayload = sendPayload;
        // In the case of a WebSocket reconnection, all subscriptions are lost and we
        // create new ones to replace them, but we want to create the illusion that
        // the original subscriptions persist. Thus, maintain a mapping from the
        // "virtual" subscription ids which are visible to the consumer to the
        // "physical" subscription ids of the actual connections. This terminology is
        // borrowed from virtual and physical memory, which has a similar mapping.
        _this.virtualSubscriptionsById = new Map();
        _this.virtualIdsByPhysicalId = new Map();
        _this.makePayload = makePayloadFactory();
        _this.cancelBackfill = noop;
        _this.startHeartbeat = function () {
            if (_this.heartbeatIntervalId != null) {
                return;
            }
            _this.heartbeatIntervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, withTimeout(this.send("net_version"), HEARTBEAT_WAIT_TIME)];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            this.ws.reconnect();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, HEARTBEAT_INTERVAL);
        };
        _this.stopHeartbeatAndBackfill = function () {
            if (_this.heartbeatIntervalId != null) {
                clearInterval(_this.heartbeatIntervalId);
                _this.heartbeatIntervalId = undefined;
            }
            _this.cancelBackfill();
        };
        _this.handleMessage = function (event) {
            var message = JSON.parse(event.data);
            if (!isSubscriptionEvent(message)) {
                return;
            }
            var physicalId = message.params.subscription;
            var virtualId = _this.virtualIdsByPhysicalId.get(physicalId);
            if (!virtualId) {
                return;
            }
            var subscription = _this.virtualSubscriptionsById.get(virtualId);
            if (subscription.method !== "eth_subscribe") {
                _this.emitGenericEvent(virtualId, message.params.result);
                return;
            }
            switch (subscription.params[0]) {
                case "newHeads": {
                    var newHeadsSubscription = subscription;
                    var newHeadsMessage = message;
                    var isBackfilling = newHeadsSubscription.isBackfilling, backfillBuffer = newHeadsSubscription.backfillBuffer;
                    var result = newHeadsMessage.params.result;
                    if (isBackfilling) {
                        addToNewHeadsEventsBuffer(backfillBuffer, result);
                    }
                    else {
                        _this.emitNewHeadsEvent(virtualId, result);
                    }
                    break;
                }
                case "logs": {
                    var logsSubscription = subscription;
                    var logsMessage = message;
                    var isBackfilling = logsSubscription.isBackfilling, backfillBuffer = logsSubscription.backfillBuffer;
                    var result = logsMessage.params.result;
                    if (isBackfilling) {
                        addToLogsEventsBuffer(backfillBuffer, result);
                    }
                    else {
                        _this.emitLogsEvent(virtualId, result);
                    }
                    break;
                }
                default:
                    _this.emitGenericEvent(virtualId, message.params.result);
            }
        };
        _this.handleReopen = function () {
            var e_1, _a;
            _this.virtualIdsByPhysicalId.clear();
            var _b = makeCancelToken(), cancel = _b.cancel, isCancelled = _b.isCancelled;
            _this.cancelBackfill = cancel;
            var _loop_1 = function (subscription) {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.resubscribeAndBackfill(isCancelled, subscription)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _a.sent();
                                if (!isCancelled()) {
                                    console.error("Error while backfilling \"" + subscription.params[0] + "\" subscription. Some events may be missing.", error_1);
                                }
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })();
            };
            try {
                for (var _c = __values(_this.virtualSubscriptionsById.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var subscription = _d.value;
                    _loop_1(subscription);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            _this.startHeartbeat();
        };
        _this.senders = makeSenders(sendPayload, _this.makePayload);
        _this.backfiller = makeBackfiller(_this.senders);
        _this.send = _this.senders.send;
        _this.addSocketListeners();
        _this.startHeartbeat();
        return _this;
    }
    AlchemyWebSocketProvider.prototype.supportsSubscriptions = function () {
        return true;
    };
    AlchemyWebSocketProvider.prototype.subscribe = function (subscribeMethod, subscriptionMethod, parameters) {
        if (subscribeMethod === void 0) { subscribeMethod = "eth_subscribe"; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params, startingBlockNumber, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = subscribeMethod;
                        params = __spread([subscriptionMethod], parameters);
                        return [4 /*yield*/, this.getBlockNumber()];
                    case 1:
                        startingBlockNumber = _a.sent();
                        return [4 /*yield*/, this.send(method, params)];
                    case 2:
                        id = _a.sent();
                        this.virtualSubscriptionsById.set(id, {
                            method: method,
                            params: params,
                            startingBlockNumber: startingBlockNumber,
                            virtualId: id,
                            physicalId: id,
                            sentEvents: [],
                            isBackfilling: false,
                            backfillBuffer: [],
                        });
                        this.virtualIdsByPhysicalId.set(id, id);
                        return [2 /*return*/, id];
                }
            });
        });
    };
    AlchemyWebSocketProvider.prototype.unsubscribe = function (subscriptionId, unsubscribeMethod) {
        if (unsubscribeMethod === void 0) { unsubscribeMethod = "eth_unsubscribe"; }
        return __awaiter(this, void 0, void 0, function () {
            var virtualSubscription, physicalId, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        virtualSubscription = this.virtualSubscriptionsById.get(subscriptionId);
                        if (!virtualSubscription) {
                            return [2 /*return*/, false];
                        }
                        physicalId = virtualSubscription.physicalId;
                        return [4 /*yield*/, this.send(unsubscribeMethod, [physicalId])];
                    case 1:
                        response = _a.sent();
                        this.virtualSubscriptionsById.delete(subscriptionId);
                        this.virtualIdsByPhysicalId.delete(physicalId);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AlchemyWebSocketProvider.prototype.disconnect = function (code, reason) {
        this.removeSocketListeners();
        this.removeAllListeners();
        this.stopHeartbeatAndBackfill();
        this.ws.close(code, reason);
    };
    AlchemyWebSocketProvider.prototype.sendBatch = function (methods, moduleInstance) {
        var _this = this;
        var payload = [];
        methods.forEach(function (method) {
            method.beforeExecution(moduleInstance);
            payload.push(_this.makePayload(method.rpcMethod, method.parameters));
        });
        return this.sendPayload(payload);
    };
    AlchemyWebSocketProvider.prototype.addSocketListeners = function () {
        this.ws.addEventListener("message", this.handleMessage);
        this.ws.addEventListener("reopen", this.handleReopen);
        this.ws.addEventListener("down", this.stopHeartbeatAndBackfill);
    };
    AlchemyWebSocketProvider.prototype.removeSocketListeners = function () {
        this.ws.removeEventListener("message", this.handleMessage);
        this.ws.removeEventListener("reopen", this.handleReopen);
        this.ws.removeEventListener("down", this.stopHeartbeatAndBackfill);
    };
    AlchemyWebSocketProvider.prototype.resubscribeAndBackfill = function (isCancelled, subscription) {
        return __awaiter(this, void 0, void 0, function () {
            var virtualId, method, params, sentEvents, backfillBuffer, startingBlockNumber, physicalId, _a, backfillEvents, events, filter_1, backfillEvents, events;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        virtualId = subscription.virtualId, method = subscription.method, params = subscription.params, sentEvents = subscription.sentEvents, backfillBuffer = subscription.backfillBuffer, startingBlockNumber = subscription.startingBlockNumber;
                        subscription.isBackfilling = true;
                        backfillBuffer.length = 0;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 9, 10]);
                        return [4 /*yield*/, this.send(method, params)];
                    case 2:
                        physicalId = _b.sent();
                        throwIfCancelled(isCancelled);
                        subscription.physicalId = physicalId;
                        this.virtualIdsByPhysicalId.set(physicalId, virtualId);
                        _a = params[0];
                        switch (_a) {
                            case "newHeads": return [3 /*break*/, 3];
                            case "logs": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, withBackoffRetries(function () {
                            return withTimeout(_this.backfiller.getNewHeadsBackfill(isCancelled, sentEvents, startingBlockNumber), BACKFILL_TIMEOUT);
                        }, BACKFILL_RETRIES, function () { return !isCancelled(); })];
                    case 4:
                        backfillEvents = _b.sent();
                        throwIfCancelled(isCancelled);
                        events = dedupeNewHeads(__spread(backfillEvents, backfillBuffer));
                        events.forEach(function (event) { return _this.emitNewHeadsEvent(virtualId, event); });
                        return [3 /*break*/, 8];
                    case 5:
                        filter_1 = params[1] || {};
                        return [4 /*yield*/, withBackoffRetries(function () {
                                return withTimeout(_this.backfiller.getLogsBackfill(isCancelled, filter_1, sentEvents, startingBlockNumber), BACKFILL_TIMEOUT);
                            }, BACKFILL_RETRIES, function () { return !isCancelled(); })];
                    case 6:
                        backfillEvents = _b.sent();
                        throwIfCancelled(isCancelled);
                        events = dedupeLogs(__spread(backfillEvents, backfillBuffer));
                        events.forEach(function (event) { return _this.emitLogsEvent(virtualId, event); });
                        return [3 /*break*/, 8];
                    case 7: return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        subscription.isBackfilling = false;
                        backfillBuffer.length = 0;
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    AlchemyWebSocketProvider.prototype.getBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blockNumberHex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.send("eth_blockNumber")];
                    case 1:
                        blockNumberHex = _a.sent();
                        return [2 /*return*/, fromHex(blockNumberHex)];
                }
            });
        });
    };
    AlchemyWebSocketProvider.prototype.emitNewHeadsEvent = function (virtualId, result) {
        this.emitAndRememberEvent(virtualId, result, getNewHeadsBlockNumber);
    };
    AlchemyWebSocketProvider.prototype.emitLogsEvent = function (virtualId, result) {
        this.emitAndRememberEvent(virtualId, result, getLogsBlockNumber);
    };
    /**
     * Emits an event to consumers, but also remembers it in its subscriptions's
     * `sentEvents` buffer so that we can detect re-orgs if the connection drops
     * and needs to be reconnected.
     */
    AlchemyWebSocketProvider.prototype.emitAndRememberEvent = function (virtualId, result, getBlockNumber) {
        var subscription = this.virtualSubscriptionsById.get(virtualId);
        if (!subscription) {
            return;
        }
        // Web3 modifies these event objects once we pass them on (changing hex
        // numbers to numbers). We want the original event, so make a defensive
        // copy.
        addToPastEventsBuffer(subscription.sentEvents, __assign({}, result), getBlockNumber);
        this.emitGenericEvent(virtualId, result);
    };
    AlchemyWebSocketProvider.prototype.emitGenericEvent = function (virtualId, result) {
        var event = {
            subscription: virtualId,
            result: result,
        };
        this.emit(virtualId, event);
    };
    return AlchemyWebSocketProvider;
}(EventEmitter));
export { AlchemyWebSocketProvider };
function addToNewHeadsEventsBuffer(pastEvents, event) {
    addToPastEventsBuffer(pastEvents, event, getNewHeadsBlockNumber);
}
function addToLogsEventsBuffer(pastEvents, event) {
    addToPastEventsBuffer(pastEvents, event, getLogsBlockNumber);
}
/**
 * Adds a new event to an array of events, evicting any events which
 * are so old that they will no longer feasibly be part of a reorg.
 */
function addToPastEventsBuffer(pastEvents, event, getBlockNumber) {
    var currentBlockNumber = getBlockNumber(event);
    // Find first index of an event recent enough to retain, then drop everything
    // at a lower index.
    var firstGoodIndex = pastEvents.findIndex(function (e) { return getBlockNumber(e) > currentBlockNumber - RETAINED_EVENT_BLOCK_COUNT; });
    if (firstGoodIndex === -1) {
        pastEvents.length = 0;
    }
    else {
        pastEvents.splice(0, firstGoodIndex);
    }
    pastEvents.push(event);
}
function getNewHeadsBlockNumber(event) {
    return fromHex(event.number);
}
function getLogsBlockNumber(event) {
    return fromHex(event.blockNumber);
}
function noop() {
    // Nothing.
}
//# sourceMappingURL=webSocketProvider.js.map