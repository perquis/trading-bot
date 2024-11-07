import { CryptoSymbol } from "@/enums/crypto-symbol";
import { services } from "@/services";
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

  describe("getLastTrade", () => {
    it("should return last trade", async () => {
      // Arrange
      const symbol = CryptoSymbol.BTCUSDT;
      const trades = await services.trades.getTrades(symbol);
      await services.trades.storeTradesInDatabase(trades!, symbol);

      // Act
      const lastTrade = await services.trades.getLastTrade(symbol);

      // Assert
      expect(lastTrade).not.toBeNull();
    });
  });
});
