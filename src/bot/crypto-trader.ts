import { ICryptocurrencyOptions, IOrderDetails } from "@/interfaces/bot-trader.interface";
import { services } from "@/services";
import { calculatedPriceWithTreshold } from "@/utils/calculated-price-with-treshold";
import { OrderSide } from "binance-api-node";

export class CryptoTrader {
  static async init({ symbol, quantity, dropTreshold, riseTreshold }: ICryptocurrencyOptions) {
    try {
      const lastTrade = await services.trades.getLastTrade(symbol);

      const latestPrice = parseFloat(lastTrade!.price),
        newOrder = {
          symbol,
          price: latestPrice,
          side: OrderSide.BUY,
          quantity,
        };

      const lastOrder = await services.orders.getLastOrder(symbol);
      if (!lastOrder) return await services.orders.createOrder(newOrder);

      const previousPrice = lastOrder.price,
        buyingOrSellingOptions = { latestPrice, previousPrice };

      const isBuying = this.#isBuying({ treshold: dropTreshold, ...buyingOrSellingOptions }),
        isSelling = this.#isSelling({ treshold: riseTreshold, ...buyingOrSellingOptions });

      if (isBuying && lastOrder.side === OrderSide.SELL) return await services.orders.createOrder(newOrder);
      if (isSelling && lastOrder.side === OrderSide.BUY) return await services.orders.createOrder({ ...newOrder, side: OrderSide.SELL });
    } catch (error) {
      console.error("Error executing simple trading strategy:", error);
    }
  }

  static #isBuying({ treshold, latestPrice, previousPrice }: IOrderDetails): boolean {
    return latestPrice < calculatedPriceWithTreshold(previousPrice, -treshold);
  }

  static #isSelling({ treshold, latestPrice, previousPrice }: IOrderDetails): boolean {
    return latestPrice > calculatedPriceWithTreshold(previousPrice, treshold);
  }
}