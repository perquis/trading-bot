import { CryptoSymbol } from "@/enums/crypto-symbol";

export interface ICryptocurrencyOptions {
  symbol: CryptoSymbol;
  dropTreshold: number;
  riseTreshold: number;
  quantity: number;
}

export interface IOrderDetails {
  latestPrice: number;
  previousPrice: number;
  treshold: number;
}
