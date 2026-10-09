"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = void 0;
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
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, phone, company } = req.body;
        const { data: profile, error } = await database_1.supabase
            .from('profiles')
            .update({ full_name, phone, company, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select('*')
            .single();
        if (error)
            throw error;
        res.json({ success: true, data: profile });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProfile = updateProfile;
