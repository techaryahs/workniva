"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryNotification = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const getNotifications = async (req, res) => {
    try {
        const data = await (0, notificationService_1.getAdminNotificationsService)();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getNotifications = getNotifications;
const retryNotification = async (req, res) => {
    try {
        const data = await (0, notificationService_1.retryNotificationService)(req.params.id);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.retryNotification = retryNotification;
