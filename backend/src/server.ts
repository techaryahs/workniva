import app from './app';
import { startCronJobs } from './utils/cron';
import { config } from './config/env';

const port = config.port;

app.listen(port, () => {
  startCronJobs();
  console.log(`Server is running on port ${port}`);
});
