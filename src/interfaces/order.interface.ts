import { CryptoSymbol } from "@/enums/crypto-symbol";
import { OrderSide } from "binance-api-node";

export interface ICreateOrderOptions {
  symbol: CryptoSymbol;
  side: OrderSide;
  price: number;
  quantity: number;
}
