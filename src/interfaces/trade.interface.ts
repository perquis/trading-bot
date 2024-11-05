import { CryptoSymbol } from "@/enums/crypto-symbol";

export interface ITrade {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  symbol: CryptoSymbol;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}
