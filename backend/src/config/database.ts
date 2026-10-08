import { createClient } from '@supabase/supabase-js';
import { config } from './env';

// This uses the service role key, bypassing RLS since it's the backend.
// We enforce authorization explicitly in our controllers and services.
export const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
