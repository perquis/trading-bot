import { services } from "@/services";

export const logger = {
  async getInfoAboutCostToSell() {
    const lastTrade = await services.trades.getLastTrade(),
      lastOrder = await services.orders.getLastOrder();

    if (!lastTrade || !lastOrder) throw new Error("No trades or orders found");

    return {
      newestPrice: parseFloat(lastTrade.price),
      lastOrderPrice: lastOrder.price,
    };
  },
};
