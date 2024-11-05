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

  async storeTradesInDatabase(trades: TradeResult[]) {
    try {
      await TradeModel.insertMany(trades);
    } catch (error) {
      console.error("Error storing trades:", error);
    }
  },

  async getLastTrade() {
    const trade = await TradeModel.findOne().sort({ time: -1 }).lean();
    return trade;
  },
};
