import { CryptoSymbol } from "@/enums/crypto-symbol";
import { IOrder } from "@/interfaces/order.interface";
import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema<IOrder>(
  {
    symbol: {
      type: String,
      required: true,
      enum: [...Object.values(CryptoSymbol)],
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    cryptoPriceForQuantity: {
      type: String,
      required: true,
    },
    side: {
      type: String,
      required: true,
      enum: ["BUY", "SELL"],
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model("Order", orderSchema);
