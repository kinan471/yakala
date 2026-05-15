import { supabase, Product } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

async function getProducts() {
  if (!supabase) return [];
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return (data as Product[]) || [];
}

export default async function ProductsListPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#fafafa] pt-24 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Tüm <span className="text-orange-500">Fırsatlar</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            En yeni teknoloji fırsatlarını keşfedين
          </p>
        </header>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400 font-bold">Henüz ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}