import { CryptoSymbol } from "@/enums/crypto-symbol";
import { OrderSide } from "binance-api-node";

export type ICreateOrderOptions = Omit<IOrder, "cryptoPriceForQuantity">;

export interface IOrder {
  symbol: CryptoSymbol;
  side: OrderSide;
  price: number;
  quantity: number;
  cryptoPriceForQuantity: string;
}
