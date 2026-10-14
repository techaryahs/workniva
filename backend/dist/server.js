"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const cron_1 = require("./utils/cron");
const env_1 = require("./config/env");
const port = env_1.config.port;
(0, env_1.validateProductionEnvironment)();
app_1.default.listen(port, () => {
    (0, cron_1.startCronJobs)();
    console.log(`WorkNiva server listening on port ${port} (mode: ${env_1.config.paymentMode})`);
});
