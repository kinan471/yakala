# YAKALA - Türkiye'nin En İyi Teknoloji Fırsat Platformu 🎯

Akıllı fiyat takibi, otomatik fırsat keşfi ve AI destekli indirim analizi.

## 🚀 Özellikler

- **Otomatik Ürün Keşfi**: Trendyol, Hepsiburada, N11 gibi platformlardan akıllı scraping
- **Deal Score Engine**: Gerçek zamanlı indirim analizi ve satın alma sinyalleri
- **Fiyat Takibi**: Otomatik fiyat güncelleme ve geçmiş takibi
- **Admin Paneli**: Ürün yönetimi, öne çıkarma ve manuel ekleme
- **PWA Desteği**: Mobil uygulama deneyimi

## 📋 Gereksinimler

- Node.js 18+
- Supabase hesabı
- Firecrawl API key (opsiyonel, AI extraction için)

## 🛠️ Kurulum

```bash
# Dependencies yükle
npm install

# .env.local dosyasını oluştur
cp .env.example .env.local

# Değişkenleri doldur
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# FIRECRAWL_API_KEY=
# CRON_SECRET=

# Development server başlat
npm run dev
```

## 📊 Database Setup

Supabase SQL Editor'da şu dosyaları çalıştır:
1. `supabase-schema.sql` - Temel tablolar
2. `supabase-schema-v2.sql` - Gelişmiş scraping özellikleri

## 🔧 API Endpoints

| Endpoint | Açıklama |
|----------|----------|
| `/api/discover?action=all` | Yeni ürün keşfet ve işle |
| `/api/sync` | Fiyatları güncelle |
| `/api/products` | Ürün listesi |
| `/api/stats` | Site istatistikleri |
| `/api/settings` | Site ayarları |
| `/api/worker-status` | Scraper durumu |

## 🤖 Scheduled Jobs (Vercel Cron)

- **Her gün 03:00**: Ürün keşfi (`/api/discover`)
- **Her gün 05:00**: Fiyat senkronizasyonu (`/api/sync`)

## 📁 Proje Yapısı

```
src/
├── app/              # Next.js pages & API routes
├── components/       # React bileşenleri
├── lib/
│   ├── scraper-engine/  # Ultra Scraper V2
│   ├── products.ts      # Ürün servis katmanı
│   ├── deal-score.ts    # İndirim analiz motoru
│   └── discovery.ts     # Ürün keşif sistemi
└── types/            # TypeScript tanımları
```

## 🔐 Admin Panel

- URL: `/admin`
- Şifre: `yakala2024` (production'da değiştirin!)

## 🎯 Deal Score Sistemi

| Skor | Sinyal | Anlam |
|------|--------|-------|
| 70-100 | 🟢 BUY_NOW | Mükemmel fırsat |
| 40-69 | 🟡 NORMAL | Normal fiyat |
| 0-39 | 🔴 WAIT | Bekle |

## 📝 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Scraping**: Firecrawl API + Custom Engine
- **Deployment**: Vercel

## 📄 License

MIT
