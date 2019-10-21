import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";
import { BorrowRequest } from "./BorrowRequest";
import { WalletType } from "./WalletType";

export class BorrowRequestAwaiting {
  public walletType: WalletType;
  public walletAddress: string;
  public borrowAsset: Asset;
  public borrowAmount: BigNumber;
  public collateralAsset: Asset;
  public depositAmount: BigNumber;
  public networkId: number;
  public txHash: string;

  constructor(borrowRequest: BorrowRequest, networkId: number, walletAddress: string, txHash: string) {
    this.walletType = borrowRequest.walletType;
    this.borrowAsset = borrowRequest.borrowAsset;
    this.borrowAmount = borrowRequest.borrowAmount;
    this.collateralAsset = borrowRequest.collateralAsset;
    this.depositAmount = borrowRequest.depositAmount;
    this.walletAddress = walletAddress;
    this.networkId = networkId;
    this.txHash = txHash;
  }

  public static toObj(bra: BorrowRequestAwaiting): any {
    const result = {
      walletType: bra.walletType,
      walletAddress: bra.walletAddress,
      borrowAsset: bra.borrowAsset,
      borrowAmount: bra.borrowAmount.toFixed(),
      collateralAsset: bra.collateralAsset,
      depositAmount: bra.depositAmount.toFixed(),
      networkId: bra.networkId,
      txHash: bra.txHash
    };

    return result;
  }

  public static fromObj(data: object): BorrowRequestAwaiting {
    const result = new BorrowRequestAwaiting(
      new BorrowRequest(
        // @ts-ignore
        (data.walletType as string),
        // @ts-ignore
        (data.borrowAsset as string),
        // @ts-ignore
        new BigNumber(data.borrowAmount as string),
        // @ts-ignore
        (data.collateralAsset as string),
        // @ts-ignore
        new BigNumber(data.depositAmount as string)
      ),
      // @ts-ignore
      (data.networkId as number),
      // @ts-ignore
      (data.txHash as string),
      // @ts-ignore
      (data.walletAddress as string)
    );

    return result;
  }

  public equals(bra: BorrowRequestAwaiting): boolean {
    if (this === bra) {
      return true;
    }

    return (this.networkId === bra.networkId) &&
      (this.txHash === bra.txHash) &&
      (this.walletType === bra.walletType) &&
      (this.walletAddress === bra.walletAddress) &&
      (this.borrowAsset === bra.borrowAsset) &&
      (this.collateralAsset === bra.collateralAsset) &&
      (this.borrowAmount.eq(bra.borrowAmount)) &&
      (this.depositAmount.eq(bra.depositAmount));
  }
}
