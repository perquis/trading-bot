import { binance } from "@/clients/binance";
import { CryptoSymbol } from "@/enums/crypto-symbol";
import { TradeModel } from "@/models/Trade";
import { TradeResult } from "binance-api-node";

export const trades = {
  async getTrades(symbol: CryptoSymbol) {
    try {
      return await binance.trades({ symbol });
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  },

  async storeTradesInDatabase(trades: TradeResult[], symbol: CryptoSymbol) {
    try {
      trades = trades.map((trade) => ({
        ...trade,
        symbol,
      }));

      await TradeModel.insertMany(trades);
    } catch (error) {
      console.error("Error storing trades:", error);
    }
  },

  async getLastTrade(symbol: CryptoSymbol) {
    try {
      const trade = await TradeModel.findOne({ symbol }).sort({ time: -1 }).lean();
      return trade;
    } catch (error) {
      console.error("Error fetching last trade:", error);
    }
  },
};
