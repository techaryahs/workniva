"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.requireAuth, bookingController_1.createBooking);
router.get('/', authMiddleware_1.requireAuth, bookingController_1.getMyBookings);
router.get('/:id', authMiddleware_1.requireAuth, bookingController_1.getBookingById);
router.patch('/:id/cancel', authMiddleware_1.requireAuth, bookingController_1.cancelBooking);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map