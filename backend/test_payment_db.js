require('dotenv').config({ path: __dirname + '/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.from('payments').select('*').limit(1);
  if (error) {
    console.error("DB Error:", error);
  } else {
    console.log("Success, payments table exists. Data:", data);
  }
}

test();
