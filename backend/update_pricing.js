const { createClient } = require('@supabase/supabase-js');
const url = 'https://euwgdolrskydqfifdxqy.supabase.co';
const key = 'sb_publishable_SeuQCI1whzUL278YsjhLag_z3HufPtV';
const supabase = createClient(url, key);

async function run() {
  await supabase.from('pricing').update({ active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  const { data, error } = await supabase.from('pricing').insert([
    { name: 'Private Cabin', duration_minutes: 60, price: 400 },
    { name: 'Conference Room', duration_minutes: 60, price: 500 },
    { name: 'Bench Seating', duration_minutes: 60, price: 100 },
    { name: 'Whole Night Office Rental', duration_minutes: 480, price: 599 }
  ]);
  console.log(error || 'Success');
}
run();
