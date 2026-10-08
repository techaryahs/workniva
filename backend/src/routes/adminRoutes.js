"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// Apply auth and admin middleware to all admin routes
router.use(authMiddleware_1.requireAuth, authMiddleware_1.requireAdmin);
router.get('/bookings', adminController_1.getBookings);
router.patch('/bookings/:id/status', adminController_1.updateBookingStatus);
router.get('/pricing', adminController_1.getPricing);
router.patch('/pricing/:id', adminController_1.updatePricing);
router.get('/availability/blocked', adminController_1.getBlockedTimes);
router.post('/availability/block', adminController_1.blockTime);
router.delete('/availability/block/:id', adminController_1.unblockTime);
router.get('/customers', adminController_1.getCustomers);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map