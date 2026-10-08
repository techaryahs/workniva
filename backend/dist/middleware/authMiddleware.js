"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const database_1 = require("../config/database");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Missing or invalid authorization token' });
        }
        const token = authHeader.split(' ')[1];
        // Verify user with Supabase
        const { data: { user }, error } = await database_1.supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        // Fetch user profile to get role
        const { data: profile, error: profileError } = await database_1.supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        if (profileError || !profile) {
            return res.status(401).json({ success: false, message: 'User profile not found' });
        }
        req.user = {
            id: user.id,
            role: profile.role,
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ success: false, message: 'Internal server error during authentication' });
    }
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
