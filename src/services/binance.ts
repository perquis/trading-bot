import Binance from 'binance-api-node';
import dotenv from 'dotenv';

dotenv.config();
const httpBase = process.env.NODE_ENV === 'development' ? 'https://testnet.binance.vision' : undefined;

export const binance = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  getTime: Date.now,
  httpBase,
});
