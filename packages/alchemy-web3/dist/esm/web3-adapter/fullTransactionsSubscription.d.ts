import { AbstractSubscription } from "web3-core-subscriptions";
export default class FullTransactionsSubscription extends AbstractSubscription {
    constructor(utils: any, formatters: any, moduleInstance: any);
    onNewSubscriptionItem(subscriptionItem: any): any;
}
