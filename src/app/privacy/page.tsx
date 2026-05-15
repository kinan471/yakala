import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Yakala",
  description: "Yakala platformu gizlilik politikası ve veri güvenliği bilgilendirmesi.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-8 border-b-4 border-orange-500 pb-4 inline-block">
          Gizlilik Politikası
        </h1>
        
        <div className="prose prose-orange max-w-none space-y-6 text-gray-600 font-medium leading-relaxed">
          <p>
            Yakala platformu olarak, kullanıcılarımızın gizliliğine ve verilerinin güvenliğine büyük önem veriyoruz. 
            Bu politika, sitemizi ziyaret ettiğinizde hangi bilgilerin toplandığını ve bu bilgilerin nasıl kullanıldığını açıklar.
          </p>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Toplanan Bilgiler</h2>
            <p>
              Sitemizi kullandığınızda, deneyiminizi iyileştirmek için anonim kullanım verileri ve çerezler aracılığıyla 
              teknik bilgiler toplanabilir. Bu bilgiler IP adresiniz, tarayıcı türünüz ve ziyaret ettiğiniz sayfaları içerebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Verilerin Kullanımı</h2>
            <p>
              Toplanan veriler sadece platformun performansını artırmak, kullanıcı deneyimini kişiselleştirmek ve 
              size en iyi fırsatları sunmak amacıyla kullanılır. Kişisel verileriniz asla üçüncü taraflarla ticari amaçla paylaşılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Affiliate Bağlantıları</h2>
            <p>
              Platformumuzda yer alan ürün bağlantıları affiliate (satış ortaklığı) bağlantılarıdır. Bir ürünü satın aldığınızda, 
              satıcı platform (Amazon, Trendyol, Hepsiburada vb.) bize küçük bir komisyon ödeyebilir. Bu durum sizin ödediğiniz fiyatı etkilemez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. İletişim</h2>
            <p>
              Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
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
