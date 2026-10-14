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
        // Create a scoped client with the user's token to query on their behalf
        const userSupabase = database_1.supabase; // Fallback
        const { createClient } = require('@supabase/supabase-js');
        const { config } = require('../config/env');
        const scopedSupabase = createClient(config.supabaseUrl, config.supabaseServiceKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
        // Fetch user profile to get role
        let { data: profile, error: profileError } = await scopedSupabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        if (profileError || !profile) {
            // Safe recovery mechanism for users missing profiles
            console.warn(`Profile missing for user ${user.id}. Attempting recovery.`);
            const isAdminEmail = user.email?.toLowerCase() === 'admin.workniva@gmail.com';
            const newProfile = {
                id: user.id,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'WorkNiva User',
                email: user.email || `${user.id}@placeholder.com`,
                role: isAdminEmail ? 'admin' : 'customer'
            };
            const { data: recoveredProfile, error: recoveryError } = await database_1.supabase
                .from('profiles')
                .insert(newProfile)
                .select('role')
                .single();
            if (recoveryError || !recoveredProfile) {
                console.error('Failed to recover profile:', recoveryError);
                // Provide a clearer error message indicating the backend key is misconfigured
                if (recoveryError?.code === '42501') {
                    return res.status(401).json({
                        success: false,
                        message: 'User profile not found. Safe recovery failed due to Row-Level Security. Please ensure backend SUPABASE_SERVICE_ROLE_KEY is correctly set in .env and is NOT the anon key.'
                    });
                }
                return res.status(401).json({ success: false, message: 'User profile not found and recovery failed' });
            }
            profile = recoveredProfile;
        }
        else if (user.email?.toLowerCase() === 'admin.workniva@gmail.com' && profile.role !== 'admin') {
            // Auto-promote admin.workniva@gmail.com if not yet marked as admin
            console.log(`Auto-promoting ${user.email} to admin role.`);
            await database_1.supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
            profile.role = 'admin';
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
