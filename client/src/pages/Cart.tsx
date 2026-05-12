import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Trash2, ShoppingCart, Zap, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateQuotePDF } from "@/lib/pdfQuoteService";

interface CartItem {
  id: number;
  name: string;
  price: number;
  technicalCode: string;
  quantity: number;
}

export default function Cart() {
  const [, navigate] = useLocation() as any;
  const { language, t } = useLanguage();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    setLoading(false);
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  const downloadQuote = () => {
    console.log('Sepet PDF indirme basladi, urun sayisi:', cartItems.length);
    
    if (cartItems.length === 0) {
      alert('Sepete urun ekleyin!');
      return;
    }

    const quoteItems = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      technicalCode: item.technicalCode,
      price: item.price,
      quantity: item.quantity
    }));

    console.log('Teklif verileri hazirlaniyor:', { quoteItems, subtotal });

    try {
      generateQuotePDF({
        items: quoteItems,
        totalAmount: subtotal,
        customerName: "Musteri",
        customerEmail: "info@yazanlargrup.com",
        companyName: "Yazanlar Grup B2B"
      });
      console.log('PDF indirme tamamlandi');
    } catch (error) {
      console.error('PDF indirme hatasi:', error);
      alert('PDF indirme sirasinda bir hata olustur.');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // %18 KDV
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

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
              {language === 'tr' ? 'Kategoriler' : 'Categories'}
            </button>
            <button 
              onClick={() => navigate("/cart")}
              className="text-foreground hover:text-primary transition-colors"
            >
              {language === 'tr' ? 'Sepet' : 'Cart'}
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
          {t('product.backButton')}
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-8">{t('cart.title')}</h1>

        {cartItems.length === 0 ? (
          <Card className="card-industrial text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h2>
            <p className="text-muted-foreground mb-6">{language === 'tr' ? 'Ürün eklemek için kategorilere göz atın' : 'Browse categories to add products'}</p>
            <Button 
              onClick={() => navigate("/categories/ndt")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {t('cart.continueShopping')}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <Card key={item.id} className="card-industrial">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {language === 'tr' ? 'Kod' : 'Code'}: {item.technicalCode}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">{language === 'tr' ? 'Miktar' : 'Quantity'}</p>
                          <div className="flex items-center gap-2 border border-border rounded-lg w-fit">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-background transition-colors"
                            >
                              −
                            </button>
                            <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-background transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">{language === 'tr' ? 'Birim Fiyat' : 'Unit Price'}</p>
                          <p className="text-lg font-semibold text-accent">{item.price} ₺</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">{language === 'tr' ? 'Toplam' : 'Total'}</p>
                          <p className="text-lg font-bold text-foreground">
                            {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="card-industrial sticky top-24">
                <h3 className="text-xl font-bold text-foreground mb-6">{language === 'tr' ? 'Sipariş Özeti' : 'Order Summary'}</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'tr' ? 'Ürünler:' : 'Products:'}</span>
                    <span className="font-semibold text-foreground">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)} {language === 'tr' ? 'adet' : 'items'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'tr' ? 'Ara Toplam:' : 'Subtotal:'}</span>
                    <span className="font-semibold text-foreground">
                      {subtotal.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'tr' ? 'KDV (%18):' : 'Tax (18%):'}</span>
                    <span className="font-semibold text-foreground">
                      {tax.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-foreground">{language === 'tr' ? 'Toplam:' : 'Total:'}</span>
                  <span className="text-2xl font-bold text-accent">
                    {total.toLocaleString('tr-TR')} ₺
                  </span>
                </div>

                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-3 py-6"
                >
                  {language === 'tr' ? 'Ödemeye Geç' : 'Proceed to Payment'}
                </Button>

                <Button 
                  onClick={downloadQuote}
                  variant="outline"
                  className="w-full py-6 mb-3 border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'tr' ? 'PDF Teklif İndir' : 'Download Quote PDF'}
                </Button>

                <Button 
                  onClick={() => navigate("/categories/ndt")}
                  variant="outline"
                  className="w-full py-6"
                >
                  {language === 'tr' ? 'Alışverişe Devam Et' : 'Continue Shopping'}
                </Button>

                <button
                  onClick={clearCart}
                  className="w-full mt-3 text-red-600 hover:text-red-700 transition-colors text-sm font-semibold"
                >
                  {language === 'tr' ? 'Sepeti Temizle' : 'Clear Cart'}
                </button>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
