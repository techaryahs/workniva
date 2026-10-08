"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getBookingById = exports.getMyBookings = exports.createBooking = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const bookingService_1 = require("../services/bookingService");
const createBooking = async (req, res) => {
    try {
        const booking = await (0, bookingService_1.createBookingService)(req.user.id, req.body);
        res.status(201).json({ success: true, data: booking });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createBooking = createBooking;
const getMyBookings = async (req, res) => {
    try {
        const bookings = await (0, bookingService_1.getMyBookingsService)(req.user.id);
        res.json({ success: true, data: bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyBookings = getMyBookings;
const getBookingById = async (req, res) => {
    try {
        const booking = await (0, bookingService_1.getBookingByIdService)(req.user.id, req.params.id);
        res.json({ success: true, data: booking });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getBookingById = getBookingById;
const cancelBooking = async (req, res) => {
    try {
        const booking = await (0, bookingService_1.cancelBookingService)(req.user.id, req.params.id);
        res.json({ success: true, data: booking });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.cancelBooking = cancelBooking;
//# sourceMappingURL=bookingController.js.map