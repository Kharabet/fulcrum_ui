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
import { fromHex, toHex } from "../util/hex";
import { throwIfCancelled } from "../util/promises";
/**
 * The maximum number of blocks to backfill. If more than this many blocks have
 * been missed, then we'll sadly miss data, but we want to make sure we don't
 * end up requesting thousands of blocks if somebody left their laptop closed
 * for a week.
 */
var MAX_BACKFILL_BLOCKS = 120;
export function makeBackfiller(senders) {
    return { getNewHeadsBackfill: getNewHeadsBackfill, getLogsBackfill: getLogsBackfill };
    function getNewHeadsBackfill(isCancelled, previousHeads, fromBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var toBlockNumber, lastSeenBlockNumber, minBlockNumber, reorgHeads, intermediateHeads;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        throwIfCancelled(isCancelled);
                        return [4 /*yield*/, getBlockNumber()];
                    case 1:
                        toBlockNumber = _a.sent();
                        throwIfCancelled(isCancelled);
                        if (previousHeads.length === 0) {
                            return [2 /*return*/, getHeadEventsInRange(Math.max(fromBlockNumber, toBlockNumber - MAX_BACKFILL_BLOCKS) + 1, toBlockNumber + 1)];
                        }
                        lastSeenBlockNumber = fromHex(previousHeads[previousHeads.length - 1].number);
                        minBlockNumber = Math.max(0, lastSeenBlockNumber - MAX_BACKFILL_BLOCKS);
                        if (lastSeenBlockNumber < minBlockNumber) {
                            return [2 /*return*/, getHeadEventsInRange(minBlockNumber, toBlockNumber + 1)];
                        }
                        return [4 /*yield*/, getReorgHeads(isCancelled, previousHeads)];
                    case 2:
                        reorgHeads = _a.sent();
                        throwIfCancelled(isCancelled);
                        return [4 /*yield*/, getHeadEventsInRange(lastSeenBlockNumber + 1, toBlockNumber + 1)];
                    case 3:
                        intermediateHeads = _a.sent();
                        throwIfCancelled(isCancelled);
                        return [2 /*return*/, __spread(reorgHeads, intermediateHeads)];
                }
            });
        });
    }
    function getReorgHeads(isCancelled, previousHeads) {
        return __awaiter(this, void 0, void 0, function () {
            var result, i, oldEvent, blockHead;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        i = previousHeads.length - 1;
                        _a.label = 1;
                    case 1:
                        if (!(i >= 0)) return [3 /*break*/, 4];
                        oldEvent = previousHeads[i];
                        return [4 /*yield*/, getBlockByNumber(fromHex(oldEvent.number))];
                    case 2:
                        blockHead = _a.sent();
                        throwIfCancelled(isCancelled);
                        if (oldEvent.hash === blockHead.hash) {
                            return [3 /*break*/, 4];
                        }
                        result.push(toNewHeadsEvent(blockHead));
                        _a.label = 3;
                    case 3:
                        i--;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result.reverse()];
                }
            });
        });
    }
    function getHeadEventsInRange(fromBlockInclusive, toBlockExclusive) {
        return __awaiter(this, void 0, void 0, function () {
            var batchParts, i, heads;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (fromBlockInclusive >= toBlockExclusive) {
                            return [2 /*return*/, []];
                        }
                        batchParts = [];
                        for (i = fromBlockInclusive; i < toBlockExclusive; i++) {
                            batchParts.push({
                                method: "eth_getBlockByNumber",
                                params: [toHex(i), false],
                            });
                        }
                        return [4 /*yield*/, senders.sendBatch(batchParts)];
                    case 1:
                        heads = _a.sent();
                        return [2 /*return*/, heads.map(toNewHeadsEvent)];
                }
            });
        });
    }
    function getBlockByNumber(blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, senders.send("eth_getBlockByNumber", [toHex(blockNumber), false])];
            });
        });
    }
    function getLogsBackfill(isCancelled, filter, previousLogs, fromBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var toBlockNumber, lastSeenBlockNumber, minBlockNumber, commonAncestorNumber, removedLogs, addedLogs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        throwIfCancelled(isCancelled);
                        return [4 /*yield*/, getBlockNumber()];
                    case 1:
                        toBlockNumber = _a.sent();
                        throwIfCancelled(isCancelled);
                        if (previousLogs.length === 0) {
                            return [2 /*return*/, getLogsInRange(filter, Math.max(fromBlockNumber, toBlockNumber - MAX_BACKFILL_BLOCKS) + 1, toBlockNumber + 1)];
                        }
                        lastSeenBlockNumber = fromHex(previousLogs[previousLogs.length - 1].blockNumber);
                        minBlockNumber = Math.max(0, lastSeenBlockNumber - MAX_BACKFILL_BLOCKS);
                        if (lastSeenBlockNumber < minBlockNumber) {
                            return [2 /*return*/, getLogsInRange(filter, minBlockNumber, toBlockNumber + 1)];
                        }
                        return [4 /*yield*/, getCommonAncestorNumber(isCancelled, previousLogs)];
                    case 2:
                        commonAncestorNumber = _a.sent();
                        throwIfCancelled(isCancelled);
                        removedLogs = previousLogs
                            .filter(function (log) { return fromHex(log.blockNumber) > commonAncestorNumber; })
                            .map(function (log) { return (__assign(__assign({}, log), { removed: true })); });
                        return [4 /*yield*/, getLogsInRange(filter, commonAncestorNumber + 1, toBlockNumber + 1)];
                    case 3:
                        addedLogs = _a.sent();
                        throwIfCancelled(isCancelled);
                        return [2 /*return*/, __spread(removedLogs, addedLogs)];
                }
            });
        });
    }
    function getCommonAncestorNumber(isCancelled, previousLogs) {
        return __awaiter(this, void 0, void 0, function () {
            var i, _a, blockHash, blockNumber, hash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        i = previousLogs.length - 1;
                        _b.label = 1;
                    case 1:
                        if (!(i >= 0)) return [3 /*break*/, 4];
                        _a = previousLogs[i], blockHash = _a.blockHash, blockNumber = _a.blockNumber;
                        return [4 /*yield*/, getBlockByNumber(fromHex(blockNumber))];
                    case 2:
                        hash = (_b.sent()).hash;
                        throwIfCancelled(isCancelled);
                        if (blockHash === hash) {
                            return [2 /*return*/, fromHex(blockNumber)];
                        }
                        _b.label = 3;
                    case 3:
                        i--;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, Number.NEGATIVE_INFINITY];
                }
            });
        });
    }
    function getLogsInRange(filter, fromBlockInclusive, toBlockExclusive) {
        return __awaiter(this, void 0, void 0, function () {
            var rangeFilter;
            return __generator(this, function (_a) {
                if (fromBlockInclusive >= toBlockExclusive) {
                    return [2 /*return*/, []];
                }
                rangeFilter = __assign(__assign({}, filter), { fromBlock: toHex(fromBlockInclusive), toBlock: toHex(toBlockExclusive - 1) });
                return [2 /*return*/, senders.send("eth_getLogs", [rangeFilter])];
            });
        });
    }
    function getBlockNumber() {
        return __awaiter(this, void 0, void 0, function () {
            var blockNumberHex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, senders.send("eth_blockNumber")];
                    case 1:
                        blockNumberHex = _a.sent();
                        return [2 /*return*/, fromHex(blockNumberHex)];
                }
            });
        });
    }
}
function toNewHeadsEvent(head) {
    var result = __assign({}, head);
    delete result.totalDifficulty;
    delete result.transactions;
    delete result.uncles;
    return result;
}
export function dedupeNewHeads(events) {
    return dedupe(events, function (event) { return event.hash; });
}
export function dedupeLogs(events) {
    return dedupe(events, function (event) { return event.blockHash + "/" + event.logIndex; });
}
function dedupe(items, getKey) {
    var keysSeen = new Set();
    var result = [];
    items.forEach(function (item) {
        var key = getKey(item);
        if (!keysSeen.has(key)) {
            keysSeen.add(key);
            result.push(item);
        }
    });
    return result;
}
//# sourceMappingURL=subscriptionBackfill.js.map