import React, { useState } from 'react';
import {
  Download,
  Printer,
  Sparkles,
  Paintbrush,
  RefreshCw,
  BookOpen,
  LayoutGrid,
  FileText,
  ChevronLeft,
  ChevronRight,
  Heart,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ColoringBook, ColoringPage } from '../types';
import { generateColoringBookPdf, downloadBlobAsFile } from '../utils/pdfGenerator';
import { ColoringCanvasModal } from './ColoringCanvasModal';

interface BookPreviewProps {
  book: ColoringBook;
  onRegeneratePage: (pageIndex: number) => Promise<void>;
  onUpdateCaption: (pageIndex: number, newTitle: string, newCaption: string) => void;
  onUpdateCover: (newTitle: string, newSubtitle: string) => void;
}

export const BookPreview: React.FC<BookPreviewProps> = ({
  book,
  onRegeneratePage,
  onUpdateCaption,
  onUpdateCover,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'flip'>('grid');
  const [currentFlipIndex, setCurrentFlipIndex] = useState<number>(0);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfProgressText, setPdfProgressText] = useState<string>('');
  const [activeColoringPage, setActiveColoringPage] = useState<ColoringPage | null>(null);
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingCaption, setEditingCaption] = useState<string>('');
  const [isEditingCover, setIsEditingCover] = useState<boolean>(false);
  const [coverTitleInput, setCoverTitleInput] = useState<string>(book.coverTitle);
  const [coverSubtitleInput, setCoverSubtitleInput] = useState<string>(book.coverSubtitle);

  // Trigger PDF Generation & Confetti Celebration
  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      setPdfProgressText('Preparing print layout...');

      const pdfBlob = await generateColoringBookPdf(book, (step, total, msg) => {
        setPdfProgressText(`${msg} (${Math.round((step / total) * 100)}%)`);
      });

      const filename = `${book.childName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-coloring-book.pdf`;
      downloadBlobAsFile(pdfBlob, filename);

      // Launch cheerful confetti celebration!
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
      });
    } catch (err) {
      console.error('Failed to create PDF:', err);
      alert('Could not compile PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
      setPdfProgressText('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStartEditPage = (index: number) => {
    setEditingPageIndex(index);
    setEditingTitle(book.pages[index].title);
    setEditingCaption(book.pages[index].rhymeCaption);
  };

  const handleSaveEditPage = () => {
    if (editingPageIndex !== null) {
      onUpdateCaption(editingPageIndex, editingTitle, editingCaption);
      setEditingPageIndex(null);
    }
  };

  const handleDownloadSingleImage = (page: ColoringPage) => {
    const link = document.createElement('a');
    link.href = page.imageUrl;
    link.download = `${book.childName.toLowerCase()}-page-${page.pageNumber}-${page.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    link.click();
  };

  return (
    <section className="space-y-8" aria-label="Generated Coloring Book">
      {/* Book Studio Action Header */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-md p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>5-Page Book Ready</span>
            </span>
            <span className="text-xs font-semibold text-stone-500">
              Quality: <span className="text-amber-700 font-bold">{book.imageSize}</span>
            </span>
          </div>
          <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {book.coverTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-700">
            {book.coverDedication}
          </p>
        </div>

        {/* Action Buttons: PDF Download, Print, Layout Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">All Pages</span>
            </button>
            <button
              onClick={() => setViewMode('flip')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'flip'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              aria-label="Flipbook View"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Flipbook</span>
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
            aria-label="Print coloring pages"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Primary Download Full PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-['Fredoka',sans-serif] text-base font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Download Full Coloring Book PDF"
          >
            {isExportingPdf ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs sm:text-sm">{pdfProgressText || 'Compiling PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Full PDF (6 Pages)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. CUSTOM COVER SHOWCASE CARD */}
      {/* ---------------------------------------------------- */}
      <div className="bg-linear-to-b from-amber-100/80 via-white to-amber-50 rounded-3xl border-3 border-amber-300 shadow-xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Cover Spine / Mockup Frame */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white rounded-2xl p-5 border-4 border-stone-900 shadow-2xl relative aspect-[3/4] flex flex-col justify-between text-center select-none">
              {/* Outer decorative line */}
              <div className="absolute inset-2 border-2 border-dashed border-amber-400 rounded-xl pointer-events-none" />

              {/* Cover Top */}
              <div className="pt-2 z-10">
                <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  Custom Edition
                </span>
                <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-stone-900 leading-tight mt-2 px-2 uppercase">
                  {book.coverTitle}
                </h3>
                <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                  {book.coverSubtitle}
                </p>
              </div>

              {/* Center Cover Art Thumbnail */}
              <div className="my-auto z-10 px-4">
                <div className="w-32 h-32 mx-auto rounded-xl border-2 border-stone-900 overflow-hidden bg-white shadow-md p-1">
                  <img
                    src={book.pages[0]?.imageUrl}
                    alt="Cover Featured Art"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Cover Bottom: Belongs To Plate */}
              <div className="pb-2 z-10">
                <div className="bg-stone-50 border border-stone-300 rounded-lg py-1.5 px-2">
                  <p className="text-[9px] font-bold text-stone-500 uppercase">This Book Belongs To</p>
                  <p className="text-base font-['Fredoka',sans-serif] font-bold text-amber-700 uppercase">
                    {book.childName}
                  </p>
                </div>
                <p className="text-[9px] text-stone-700 mt-1">
                  Printed • 5 Thick-Line Art Pages
                </p>
              </div>
            </div>
          </div>

          {/* Cover Info & Customization */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/70 text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Personalized Printable Cover Page</span>
            </div>

            <h3 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-bold text-stone-900">
              Ready for Crayons, Markers & Little Hands
            </h3>

            <p className="text-sm text-stone-700 leading-relaxed">
              This cover page is included as Page 1 of your downloaded PDF! It features an interactive nameplate for{' '}
              <strong className="text-amber-900 font-bold">{book.childName}</strong> to practice writing their name or coloring the title banner.
            </p>

            {/* Quick stats checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 shadow-2xs">
                <span className="block text-xl font-['Fredoka',sans-serif] font-bold text-amber-600">5</span>
                <span className="text-xs font-semibold text-stone-700">Distinct Pages</span>
              </div>
              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 shadow-2xs">
                <span className="block text-xl font-['Fredoka',sans-serif] font-bold text-indigo-600">Thick</span>
                <span className="text-xs font-semibold text-stone-700">Crisp Outlines</span>
              </div>
              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 shadow-2xs col-span-2 sm:col-span-1">
                <span className="block text-xl font-['Fredoka',sans-serif] font-bold text-emerald-600">Rhymes</span>
                <span className="text-xs font-semibold text-stone-700">Story Captions</span>
              </div>
            </div>

            {/* Edit Cover Details Toggle */}
            <div className="pt-2">
              {isEditingCover ? (
                <div className="p-4 bg-white rounded-2xl border border-amber-300 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Book Title</label>
                    <input
                      type="text"
                      value={coverTitleInput}
                      onChange={(e) => setCoverTitleInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={coverSubtitleInput}
                      onChange={(e) => setCoverSubtitleInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold text-stone-800"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingCover(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onUpdateCover(coverTitleInput, coverSubtitleInput);
                        setIsEditingCover(false);
                      }}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
                    >
                      Save Cover
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingCover(true)}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Customize Cover Title & Subtitle</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. FIVE COLORING PAGES DISPLAY */}
      {/* ---------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-['Fredoka',sans-serif] text-2xl font-bold text-stone-900">
              Inside the Book (5 Pages)
            </h3>
            <p className="text-xs sm:text-sm text-stone-700">
              Each page is formatted for printable US Letter and A4 with safe margins and rhyming poetry.
            </p>
          </div>
        </div>

        {/* View Mode: Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {book.pages.map((page, index) => (
              <div
                key={page.id}
                className="bg-white rounded-3xl border-2 border-stone-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all p-5 flex flex-col justify-between group"
              >
                {/* Page Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Page {page.pageNumber} of {book.pages.length}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEditPage(index)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
                      title="Edit title & rhyme"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRegeneratePage(index)}
                      disabled={page.isGenerating}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors disabled:opacity-50"
                      title="Regenerate this page art"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${page.isGenerating ? 'animate-spin text-amber-600' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Page Title */}
                <h4 className="font-['Fredoka',sans-serif] text-lg font-bold text-stone-900 mb-2 truncate">
                  {page.title}
                </h4>

                {/* Main Coloring Art Frame */}
                <div className="relative bg-white rounded-2xl border-3 border-stone-900 shadow-inner p-2 my-2 aspect-[3/4] flex items-center justify-center overflow-hidden">
                  {page.isGenerating ? (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="text-xs font-bold text-amber-800">Generating New Art...</span>
                    </div>
                  ) : (
                    <img
                      src={page.imageUrl}
                      alt={page.title}
                      className="w-full h-full object-contain select-none"
                    />
                  )}

                  {/* Hover "Color Online" Floating Button */}
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => setActiveColoringPage(page)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-['Fredoka',sans-serif] text-sm font-bold shadow-lg flex items-center gap-1.5 cursor-pointer transform hover:scale-105 transition-all"
                    >
                      <Paintbrush className="w-4 h-4" />
                      <span>Color Online</span>
                    </button>
                    <button
                      onClick={() => handleDownloadSingleImage(page)}
                      className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-900 shadow-lg cursor-pointer"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Rhyme Caption Box */}
                <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center">
                  <p className="text-xs font-medium text-stone-800 whitespace-pre-line italic">
                    "{page.rhymeCaption}"
                  </p>
                </div>

                {/* Quick Action footer */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveColoringPage(page)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Paintbrush className="w-3.5 h-3.5" />
                    <span>Open Magic Coloring Tool</span>
                  </button>
                  <button
                    onClick={() => handleDownloadSingleImage(page)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Save PNG</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode: Flipbook (Single Page at a time) */}
        {viewMode === 'flip' && (
          <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-xl p-6 sm:p-8 max-w-2xl mx-auto flex flex-col items-center">
            {/* Flip Header */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Page {book.pages[currentFlipIndex].pageNumber} of {book.pages.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentFlipIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentFlipIndex === 0}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5 text-stone-700" />
                </button>
                <button
                  onClick={() => setCurrentFlipIndex((prev) => Math.min(book.pages.length - 1, prev + 1))}
                  disabled={currentFlipIndex === book.pages.length - 1}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-5 h-5 text-stone-700" />
                </button>
              </div>
            </div>

            {/* Flip Art */}
            <h4 className="font-['Fredoka',sans-serif] text-2xl font-bold text-stone-900 mb-2 text-center">
              {book.pages[currentFlipIndex].title}
            </h4>

            <div className="w-full max-w-md bg-white rounded-2xl border-4 border-stone-900 shadow-xl p-4 aspect-[3/4] flex items-center justify-center my-3">
              <img
                src={book.pages[currentFlipIndex].imageUrl}
                alt={book.pages[currentFlipIndex].title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Rhyme caption */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center my-2">
              <p className="text-sm font-medium text-stone-800 whitespace-pre-line italic">
                "{book.pages[currentFlipIndex].rhymeCaption}"
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => setActiveColoringPage(book.pages[currentFlipIndex])}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-['Fredoka',sans-serif] font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Paintbrush className="w-4 h-4" />
                <span>Color Online</span>
              </button>
              <button
                onClick={() => handleDownloadSingleImage(book.pages[currentFlipIndex])}
                className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm border border-stone-200 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save PNG</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. EDIT PAGE MODAL (if open) */}
      {/* ---------------------------------------------------- */}
      {editingPageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-amber-200 shadow-2xl space-y-4">
            <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-stone-900">
              Edit Page {editingPageIndex + 1}
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Page Title</label>
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 font-medium text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Rhyming Caption</label>
              <textarea
                value={editingCaption}
                onChange={(e) => setEditingCaption(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 font-medium text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingPageIndex(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditPage}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. DIGITAL COLORING MODAL (if active) */}
      {/* ---------------------------------------------------- */}
      {activeColoringPage && (
        <ColoringCanvasModal
          page={activeColoringPage}
          childName={book.childName}
          onClose={() => setActiveColoringPage(null)}
        />
      )}
    </section>
  );
};
