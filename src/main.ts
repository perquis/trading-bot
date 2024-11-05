import { Trader } from '@/bot/trader';
import { connectWithMongoDb } from '@/db/mongodb';
import { CryptoSymbol } from '@/enums/crypto-symbol';

connectWithMongoDb();

setInterval(async () => {
  const trades = await Trader.getTrades(CryptoSymbol.BTCUSDT);
  await Trader.storeTrades(trades!);

  await Trader.buyOrSellOrders({
    symbol: CryptoSymbol.BTCUSDT,
    dropTreshold: 1,
    riseTreshold: 1,
    quantity: 0.01,
  });
}, 10000);
