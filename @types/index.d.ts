declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV?: "development" | "production" | "test";
      readonly PORT?: string;
      readonly MONGO_URI?: string;
      readonly BINANCE_API_KEY?: string;
      readonly BINANCE_API_SECRET?: string;
      readonly BINANCE_API_URL?: string;
    }
  }
}

export {};
