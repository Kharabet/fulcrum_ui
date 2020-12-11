import { callWhenDone } from "../util/promises";
/**
 * Returns a "provider" which can be passed to the Web3 constructor.
 */
export function makeAlchemyHttpProvider(sendPayload) {
    function sendAsync(payload, callback) {
        callWhenDone(sendPayload(payload), callback);
    }
    return { sendAsync: sendAsync };
}
//# sourceMappingURL=httpProvider.js.map