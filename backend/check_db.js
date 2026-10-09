const { supabase } = require('./dist/config/database');

async function run() {
  const { data, error } = await supabase.rpc('get_constraints');
  console.log("RPC get_constraints:", data, error);
}
run();
