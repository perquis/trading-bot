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

  it("should return false if symbol is not blocked", async () => {
    const symbol = CryptoSymbol.BTCUSDT;
    const isBlocked = await services.blockers.isBlockedTrading(symbol);
    expect(isBlocked).toBeFalsy();
  });

  it("should return true if symbol is blocked", async () => {
    const symbol = CryptoSymbol.BTCUSDT;
    await services.blockers.createBlocker(symbol);

    const isBlocked = await services.blockers.isBlockedTrading(symbol);
    expect(isBlocked).toBeTruthy();
  });
});
