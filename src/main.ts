import { jobs } from "@/jobs";
import { bitcoin, ethereum } from "@/options/crypto";
import { scheduler } from "@/utils/scheduler";

/*
- Remember to add income attribute for each orders.
- Add logs for each orders to see the result of the trading strategy.
- Make sure whether the trading strategy is profitable or not 
  by comparing the income and the loss. Use TDD to test the trading
  strategy.
*/

scheduler.createScheduledJob(jobs.tradingStrategy(bitcoin));
scheduler.createScheduledJob(jobs.tradingStrategy(ethereum));
