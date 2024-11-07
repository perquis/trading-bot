import Binance from "binance-api-node";
import dotenv from "dotenv";

dotenv.config();

export const binance = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  httpBase: process.env.BINANCE_API_URL,
  getTime: Date.now,
});
