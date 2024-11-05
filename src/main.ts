import { Trader } from "@/bot/trader";
import { connectWithMongoDb } from "@/db/mongodb";
import { CryptoSymbol } from "@/enums/crypto-symbol";
import { scheduler } from "@/jobs/scheduler";
import { services } from "@/services";

connectWithMongoDb();

scheduler.run(async () => {
  const trades = await services.trades.getTrades(CryptoSymbol.BTCUSDT);
  await services.trades.storeTradesInDatabase(trades!);

  await Trader.init({
    symbol: CryptoSymbol.BTCUSDT,
    dropTreshold: 1,
    riseTreshold: 1,
    quantity: 0.01,
  });
});
