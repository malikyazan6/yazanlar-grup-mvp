import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
  try {
    console.log('PDF olusturma basladi:', quoteData);

    // Veri dogrulama
    if (!quoteData.items || quoteData.items.length === 0) {
      console.error('Urun listesi bos!');
      alert('Lutfen en az bir urun secin.');
      return;
    }

    // PDF belgesi olustur - basit ve stabil
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 15;
    const marginRight = 15;
    const marginTop = 15;
    const contentWidth = pageWidth - marginLeft - marginRight;

    let yPosition = marginTop;

    // ===== ANTET (BASIT METIN) =====
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text('YAZANLAR GRUP', marginLeft, yPosition);
    
    yPosition += 5;
    doc.setFontSize(10);
    doc.setTextColor(113, 113, 122);
    doc.text('B2B Ihtisas Pazar Yeri', marginLeft, yPosition);

    // Sag uste tarih ve teklif no
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const today = new Date();
    const formattedDate = today.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const quoteNumber = `YZN-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;

    doc.text(`Tarih: ${formattedDate}`, pageWidth - marginRight, yPosition, { align: 'right' });
    doc.text(`Teklif No: ${quoteNumber}`, pageWidth - marginRight, yPosition + 5, { align: 'right' });

    yPosition += 15;

    // ===== BASLIK =====
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text('FIYAT TEKLIFI (PROFORMA INVOICE)', marginLeft, yPosition);

    yPosition += 10;

    // ===== MUSTERI BILGILERI =====
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text('MUSTERI BILGILERI', marginLeft, yPosition);

    yPosition += 6;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    if (quoteData.companyName) {
      doc.text(`Sirket: ${quoteData.companyName}`, marginLeft, yPosition);
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

    yPosition += 8;

    // ===== URUN TABLOSU (autoTable) =====
    const tableData = quoteData.items.map((item, index) => [
      (index + 1).toString(),
      item.name || 'N/A',
      item.technicalCode || 'N/A',
      item.quantity.toString(),
      `${(item.price || 0).toFixed(2)} TL`,
      `${((item.price || 0) * (item.quantity || 0)).toFixed(2)} TL`
    ]);

    console.log('Tablo verisi hazir:', tableData);

    // autoTable kullan - stabil yontem
    (doc as any).autoTable({
      head: [['Sira', 'Urun Adi', 'Teknik Kod', 'Miktar', 'Birim Fiyat', 'Toplam']],
      body: tableData,
      startY: yPosition,
      margin: { left: marginLeft, right: marginRight, top: marginTop, bottom: 20 },
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center' as const,
        valign: 'middle' as const
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [0, 0, 0],
        valign: 'middle' as const
      },
      alternateRowStyles: {
        fillColor: [245, 245, 250]
      },
      columnStyles: {
        0: { halign: 'center' as const, cellWidth: 12 },
        1: { halign: 'left' as const },
        2: { halign: 'center' as const, cellWidth: 22 },
        3: { halign: 'center' as const, cellWidth: 15 },
        4: { halign: 'right' as const, cellWidth: 22 },
        5: { halign: 'right' as const, cellWidth: 22 }
      },
      didDrawPage: (data: any) => {
        // Sayfa altinda footer
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Sayfa ${data.pageNumber}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    });

    yPosition = (doc as any).lastAutoTable?.finalY || yPosition + 50;
    yPosition += 10;

    // ===== TOPLAM TUTARLAR =====
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const totalLabelX = marginLeft;
    const totalValueX = pageWidth - marginRight;

    // Ara Toplam
    doc.text('Ara Toplam:', totalLabelX, yPosition);
    doc.text(`${(quoteData.totalAmount || 0).toFixed(2)} TL`, totalValueX, yPosition, { align: 'right' });

    yPosition += 7;

    // KDV
    const kdvAmount = (quoteData.totalAmount || 0) * 0.18;
    doc.text('KDV (%18):', totalLabelX, yPosition);
    doc.text(`${kdvAmount.toFixed(2)} TL`, totalValueX, yPosition, { align: 'right' });

    yPosition += 7;

    // Genel Toplam
    doc.setFontSize(11);
    doc.setFontStyle('bold');
    doc.setTextColor(30, 58, 138);
    const grandTotal = (quoteData.totalAmount || 0) + kdvAmount;
    doc.text('GENEL TOPLAM:', totalLabelX, yPosition);
    doc.text(`${grandTotal.toFixed(2)} TL`, totalValueX, yPosition, { align: 'right' });

    yPosition += 12;

    // ===== NOTLAR =====
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFontStyle('normal');
    
    const notesText = 'Bu teklif 30 gun gecerlidir. Fiyatlar KDV haric olup degisiklige tabi tutulabilir. Siparis icin lutfen iletisime geciniz.';
    doc.text(notesText, marginLeft, yPosition, { maxWidth: contentWidth });

    // PDF'i indir - garantili
    console.log('PDF kaydediliyor:', `Yazanlar-Grup-Teklif-${quoteNumber}.pdf`);
    doc.save(`Yazanlar-Grup-Teklif-${quoteNumber}.pdf`);
    console.log('PDF basariyla indirildi!');

  } catch (error) {
    console.error('PDF olusturma hatasi:', error);
    console.error('Hata detayi:', error instanceof Error ? error.message : String(error));
    alert('PDF olusturulurken bir hata olustur. Lutfen tarayici konsolunu kontrol edin ve daha sonra tekrar deneyin.');
  }
};
