import { jobs } from "@/jobs";
import { scheduler } from "@/utils/scheduler";

scheduler.createScheduledJob(jobs.tradingStrategy);
