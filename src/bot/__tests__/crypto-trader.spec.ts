import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { CryptoTraderFactory } from "@/bot/crypto-trader";
import { CryptoSymbol } from "@/enums/crypto-symbol";
import { services } from "@/services";
import { TradeResult } from "binance-api-node";
import dotenv from "dotenv";
dotenv.config();

describe("CryptoTrader", () => {
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

  const options = {
    symbol: CryptoSymbol.BTCUSDT,
    quantity: 0.01,
    riseTreshold: 0.5,
    dropTreshold: 0.5,
  };

  const createNewTrade = (trade: TradeResult, newPrice = 1000) => {
    const newTrade = { ...trade };
    newTrade.price = String(parseFloat(newTrade.price) + newPrice);
    newTrade.time = new Date().getTime();

    return newTrade;
  };

  it("should buy cryptocurrency when it doesn't have any order", async () => {
    // Arrange
    const trades = await services.trades.getTrades(options.symbol);
    await services.trades.storeTradesInDatabase(trades!, options.symbol);
    await CryptoTraderFactory.create(options.symbol, options);

    // Act
    const order = await services.orders.getLastOrder(options.symbol);

    // Assert
    expect(order).not.toBeNull();
    expect(order!.side).toBe("BUY");
  });

  it("should sell cryptocurrency when it has a buy order", async () => {
    // Arrange
    const trades = await services.trades.getTrades(options.symbol);
    await services.trades.storeTradesInDatabase(trades!, options.symbol);

    await CryptoTraderFactory.create(options.symbol, options);

    const newTrade = createNewTrade(trades![0]);
    await services.trades.storeTradesInDatabase([newTrade], options.symbol);
    await CryptoTraderFactory.create(options.symbol, options);

    // Act
    const order = await services.orders.getLastOrder(options.symbol);

    // Assert
    expect(order).not.toBeNull();
    expect(order!.side).toBe("SELL");
  });

  it("should buy cryptocurrency when it has a sell order", async () => {
    // Arrange
    const trades = await services.trades.getTrades(options.symbol);
    await services.trades.storeTradesInDatabase(trades!, options.symbol);

    await CryptoTraderFactory.create(options.symbol, options);

    const newTrade = createNewTrade(trades![0]);
    await services.trades.storeTradesInDatabase([newTrade], options.symbol);
    await CryptoTraderFactory.create(options.symbol, options);

    const newTrade2 = createNewTrade(trades![0], -1000);
    await services.trades.storeTradesInDatabase([newTrade2], options.symbol);
    await CryptoTraderFactory.create(options.symbol, options);

    // Act
    const order = await services.orders.getLastOrder(options.symbol);

    // Assert
    expect(order).not.toBeNull();
    expect(order!.side).toBe("BUY");
  });
});
