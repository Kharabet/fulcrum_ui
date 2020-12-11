"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAlchemyHttpProvider = void 0;
var promises_1 = require("../util/promises");
/**
 * Returns a "provider" which can be passed to the Web3 constructor.
 */
function makeAlchemyHttpProvider(sendPayload) {
    function sendAsync(payload, callback) {
        promises_1.callWhenDone(sendPayload(payload), callback);
    }
    return { sendAsync: sendAsync };
}
exports.makeAlchemyHttpProvider = makeAlchemyHttpProvider;
