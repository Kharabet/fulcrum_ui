import { Asset } from "../../domain/Asset";

export class LiquidationTransactionMinedEvent {
    public asset: Asset;
    public txHash: string;

    constructor(asset: Asset, txHash: string) {
        this.asset = asset;
        this.txHash = txHash;
    }
}
