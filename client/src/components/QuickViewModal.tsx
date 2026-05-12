import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, FileText, Heart, Share2 } from "lucide-react";
import { Product } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onRequestQuote,
}: QuickViewModalProps) {
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const isFav = favorites.find((fav: any) => fav.id === product.id);
      setIsFavorite(!!isFav);
    }
  }, [product]);

  const handleAddToFavorites = () => {
    if (!product) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFav = favorites.find((fav: any) => fav.id === product.id);

    if (isFav) {
      const updated = favorites.filter((fav: any) => fav.id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(product);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleShare = (platform: string) => {
    if (!product) return;
    const url = `${window.location.origin}/product/${product.id}`;
    const text = `${product.name} - ${product.technicalCode}`;

    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
      setShowShareMenu(false);
    }
  };

  if (!product) return null;

  const translations = {
    tr: {
      quickView: "Hizli Gorunum",
      technicalCode: "Teknik Kod",
      material: "Malzeme",
      certification: "Sertifikasyon",
      price: "Fiyat",
      unitPrice: "Adet fiyati",
      quantity: "Miktar",
      inStock: "Stokta Var",
      outOfStock: "Stokta Yok",
      addToCart: "Sepete Ekle",
      requestQuote: "Toptan Fiyat Teklifi Al",
      technicalSpecs: "Teknik Ozellikler",
      downloadDatasheet: "Datasheet Indir",
      addToFavorites: "Favorilere Ekle",
      removeFromFavorites: "Favorilerden Cikar",
      share: "Paylas",
      shareVia: "Su yolla paylas:",
    },
    en: {
      quickView: "Quick View",
      technicalCode: "Technical Code",
      material: "Material",
      certification: "Certification",
      price: "Price",
      unitPrice: "Unit Price",
      quantity: "Quantity",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      addToCart: "Add to Cart",
      requestQuote: "Request Bulk Quote",
      technicalSpecs: "Technical Specifications",
      downloadDatasheet: "Download Datasheet",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      share: "Share",
      shareVia: "Share via:",
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-4 pb-0">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-2xl font-bold">{t.quickView}</DialogTitle>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-60px)]">
          {/* DIKEY YERLESIM: Gorsel Ust, Detaylar Alt */}
          <div className="flex flex-col gap-6 p-6">
            
            {/* GORSEL ALANI - SABIT ORAN (3:4) */}
            <div className="w-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden">
              <div className="w-full aspect-[3/4] flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={language === 'tr' ? product.name_tr : product.name_en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground text-center p-4">
                    <FileText className="w-16 h-16 mx-auto mb-2" />
                    <p>{language === 'tr' ? 'Gorsel Yok' : 'No Image'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* DETAYLAR ALANI */}
            <div className="space-y-5">
              
              {/* Baslik ve Kod */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {language === 'tr' ? product.name_tr : product.name_en}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t.technicalCode}: <span className="font-semibold text-foreground">{product.technicalCode}</span>
                </p>
              </div>

              {/* Temel Bilgiler */}
              <div className="space-y-3 pb-4 border-b border-border">
                <p className="text-sm">
                  <strong>{t.material}:</strong> <span className="text-foreground">{product.material}</span>
                </p>
                <p className="text-sm">
                  <strong>{t.certification}:</strong> <span className="text-foreground">{product.certification}</span>
                </p>
                <p className="text-sm">
                  <strong>Stok:</strong>{" "}
                  <span className={product.inStock ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {product.inStock ? t.inStock : t.outOfStock}
                  </span>
                </p>
              </div>

              {/* Teknik Ozellikler */}
              <div className="pb-4 border-b border-border">
                <h3 className="font-bold text-foreground mb-3">{t.technicalSpecs}</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(language === 'tr' ? (product.specs_tr || product.specs) : (product.specs_en || product.specs)).map(([key, value]) => (
                    <p key={key} className="flex justify-between">
                      <strong className="capitalize text-muted-foreground">{key}:</strong>
                      <span className="text-foreground font-medium">{String(value)}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Fiyat */}
              <div className="pb-4 border-b border-border">
                <p className="text-3xl font-bold text-accent">{product.price} TL</p>
                <p className="text-xs text-muted-foreground mt-1">{t.unitPrice}</p>
              </div>

              {/* MIKTAR SECIMI */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <label className="text-sm font-semibold whitespace-nowrap">{t.quantity}:</label>
                <div className="flex items-center gap-2 border border-border rounded-lg bg-background">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition-colors font-semibold"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-muted transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* DIKEY BUTON YAPISI - TAMAMIYLA RESPONSIVE */}
              <div className="flex flex-col gap-3">
                
                {/* Ana Islem Butonlari - Alt Alta */}
                <Button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                    onClose();
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 py-6 text-base"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t.addToCart}
                </Button>

                <Button
                  onClick={() => {
                    onRequestQuote(product);
                    onClose();
                  }}
                  variant="outline"
                  className="w-full py-6 text-base"
                >
                  {t.requestQuote}
                </Button>

                {/* Favori ve Paylas Butonlari - Alt Alta */}
                <Button
                  onClick={handleAddToFavorites}
                  variant="outline"
                  className={`w-full flex items-center justify-center gap-2 py-6 transition-colors ${
                    isFavorite ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100" : ""
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                  <span>{isFavorite ? t.removeFromFavorites : t.addToFavorites}</span>
                </Button>

                <div className="relative w-full">
                  <Button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-6"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{t.share}</span>
                  </Button>

                  {/* Paylas Menusu */}
                  {showShareMenu && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <p className="text-xs font-semibold text-muted-foreground px-2 py-2">{t.shareVia}</p>
                        <button
                          onClick={() => handleShare("whatsapp")}
                          className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm transition-colors"
                        >
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare("twitter")}
                          className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm transition-colors"
                        >
                          Twitter
                        </button>
                        <button
                          onClick={() => handleShare("facebook")}
                          className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm transition-colors"
                        >
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare("email")}
                          className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm transition-colors"
                        >
                          Email
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Datasheet Indir */}
                {product.datasheet && (
                  <Button
                    onClick={() => window.open(product.datasheet, "_blank")}
                    variant="ghost"
                    className="w-full text-accent hover:text-accent/80 hover:bg-accent/10 py-6"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t.downloadDatasheet}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
