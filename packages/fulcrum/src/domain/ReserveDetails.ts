import { BigNumber } from "@0x/utils";

export class ReserveDetails {
  public addressErc20: string = "";
  public symbol: string = "";
  public name: string = "";
  public price: BigNumber | null;
  public liquidity: BigNumber | null;
  public liquidityReserved: BigNumber | null;
  public totalSupply: BigNumber | null;
  public totalBorrow: BigNumber | null;
  public supplyInterestRate: BigNumber | null;
  public borrowInterestRate: BigNumber | null;
  public nextInterestRate: BigNumber | null;
  public lockedAssets: BigNumber | null;


  constructor(
    addressErc20: string = "",
    symbol: string = "",
    name: string = "",
    price: BigNumber | null,
    liquidity: BigNumber | null,
    liquidityReserved: BigNumber | null,
    totalSupply: BigNumber | null,
    totalBorrow: BigNumber | null,
    supplyInterestRate: BigNumber | null,
    borrowInterestRate: BigNumber | null,
    nextInterestRate: BigNumber | null,
    lockedAssets: BigNumber | null
  ) {
    this.addressErc20 = addressErc20;
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.liquidity = liquidity;
    this.liquidityReserved = liquidityReserved;
    this.totalSupply = totalSupply;
    this.totalBorrow = totalBorrow;
    this.supplyInterestRate = supplyInterestRate;
    this.borrowInterestRate = borrowInterestRate;
    this.nextInterestRate = nextInterestRate;
    this.lockedAssets = lockedAssets;
  }

  public static getEmpty(): ReserveDetails {
    return new ReserveDetails(
      "",
      "",
      "",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }
}
