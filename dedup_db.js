const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vvxuahkmbzucccztbvod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2eHVhaGttYnp1Y2NjenRidm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzIxMjcsImV4cCI6MjA5NDAwODEyN30.aFEWx9xAuapLwGYUWhRbVhjrnrg281BFHbSk_dsboIM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function deduplicateDB() {
  console.log('🔍 Fetching all products...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, source_url, created_at')
    .order('created_at', { ascending: true }); // keep OLDEST (first inserted)

  if (error) {
    console.error('Fetch error:', error.message);
    return;
  }

  console.log(`📦 Total products: ${products.length}`);

  // Group by source_url - keep first (oldest), delete rest
  const seen = new Map(); // url -> id
  const toDelete = [];

  for (const p of products) {
    const cleanUrl = (p.source_url || '').split('?')[0]; // Remove query params
    if (seen.has(cleanUrl)) {
      toDelete.push(p.id);
      console.log(`  🗑️  Duplicate: "${p.title?.slice(0, 50)}"`);
    } else {
      seen.set(cleanUrl, p.id);
    }
  }

  console.log(`\nFound ${toDelete.length} duplicates to delete...`);

  if (toDelete.length > 0) {
    const { error: delErr } = await supabase
      .from('products')
      .delete()
      .in('id', toDelete);

    if (delErr) {
      console.error('Delete error:', delErr.message);
    } else {
      console.log(`✅ Deleted ${toDelete.length} duplicate products!`);
    }
  }

  // Also clean pending_scrapes duplicates
  console.log('\n🔍 Cleaning pending_scrapes duplicates...');
  const { data: scrapes } = await supabase
    .from('pending_scrapes')
    .select('id, url, status, created_at')
    .order('created_at', { ascending: true });

  if (scrapes) {
    const seenScrapes = new Map();
    const toDeleteScrapes = [];

    for (const s of scrapes) {
      const cleanUrl = (s.url || '').split('?')[0];
      if (seenScrapes.has(cleanUrl)) {
        toDeleteScrapes.push(s.id);
      } else {
        seenScrapes.set(cleanUrl, s.id);
      }
    }

    if (toDeleteScrapes.length > 0) {
      await supabase.from('pending_scrapes').delete().in('id', toDeleteScrapes);
      console.log(`✅ Deleted ${toDeleteScrapes.length} duplicate pending_scrapes!`);
    } else {
      console.log('✅ No pending_scrapes duplicates!');
    }
  }

  console.log('\n🎉 Deduplication complete!');
  
  // Final count
  const { data: final } = await supabase.from('products').select('id').eq('is_active', true);
  console.log(`📦 Final product count: ${final?.length}`);
}

deduplicateDB();
