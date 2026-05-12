import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  ArrowLeft,
  ShoppingCart,
  FileText,
  Download,
  Package,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";
import { useState } from "react";
import { getProductById } from "@/lib/mockData";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateQuotePDF } from "@/lib/pdfQuoteService";

export default function ProductDetail() {
  const [location, navigate] = useLocation() as any;
  const { language, t } = useLanguage();
  const productId = parseInt(location.split("/").pop() || "1");
  
  const product = getProductById(productId);
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{language === 'tr' ? 'Ürün Bulunamadı' : 'Product Not Found'}</h1>
          <button onClick={() => navigate("/categories/ndt")} className="px-4 py-2 bg-primary text-white rounded">{language === 'tr' ? 'Kategorilere Dön' : 'Back to Categories'}</button>
        </div>
      </div>
    );
  }
  
  // Get product name and description based on language
  const productName = language === 'tr' ? product.name_tr : product.name_en;
  const productDescription = language === 'tr' ? product.description_tr : product.description_en;
  const productSpecs = language === 'tr' ? product.specs_tr || product.specs : product.specs_en || product.specs;

  const [quantity, setQuantity] = useState(1);
  const [showB2BForm, setShowB2BForm] = useState(false);
  const [b2bData, setB2BData] = useState({
    packagingType: "koli",
    quantity: 10,
    companyName: "",
    email: "",
    phone: ""
  });
  const [cartNotification, setCartNotification] = useState(false);
  const [b2bNotification, setB2BNotification] = useState(false);

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if product already in cart
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({
        id: product.id,
        name: productName,
        price: product.price,
        technicalCode: product.technicalCode,
        quantity: quantity
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Show notification
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 3000);
  };

  const submitB2BQuoteMutation = trpc.b2b.submitQuote.useMutation();

  const handleB2BSubmit = async () => {
    if (!b2bData.companyName || !b2bData.email || !b2bData.phone) {
      alert("Lutfen tum alanlari doldurunuz");
      return;
    }

    try {
      await submitB2BQuoteMutation.mutateAsync({
        productId: product.id,
        productName: product.name,
        technicalCode: product.technicalCode,
        companyName: b2bData.companyName,
        email: b2bData.email,
        phone: b2bData.phone,
        packagingType: b2bData.packagingType as "koli" | "palet",
        quantity: b2bData.quantity,
      });

      // Show notification
      setB2BNotification(true);
      setShowB2BForm(false);
      
      // Reset form
      setB2BData({
        packagingType: "koli",
        quantity: 10,
        companyName: "",
        email: "",
        phone: ""
      });
      
      setTimeout(() => setB2BNotification(false), 3000);
    } catch (error) {
      console.error("B2B quote submission error:", error);
      alert("Teklif talebiniz gonderilirken bir hata olustur. Lutfen daha sonra tekrar deneyin.");
    }
  };

  const downloadProductQuote = () => {
    console.log('Urun PDF indirme basladi:', { productName, quantity, price: product.price });
    
    try {
      generateQuotePDF({
        items: [
          {
            id: product.id,
            name: productName,
            technicalCode: product.technicalCode,
            price: product.price,
            quantity: quantity
          }
        ],
        totalAmount: product.price * quantity,
        customerName: "Musteri",
        customerEmail: "info@yazanlargrup.com",
        companyName: "Yazanlar Grup B2B"
      });
      console.log('Urun PDF indirme tamamlandi');
    } catch (error) {
      console.error('Urun PDF indirme hatasi:', error);
      alert('PDF indirme sirasinda bir hata olustur.');
    }
  };

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
              Kategoriler
            </button>
            <button 
              onClick={() => navigate("/cart")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Sepet
            </button>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {cartNotification && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          Ürün sepete eklendi!
        </div>
      )}
      {b2bNotification && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          Teklif talebiniz gönderildi!
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('product.backButton')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <Card className="card-industrial sticky top-24">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-96 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-32 h-32 text-muted-foreground" />
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-600">{t('product.inStock')}</span>
              </div>
              
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">{t('product.price')}</p>
                <p className="text-4xl font-bold text-accent">{product.price} ₺</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Miktar (Adet)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-background transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-center bg-background"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-background transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* B2C Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 mb-3"
              >
                {t('product.addToCart')}
              </Button>

              {/* PDF Quote Button */}
              <Button
                onClick={downloadProductQuote}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 py-6 mb-3"
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'tr' ? 'PDF Teklif Indir' : 'Download Quote PDF'}
              </Button>

              {/* B2B Button */}
              <Button
                onClick={() => setShowB2BForm(!showB2BForm)}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 py-6"
              >
                {t('product.requestQuote')}
              </Button>
            </Card>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="card-industrial">
              <h1 className="text-3xl font-bold text-foreground mb-4">{productName}</h1>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{language === 'tr' ? 'Teknik Kod' : 'Technical Code'}</p>
                  <p className="text-lg font-semibold text-foreground">{product.technicalCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{language === 'tr' ? 'Malzeme' : 'Material'}</p>
                  <p className="text-lg font-semibold text-foreground">{product.material}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{language === 'tr' ? 'Sertifikasyon' : 'Certification'}</p>
                  <p className="text-lg font-semibold text-foreground">{product.certification}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{language === 'tr' ? 'Stok Durumu' : 'Stock Status'}</p>
                  <p className="text-lg font-semibold text-green-600">{product.quantity} {language === 'tr' ? 'Adet' : 'Units'}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{language === 'tr' ? 'Ürün Açıklaması' : 'Product Description'}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {productDescription}
                </p>
              </div>
            </Card>

            {/* Technical Specs */}
            <Card className="card-industrial">
              <h3 className="text-xl font-bold text-foreground mb-4">{t('product.technicalSpecs')}</h3>
              <table className="table-specs w-full">
                <tbody>
                  {Object.entries(productSpecs).map(([key, value]) => (
                    <tr key={key} className="border-b border-border last:border-b-0">
                      <td className="font-semibold text-foreground py-3 px-4">{key}</td>
                      <td className="text-muted-foreground py-3 px-4">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Datasheet Download */}
            {product.datasheet && (
              <Card className="card-industrial">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-accent" />
                    <div>
                      <h4 className="font-semibold text-foreground">Teknik Dokuman</h4>
                      <p className="text-sm text-muted-foreground">PDF Datasheet</p>
                    </div>
                  </div>
                  <a
                    href={product.datasheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Indir
                  </a>
                </div>
              </Card>
            )}

            {/* B2B Form */}
            {showB2BForm && (
              <Card className="card-industrial border-accent">
                <h3 className="text-xl font-bold text-foreground mb-4">Toptan Fiyat Teklifi Talep Formu</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Şirket Adı *
                    </label>
                    <input
                      type="text"
                      placeholder="Şirket adınızı giriniz"
                      value={b2bData.companyName}
                      onChange={(e) => setB2BData({ ...b2bData, companyName: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        placeholder="E-posta adresiniz"
                        value={b2bData.email}
                        onChange={(e) => setB2BData({ ...b2bData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        placeholder="Telefon numaranız"
                        value={b2bData.phone}
                        onChange={(e) => setB2BData({ ...b2bData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Paketleme Türü
                    </label>
                    <select
                      value={b2bData.packagingType}
                      onChange={(e) => setB2BData({ ...b2bData, packagingType: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="koli">Koli Bazlı</option>
                      <option value="palet">Palet Bazlı</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Miktar (Koli/Palet)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={b2bData.quantity}
                      onChange={(e) => setB2BData({ ...b2bData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleB2BSubmit}
                      disabled={submitB2BQuoteMutation.isPending}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
                    >
                      {submitB2BQuoteMutation.isPending ? "Gonderiliyor..." : "Teklif Talep Gönder"}
                    </Button>
                    <Button
                      onClick={() => setShowB2BForm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      İptal
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
