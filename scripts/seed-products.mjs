import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 1,
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('//')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'yazanlar_grup',
});

const categories = [
  { name: 'NDT Sarfları', slug: 'ndt', description: 'Tahribatsız muayene malzemeleri ve test ekipmanları', icon: 'AlertCircle' },
  { name: 'Kaynak & Alaşım', slug: 'welding', description: 'Özel kaynak telleri ve alaşım ürünleri', icon: 'Zap' },
  { name: 'Yapı Kimyasalları', slug: 'construction', description: 'İleri yapı kimyasalları ve sabitleyiciler', icon: 'Beaker' },
  { name: 'Yüzey İşlem', slug: 'surface', description: 'Yüzey işlem ve aşındırıcı ürünleri', icon: 'Wrench' },
  { name: 'İş Güvenliği', slug: 'safety', description: 'Nitelikli iş güvenliği ekipmanları', icon: 'Shield' },
];

const products = [
  // NDT Sarfları (10 ürün)
  {
    categorySlug: 'ndt',
    name: 'Penetrant Test Spreyi - Kırmızı',
    technicalCode: 'PT-500-RED',
    material: 'Kimyasal Penetrant',
    certification: 'ISO 3104',
    price: 250,
    quantity: 150,
    specs: { viskozite: '10-15 cSt', parlamaNoktası: '>100°C', yoğunluk: '0.85 g/cm³', renk: 'Kırmızı' }
  },
  {
    categorySlug: 'ndt',
    name: 'Penetrant Test Spreyi - Sarı',
    technicalCode: 'PT-500-YEL',
    material: 'Kimyasal Penetrant',
    certification: 'ISO 3104',
    price: 250,
    quantity: 120,
    specs: { viskozite: '10-15 cSt', parlamaNoktası: '>100°C', yoğunluk: '0.85 g/cm³', renk: 'Sarı' }
  },
  {
    categorySlug: 'ndt',
    name: 'Manyetik Parçacık Tozu - Kırmızı',
    technicalCode: 'MPT-100-RED',
    material: 'Demir Oksit',
    certification: 'ASTM E1316',
    price: 180,
    quantity: 200,
    specs: { parcacik: '1-10 μm', yoğunluk: '2.8 g/cm³', renk: 'Kırmızı' }
  },
  {
    categorySlug: 'ndt',
    name: 'Manyetik Parçacık Tozu - Sarı',
    technicalCode: 'MPT-100-YEL',
    material: 'Demir Oksit',
    certification: 'ASTM E1316',
    price: 180,
    quantity: 180,
    specs: { parcacik: '1-10 μm', yoğunluk: '2.8 g/cm³', renk: 'Sarı' }
  },
  {
    categorySlug: 'ndt',
    name: 'UT Jeli - Standart',
    technicalCode: 'UTJ-1L',
    material: 'Polimer Jel',
    certification: 'ISO 2409',
    price: 95,
    quantity: 300,
    specs: { viskozite: 'Yüksek', iletkenlik: 'İyi', sicaklik: '-10 ile +50°C' }
  },
  {
    categorySlug: 'ndt',
    name: 'UT Jeli - Yüksek Sıcaklık',
    technicalCode: 'UTJ-HT',
    material: 'Polimer Jel',
    certification: 'ISO 2409',
    price: 145,
    quantity: 100,
    specs: { viskozite: 'Yüksek', iletkenlik: 'Mükemmel', sicaklik: '-20 ile +80°C' }
  },
  {
    categorySlug: 'ndt',
    name: 'Temizleme Spreyi - Penetrant Kalıntı',
    technicalCode: 'CLS-500',
    material: 'Organik Çözücü',
    certification: 'ISO 3104',
    price: 120,
    quantity: 250,
    specs: { buharlas: 'Hızlı', kalintilar: 'Minimum', kokusuz: 'Evet' }
  },
  {
    categorySlug: 'ndt',
    name: 'Geliştirici Toz - Beyaz',
    technicalCode: 'DEV-WH',
    material: 'Titanyum Dioksit',
    certification: 'ASTM E1417',
    price: 210,
    quantity: 80,
    specs: { parcacik: '5-50 μm', yoğunluk: '3.9 g/cm³', renk: 'Beyaz' }
  },
  {
    categorySlug: 'ndt',
    name: 'Kalibrasyonu Kontrol Bloğu',
    technicalCode: 'CAL-STD',
    material: 'Çelik',
    certification: 'ISO 6506',
    price: 450,
    quantity: 30,
    specs: { boyut: '50x50x50 mm', sertlik: '58-62 HRC', hassasiyet: '±0.01 mm' }
  },
  {
    categorySlug: 'ndt',
    name: 'Floresans Penetrant Spreyi',
    technicalCode: 'FPT-500',
    material: 'Floresans Penetrant',
    certification: 'ISO 3104',
    price: 320,
    quantity: 60,
    specs: { parlaklık: 'Yüksek', dalga: '365 nm', süresi: '8-10 saat' }
  },

  // Kaynak & Alaşım (10 ürün)
  {
    categorySlug: 'welding',
    name: 'IN718 Uyumlu TIG Teli - 1.6mm',
    technicalCode: 'ER308L-1.6',
    material: 'Nikel Alaşımı',
    certification: 'AWS A5.14',
    price: 450,
    quantity: 500,
    specs: { cap: '1.6 mm', cekme: '480 MPa', akma: '170 MPa', uzama: '%35' }
  },
  {
    categorySlug: 'welding',
    name: 'IN718 Uyumlu TIG Teli - 2.4mm',
    technicalCode: 'ER308L-2.4',
    material: 'Nikel Alaşımı',
    certification: 'AWS A5.14',
    price: 480,
    quantity: 350,
    specs: { cap: '2.4 mm', cekme: '480 MPa', akma: '170 MPa', uzama: '%35' }
  },
  {
    categorySlug: 'welding',
    name: 'Gümüş Kaynak Pastası - %45',
    technicalCode: 'AG-45',
    material: 'Gümüş %45',
    certification: 'DIN 1707',
    price: 520,
    quantity: 150,
    specs: { erimeSıcaklığı: '780°C', dayanim: '250 MPa', akışkanlık: 'İyi' }
  },
  {
    categorySlug: 'welding',
    name: 'Gümüş Kaynak Pastası - %56',
    technicalCode: 'AG-56',
    material: 'Gümüş %56',
    certification: 'DIN 1707',
    price: 680,
    quantity: 100,
    specs: { erimeSıcaklığı: '720°C', dayanim: '300 MPa', akışkanlık: 'Mükemmel' }
  },
  {
    categorySlug: 'welding',
    name: 'Bakır Kaynak Teli',
    technicalCode: 'CU-WIRE',
    material: 'Bakır',
    certification: 'AWS A5.6',
    price: 280,
    quantity: 400,
    specs: { cap: '1.2 mm', erimeSıcaklığı: '1083°C', iletkenlik: 'Mükemmel' }
  },
  {
    categorySlug: 'welding',
    name: 'Alüminyum Kaynak Teli - 5356',
    technicalCode: 'AL-5356',
    material: 'Alüminyum',
    certification: 'AWS A5.10',
    price: 320,
    quantity: 300,
    specs: { cap: '1.6 mm', erimeSıcaklığı: '600°C', dayanim: '215 MPa' }
  },
  {
    categorySlug: 'welding',
    name: 'Kaynakçı Eldiveni - Deri',
    technicalCode: 'WLD-GLV-L',
    material: 'Sığır Derisi',
    certification: 'EN 12477',
    price: 150,
    quantity: 200,
    specs: { sicaklik: '300°C', boyut: 'L', esneklik: 'İyi' }
  },
  {
    categorySlug: 'welding',
    name: 'Kaynak Masası - Mıknatıslı',
    technicalCode: 'WLD-TBL-MAG',
    material: 'Çelik',
    certification: 'ISO 1101',
    price: 1200,
    quantity: 20,
    specs: { boyut: '1000x500 mm', mıknatıs: 'Güçlü', taşıma: '50 kg' }
  },
  {
    categorySlug: 'welding',
    name: 'Kaynak Masası - Standart',
    technicalCode: 'WLD-TBL-STD',
    material: 'Çelik',
    certification: 'ISO 1101',
    price: 800,
    quantity: 30,
    specs: { boyut: '1000x500 mm', yükseklik: 'Ayarlanabilir', taşıma: '100 kg' }
  },
  {
    categorySlug: 'welding',
    name: 'Elektrot - E6013',
    technicalCode: 'ELC-E6013',
    material: 'Çelik',
    certification: 'AWS A5.1',
    price: 180,
    quantity: 500,
    specs: { cap: '3.2 mm', dayanim: '430 MPa', akma: '345 MPa' }
  },

  // Yapı Kimyasalları (10 ürün)
  {
    categorySlug: 'construction',
    name: 'Epoksi Akrilat Dübel - M12',
    technicalCode: 'EA-M12',
    material: 'Epoksi Reçine',
    certification: 'ETA',
    price: 320,
    quantity: 200,
    specs: { cekme: '15 kN', kesme: '12 kN', kuruma: '30 dakika' }
  },
  {
    categorySlug: 'construction',
    name: 'Epoksi Akrilat Dübel - M16',
    technicalCode: 'EA-M16',
    material: 'Epoksi Reçine',
    certification: 'ETA',
    price: 380,
    quantity: 150,
    specs: { cekme: '25 kN', kesme: '20 kN', kuruma: '30 dakika' }
  },
  {
    categorySlug: 'construction',
    name: 'Poliüretan Mastik - 500ml',
    technicalCode: 'PU-500',
    material: 'Poliüretan',
    certification: 'ISO 11600',
    price: 280,
    quantity: 300,
    specs: { elastiklik: '%25', dayaniklilik: '20 yıl', renk: 'Gri' }
  },
  {
    categorySlug: 'construction',
    name: 'Poliüretan Mastik - 1L',
    technicalCode: 'PU-1L',
    material: 'Poliüretan',
    certification: 'ISO 11600',
    price: 450,
    quantity: 200,
    specs: { elastiklik: '%25', dayaniklilik: '20 yıl', renk: 'Beyaz' }
  },
  {
    categorySlug: 'construction',
    name: 'Beton Tamir Harcı - 25kg',
    technicalCode: 'CRT-25',
    material: 'Çimento Bazlı',
    certification: 'EN 1504-3',
    price: 95,
    quantity: 500,
    specs: { dayanim: '30 MPa', kuruma: '24 saat', renk: 'Gri' }
  },
  {
    categorySlug: 'construction',
    name: 'Beton Tamir Harcı - 50kg',
    technicalCode: 'CRT-50',
    material: 'Çimento Bazlı',
    certification: 'EN 1504-3',
    price: 160,
    quantity: 300,
    specs: { dayanim: '30 MPa', kuruma: '24 saat', renk: 'Gri' }
  },
  {
    categorySlug: 'construction',
    name: 'Yapıştırıcı - Yapı Taşı',
    technicalCode: 'ADH-STONE',
    material: 'Polimer Modifiye',
    certification: 'EN 12004',
    price: 180,
    quantity: 400,
    specs: { acikZaman: '15 dakika', dayanim: '1 MPa', renk: 'Gri' }
  },
  {
    categorySlug: 'construction',
    name: 'Sızdırmazlık Bantı - Köpük',
    technicalCode: 'SL-FOAM',
    material: 'Polyethylene Köpük',
    certification: 'EN 12114',
    price: 45,
    quantity: 600,
    specs: { genişlik: '10 mm', kalınlık: '5 mm', sıkıştırma: '%50' }
  },
  {
    categorySlug: 'construction',
    name: 'Epoksi Reçine - 2 Komponentli',
    technicalCode: 'EPS-2K',
    material: 'Epoksi',
    certification: 'ISO 2114',
    price: 380,
    quantity: 100,
    specs: { karışım: '1:1', kuruma: '24 saat', dayanim: '50 MPa' }
  },
  {
    categorySlug: 'construction',
    name: 'Astar - Beton İçin',
    technicalCode: 'PRM-CONC',
    material: 'Polimer Bazlı',
    certification: 'EN 1062-1',
    price: 220,
    quantity: 250,
    specs: { kapsama: '10 m²/L', kuruma: '4 saat', renk: 'Beyaz' }
  },

  // Yüzey İşlem (10 ürün)
  {
    categorySlug: 'surface',
    name: 'Cam Küreciği Kumlama Kumu - 120 mesh',
    technicalCode: 'GK-120',
    material: 'Cam',
    certification: 'ISO 11126',
    price: 150,
    quantity: 400,
    specs: { granul: '120 mesh', sertlik: '5.5 Mohs', yoğunluk: '2.5 g/cm³' }
  },
  {
    categorySlug: 'surface',
    name: 'Cam Küreciği Kumlama Kumu - 80 mesh',
    technicalCode: 'GK-80',
    material: 'Cam',
    certification: 'ISO 11126',
    price: 140,
    quantity: 350,
    specs: { granul: '80 mesh', sertlik: '5.5 Mohs', yoğunluk: '2.5 g/cm³' }
  },
  {
    categorySlug: 'surface',
    name: 'Zirkonyum Flap Disk - 125mm',
    technicalCode: 'ZF-125',
    material: 'Zirkonyum',
    certification: 'ISO 13696',
    price: 95,
    quantity: 600,
    specs: { cap: '125 mm', tane: '60', dayaniklilik: 'Uzun' }
  },
  {
    categorySlug: 'surface',
    name: 'Zirkonyum Flap Disk - 180mm',
    technicalCode: 'ZF-180',
    material: 'Zirkonyum',
    certification: 'ISO 13696',
    price: 140,
    quantity: 400,
    specs: { cap: '180 mm', tane: '60', dayaniklilik: 'Uzun' }
  },
  {
    categorySlug: 'surface',
    name: 'Alüminyum Oksit Zımpara - 120',
    technicalCode: 'AO-120',
    material: 'Alüminyum Oksit',
    certification: 'ISO 6344',
    price: 75,
    quantity: 800,
    specs: { tane: '120', boyut: '230x280 mm', dayaniklilik: 'Standart' }
  },
  {
    categorySlug: 'surface',
    name: 'Alüminyum Oksit Zımpara - 80',
    technicalCode: 'AO-80',
    material: 'Alüminyum Oksit',
    certification: 'ISO 6344',
    price: 70,
    quantity: 900,
    specs: { tane: '80', boyut: '230x280 mm', dayaniklilik: 'Standart' }
  },
  {
    categorySlug: 'surface',
    name: 'Paslanmaz Çelik Fırçası',
    technicalCode: 'SSB-WIRE',
    material: 'Paslanmaz Çelik',
    certification: 'ISO 8992',
    price: 85,
    quantity: 500,
    specs: { cap: '0.3 mm', sertlik: 'Orta', kullanım: 'Elden' }
  },
  {
    categorySlug: 'surface',
    name: 'Demir Oksit Toz - Kırmızı',
    technicalCode: 'IO-RED',
    material: 'Demir Oksit',
    certification: 'ISO 12944',
    price: 120,
    quantity: 300,
    specs: { parcacik: '1-10 μm', yoğunluk: '2.8 g/cm³', renk: 'Kırmızı' }
  },
  {
    categorySlug: 'surface',
    name: 'Yüzey Hazırlama Ajanı',
    technicalCode: 'SPA-500',
    material: 'Organik Çözücü',
    certification: 'ISO 8501',
    price: 180,
    quantity: 250,
    specs: { buharlas: 'Hızlı', kalintilar: 'Minimum', koku: 'Hafif' }
  },
  {
    categorySlug: 'surface',
    name: 'Cilalama Pastası - Profesyonel',
    technicalCode: 'POL-PRO',
    material: 'Polimer Bazlı',
    certification: 'ISO 6270',
    price: 220,
    quantity: 200,
    specs: { parlaklık: 'Yüksek', dayaniklilik: '6 ay', renk: 'Beyaz' }
  },

  // İş Güvenliği (10 ürün)
  {
    categorySlug: 'safety',
    name: 'Kevlar Dikişli Argon Eldiveni - L',
    technicalCode: 'KE-L',
    material: 'Kevlar',
    certification: 'EN 407',
    price: 180,
    quantity: 300,
    specs: { sicaklik: '500°C', boyut: 'L', esneklik: 'İyi' }
  },
  {
    categorySlug: 'safety',
    name: 'Kevlar Dikişli Argon Eldiveni - XL',
    technicalCode: 'KE-XL',
    material: 'Kevlar',
    certification: 'EN 407',
    price: 180,
    quantity: 250,
    specs: { sicaklik: '500°C', boyut: 'XL', esneklik: 'İyi' }
  },
  {
    categorySlug: 'safety',
    name: 'Aktif Karbon Gaz Maskesi - P100',
    technicalCode: 'ACM-P100',
    material: 'Aktif Karbon',
    certification: 'NIOSH P100',
    price: 210,
    quantity: 400,
    specs: { filtre: 'P100', koruma: '%99.97', omur: '40 saat' }
  },
  {
    categorySlug: 'safety',
    name: 'Aktif Karbon Gaz Maskesi - N95',
    technicalCode: 'ACM-N95',
    material: 'Aktif Karbon',
    certification: 'NIOSH N95',
    price: 45,
    quantity: 1000,
    specs: { filtre: 'N95', koruma: '%95', omur: '8 saat' }
  },
  {
    categorySlug: 'safety',
    name: 'Emniyet Gözlüğü - Koruyucu',
    technicalCode: 'SGG-PROT',
    material: 'Polycarbonate',
    certification: 'EN 166',
    price: 85,
    quantity: 600,
    specs: { etkilenme: 'Yüksek', UV: 'Korumalı', buğu: 'Önleyici' }
  },
  {
    categorySlug: 'safety',
    name: 'Emniyet Gözlüğü - Kaynak',
    technicalCode: 'SGG-WELD',
    material: 'Polycarbonate',
    certification: 'EN 166',
    price: 120,
    quantity: 400,
    specs: { koyu: 'DIN 11', UV: 'Tam Korumalı', buğu: 'Önleyici' }
  },
  {
    categorySlug: 'safety',
    name: 'Koruyucu Elbise - Tam Vücut',
    technicalCode: 'PPE-SUIT',
    material: 'Polyester',
    certification: 'EN 11612',
    price: 250,
    quantity: 200,
    specs: { sicaklik: '300°C', boyut: 'M-XXL', renk: 'Beyaz' }
  },
  {
    categorySlug: 'safety',
    name: 'Güvenlik Ayakkabısı - Çelik Burun',
    technicalCode: 'SAF-SHOE',
    material: 'Deri',
    certification: 'EN ISO 20345',
    price: 320,
    quantity: 150,
    specs: { burun: 'Çelik', taban: 'Kaymaz', boyut: '36-48' }
  },
  {
    categorySlug: 'safety',
    name: 'İşitme Koruyucu - Kulak Tıkacı',
    technicalCode: 'EAR-PLUG',
    material: 'Silikon',
    certification: 'EN 352-2',
    price: 35,
    quantity: 1000,
    specs: { azaltma: '30 dB', malzeme: 'Yumuşak', yeniden: 'Kullanilabilir' }
  },
  {
    categorySlug: 'safety',
    name: 'Emniyet Kemeri - Tam Vücut',
    technicalCode: 'HARNESS-FB',
    material: 'Polyester',
    certification: 'EN 361',
    price: 450,
    quantity: 100,
    specs: { kapasite: '150 kg', baglanti: 'Coklu', ayarlama: 'Kolay' }
  }
];

async function seedDatabase() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Kategoriler ekleniyor...');
    for (const category of categories) {
      await connection.execute(
        'INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)',
        [category.name, category.slug, category.description, category.icon]
      );
    }
    console.log('✓ Kategoriler eklendi');

    console.log('Ürünler ekleniyor...');
    for (const product of products) {
      const categoryResult = await connection.execute(
        'SELECT id FROM categories WHERE slug = ?',
        [product.categorySlug]
      );
      
      if (categoryResult[0].length > 0) {
        const categoryId = categoryResult[0][0].id;
        await connection.execute(
          'INSERT INTO products (categoryId, name, technicalCode, material, certification, price, quantity, inStock, technicalSpecs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            categoryId,
            product.name,
            product.technicalCode,
            product.material,
            product.certification,
            product.price,
            product.quantity,
            true,
            JSON.stringify(product.specs)
          ]
        );
      }
    }
    console.log('✓ Ürünler eklendi');

    console.log('\n✅ Veritabanı başarıyla dolduruldu!');
    console.log(`- ${categories.length} kategori`);
    console.log(`- ${products.length} ürün`);
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedDatabase();
