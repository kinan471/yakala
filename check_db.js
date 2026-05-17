const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vvxuahkmbzucccztbvod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2eHVhaGttYnp1Y2NjenRidm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzIxMjcsImV4cCI6MjA5NDAwODEyN30.aFEWx9xAuapLwGYUWhRbVhjrnrg281BFHbSk_dsboIM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Check what columns exist and if duplicates exist
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, source_url, source_platform, current_price, fingerprint')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error:', error.message);
    console.log('\n=== COLUMNS ERROR - checking if fingerprint column exists ===');
    
    // Try without fingerprint
    const { data: p2, error: e2 } = await supabase
      .from('products')
      .select('id, title, source_url, source_platform, current_price')
      .eq('is_active', true)
      .limit(50);
    
    if (e2) {
      console.error('Still error:', e2.message);
    } else {
      console.log(`\nTotal products: ${p2?.length}`);
      console.log('\n⚠️  fingerprint column does NOT exist!\n');
      
      // Check duplicates by title similarity
      const seen = new Map();
      const dups = [];
      for (const p of (p2 || [])) {
        const key = p.title?.toLowerCase().trim().split(' ').slice(0, 4).join(' ');
        if (seen.has(key)) {
          dups.push({ title: p.title, url: p.source_url, platform: p.source_platform });
        } else {
          seen.set(key, p);
        }
      }
      console.log(`Duplicates found: ${dups.length}`);
      dups.forEach(d => console.log(`  🔁 "${d.title}" [${d.platform}]`));
    }
    return;
  }

  console.log(`\n📦 Total active products: ${products?.length}`);
  
  // Check if fingerprint column exists
  const hasFp = products?.[0] && 'fingerprint' in products[0];
  console.log(`fingerprint column exists: ${hasFp}`);
  
  // Check source_url uniqueness
  const urls = products?.map(p => p.source_url) || [];
  const uniqueUrls = new Set(urls);
  console.log(`source_url unique: ${uniqueUrls.size === urls.length ? '✅ YES' : '❌ NO - DUPLICATES BY URL!'}`);
  
  // Find exact URL duplicates
  const urlCount = {};
  for (const u of urls) {
    urlCount[u] = (urlCount[u] || 0) + 1;
  }
  const dupUrls = Object.entries(urlCount).filter(([, c]) => c > 1);
  if (dupUrls.length > 0) {
    console.log('\n🔁 Duplicate URLs:');
    dupUrls.forEach(([url, count]) => console.log(`  ${url} (${count}x)`));
  }
  
  // Find title duplicates
  const titles = {};
  for (const p of (products || [])) {
    const key = p.title?.toLowerCase().trim().split(' ').slice(0, 5).join(' ');
    if (!titles[key]) titles[key] = [];
    titles[key].push(p.source_platform);
  }
  const dupTitles = Object.entries(titles).filter(([, platforms]) => platforms.length > 1);
  if (dupTitles.length > 0) {
    console.log('\n🔁 Duplicate Titles (same product, different platform or insert):');
    dupTitles.forEach(([title, platforms]) => 
      console.log(`  "${title}" → [${platforms.join(', ')}]`)
    );
  } else {
    console.log('\n✅ No title duplicates found!');
  }
}

checkSchema();
