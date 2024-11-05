import { CryptoSymbol } from "@/enums/crypto-symbol";
import { ITrade } from "@/interfaces/trade.interface";
import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema<ITrade>({
  id: {
    type: Number,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    enum: [...Object.values(CryptoSymbol)],
  },
  qty: {
    type: String,
    required: true,
  },
  quoteQty: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  isBuyerMaker: {
    type: Boolean,
    required: true,
  },
  isBestMatch: {
    type: Boolean,
    required: true,
  },
});

export const TradeModel = mongoose.model("Trade", tradeSchema);
