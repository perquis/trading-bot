import { Trader } from "@/bot/trader";
import { connectWithMongoDb } from "@/db/mongodb";
import { CryptoSymbol } from "@/enums/crypto-symbol";
import { services } from "@/services";

connectWithMongoDb();

export const tradingStrategy = async () => {
  const trades = await services.trades.getTrades(CryptoSymbol.BTCUSDT);
  await services.trades.storeTradesInDatabase(trades!);

  await Trader.init({
    symbol: CryptoSymbol.BTCUSDT,
    dropTreshold: 1,
    riseTreshold: 1,
    quantity: 0.01,
  });
};
