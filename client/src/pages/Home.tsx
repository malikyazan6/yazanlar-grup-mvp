import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  Shield, 
  Zap, 
  Truck, 
  CheckCircle,
  ArrowRight,
  Package,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "@/components/Logo";

export default function Home() {
  const [, navigate] = useLocation() as any;
  const { language, t } = useLanguage();

  const trustBadges = [
    { icon: CheckCircle, text: t('home.trustBadges.quality') },
    { icon: Truck, text: t('home.trustBadges.delivery') },
    { icon: Shield, text: t('home.trustBadges.security') },
    { icon: Package, text: t('home.trustBadges.wholesale') },
  ];

  const categories = [
    {
      id: "ndt",
      name: language === 'tr' ? "NDT Sarfları" : "NDT Supplies",
      slug: "ndt",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663344664281/iLAZ2sy4bhUT8UQQZD9P2x/category-ndt-8SjAsWHdqsh5LyUrTPSwC8.webp",
    },
    {
      id: "welding",
      name: language === 'tr' ? "Kaynak & Alaşım" : "Welding & Alloys",
      slug: "welding",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663344664281/iLAZ2sy4bhUT8UQQZD9P2x/category-welding-PHDF3LFJmjh2XNdrBC6Rt4.webp",
    },
    {
      id: "construction",
      name: language === 'tr' ? "Yapı Kimyasalları" : "Construction Chemicals",
      slug: "construction",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663344664281/iLAZ2sy4bhUT8UQQZD9P2x/category-chemicals-MQXmKCaY8cLQVTdviYNbXr.webp",
    },
    {
      id: "surface",
      name: language === 'tr' ? "Yüzey İşlem" : "Surface Treatment",
      slug: "surface",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "safety",
      name: language === 'tr' ? "İş Güvenliği" : "Safety Equipment",
      slug: "safety",
      image: "https://images.unsplash.com/photo-1590402444811-bfee29d1df6a?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <img
          src={language === 'tr' 
            ? 'https://d2xsxph8kpxj0f.cloudfront.net/310519663344664281/iLAZ2sy4bhUT8UQQZD9P2x/hero-banner-tr-ANDvjfK7DRYEGS9vVPeSSD.webp'
            : 'https://d2xsxph8kpxj0f.cloudfront.net/310519663344664281/iLAZ2sy4bhUT8UQQZD9P2x/hero-banner-en-P67b8h75d3D7BfJ7cYeJcL.webp'
          }
          alt={t('home.heroTitle')}
          className="w-full h-full object-cover"
        />
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <h3 className="text-3xl font-bold text-foreground mb-12">{t('home.categoriesTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                onClick={() => navigate(`/categories/${cat.slug}`)}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 overflow-hidden group"
              >
                <div className="relative h-40 overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-foreground">{cat.name}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => {
              const IconComponent = badge.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <p className="font-semibold text-foreground text-sm md:text-base">{badge.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/80 text-white cursor-pointer group" onClick={() => navigate("/categories/ndt")}>
        <div className="container text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">{t('home.ctaTitle')}</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {t('home.ctaSubtitle')}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/categories/ndt");
            }}
            className="px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition-colors"
          >
            {t('home.requestQuote')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <Logo className="h-10" />
            <nav className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Hakkımızda</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">İletişim</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">KVKK</a>
            </nav>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>{t('home.footer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
