const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDB() {
  console.log("Cleaning database...");
  
  // Reset pending scrapes
  const { error: resetErr } = await supabase
    .from('pending_scrapes')
    .update({ status: 'pending', attempts: 0, last_error: null })
    .neq('status', 'processing'); // update all
    
  if (resetErr) console.error("Error resetting queue:", resetErr);
  else console.log("Queue reset successfully!");

  // Delete all products to start fresh with new fingerprinting
  const { error: delErr } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
    
  if (delErr) console.error("Error deleting products:", delErr);
  else console.log("Products deleted successfully!");
}

cleanDB();
