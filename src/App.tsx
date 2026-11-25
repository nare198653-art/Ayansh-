import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BookCreatorForm } from './components/BookCreatorForm';
import { BookPreview } from './components/BookPreview';
import { AiChatDrawer } from './components/AiChatDrawer';
import { ColoringBook, ColoringPage, ImageResolution, AgeGroup } from './types';
import { generateDemoBook, getVectorLineArtSvg, formatCoverTitle, buildPagePrompt } from './utils/coloringLogic';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [book, setBook] = useState<ColoringBook>(() => generateDemoBook('Leo', 'space dinosaurs', '1K'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasCreatedCustomBook, setHasCreatedCustomBook] = useState(false);
  const [quotaAlert, setQuotaAlert] = useState<string | null>(null);

  // Check for autostart URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setHasCreatedCustomBook(true);
    }
  }, []);

  const handleLoadDemo = (theme?: string, name?: string) => {
    const demo = generateDemoBook(name || 'Leo', theme || 'space dinosaurs', '1K');
    setBook(demo);
    setHasCreatedCustomBook(true);
  };

  const handleGenerateBook = async (params: {
    childName: string;
    theme: string;
    imageSize: ImageResolution;
    ageGroup: AgeGroup;
  }) => {
    setIsGenerating(true);
    setProgressStep('Outlining 5 story scenes...');

    try {
      // Step 1: Call server plan generation API
      let planData: any = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const planRes = await fetch('/api/coloring-book/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (planRes.ok) {
          planData = await planRes.json();
        }
      } catch {
        // Fallback to local vector generation
      }

      // Prepare 5 pages structure
      const pages: ColoringPage[] = [];
      const planPages = planData?.pages && Array.isArray(planData.pages) && planData.pages.length >= 5
        ? planData.pages
        : null;

      const coverTitle = planData?.coverTitle || formatCoverTitle(params.childName, params.theme);
      const coverSubtitle = planData?.coverSubtitle || 'A 5-Page Thick-Line Coloring Adventure';

      // Build placeholder pages
      for (let i = 0; i < 5; i++) {
        const defaultPage = planPages ? planPages[i] : null;
        const pageTitle = defaultPage?.title || `Adventure Scene ${i + 1}`;
        const sceneDesc = defaultPage?.sceneDescription || `Fun scene featuring ${params.theme} for ${params.childName}`;
        const rhyme = defaultPage?.rhymeCaption || `Color this scene so bright and grand,\nThe happiest magic in all the land!`;
        
        pages.push({
          id: `page-${Date.now()}-${i + 1}`,
          pageNumber: i + 1,
          title: pageTitle,
          sceneDescription: sceneDesc,
          rhymeCaption: rhyme,
          imageUrl: getVectorLineArtSvg(i, params.theme, params.childName),
          isGenerating: true,
        });
      }

      const initialBook: ColoringBook = {
        id: `book-${Date.now()}`,
        childName: params.childName,
        theme: params.theme,
        ageGroup: params.ageGroup,
        imageSize: params.imageSize,
        coverTitle,
        coverSubtitle,
        coverDedication: `Specially crafted for ${params.childName} • Happy Coloring!`,
        pages,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setBook(initialBook);
      setHasCreatedCustomBook(true);

      // Step 2: Generate thick-line art images for each of the 5 pages
      let hasHitQuota = false;
      for (let i = 0; i < 5; i++) {
        if (hasHitQuota) {
          // Immediately resolve remaining pages to vector art without making doomed API calls
          setBook((prev) => {
            const nextPages = [...prev.pages];
            nextPages[i] = { ...nextPages[i], isGenerating: false };
            return { ...prev, pages: nextPages };
          });
          continue;
        }

        setProgressStep(`Illustrating Page ${i + 1} of 5 (${pages[i].title})...`);
        const fullPrompt = buildPagePrompt(params.theme, pages[i].title, pages[i].sceneDescription, params.ageGroup);

        try {
          const imgRes = await fetch('/api/coloring-book/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: fullPrompt,
              theme: params.theme,
              childName: params.childName,
              imageSize: params.imageSize,
              pageIndex: i,
            }),
          });

          if (imgRes.ok) {
            const imgData = await imgRes.json();
            if (imgData.quotaExceeded) {
              hasHitQuota = true;
              setQuotaAlert('Using crisp vector line art. Select a billing-enabled API key in Settings > Secrets to enable live Gemini 3 Pro image generation.');
            }

            if (imgData.imageUrl && !imgData.useFallback) {
              setBook((prev) => {
                const nextPages = [...prev.pages];
                nextPages[i] = {
                  ...nextPages[i],
                  imageUrl: imgData.imageUrl,
                  isGenerating: false,
                };
                return { ...prev, pages: nextPages };
              });
              continue;
            }
          }
        } catch {
          // Silent fallback to vector line art
        }

        // Fallback: keep vector SVG art and clear isGenerating
        setBook((prev) => {
          const nextPages = [...prev.pages];
          nextPages[i] = {
            ...nextPages[i],
            isGenerating: false,
          };
          return { ...prev, pages: nextPages };
        });
      }
    } catch (error) {
      console.error('Book generation failed:', error);
    } finally {
      setIsGenerating(false);
      setProgressStep('');
    }
  };

  const handleRegeneratePage = async (pageIndex: number) => {
    const targetPage = book.pages[pageIndex];
    if (!targetPage) return;

    // Mark as generating
    setBook((prev) => {
      const nextPages = [...prev.pages];
      nextPages[pageIndex] = { ...nextPages[pageIndex], isGenerating: true };
      return { ...prev, pages: nextPages };
    });

    try {
      const fullPrompt = buildPagePrompt(
        book.theme,
        targetPage.title,
        `${targetPage.sceneDescription} (alternative fresh composition)`,
        book.ageGroup
      );

      const res = await fetch('/api/coloring-book/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          theme: book.theme,
          childName: book.childName,
          imageSize: book.imageSize,
          pageIndex,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl && !data.useFallback) {
          setBook((prev) => {
            const nextPages = [...prev.pages];
            nextPages[pageIndex] = {
              ...nextPages[pageIndex],
              imageUrl: data.imageUrl,
              isGenerating: false,
            };
            return { ...prev, pages: nextPages };
          });
          return;
        }
      }
    } catch (err) {
      console.error('Failed to regenerate page:', err);
    }

    setBook((prev) => {
      const nextPages = [...prev.pages];
      nextPages[pageIndex] = { ...nextPages[pageIndex], isGenerating: false };
      return { ...prev, pages: nextPages };
    });
  };

  const handleUpdateCaption = (pageIndex: number, newTitle: string, newCaption: string) => {
    setBook((prev) => {
      const nextPages = [...prev.pages];
      nextPages[pageIndex] = {
        ...nextPages[pageIndex],
        title: newTitle,
        rhymeCaption: newCaption,
      };
      return { ...prev, pages: nextPages };
    });
  };

  const handleUpdateCover = (newTitle: string, newSubtitle: string) => {
    setBook((prev) => ({
      ...prev,
      coverTitle: newTitle,
      coverSubtitle: newSubtitle,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Top Header */}
      <Header
        onToggleChat={() => setIsChatOpen((prev) => !prev)}
        isChatOpen={isChatOpen}
        onResetToNew={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* Step 1: Book Creation Form */}
        <BookCreatorForm
          onGenerate={handleGenerateBook}
          onLoadDemo={handleLoadDemo}
          isGenerating={isGenerating}
          progressStep={progressStep}
        />

        {/* Informative Quota / Engine Notice */}
        {quotaAlert && (
          <div className="max-w-3xl mx-auto -mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs flex items-center justify-between gap-3 text-xs text-amber-900 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <span>{quotaAlert}</span>
            </div>
            <button
              onClick={() => setQuotaAlert(null)}
              className="text-amber-700 hover:text-amber-950 font-bold px-2 py-1 rounded-lg hover:bg-amber-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step 2: Book Preview Showcase */}
        {book && (
          <BookPreview
            book={book}
            onRegeneratePage={handleRegeneratePage}
            onUpdateCaption={handleUpdateCaption}
            onUpdateCover={handleUpdateCover}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-amber-200/80 bg-white/80 py-8 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-['Fredoka',sans-serif] font-bold text-stone-700">
            <span>ColorCraft Studio</span>
            <span className="text-amber-500">•</span>
            <span className="font-normal text-stone-500">5-Page Children's Coloring Book Maker</span>
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted for little imaginations everywhere</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </footer>

      {/* Multi-turn AI Assistant Drawer */}
      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        childName={book.childName}
        currentTheme={book.theme}
        onApplyThemeSuggestion={(t) => {
          // Can apply directly
          handleLoadDemo(t, book.childName);
        }}
      />
    </div>
  );
}
