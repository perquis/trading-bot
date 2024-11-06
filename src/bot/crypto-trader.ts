import { CryptoSymbol } from "@/enums/crypto-symbol";
import { ICryptocurrencyOptions, ICryptocurrencyOptionsWithoutTresholds } from "@/interfaces/bot-trader.interface";
import { ICreateOrderOptions, IOrder } from "@/interfaces/order.interface";
import { ITrade } from "@/interfaces/trade.interface";
import { services } from "@/services";
import { calculatedPriceWithTreshold } from "@/utils/calculated-price-with-treshold";
import { OrderSide } from "binance-api-node";

export class CryptoTrader {
  static #newestPrice: number = 0;
  static #lastTrade: ITrade | null = null;
  static #lastOrder: IOrder | null = null;

  static async init({ symbol, ...options }: ICryptocurrencyOptions) {
    try {
      const isBlockedTrading = await services.blockers.isBlockedTrading(symbol);
      if (isBlockedTrading) return;

      this.#lastTrade = await services.trades.getLastTrade(symbol);
      this.#lastOrder = await services.orders.getLastOrder(symbol);

      this.#newestPrice = parseFloat(this.#lastTrade!.price);

      await this.#update({ symbol, ...options });
    } catch (error) {
      console.error("Error executing simple trading strategy:", error);
    }
  }

  static async #update({ symbol, quantity, riseTreshold, dropTreshold }: ICryptocurrencyOptions) {
    const initialOrder = this.#createInitialOrderOptions({ symbol, quantity });

    if (this.#isNotExistingAnyOrder()) return await services.orders.createOrder(initialOrder);
    if (this.#isBuyingCryptocurrency(dropTreshold)) return await services.orders.createOrder(initialOrder);

    initialOrder.side = OrderSide.SELL;

    if (this.#isSellingCryptocurrency(riseTreshold)) return await services.orders.createOrder(initialOrder);
    if (this.#isSellingWhenPriceIsDroppingTooMuch()) return await this.#blockTrading(symbol, initialOrder);
  }

  static #createInitialOrderOptions({ symbol, quantity }: ICryptocurrencyOptionsWithoutTresholds): ICreateOrderOptions {
    return {
      symbol,
      price: this.#newestPrice,
      side: OrderSide.BUY,
      quantity,
    };
  }

  static #isNotExistingAnyOrder(): boolean {
    return !this.#lastOrder;
  }

  static #isEqualsSide(side: OrderSide): boolean {
    return this.#lastOrder!.side === side;
  }

  static #isBuyingCryptocurrency(treshold: number): boolean {
    return this.#comparePriceIfIsHigherOrLower(-treshold) && this.#isEqualsSide(OrderSide.SELL);
  }

  static #isSellingCryptocurrency(treshold: number): boolean {
    return this.#comparePriceIfIsHigherOrLower(treshold) && this.#isEqualsSide(OrderSide.BUY);
  }

  static #isSellingWhenPriceIsDroppingTooMuch(): boolean {
    return this.#comparePriceIfIsHigherOrLower(-5) && this.#isEqualsSide(OrderSide.BUY);
  }

  static #comparePriceIfIsHigherOrLower(treshold: number): boolean {
    if (treshold > 0) return this.#newestPrice > calculatedPriceWithTreshold(this.#lastOrder!.price, treshold);
    return this.#newestPrice < calculatedPriceWithTreshold(this.#lastOrder!.price, treshold);
  }

  static async #blockTrading(symbol: CryptoSymbol, newOrder: ICreateOrderOptions): Promise<void> {
    await services.blockers.createBlocker(symbol);
    return await services.orders.createOrder(newOrder);
  }
}
