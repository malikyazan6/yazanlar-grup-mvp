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
      quickView: "Hızlı Görünüm",
      technicalCode: "Teknik Kod",
      material: "Malzeme",
      certification: "Sertifikasyon",
      price: "Fiyat",
      unitPrice: "Adet fiyatı",
      quantity: "Miktar",
      inStock: "Stokta Var",
      outOfStock: "Stokta Yok",
      addToCart: "Sepete Ekle",
      requestQuote: "Toptan Fiyat Teklifi Al",
      technicalSpecs: "Teknik Özellikler",
      downloadDatasheet: "Datasheet İndir",
      addToFavorites: "Favorilere Ekle",
      removeFromFavorites: "Favorilerden Çıkar",
      share: "Paylaş",
      shareVia: "Şu yolla paylaş:",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-2xl font-bold">{t.quickView}</DialogTitle>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 min-h-[300px]">
            {product.image ? (
              <img
                src={product.image}
                alt={language === 'tr' ? product.name_tr : product.name_en}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-muted-foreground text-center">
                <FileText className="w-16 h-16 mx-auto mb-2" />
                  <p>{language === 'tr' ? 'Görsel Yok' : 'No Image'}</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{language === 'tr' ? product.name_tr : product.name_en}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t.technicalCode}: <span className="font-semibold text-foreground">{product.technicalCode}</span>
              </p>
            </div>

            {/* Basic Info */}
            <div className="space-y-2 pb-4 border-b border-border">
              <p className="text-sm">
                <strong>{t.material}:</strong> {product.material}
              </p>
              <p className="text-sm">
                <strong>{t.certification}:</strong> {product.certification}
              </p>
              <p className="text-sm">
                <strong>Stok:</strong>{" "}
                <span className={product.inStock ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {product.inStock ? t.inStock : t.outOfStock}
                </span>
              </p>
            </div>

            {/* Technical Specs */}
            <div className="pb-4 border-b border-border">
              <h3 className="font-bold text-foreground mb-2">{t.technicalSpecs}</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(language === 'tr' ? (product.specs_tr || product.specs) : (product.specs_en || product.specs)).map(([key, value]) => (
                  <p key={key}>
                    <strong className="capitalize">{key}:</strong> {String(value)}
                  </p>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="pb-4 border-b border-border">
              <p className="text-3xl font-bold text-accent">{product.price} ₺</p>
              <p className="text-xs text-muted-foreground">{t.unitPrice}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold">{t.quantity}:</label>
              <div className="flex items-center gap-2 border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted"
                >
                  -
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(product);
                  }
                  onClose();
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
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
                className="flex-1"
              >
                {t.requestQuote}
              </Button>
            </div>

            {/* Favorites and Share Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddToFavorites}
                variant="outline"
                className={`flex-1 flex items-center justify-center gap-2 ${
                  isFavorite ? "bg-red-50 border-red-300 text-red-600" : ""
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? t.removeFromFavorites : t.addToFavorites}
              </Button>

              <div className="relative flex-1">
                <Button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t.share}
                </Button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50 min-w-[200px]">
                    <div className="p-2">
                      <p className="text-xs font-semibold text-muted-foreground px-2 py-1">{t.shareVia}</p>
                      <button
                        onClick={() => handleShare("whatsapp")}
                        className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                      >
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                      >
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare("email")}
                        className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                      >
                        Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Download Datasheet */}
            {product.datasheet && (
              <Button
                onClick={() => window.open(product.datasheet, "_blank")}
                variant="ghost"
                className="w-full text-accent hover:text-accent/80"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t.downloadDatasheet}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
