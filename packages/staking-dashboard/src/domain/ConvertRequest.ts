import { BigNumber } from "@0x/utils";

export class ConvertRequest {
    public id: number;
    public name: string
    public tokenAmount: BigNumber;
    constructor(
        tokenAmount: BigNumber,
    ) {
        this.id = Math.round(new Date().getTime() / 1000);
        this.name = "Convert";
        this.tokenAmount = tokenAmount;
    }
}
