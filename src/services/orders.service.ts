import { binance } from "@/clients/binance";
import { ICreateOrderOptions } from "@/interfaces/order.interface";
import { OrderModel } from "@/models/Order";
import { currencyFormat } from "@/utils/currency-format";
import { OrderType } from "binance-api-node";

export const orders = {
  async getLastOrder() {
    return await OrderModel.findOne().sort({ createdAt: -1 }).lean();
  },

  async createOrder({ symbol, price, side, quantity }: ICreateOrderOptions) {
    const purchasePrice = currencyFormat(price, quantity);

    await OrderModel.create({
      symbol,
      price,
      quantity,
      purchasePrice,
      side,
    });

    await binance.order({
      symbol,
      side,
      type: OrderType.MARKET,
      quantity: String(quantity),
    });
  },
};
