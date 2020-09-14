import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class LiquidationRequest {
    public id: number;
    public loanId: string;
    public closeAmount: BigNumber;
    public loanToken: Asset;

    constructor(
        loanId: string,
        loanToken: Asset,
        closeAmount: BigNumber,
    ) {
        this.id = Math.round(new Date().getTime() / 1000);
        this.loanId = loanId;
        this.closeAmount = closeAmount;
        this.loanToken = loanToken;
    }
}
