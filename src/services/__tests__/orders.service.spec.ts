import { CryptoSymbol } from "@/enums/crypto-symbol";
import { services } from "@/services";
import { OrderSide } from "binance-api-node";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

describe("trades.service", () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  const newOrder = {
    symbol: CryptoSymbol.BTCUSDT,
    price: 50000,
    side: OrderSide.BUY,
    quantity: 0.001,
  };

  it("should find last order if exists", async () => {
    await services.orders.createOrder(newOrder);
    const lastOrder = await services.orders.getLastOrder(newOrder.symbol);

    expect(lastOrder).not.toBeNull();
    expect(lastOrder!.symbol).toBe(newOrder.symbol);
  });

  it("should not find last order if not exists", async () => {
    const lastOrder = await services.orders.getLastOrder(CryptoSymbol.ETHUSDT);
    expect(lastOrder).toBeNull();
  });
});
