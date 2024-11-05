import { CronJob } from "cron";

export const scheduler = {
  run: (onTick: () => void, cronTime = "* * * * *") => {
    try {
      CronJob.from({
        cronTime,
        onTick,
        start: true,
      });
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
      process.exit(1);
    }
  },
};
