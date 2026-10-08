"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const database_1 = require("../config/database");
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: profile, error } = await database_1.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error)
            throw error;
        res.json({ success: true, data: profile });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map