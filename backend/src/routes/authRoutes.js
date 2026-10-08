"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/me', authMiddleware_1.requireAuth, authController_1.getMe);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map