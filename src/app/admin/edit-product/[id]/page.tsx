"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type ScrapedData = {
  title: string;
  description: string;
  current_price: number;
  original_price: number;
  images: string[];
  category: string;
  rating: number;
  source_url: string;
  source_platform: string;
  currency: string;
  scarcity_level?: number;
  specs?: Record<string, string>;
};

const HOURS_OPTIONS = [
  { label: "6 saat", value: 6 },
  { label: "12 saat", value: 12 },
  { label: "24 saat", value: 24 },
  { label: "48 saat", value: 48 },
  { label: "72 saat", value: 72 },
];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");
  const [scraped, setScraped] = useState<ScrapedData | null>(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [specList, setSpecList] = useState<{ k: string; v: string }[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    current_price: "",
    original_price: "",
    affiliate_link: "",
    scarcity_level: "8",
    social_proof_count: "24",
    countdown_hours: "24",
    is_featured: false,
    featured_type: "",
    category: "",
    rating: "4.5",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_auth");
      if (saved === "true") setIsAuth(true);
    }
  }, []);

  useEffect(() => {
    if (isAuth && id) {
      fetchProduct();
    }
  }, [isAuth, id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Ürün yüklenemedi");
      const data = await res.json();
      
      setForm({
        title: data.title || "",
        description: data.description || "",
        current_price: String(data.current_price || ""),
        original_price: String(data.original_price || ""),
        affiliate_link: data.affiliate_link || "",
        scarcity_level: String(data.scarcity_level || "10"),
        social_proof_count: String(data.social_proof_count || "0"),
        countdown_hours: "24", // Default for edit
        is_featured: data.is_featured || false,
        featured_type: data.featured_type || "",
        category: data.category || "",
        rating: String(data.rating || "4.5"),
      });

      setScraped({
        title: data.title,
        description: data.description,
        current_price: data.current_price,
        original_price: data.original_price,
        images: data.images || [],
        category: data.category,
        rating: data.rating,
        source_url: data.source_url,
        source_platform: data.source_platform,
        currency: data.currency,
        specs: data.specs
      });

      if (data.specs) {
        setSpecList(Object.entries(data.specs).map(([k, v]) => ({ k, v: String(v) })));
      }
      
      setUrl(data.source_url || "");
    } catch (err) {
      alert("Hata: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "yakala2024") {
      setIsAuth(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      alert("Hatalı şifre!");
    }
  };

  const handleScrape = async () => {
    if (!url.trim()) return;
    setScraping(true);
    setScrapeError("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setScrapeError(data.error || "Hata oluştu");
        return;
      }
      setScraped(data);
      setForm((f) => ({
        ...f,
        title: data.title || f.title,
        description: data.description || f.description,
        current_price: String(data.current_price || f.current_price),
        original_price: String(data.original_price || f.original_price),
        category: data.category || f.category,
        rating: String(data.rating || f.rating),
      }));
      const newSpecsList = data.specs ? Object.entries(data.specs).map(([k, v]) => ({ k, v: String(v) })) : specList;
      setSpecList(newSpecsList);
    } catch {
      setScrapeError("Bağlantı hatası.");
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.current_price || !form.affiliate_link) {
      alert("Zorunlu alanları doldurun");
      return;
    }
    setSaving(true);
    
    const payload = {
      title: form.title,
      description: form.description,
      current_price: parseFloat(form.current_price),
      original_price: parseFloat(form.original_price),
      images: scraped?.images || [],
      category: form.category,
      rating: parseFloat(form.rating),
      source_url: url,
      affiliate_link: form.affiliate_link,
      source_platform: scraped?.source_platform || "other",
      scarcity_level: parseInt(form.scarcity_level),
      social_proof_count: parseInt(form.social_proof_count),
      is_featured: form.is_featured,
      featured_type: form.featured_type || null,
      specs: specList.reduce((acc, curr) => {
        if (curr.k.trim()) acc[curr.k.trim()] = curr.v.trim();
        return acc;
      }, {} as Record<string, string>),
    };

    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const err = await res.json();
      alert("Hata: " + err.error);
    }
    setSaving(false);
  };

  const update = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 pt-28">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900">YAKALA Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Şifre"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center outline-none focus:border-orange-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-yakala w-full py-4">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-24 font-bold text-gray-400">Ürün Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-4 bg-white shadow-sm">
        <Link href="/admin" className="text-gray-500 hover:text-orange-500 transition-colors font-bold text-sm">← Geri</Link>
        <span className="font-bold text-gray-900">✏️ Ürünü Düzenle</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-black text-gray-900 text-base mb-4">🔗 Kaynak Linki (Opsiyonel Güncelleme)</h2>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Ürün linki..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all"
                />
                <button
                  onClick={handleScrape}
                  disabled={scraping}
                  className="btn-yakala px-5 whitespace-nowrap disabled:opacity-50"
                >
                  {scraping ? "..." : "🔄 Verileri Yenile"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="font-black text-gray-900 text-base mb-2">📦 Ürün Bilgileri</h2>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">Başlık *</label>
                <input value={form.title} onChange={(e) => update("title", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">Açıklama</label>
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all min-h-[100px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">Mevcut Fiyat (₺) *</label>
                  <input type="number" value={form.current_price} onChange={(e) => update("current_price", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">Eski Fiyat (₺)</label>
                  <input type="number" value={form.original_price} onChange={(e) => update("original_price", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">🔗 Affiliate Link *</label>
                <input type="url" value={form.affiliate_link} onChange={(e) => update("affiliate_link", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">📦 Stok Seviyesi</label>
                  <input type="number" value={form.scarcity_level} onChange={(e) => update("scarcity_level", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">⭐ Puan</label>
                  <input type="number" step="0.1" value={form.rating} onChange={(e) => update("rating", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">Kategori</label>
                  <input value={form.category} onChange={(e) => update("category", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all" />
                </div>
              </div>

              <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input type="checkbox" id="is_featured" checked={form.is_featured}
                      onChange={(e) => update("is_featured", e.target.checked)}
                      className="w-4 h-4 accent-orange-500" />
                    <label htmlFor="is_featured" className="text-gray-900 font-bold text-sm cursor-pointer">
                      🏅 Günün En İyi 3 Yakalası&apos;na ekle
                    </label>
                  </div>
                  {form.is_featured && (
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { v: "cheapest", l: "💰 En Uygun" },
                        { v: "bestseller", l: "🏆 Çok Satılan" },
                        { v: "expert", l: "⭐ Uzman Seçimi" },
                      ].map(({ v, l }) => (
                        <button key={v} type="button"
                          onClick={() => update("featured_type", v)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
                            form.featured_type === v ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200"
                          }`}
                        >{l}</button>
                      ))}
                    </div>
                  )}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-blue-600 text-sm uppercase tracking-widest">🔧 Teknik Özellikler</h3>
                <button type="button" onClick={() => setSpecList([...specList, { k: "", v: "" }])} className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg">+ Ekle</button>
              </div>
              <div className="space-y-2">
                {specList.map((spec, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={spec.k} onChange={(e) => { const n = [...specList]; n[i].k = e.target.value; setSpecList(n); }} className="w-1/3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold" placeholder="Özellik" />
                    <input value={spec.v} onChange={(e) => { const n = [...specList]; n[i].v = e.target.value; setSpecList(n); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" placeholder="Değer" />
                    <button onClick={() => { const n = [...specList]; n.splice(i, 1); setSpecList(n); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {scraped?.images && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-700 text-sm mb-3">📸 Görseller ({scraped.images.length})</h3>
                <div className="relative aspect-square rounded-2xl overflow-hidden border mb-3">
                  <Image src={scraped.images[selectedImg] || ""} alt="Preview" fill className="object-cover" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {scraped.images.slice(0, 8).map((img, i) => (
                    <div key={i} onClick={() => setSelectedImg(i)} className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${selectedImg === i ? "border-orange-500" : "border-transparent"}`}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-3 sticky top-28">
              <button onClick={handleSave} disabled={saving} className="btn-yakala w-full py-4 font-black">
                {saving ? "Kaydediliyor..." : "💾 Değişiklikleri Kaydet"}
              </button>
              <Link href="/admin" className="block text-center text-gray-500 font-bold py-2">İptal</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
