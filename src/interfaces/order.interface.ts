import { CryptoSymbol } from "@/enums/crypto-symbol";
import { OrderSide } from "binance-api-node";

export type ICreateOrderOptions = Omit<IOrder, "purchasePrice">;

export interface IOrder {
  symbol: CryptoSymbol;
  side: OrderSide;
  price: number;
  quantity: number;
  purchasePrice: string;
}
