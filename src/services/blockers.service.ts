import { CryptoSymbol } from "@/enums/crypto-symbol";
import { BlockerModel } from "@/models/Blocker";

export const blockers = {
  async isBlockedTrading(symbol: CryptoSymbol) {
    try {
      const blocker = await BlockerModel.findOne({ symbol });
      return !!blocker;
    } catch (error) {
      console.error("Error checking if symbol is blocked:", error);
      return false;
    }
  },
  async createBlocker(symbol: CryptoSymbol) {
    try {
      await BlockerModel.create({ symbol });
    } catch (error) {
      console.error("Error creating blocker:", error);
    }
  },
};
