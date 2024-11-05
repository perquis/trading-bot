import { CronJob } from "cron";

export const scheduler = {
  run: (onTick: () => void, cronTime = "* * * * *") => {
    CronJob.from({
      cronTime,
      onTick,
      start: true,
    });
  },
};
