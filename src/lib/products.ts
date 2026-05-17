import { supabase, Product } from "./supabase";

export const DEFAULT_REVALIDATE = 60;

/**
 * Fetch all active products
 */
export async function getActiveProducts() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
  return (data as Product[]) || [];
}

/**
 * Fetch only featured products
 */
export async function getFeaturedProducts() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
  return (data as Product[]) || [];
}

/**
 * Fetch products by category name (partial match)
 */
export async function getProductsByCategory(categoryName: string) {
  if (!supabase || !categoryName) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("category", `%${categoryName}%`)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching products for category ${categoryName}:`, error);
    return [];
  }
  return (data as Product[]) || [];
}

/**
 * Search products by title
 */
export async function searchProducts(query: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("title", `%${query}%`)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error searching products for query ${query}:`, error);
    return [];
  }
  return (data as Product[]) || [];
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string) {
  if (!supabase || !id) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
  return data as Product;
}

/**
 * Automatically classifies and updates the top 3 featured products of the day based on active deals
 */
export async function autoClassifyFeaturedProducts() {
  if (!supabase) return;
  console.log("[FeaturedClassifier] Starting automatic deal classification...");

  // 1. Fetch all active products
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (error || !products || products.length === 0) {
    console.warn("[FeaturedClassifier] No active products to classify.", error);
    return;
  }

  // 2. Reset all current featured products in a single operation
  await supabase
    .from("products")
    .update({ is_featured: false, featured_type: null })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Reset all

  // 3. Selection Algorithms
  
  // A. Cheapest (Best Discount % Guarantee)
  // Calculate discount percent: ((original_price - current_price) / original_price) * 100
  const discountSorted = [...products].sort((a, b) => {
    const discA = a.original_price > 0 ? ((a.original_price - a.current_price) / a.original_price) : 0;
    const discB = b.original_price > 0 ? ((b.original_price - b.current_price) / b.original_price) : 0;
    return discB - discA; // Descending (highest discount first)
  });
  const cheapestProduct = discountSorted[0];

  // B. Bestseller (Highest rating + click count + social proof)
  const bestsellerSorted = [...products]
    .filter(p => !cheapestProduct || p.id !== cheapestProduct.id) // Exclude selected cheapest
    .sort((a, b) => {
      // Score based on rating (weight 100) + social proof count (weight 1) + click count (weight 5)
      const scoreA = (a.rating || 0) * 100 + (a.social_proof_count || 0) + (a.click_count || 0) * 5;
      const scoreB = (b.rating || 0) * 100 + (b.social_proof_count || 0) + (b.click_count || 0) * 5;
      return scoreB - scoreA;
    });
  const bestsellerProduct = bestsellerSorted[0];

  // C. Expert Choice (Highest scarcity level & spec complexity)
  const expertSorted = [...products]
    .filter(p => (!cheapestProduct || p.id !== cheapestProduct.id) && (!bestsellerProduct || p.id !== bestsellerProduct.id))
    .sort((a, b) => {
      const specsCountA = a.specs ? Object.keys(a.specs).length : 0;
      const specsCountB = b.specs ? Object.keys(b.specs).length : 0;
      const scoreA = (a.scarcity_level || 0) * 10 + specsCountA * 2 + (a.rating || 0) * 5;
      const scoreB = (b.scarcity_level || 0) * 10 + specsCountB * 2 + (b.rating || 0) * 5;
      return scoreB - scoreA;
    });
  const expertProduct = expertSorted[0];

  // 4. Update the chosen products in Supabase
  const updates = [];
  if (cheapestProduct) {
    console.log(`[FeaturedClassifier] Selected CHEAPEST: ${cheapestProduct.title} (${cheapestProduct.source_platform})`);
    updates.push(
      supabase.from("products").update({ is_featured: true, featured_type: "cheapest" }).eq("id", cheapestProduct.id)
    );
  }
  if (bestsellerProduct) {
    console.log(`[FeaturedClassifier] Selected BESTSELLER: ${bestsellerProduct.title} (${bestsellerProduct.source_platform})`);
    updates.push(
      supabase.from("products").update({ is_featured: true, featured_type: "bestseller" }).eq("id", bestsellerProduct.id)
    );
  }
  if (expertProduct) {
    console.log(`[FeaturedClassifier] Selected EXPERT: ${expertProduct.title} (${expertProduct.source_platform})`);
    updates.push(
      supabase.from("products").update({ is_featured: true, featured_type: "expert" }).eq("id", expertProduct.id)
    );
  }

  if (updates.length > 0) {
    await Promise.all(updates);
    console.log("[FeaturedClassifier] Auto-classification completed successfully.");
  }
}
