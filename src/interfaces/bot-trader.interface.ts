import { CryptoSymbol } from "@/enums/crypto-symbol";

export interface ICryptocurrencyOptions {
  symbol: CryptoSymbol;
  dropTreshold: number;
  riseTreshold: number;
  quantity: number;
}

export interface IOrderDetails {
  newestPrice: number;
  previousPrice: number;
  treshold: number;
}

export type ICryptocurrencyOptionsWithoutTresholds = Omit<ICryptocurrencyOptions, "dropTreshold" | "riseTreshold">;
