import { CryptoSymbol } from "@/enums/crypto-symbol";
import { ICryptocurrencyOptions } from "@/interfaces/bot-trader.interface";

export const bitcoin: ICryptocurrencyOptions = {
  symbol: CryptoSymbol.BTCUSDT,
  quantity: 0.001,
  dropTreshold: 0.01,
  riseTreshold: 0.01,
};

export const ethereum: ICryptocurrencyOptions = {
  symbol: CryptoSymbol.ETHUSDT,
  quantity: 0.01,
  dropTreshold: 0.02,
  riseTreshold: 0.03,
};
