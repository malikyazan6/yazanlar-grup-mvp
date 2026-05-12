import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface QuoteItem {
  id: number;
  name: string;
  technicalCode: string;
  price: number;
  quantity: number;
}

export interface QuoteData {
  items: QuoteItem[];
  totalAmount: number;
  customerName?: string;
  customerEmail?: string;
  companyName?: string;
}

export const generateQuotePDF = (quoteData: QuoteData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Sayfa genişliği ve marjinler
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 15;
  const marginRight = 15;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let yPosition = 15;

  // ===== ANTET (HEADER) =====
  // Yazanlar Grup Logosu SVG olarak metin
  doc.setFontSize(24);
  doc.setTextColor(30, 58, 138); // Derin Lacivert
  doc.text('YAZANLAR', marginLeft, yPosition);
  
  doc.setFontSize(10);
  doc.setTextColor(113, 113, 122); // Çelik Grisi
  doc.text('GRUP', marginLeft, yPosition + 6);

  // Şirket bilgileri sağ tarafta
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  const headerRightX = pageWidth - marginRight;
  doc.text('Yazanlar Grup B2B', headerRightX, yPosition, { align: 'right' });
  doc.text('İhtisas Pazar Yeri', headerRightX, yPosition + 5, { align: 'right' });
  doc.text('www.yazanlargrup.com', headerRightX, yPosition + 10, { align: 'right' });

  yPosition += 20;

  // ===== BAŞLIK =====
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('FİYAT TEKLİFİ (PROFORMA INVOICE)', marginLeft, yPosition);

  yPosition += 10;

  // ===== TARİH VE REFERANS =====
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const today = new Date();
  const formattedDate = today.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const quoteNumber = `YZN-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;

  doc.text(`Tarih: ${formattedDate}`, marginLeft, yPosition);
  doc.text(`Teklif No: ${quoteNumber}`, marginLeft, yPosition + 6);

  yPosition += 15;

  // ===== MÜŞTERİ BİLGİLERİ =====
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('MÜŞTERİ BİLGİLERİ', marginLeft, yPosition);

  yPosition += 6;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  if (quoteData.companyName) {
    doc.text(`Şirket: ${quoteData.companyName}`, marginLeft, yPosition);
    yPosition += 5;
  }
  
  if (quoteData.customerName) {
    doc.text(`Ad Soyad: ${quoteData.customerName}`, marginLeft, yPosition);
    yPosition += 5;
  }
  
  if (quoteData.customerEmail) {
    doc.text(`E-posta: ${quoteData.customerEmail}`, marginLeft, yPosition);
    yPosition += 5;
  }

  yPosition += 5;

  // ===== ÜRÜN TABLOSU =====
  const tableData = quoteData.items.map((item, index) => [
    (index + 1).toString(),
    item.name,
    item.technicalCode,
    item.quantity.toString(),
    `₺ ${item.price.toFixed(2)}`,
    `₺ ${(item.price * item.quantity).toFixed(2)}`
  ]);

  autoTable(doc, {
    head: [['Sıra', 'Ürün Adı', 'Teknik Kod', 'Miktar', 'Birim Fiyat', 'Toplam']],
    body: tableData,
    startY: yPosition,
    margin: { left: marginLeft, right: marginRight },
    headStyles: {
      fillColor: [30, 58, 138], // Derin Lacivert
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [240, 240, 245]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'left' },
      2: { halign: 'center', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', cellWidth: 25 }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // ===== TOPLAM TUTARLAR =====
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  
  const totalLabelX = pageWidth - marginRight - 60;
  const totalValueX = pageWidth - marginRight;

  doc.text('Ara Toplam:', totalLabelX, yPosition, { align: 'left' });
  doc.text(`₺ ${quoteData.totalAmount.toFixed(2)}`, totalValueX, yPosition, { align: 'right' });

  yPosition += 8;
  doc.setFontSize(11);
  doc.setFontStyle('bold');
  doc.text('GENEL TOPLAM:', totalLabelX, yPosition, { align: 'left' });
  doc.text(`₺ ${quoteData.totalAmount.toFixed(2)}`, totalValueX, yPosition, { align: 'right' });

  yPosition += 12;

  // ===== NOTLAR =====
  doc.setFontSize(9);
  doc.setTextColor(113, 113, 122);
  doc.setFontStyle('normal');
  
  const notesText = 'Bu teklif 30 gün geçerlidir. Fiyatlar KDV hariçtir. Sipariş için lütfen iletişime geçiniz.';
  doc.text(notesText, marginLeft, yPosition, { maxWidth: contentWidth });

  yPosition += 15;

  // ===== İMZA ALANLARI =====
  doc.setFontSize(9);
  doc.text('Hazırlayan:', marginLeft, yPosition);
  doc.text('Onaylayan:', pageWidth / 2, yPosition);

  // PDF'i indir
  doc.save(`Yazanlar-Grup-Teklif-${quoteNumber}.pdf`);
};
