import { jobs } from "@/jobs";
import { bitcoin, ethereum } from "@/strategies";
import { scheduler } from "@/utils/scheduler";

scheduler.createScheduledJob(jobs.tradingStrategy(bitcoin));
scheduler.createScheduledJob(jobs.tradingStrategy(ethereum));
