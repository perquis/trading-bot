import { CryptoSymbol } from '@/enums/crypto-symbol';
import { TradeModel } from '@/models/TradeModel';
import { binance } from '@/services/binance';
import { OrderType, TradeResult } from 'binance-api-node';

interface IBuyOrSellOrdersOptions {
  symbol: CryptoSymbol;
  dropTreshold: number;
  riseTreshold: number;
  quantity: number;
}

export class Trader {
  static #lastBuyPrice: number | null = null;

  static #calculateCryptoCost(buyPrice: number, quantity: number): string {
    return Intl.NumberFormat('en-ES', { currency: 'USD', style: 'currency' }).format(buyPrice * quantity);
  }

  static async getLastTrade() {
    return await TradeModel.findOne().sort({ time: -1 }).lean();
  }

  static async getTrades(symbol: CryptoSymbol) {
    try {
      return await binance.trades({ symbol });
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  }

  static async storeTrades(trades: TradeResult[]) {
    try {
      await TradeModel.insertMany(trades);
    } catch (error) {
      console.error('Error storing trades:', error);
    }
  }

  static async buyOrSellOrders({ symbol, dropTreshold, riseTreshold, quantity }: IBuyOrSellOrdersOptions) {
    try {
      const lastTrade = await Trader.getLastTrade();
      if (!lastTrade) throw new Error('No trades found');

      const currentPrice = parseFloat(lastTrade.price);

      if (this.#shouldBuy(currentPrice, dropTreshold)) return await this.#buyOrder(symbol, currentPrice, quantity);
      if (this.#shouldSell(currentPrice, riseTreshold)) return await this.#sellOrder(symbol, currentPrice, quantity);
    } catch (error) {
      console.error('Error executing simple trading strategy:', error);
    }
  }

  static #shouldBuy(currentPrice: number, dropTreshold: number): boolean {
    return !this.#lastBuyPrice || currentPrice < this.#lastBuyPrice * (1 - dropTreshold / 100);
  }

  static async #buyOrder(symbol: CryptoSymbol, currentPrice: number, quantity: number) {
    this.#lastBuyPrice = currentPrice;
    console.log('Buying at:', this.#calculateCryptoCost(this.#lastBuyPrice, quantity));

    await binance.order({
      symbol,
      side: 'BUY',
      type: OrderType.MARKET,
      quantity: '0.001',
    });
  }

  static #shouldSell(currentPrice: number, riseTreshold: number): boolean {
    return this.#lastBuyPrice && currentPrice > this.#lastBuyPrice * (1 + riseTreshold / 100) ? true : false;
  }

  static async #sellOrder(symbol: CryptoSymbol, currentPrice: number, quantity: number) {
    this.#lastBuyPrice = null;
    console.log('Selling at:', this.#calculateCryptoCost(currentPrice, quantity));

    await binance.order({
      symbol,
      side: 'SELL',
      type: OrderType.MARKET,
      quantity: '0.001',
    });
  }
}
