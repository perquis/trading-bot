import { CryptoSymbol } from "@/enums/crypto-symbol";

export interface IBlocker {
  symbol: CryptoSymbol;
  blocked: boolean;
}
