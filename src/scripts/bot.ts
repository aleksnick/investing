import { GET as Bot } from '@app/api/cron/route';

const run = async () => {
  await Bot();
};

run();
