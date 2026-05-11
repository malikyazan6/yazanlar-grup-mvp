export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    // Header & Navigation
    header: {
      title: 'Yazanlar Grup',
      categories: 'Kategoriler',
      cart: 'Sepet',
      language: 'Dil',
    },
    
    // Home Page
    home: {
      heroTitle: 'Mühendislik Tedarik Portalı',
      heroSubtitle: 'Endüstriyel ürünlerde güvenilir çözüm ortağınız',
      discoverProducts: 'Ürünleri Keşfet',
      shopProducts: 'ÜRÜNLERI KEŞFET',
      browseSolutions: 'ÇÖZÜMLERI GÖZAT',
      categoriesTitle: 'Ürün Kategorileri',
      trustBadges: {
        quality: 'Sertifikalı Ürünler',
        delivery: 'Hızlı Teslimat',
        security: 'Güvenli Alışveriş',
        wholesale: 'Toptan Fiyatlar',
      },
      ctaTitle: 'Toptan Alım İçin Teklif Al',
      ctaSubtitle: 'Kurumsal alımlar için özel fiyatlandırma ve hızlı teslimat hizmetleri',
      requestQuote: 'Teklif Talep Et',
      footer: '© 2026 Yazanlar Limited Şirketi. Tüm hakları saklıdır.',
    },

    // Categories
    categories: {
      ndt: 'NDT Sarfları',
      ndtDesc: 'Tahribatsız muayene malzemeleri ve test ekipmanları',
      welding: 'Kaynak & Alaşım',
      weldingDesc: 'Özel kaynak telleri ve alaşım ürünleri',
      construction: 'Yapı Kimyasalları',
      constructionDesc: 'İleri yapı kimyasalları ve sabitleyiciler',
      surface: 'Yüzey İşlem',
      surfaceDesc: 'Yüzey işlem ve aşındırıcı ürünleri',
      safety: 'İş Güvenliği',
      safetyDesc: 'Nitelikli iş güvenliği ekipmanları',
      productsFound: 'ürün bulundu',
      filters: 'Filtreleri Temizle',
      priceRange: 'Fiyat Aralığı',
      certification: 'Sertifikasyon',
      all: 'Tümü',
    },

    // Product Detail
    product: {
      backButton: 'Geri Dön',
      inStock: 'Stokta Mevcut',
      outOfStock: 'Stokta Yok',
      price: 'Fiyat',
      quantity: 'Miktar',
      addToCart: 'Sepete Ekle',
      requestQuote: 'Toptan Fiyat Teklifi Al',
      technicalSpecs: 'Teknik Özellikler',
      downloadDatasheet: 'Datasheet İndir',
      technicalCode: 'Teknik Kod',
      material: 'Malzeme',
      certification: 'Sertifikasyon',
      b2bForm: {
        title: 'Toptan Fiyat Teklifi',
        packagingType: 'Paketleme Türü',
        koli: 'Koli',
        palet: 'Palet',
        quantity: 'Miktar',
        companyName: 'Şirket Adı',
        email: 'E-posta',
        phone: 'Telefon',
        submit: 'Teklif Gönder',
        cancel: 'İptal',
      },
      notifications: {
        addedToCart: 'Ürün sepete eklendi!',
        quoteSent: 'Teklif talebiniz gönderildi!',
      },
    },

    // Cart
    cart: {
      title: 'Alışveriş Sepeti',
      empty: 'Sepetiniz boş',
      continueShopping: 'Alışverişe Devam Et',
      product: 'Ürün',
      quantity: 'Miktar',
      price: 'Fiyat',
      total: 'Toplam',
      remove: 'Sil',
      checkout: 'Ödemeye Geç',
      subtotal: 'Ara Toplam',
      tax: 'KDV (%18)',
      grandTotal: 'Genel Toplam',
    },

    // Common
    common: {
      loading: 'Yükleniyor...',
      error: 'Hata oluştu',
      success: 'Başarılı',
      cancel: 'İptal',
      submit: 'Gönder',
      close: 'Kapat',
      required: 'Gerekli alan',
    },
  },

  en: {
    // Header & Navigation
    header: {
      title: 'Yazanlar Group',
      categories: 'Categories',
      cart: 'Cart',
      language: 'Language',
    },

    // Home Page
    home: {
      heroTitle: 'Engineering Supply Portal',
      heroSubtitle: 'Your trusted partner in industrial products',
      discoverProducts: 'Discover Products',
      shopProducts: 'SHOP PRODUCTS',
      browseSolutions: 'BROWSE SOLUTIONS',
      categoriesTitle: 'Product Categories',
      trustBadges: {
        quality: 'Certified Products',
        delivery: 'Fast Delivery',
        security: 'Secure Shopping',
        wholesale: 'Wholesale Prices',
      },
      ctaTitle: 'Request a Quote for Bulk Orders',
      ctaSubtitle: 'Special pricing and fast delivery services for corporate purchases',
      requestQuote: 'Request Quote',
      footer: '© 2026 Yazanlar Limited Company. All rights reserved.',
    },

    // Categories
    categories: {
      ndt: 'NDT Supplies',
      ndtDesc: 'Non-destructive testing materials and equipment',
      welding: 'Welding & Alloys',
      weldingDesc: 'Specialized welding wires and alloy products',
      construction: 'Construction Chemicals',
      constructionDesc: 'Advanced construction chemicals and adhesives',
      surface: 'Surface Treatment',
      surfaceDesc: 'Surface treatment and abrasive products',
      safety: 'Safety Equipment',
      safetyDesc: 'Professional safety equipment and PPE',
      productsFound: 'products found',
      filters: 'Clear Filters',
      priceRange: 'Price Range',
      certification: 'Certification',
      all: 'All',
    },

    // Product Detail
    product: {
      backButton: 'Go Back',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      price: 'Price',
      quantity: 'Quantity',
      addToCart: 'Add to Cart',
      requestQuote: 'Request Wholesale Quote',
      technicalSpecs: 'Technical Specifications',
      downloadDatasheet: 'Download Datasheet',
      technicalCode: 'Technical Code',
      material: 'Material',
      certification: 'Certification',
      b2bForm: {
        title: 'Wholesale Quote Request',
        packagingType: 'Packaging Type',
        koli: 'Box',
        palet: 'Pallet',
        quantity: 'Quantity',
        companyName: 'Company Name',
        email: 'Email',
        phone: 'Phone',
        submit: 'Send Quote',
        cancel: 'Cancel',
      },
      notifications: {
        addedToCart: 'Product added to cart!',
        quoteSent: 'Your quote request has been sent!',
      },
    },

    // Cart
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      product: 'Product',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      remove: 'Remove',
      checkout: 'Proceed to Checkout',
      subtotal: 'Subtotal',
      tax: 'Tax (18%)',
      grandTotal: 'Grand Total',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      submit: 'Submit',
      close: 'Close',
      required: 'Required field',
    },
  },
};

export function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let value: any = translations[lang];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Fallback to path if translation not found
    }
  }
  
  return typeof value === 'string' ? value : path;
}
