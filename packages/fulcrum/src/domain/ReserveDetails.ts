import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";

export class ReserveDetails {
  public asset: Asset | null;
  public addressErc20: string = "";
  public symbol: string = "";
  public name: string = "";
  public decimals: number | null;
  public price: BigNumber | null;
  public liquidity: BigNumber | null;
  public liquidityReserved: BigNumber | null;
  public totalSupply: BigNumber | null;
  public totalBorrow: BigNumber | null;
  public supplyInterestRate: BigNumber | null;
  public borrowInterestRate: BigNumber | null;
  public torqueBorrowInterestRate: BigNumber | null;
  public avgBorrowInterestRate: BigNumber | null;
  public lockedAssets: BigNumber | null;
  public swapToUSDPrice: BigNumber | null;
  public usdSupply: BigNumber | null;
  public usdTotalLocked: BigNumber | null;

  constructor(
    asset: Asset | null,
    addressErc20: string = "",
    symbol: string = "",
    name: string = "",
    decimals: number | null,
    price: BigNumber | null,
    liquidity: BigNumber | null,
    liquidityReserved: BigNumber | null,
    totalSupply: BigNumber | null,
    totalBorrow: BigNumber | null,
    supplyInterestRate: BigNumber | null,
    borrowInterestRate: BigNumber | null,
    torqueBorrowInterestRate: BigNumber | null,
    avgBorrowInterestRate: BigNumber | null,
    lockedAssets: BigNumber | null,
    swapToUSDPrice: BigNumber | null,
    usdSupply: BigNumber | null,
    usdTotalLocked: BigNumber | null,
  ) {
    this.asset = asset;
    this.addressErc20 = addressErc20;
    this.symbol = symbol;
    this.name = name;
    this.decimals = decimals;
    this.price = price;
    this.liquidity = liquidity;
    this.liquidityReserved = liquidityReserved;
    this.totalSupply = totalSupply;
    this.totalBorrow = totalBorrow;
    this.supplyInterestRate = supplyInterestRate;
    this.borrowInterestRate = borrowInterestRate;
    this.torqueBorrowInterestRate = torqueBorrowInterestRate;
    this.avgBorrowInterestRate = avgBorrowInterestRate;
    this.lockedAssets = lockedAssets;
    this.swapToUSDPrice = swapToUSDPrice;
    this.usdSupply = usdSupply;
    this.usdTotalLocked = usdTotalLocked;
  }
}
