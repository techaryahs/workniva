"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = exports.unblockTime = exports.blockTime = exports.getBlockedTimes = exports.updatePricing = exports.getPricing = exports.updateBookingStatus = exports.getBookings = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminService_1 = require("../services/adminService");
const getBookings = async (req, res) => {
    try {
        const data = await (0, adminService_1.getAdminBookingsService)();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBookings = getBookings;
const updateBookingStatus = async (req, res) => {
    try {
        const data = await (0, adminService_1.updateBookingStatusService)(req.params.id, req.body.status);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
const getPricing = async (req, res) => {
    try {
        const data = await (0, adminService_1.getPricingService)();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPricing = getPricing;
const updatePricing = async (req, res) => {
    try {
        await (0, adminService_1.updatePricingService)(req.params.id, req.body);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updatePricing = updatePricing;
const getBlockedTimes = async (req, res) => {
    try {
        const data = await (0, adminService_1.getBlockedTimesService)();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBlockedTimes = getBlockedTimes;
const blockTime = async (req, res) => {
    try {
        const data = await (0, adminService_1.blockTimeService)(req.user.id, req.body);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.blockTime = blockTime;
const unblockTime = async (req, res) => {
    try {
        await (0, adminService_1.unblockTimeService)(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.unblockTime = unblockTime;
const getCustomers = async (req, res) => {
    try {
        const data = await (0, adminService_1.getAdminCustomersService)();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCustomers = getCustomers;
//# sourceMappingURL=adminController.js.map