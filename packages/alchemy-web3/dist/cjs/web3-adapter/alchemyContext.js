"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAlchemyContext = void 0;
var sturdy_websocket_1 = __importDefault(require("sturdy-websocket"));
var websocket_1 = require("websocket");
var version_1 = require("../version");
var alchemySendHttp_1 = require("./alchemySendHttp");
var alchemySendWebSocket_1 = require("./alchemySendWebSocket");
var httpProvider_1 = require("./httpProvider");
var sendPayload_1 = require("./sendPayload");
var webSocketProvider_1 = require("./webSocketProvider");
var NODE_MAX_WS_FRAME_SIZE = 100 * 1024 * 1024; // 100 MB
function makeAlchemyContext(url, config) {
    if (/^https?:\/\//.test(url)) {
        var alchemySend = alchemySendHttp_1.makeHttpSender(url);
        var _a = sendPayload_1.makePayloadSender(alchemySend, config), sendPayload = _a.sendPayload, setWriteProvider = _a.setWriteProvider;
        var provider = httpProvider_1.makeAlchemyHttpProvider(sendPayload);
        return { provider: provider, setWriteProvider: setWriteProvider };
    }
    else if (/^wss?:\/\//.test(url)) {
        var protocol = isAlchemyUrl(url) ? "alchemy-web3-" + version_1.VERSION : undefined;
        var ws = new sturdy_websocket_1.default(url, protocol, {
            wsConstructor: getWebSocketConstructor(),
        });
        var alchemySend = alchemySendWebSocket_1.makeWebSocketSender(ws);
        var _b = sendPayload_1.makePayloadSender(alchemySend, config), sendPayload = _b.sendPayload, setWriteProvider = _b.setWriteProvider;
        var provider = new webSocketProvider_1.AlchemyWebSocketProvider(ws, sendPayload);
        return { provider: provider, setWriteProvider: setWriteProvider };
    }
    else {
        throw new Error("Alchemy URL protocol must be one of http, https, ws, or wss. Recieved: " + url);
    }
}
exports.makeAlchemyContext = makeAlchemyContext;
function getWebSocketConstructor() {
    return isNodeEnvironment()
        ? function (url, protocols) {
            return new websocket_1.w3cwebsocket(url, protocols, undefined, undefined, undefined, {
                maxReceivedMessageSize: NODE_MAX_WS_FRAME_SIZE,
                maxReceivedFrameSize: NODE_MAX_WS_FRAME_SIZE,
            });
        }
        : WebSocket;
}
function isNodeEnvironment() {
    return (typeof process !== "undefined" &&
        process != null &&
        process.versions != null &&
        process.versions.node != null);
}
function isAlchemyUrl(url) {
    return url.indexOf("alchemyapi.io") >= 0;
}
