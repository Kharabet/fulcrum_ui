import { createHashHistory, History } from "history";
import { WalletType, walletTypeToWalletTypeAbbr } from "../domain/WalletType";

export class NavService {
  public static Instance: NavService;
  public readonly History: History;

  constructor() {
    // init
    this.History = createHashHistory({ hashType: "slash" });

    // singleton
    if (!NavService.Instance) {
      NavService.Instance = this;
    }

    return NavService.Instance;
  }

  public getWalletAddress = (
    destinationAbbr: string // "b" - borrow, "t" - track, dashboard
  ) => {
    return `/wallet/${destinationAbbr}`;
    /*// return `/dashboard/n`;
    return destinationAbbr === "t" ?
      `/dashboard/n` :
      `/borrow/n`;*/
  };

  public getBorrowAddress = (walletType: WalletType) => {
    const walletTypeAbbr = walletTypeToWalletTypeAbbr(walletType);
    return `/borrow/${walletTypeAbbr}`;
  };

  public getDashboardAddress = (walletType: WalletType, walletAddress: string | undefined) => {
    const walletTypeAbbr = walletTypeToWalletTypeAbbr(walletType);
    return `/dashboard/${walletTypeAbbr}/${walletAddress}`;
  };

   public getRefinanceAddress = (
    destinationAbbr: string // "b" - borrow, "t" - track, dashboard
  ) => {
    return `/refinance/${destinationAbbr}`;
    /*// return `/dashboard/n`;
    return destinationAbbr === "t" ?
      `/dashboard/n` :
      `/borrow/n`;*/
  };
}

// tslint:disable-next-line:no-unused-expression
new NavService();
