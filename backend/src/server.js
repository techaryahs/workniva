"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const port = env_1.config.port;
app_1.default.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map