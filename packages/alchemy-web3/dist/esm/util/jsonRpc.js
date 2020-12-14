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
export function makePayloadFactory() {
    var nextId = 0;
    return function (method, params) { return ({ method: method, params: params, jsonrpc: "2.0", id: nextId++ }); };
}
export function makeSenders(sendPayload, makePayload) {
    var _this = this;
    var send = function (method, params) { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendPayload(makePayload(method, params))];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        throw new Error(response.error.message);
                    }
                    return [2 /*return*/, response.result];
            }
        });
    }); };
    function sendBatch(parts) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, message, errorResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = parts.map(function (_a) {
                            var method = _a.method, params = _a.params;
                            return makePayload(method, params);
                        });
                        return [4 /*yield*/, sendPayload(payload)];
                    case 1:
                        response = _a.sent();
                        if (!Array.isArray(response)) {
                            message = response.error
                                ? response.error.message
                                : "Batch request failed";
                            throw new Error(message);
                        }
                        errorResponse = response.find(function (r) { return !!r.error; });
                        if (errorResponse) {
                            throw new Error(errorResponse.error.message);
                        }
                        // The ids are ascending numbers because that's what Payload Factories do.
                        return [2 /*return*/, response
                                .sort(function (r1, r2) { return r1.id - r2.id; })
                                .map(function (r) { return r.result; })];
                }
            });
        });
    }
    return { send: send, sendBatch: sendBatch };
}
//# sourceMappingURL=jsonRpc.js.map