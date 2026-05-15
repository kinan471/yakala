import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Yakala",
  description: "Yakala platformu kullanım şartları ve yasal sorumluluklar.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-8 border-b-4 border-blue-600 pb-4 inline-block">
          Kullanım Koşulları
        </h1>
        
        <div className="prose prose-blue max-w-none space-y-6 text-gray-600 font-medium leading-relaxed">
          <p>
            Yakala platformuna hoş geldiniz. Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
          </p>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Hizmet Tanımı</h2>
            <p>
              Yakala, çeşitli e-ticaret sitelerindeki indirimli ürünleri bulan ve kullanıcılara sunan bir fırsat takip platformudur. 
              Biz doğrudan ürün satışı yapmıyoruz; sadece yönlendirme sağlıyoruz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Sorumluluk Reddi</h2>
            <p>
              Ürün fiyatları, stok durumları ve kampanya detayları ilgili mağazalar (Amazon, Trendyol, Hepsiburada vb.) tarafından belirlenir. 
              Veriler anlık olarak değişebilir. Yakala, fiyat hatalarından veya mağazalarda yaşanan sorunlardan sorumlu tutulamaz. 
              Satın alma işlemi ilgili mağazanın kurallarına tabidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Kullanım Hakları</h2>
            <p>
              Sitede yer alan içeriklerin, tasarımın ve yazılımın tüm hakları Yakala'ya aittir. İzinsiz kopyalanması veya ticari amaçla 
              kullanılması yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Değişiklikler</h2>
            <p>
              Yakala, bu koşulları dilediği zaman güncelleme hakkını saklı tutar. Kullanıcılar siteyi ziyaret ederek güncel koşulları 
              takip etmekle yükümlüdür.
            </p>
          </section>
          
          <div className="mt-12 pt-8 border-t border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-widest">
            Son Güncelleme: 15 Mayıs 2026
          </div>
        </div>
      </div>
    </div>
  );
}
