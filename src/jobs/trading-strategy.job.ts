import { CryptoTraderFactory } from "@/bot/crypto-trader";
import { connectWithMongoDb } from "@/db/mongodb";
import { ICryptocurrencyOptions } from "@/interfaces/bot-trader.interface";
import { services } from "@/services";

connectWithMongoDb();

export const tradingStrategy = (options: ICryptocurrencyOptions) => async () => {
  const trades = await services.trades.getTrades(options.symbol);
  await services.trades.storeTradesInDatabase(trades!, options.symbol);

  await CryptoTraderFactory.create(options.symbol, options);
};
