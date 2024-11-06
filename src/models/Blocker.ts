import { CryptoSymbol } from "@/enums/crypto-symbol";
import { IBlocker } from "@/interfaces/blocker.interface";
import { model, Schema } from "mongoose";

const blockerSchema = new Schema<IBlocker>({
  symbol: {
    type: String,
    required: true,
    enum: [...Object.values(CryptoSymbol)],
  },
});

export const BlockerModel = model<IBlocker>("Blocker", blockerSchema);
