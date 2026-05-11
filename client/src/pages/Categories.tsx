import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  ChevronDown,
  Filter,
  ArrowLeft,
  Zap,
  AlertCircle,
  Beaker,
  Wrench,
  Shield,
  ShoppingCart,
  FileText,
  Package,
  Eye
} from "lucide-react";
import { useState } from "react";
import { products, getProductsByCategory, categories as allCategories, Product } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import QuickViewModal from "@/components/QuickViewModal";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  ndt: AlertCircle,
  welding: Zap,
  construction: Beaker,
  surface: Wrench,
  safety: Shield,
};

export default function Categories() {
  const [location, navigate] = useLocation() as any;
  const { language } = useLanguage();
  const categoryId = location.split("/").pop();

  const categoryNames: Record<string, { tr: string; en: string }> = {
    ndt: { tr: 'NDT Sarfları', en: 'NDT Supplies' },
    welding: { tr: 'Kaynak & Alaşım', en: 'Welding & Alloys' },
    construction: { tr: 'Yapı Kimyasalları', en: 'Construction Chemicals' },
    surface: { tr: 'Yüzey İşlem', en: 'Surface Treatment' },
    safety: { tr: 'İş Güvenliği', en: 'Safety Equipment' },
  };
  
  const categoryDescriptions: Record<string, { tr: string; en: string }> = {
    ndt: { tr: 'Tahribatsız muayene malzemeleri ve test ekipmanları', en: 'Non-destructive testing materials and equipment' },
    welding: { tr: 'Özel kaynak telleri ve alaşım ürünleri', en: 'Specialized welding wires and alloy products' },
    construction: { tr: 'İleri yapı kimyasalları ve sabitleyiciler', en: 'Advanced construction chemicals and adhesives' },
    surface: { tr: 'Yüzey işlem ve aşındırıcı ürünleri', en: 'Surface treatment and abrasive products' },
    safety: { tr: 'Nitelikli iş güvenliği ekipmanları', en: 'Professional safety equipment and PPE' },
  };

  const labels = {
    back: language === 'tr' ? 'Geri' : 'Back',
    categories: language === 'tr' ? 'Kategoriler' : 'Categories',
    cart: language === 'tr' ? 'Sepet' : 'Cart',
    filters: language === 'tr' ? 'Filtreler' : 'Filters',
    priceRange: language === 'tr' ? 'Fiyat Aralığı' : 'Price Range',
    certification: language === 'tr' ? 'Sertifikasyon' : 'Certification',
    productsFound: language === 'tr' ? 'ürün bulundu' : 'products found',
    quickView: language === 'tr' ? 'Hızlı Görünüm' : 'Quick View',
    code: language === 'tr' ? 'Kod' : 'Code',
  };

  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    certification: true
  });
  
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: 'all',
    certification: 'all'
  });

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const filteredProducts = getProductsByCategory(categoryId).filter(product => {
    // Price filter
    if (selectedFilters.priceRange !== 'all') {
      const price = product.price;
      switch (selectedFilters.priceRange) {
        case 'under500':
          if (price >= 500) return false;
          break;
        case '500to1000':
          if (price < 500 || price >= 1000) return false;
          break;
        case '1000to2000':
          if (price < 1000 || price >= 2000) return false;
          break;
        case 'over2000':
          if (price < 2000) return false;
          break;
      }
    }

    // Certification filter
    if (selectedFilters.certification !== 'all') {
      if (product.certification !== selectedFilters.certification) return false;
    }

    return true;
  });

  const currentCategory = categoryNames[categoryId as keyof typeof categoryNames];
  const currentDescription = categoryDescriptions[categoryId as keyof typeof categoryDescriptions];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Yazanlar Grup</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/categories/ndt")}
              className="text-foreground hover:text-primary transition-colors"
            >
              {labels.categories}
            </button>
            <button 
              onClick={() => navigate("/cart")}
              className="text-foreground hover:text-primary transition-colors"
            >
              {labels.cart}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {labels.back}
        </button>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {currentCategory ? (language === 'tr' ? currentCategory.tr : currentCategory.en) : 'Kategoriler'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {currentDescription ? (language === 'tr' ? currentDescription.tr : currentDescription.en) : ''}
          </p>
        </div>

        {/* Filters and Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-industrial p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">{labels.filters}</h2>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6 pb-6 border-b border-border">
                <button
                  onClick={() => setExpandedFilters(prev => ({
                    ...prev,
                    price: !prev.price
                  }))}
                  className="flex items-center justify-between w-full font-semibold text-foreground mb-3"
                >
                  {labels.priceRange}
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedFilters.price ? "rotate-180" : ""}`} />
                </button>
                {expandedFilters.price && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={selectedFilters.priceRange === 'all'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, priceRange: 'all' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">{language === 'tr' ? 'Tümü' : 'All'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="under500"
                        checked={selectedFilters.priceRange === 'under500'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, priceRange: 'under500' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">{language === 'tr' ? '500 ₺ Altında' : 'Under 500 ₺'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="500to1000"
                        checked={selectedFilters.priceRange === '500to1000'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, priceRange: '500to1000' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">500 - 1000 ₺</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="1000to2000"
                        checked={selectedFilters.priceRange === '1000to2000'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, priceRange: '1000to2000' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">1000 - 2000 ₺</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="over2000"
                        checked={selectedFilters.priceRange === 'over2000'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, priceRange: 'over2000' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">{language === 'tr' ? '2000 ₺ Üstü' : 'Over 2000 ₺'}</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Certification Filter */}
              <div>
                <button
                  onClick={() => setExpandedFilters(prev => ({
                    ...prev,
                    certification: !prev.certification
                  }))}
                  className="flex items-center justify-between w-full font-semibold text-foreground mb-3"
                >
                  {labels.certification}
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedFilters.certification ? "rotate-180" : ""}`} />
                </button>
                {expandedFilters.certification && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cert"
                        value="all"
                        checked={selectedFilters.certification === 'all'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, certification: 'all' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">{language === 'tr' ? 'Tümü' : 'All'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cert"
                        value="ISO 9001"
                        checked={selectedFilters.certification === 'ISO 9001'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, certification: 'ISO 9001' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">ISO 9001</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cert"
                        value="CE"
                        checked={selectedFilters.certification === 'CE'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, certification: 'CE' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">CE</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cert"
                        value="ASTM"
                        checked={selectedFilters.certification === 'ASTM'}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, certification: 'ASTM' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">ASTM</span>
                    </label>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredProducts.length} {labels.productsFound}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const productName = language === 'tr' ? product.name_tr : product.name_en;
                return (
                  <Card key={product.id} className="card-industrial overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-48 flex items-center justify-center overflow-hidden relative group">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-muted-foreground" />
                      )}
                      
                      {/* Quick View Button */}
                      <button
                        onClick={() => handleQuickView(product)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <div className="flex items-center gap-2 text-white">
                          <Eye className="w-5 h-5" />
                          <span>{labels.quickView}</span>
                        </div>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2 line-clamp-2 text-sm">{productName}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{labels.code}</span>
                          <span className="text-xs font-semibold text-accent">{product.technicalCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{labels.certification}</span>
                          <span className="text-xs font-semibold text-foreground">{product.certification}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-accent">{product.price} ₺</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {language === 'tr' ? 'Ürün bulunamadı' : 'No products found'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          product={quickViewProduct}
          onAddToCart={(product) => {
            const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
            const existingItem = existingCart.find((item: any) => item.id === product.id);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              const productName = language === 'tr' ? product.name_tr : product.name_en;
              existingCart.push({
                id: product.id,
                name: productName,
                price: product.price,
                technicalCode: product.technicalCode,
                quantity: 1
              });
            }
            localStorage.setItem("cart", JSON.stringify(existingCart));
            setIsQuickViewOpen(false);
          }}
          onRequestQuote={(product) => {
            navigate(`/product/${product.id}`);
          }}
        />
      )}
    </div>
  );
}
