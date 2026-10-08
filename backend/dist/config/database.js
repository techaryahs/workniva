"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
// This uses the service role key, bypassing RLS since it's the backend.
// We enforce authorization explicitly in our controllers and services.
exports.supabase = (0, supabase_js_1.createClient)(env_1.config.supabaseUrl, env_1.config.supabaseServiceKey);
