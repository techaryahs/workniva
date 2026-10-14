import app from './app';
import { startCronJobs } from './utils/cron';
import { config, validateProductionEnvironment } from './config/env';

const port = config.port;

validateProductionEnvironment();

app.listen(port, () => {
  startCronJobs();
  console.log(`WorkNiva server listening on port ${port} (mode: ${config.paymentMode})`);
});
