import { CryptoSymbol } from "@/enums/crypto-symbol";

export interface IBuyOrSellOrdersOptions {
  symbol: CryptoSymbol;
  dropTreshold: number;
  riseTreshold: number;
  quantity: number;
}

export interface IBuyingOrSellingOptions {
  latestPrice: number;
  previousPrice: number;
  treshold: number;
}
