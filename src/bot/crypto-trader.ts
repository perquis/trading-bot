import { CryptoSymbol } from "@/enums/crypto-symbol";
import { ICryptocurrencyOptions } from "@/interfaces/bot-trader.interface";
import { ICreateOrderOptions, IOrder } from "@/interfaces/order.interface";
import { ITrade } from "@/interfaces/trade.interface";
import { services } from "@/services";
import { calculatedPriceWithTreshold } from "@/utils/calculated-price-with-treshold";
import { OrderSide } from "binance-api-node";

export class CryptoTraderFactory {
  static async create(symbol: CryptoSymbol, options: ICryptocurrencyOptions) {
    const trader = new CryptoTrader(symbol, options);
    await trader.init();
  }
}

class CryptoTrader {
  #newestPrice: number = 0;
  #lastTrade: ITrade | null = null;
  #lastOrder: IOrder | null = null;

  constructor(private symbol: CryptoSymbol, private options: ICryptocurrencyOptions) {}

  async init() {
    try {
      const isBlockedTrading = await services.blockers.isBlockedTrading(this.symbol);
      if (isBlockedTrading) return;

      this.#lastTrade = await services.trades.getLastTrade(this.symbol);
      this.#lastOrder = await services.orders.getLastOrder(this.symbol);

      this.#newestPrice = parseFloat(this.#lastTrade!.price);

      await this.#update();
    } catch (error) {
      console.error("Error executing simple trading strategy:", error);
    }
  }

  async #update() {
    const initialOrder = this.#createInitialOrderOptions();

    if (this.#isNotExistingAnyOrder()) return await services.orders.createOrder(initialOrder);
    if (this.#isBuyingCryptocurrency()) return await services.orders.createOrder(initialOrder);

    initialOrder.side = OrderSide.SELL;

    if (this.#isSellingCryptocurrency()) return await services.orders.createOrder(initialOrder);
    if (this.#isSellingWhenPriceIsDroppingTooMuch()) return await this.#blockTrading(initialOrder);
  }

  #createInitialOrderOptions(): ICreateOrderOptions {
    return {
      symbol: this.symbol,
      price: this.#newestPrice,
      side: OrderSide.BUY,
      quantity: this.options.quantity,
    };
  }

  #isNotExistingAnyOrder(): boolean {
    return !this.#lastOrder;
  }

  #isEqualsSide(side: OrderSide): boolean {
    return this.#lastOrder!.side === side;
  }

  #isBuyingCryptocurrency(): boolean {
    return this.#comparePriceIfIsHigherOrLower(-this.options.dropTreshold) && this.#isEqualsSide(OrderSide.SELL);
  }

  #isSellingCryptocurrency(): boolean {
    return this.#comparePriceIfIsHigherOrLower(this.options.riseTreshold) && this.#isEqualsSide(OrderSide.BUY);
  }

  #isSellingWhenPriceIsDroppingTooMuch(): boolean {
    const percentage = -5 - this.options.dropTreshold;
    return this.#comparePriceIfIsHigherOrLower(percentage) && this.#isEqualsSide(OrderSide.BUY);
  }

  #comparePriceIfIsHigherOrLower(treshold: number): boolean {
    if (treshold > 0) return this.#newestPrice > calculatedPriceWithTreshold(this.#lastOrder!.price, treshold);
    return this.#newestPrice < calculatedPriceWithTreshold(this.#lastOrder!.price, treshold);
  }

  async #blockTrading(newOrder: ICreateOrderOptions): Promise<void> {
    await services.blockers.createBlocker(this.symbol);
    return await services.orders.createOrder(newOrder);
  }
}
