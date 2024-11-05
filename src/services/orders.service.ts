import { binance } from "@/clients/binance";
import { CryptoSymbol } from "@/enums/crypto-symbol";
import { ICreateOrderOptions } from "@/interfaces/order.interface";
import { OrderModel } from "@/models/Order";
import { currencyFormat } from "@/utils/currency-format";
import { OrderType } from "binance-api-node";

export const orders = {
  async getLastOrder(symbol: CryptoSymbol) {
    return await OrderModel.findOne({ symbol }).sort({ createdAt: -1 }).lean();
  },

  async createOrder({ symbol, price, side, quantity }: ICreateOrderOptions) {
    try {
      const cryptoPriceForQuantity = currencyFormat(price, quantity);

      await OrderModel.create({
        symbol,
        price,
        quantity,
        cryptoPriceForQuantity,
        side,
      });

      await binance.order({
        symbol,
        side,
        type: OrderType.MARKET,
        quantity: String(quantity),
      });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  },
};
