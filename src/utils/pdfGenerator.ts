import { jsPDF } from 'jspdf';
import { ColoringBook } from '../types';

/**
 * Converts any image DataURL (including SVG or PNG) into a canvas-backed PNG data URL
 * so jsPDF can reliably embed it into the PDF without format errors.
 */
async function rasterizeImageForPdf(dataUrl: string): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Use high-resolution canvas for crisp print quality
      const canvas = document.createElement('canvas');
      const targetWidth = Math.max(img.width || 1200, 1200);
      const targetHeight = Math.max(img.height || 1600, 1600);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve({ dataUrl, width: img.width, height: img.height });
      }
      // Fill white background for print
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const pngDataUrl = canvas.toDataURL('image/png', 0.95);
      resolve({ dataUrl: pngDataUrl, width: targetWidth, height: targetHeight });
    };
    img.onerror = (e) => {
      console.warn('Image rasterization warning:', e);
      resolve({ dataUrl, width: 800, height: 1000 });
    };
    img.src = dataUrl;
  });
}

export async function generateColoringBookPdf(
  book: ColoringBook,
  onProgress?: (step: number, total: number, message: string) => void
): Promise<Blob> {
  const totalSteps = book.pages.length + 1;
  onProgress?.(1, totalSteps, 'Designing custom cover page...');

  // Standard US Letter (8.5 x 11 in => 215.9 x 279.4 mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 215.9 mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 279.4 mm
  const margin = 12;

  // ----------------------------------------------------
  // 1. COVER PAGE
  // ----------------------------------------------------
  // Decorative double border
  pdf.setDrawColor(20, 20, 20);
  pdf.setLineWidth(1.8);
  pdf.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, 'S');

  pdf.setLineWidth(0.6);
  pdf.rect(margin + 2.5, margin + 2.5, pageWidth - (margin + 2.5) * 2, pageHeight - (margin + 2.5) * 2, 'S');

  // Corner decorative marks
  const cornerSize = 8;
  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    pdf.setLineWidth(1.2);
    pdf.line(x, y, x + dx * cornerSize, y);
    pdf.line(x, y, x, y + dy * cornerSize);
    pdf.circle(x + dx * (cornerSize / 2), y + dy * (cornerSize / 2), 1, 'FD');
  };
  drawCorner(margin + 5, margin + 5, 1, 1);
  drawCorner(pageWidth - margin - 5, margin + 5, -1, 1);
  drawCorner(margin + 5, pageHeight - margin - 5, 1, -1);
  drawCorner(pageWidth - margin - 5, pageHeight - margin - 5, -1, -1);

  // Top Badge / Header Ribbon
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(80, 80, 80);
  pdf.text('SPECIAL LIMITED EDITION COLORING BOOK', pageWidth / 2, margin + 14, { align: 'center' });

  // Main Book Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(15, 15, 15);
  const titleLines = pdf.splitTextToSize(book.coverTitle.toUpperCase(), pageWidth - margin * 4);
  pdf.text(titleLines, pageWidth / 2, margin + 26, { align: 'center' });

  const titleHeightOffset = (titleLines.length - 1) * 10;

  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(70, 70, 70);
  pdf.text(book.coverSubtitle || 'A 5-Page Thick-Line Art Adventure', pageWidth / 2, margin + 35 + titleHeightOffset, { align: 'center' });

  // Featured Illustration on Cover (Page 1 preview)
  try {
    const coverArt = await rasterizeImageForPdf(book.pages[0]?.imageUrl || '');
    const imgBoxWidth = 135;
    const imgBoxHeight = 135;
    const imgBoxX = (pageWidth - imgBoxWidth) / 2;
    const imgBoxY = margin + 44 + titleHeightOffset;

    // Drawing frame around preview
    pdf.setDrawColor(30, 30, 30);
    pdf.setLineWidth(1.2);
    pdf.roundedRect(imgBoxX, imgBoxY, imgBoxWidth, imgBoxHeight, 4, 4, 'S');

    pdf.addImage(coverArt.dataUrl, 'PNG', imgBoxX + 2, imgBoxY + 2, imgBoxWidth - 4, imgBoxHeight - 4);
  } catch (err) {
    console.warn('Cover preview image rasterization skipped:', err);
  }

  // "This Book Belongs To" interactive nameplate
  const nameplateY = pageHeight - margin - 48;
  pdf.setDrawColor(40, 40, 40);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(margin + 20, nameplateY, pageWidth - (margin + 20) * 2, 28, 4, 4, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  pdf.text('THIS COLORING BOOK BELONGS TO:', pageWidth / 2, nameplateY + 8, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(10, 10, 10);
  pdf.text(book.childName.toUpperCase(), pageWidth / 2, nameplateY + 18, { align: 'center' });

  // Underline for child's signature / coloring
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(120, 120, 120);
  pdf.line(pageWidth / 2 - 40, nameplateY + 21, pageWidth / 2 + 40, nameplateY + 21);

  // Footer Dedication & Date
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    `${book.coverDedication || `Created especially for ${book.childName}`} • Printed on ${book.createdAt}`,
    pageWidth / 2,
    pageHeight - margin - 8,
    { align: 'center' }
  );

  // ----------------------------------------------------
  // 2. FIVE COLORING PAGES
  // ----------------------------------------------------
  for (let i = 0; i < book.pages.length; i++) {
    const page = book.pages[i];
    onProgress?.(i + 2, totalSteps, `Rendering Page ${i + 1} of ${book.pages.length}: ${page.title}...`);

    pdf.addPage();

    // Outer thick print border
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(1.4);
    pdf.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, 'S');

    // Page Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(20, 20, 20);
    pdf.text(page.title.toUpperCase(), pageWidth / 2, margin + 11, { align: 'center' });

    pdf.setLineWidth(0.4);
    pdf.line(pageWidth / 2 - 35, margin + 14, pageWidth / 2 + 35, margin + 14);

    // Rasterize and place image
    try {
      const pageArt = await rasterizeImageForPdf(page.imageUrl);
      const artAreaWidth = pageWidth - margin * 2 - 12; // ~179.9 mm
      const artAreaHeight = 188; // generous height for 3:4 portrait
      const artX = margin + 6;
      const artY = margin + 17;

      // Inner image bounding box
      pdf.setDrawColor(20, 20, 20);
      pdf.setLineWidth(0.6);
      pdf.rect(artX, artY, artAreaWidth, artAreaHeight, 'S');

      pdf.addImage(pageArt.dataUrl, 'PNG', artX + 1, artY + 1, artAreaWidth - 2, artAreaHeight - 2);
    } catch (err) {
      console.warn(`Error drawing page ${i + 1} art to PDF:`, err);
    }

    // Rhyme / Story Caption Box at bottom
    const captionBoxY = pageHeight - margin - 38;
    const captionBoxHeight = 26;
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(0.6);
    pdf.roundedRect(margin + 6, captionBoxY, pageWidth - (margin + 6) * 2, captionBoxHeight, 3, 3, 'S');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10.5);
    pdf.setTextColor(40, 40, 40);
    const captionLines = pdf.splitTextToSize(page.rhymeCaption, pageWidth - (margin + 12) * 2);
    pdf.text(captionLines, pageWidth / 2, captionBoxY + 8, { align: 'center' });

    // Footer with Page Number & Child Name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    pdf.text(
      `ColorCraft Studio • Page ${i + 1} of ${book.pages.length} • Made for ${book.childName}`,
      pageWidth / 2,
      pageHeight - margin - 4,
      { align: 'center' }
    );
  }

  onProgress?.(totalSteps, totalSteps, 'Compiling printable PDF...');
  return pdf.output('blob');
}

export function downloadBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 200);
}
