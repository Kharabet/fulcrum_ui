"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var web3_core_subscriptions_1 = require("web3-core-subscriptions");
var FullTransactionsSubscription = /** @class */ (function (_super) {
    __extends(FullTransactionsSubscription, _super);
    function FullTransactionsSubscription(utils, formatters, moduleInstance) {
        return _super.call(this, "eth_subscribe", "alchemy_newFullPendingTransactions", null, utils, formatters, moduleInstance) || this;
    }
    FullTransactionsSubscription.prototype.onNewSubscriptionItem = function (subscriptionItem) {
        return subscriptionItem;
    };
    return FullTransactionsSubscription;
}(web3_core_subscriptions_1.AbstractSubscription));
exports.default = FullTransactionsSubscription;
