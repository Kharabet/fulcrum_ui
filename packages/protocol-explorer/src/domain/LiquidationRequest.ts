import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class LiquidationRequest {
    public loanId: string;
    public loanToken: Asset;
    public collateralToken: Asset;
    public repayAmount: BigNumber;
    public collateralWithdrawAmount: BigNumber;
    public collateralToLoanRate: BigNumber;// one unit of baseToken, denominated in quoteToken
    public currentMargin: BigNumber;

    constructor(
        loanId: string,
        loanToken: Asset,
        collateralToken: Asset,
        repayAmount: BigNumber,
        collateralWithdrawAmount: BigNumber,
        collateralToLoanRate: BigNumber,
        currentMargin: BigNumber,
    ) {
        this.loanId = loanId;
        this.loanToken = loanToken;
        this.collateralToken = collateralToken;
        this.repayAmount = repayAmount;
        this.collateralWithdrawAmount = collateralWithdrawAmount;
        this.collateralToLoanRate = collateralToLoanRate;
        this.currentMargin = currentMargin;
    }
}
