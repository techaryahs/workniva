"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailability = void 0;
const availabilityService_1 = require("../services/availabilityService");
const checkAvailability = async (req, res) => {
    try {
        const { date, startTime, duration } = req.query;
        if (!date || !startTime || !duration) {
            return res.status(400).json({ success: false, message: 'Missing required parameters' });
        }
        let durationMinutes = 60;
        if (String(duration).includes('Hour'))
            durationMinutes = parseInt(String(duration)) * 60;
        if (duration === 'Half Day')
            durationMinutes = 240;
        if (duration === 'Full Day' || duration === 'Night')
            durationMinutes = 480;
        const result = await (0, availabilityService_1.checkAvailabilityService)(String(date), String(startTime), durationMinutes);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.checkAvailability = checkAvailability;
