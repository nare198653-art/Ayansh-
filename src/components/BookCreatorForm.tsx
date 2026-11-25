import React, { useState } from 'react';
import {
  Sparkles,
  Rocket,
  Wand2,
  BookMarked,
  Layers,
  Baby,
  Smile,
  Zap,
  HelpCircle
} from 'lucide-react';
import { ImageResolution, AgeGroup } from '../types';

interface BookCreatorFormProps {
  onGenerate: (data: {
    childName: string;
    theme: string;
    imageSize: ImageResolution;
    ageGroup: AgeGroup;
  }) => void;
  onLoadDemo: (theme?: string, name?: string) => void;
  isGenerating: boolean;
  progressStep: string;
}

const POPULAR_THEMES = [
  { label: '🚀 Space Dinosaurs', theme: 'space dinosaurs', desc: 'T-Rex astronauts & moon rovers' },
  { label: '🌊 Ocean Explorers', theme: 'deep ocean marine explorers', desc: 'Friendly whales & submarines' },
  { label: '🦄 Fairy Forest', theme: 'enchanted fairy forest', desc: 'Pixie trees & unicorn garden' },
  { label: '🦁 Safari Superheroes', theme: 'safari superhero animals', desc: 'Lion with cape & superhero rhinos' },
  { label: '🧁 Candy Kingdom', theme: 'candy castle adventure', desc: 'Lollipop trees & cupcake dragon' },
  { label: '🚜 Monster Trucks', theme: 'friendly construction trucks', desc: 'Big wheels digging for treasures' },
];

export const BookCreatorForm: React.FC<BookCreatorFormProps> = ({
  onGenerate,
  onLoadDemo,
  isGenerating,
  progressStep,
}) => {
  const [childName, setChildName] = useState('Leo');
  const [theme, setTheme] = useState('space dinosaurs');
  const [imageSize, setImageSize] = useState<ImageResolution>('1K');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('kids');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      setError("Please enter the child's name.");
      return;
    }
    if (!theme.trim()) {
      setError('Please provide a coloring book theme.');
      return;
    }
    setError(null);
    onGenerate({
      childName: childName.trim(),
      theme: theme.trim(),
      imageSize,
      ageGroup,
    });
  };

  const handleSelectTheme = (t: string) => {
    setTheme(t);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-xl shadow-amber-900/5 p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3 border border-amber-300">
          <Wand2 className="w-3.5 h-3.5 text-amber-600" />
          <span>AI-Powered Coloring Book Creator</span>
        </div>
        <h1 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-bold text-stone-900 mb-2 tracking-tight">
          Create a Personalized Coloring Book
        </h1>
        <p className="text-sm sm:text-base text-stone-700">
          Enter a child's name and any imaginative theme. We'll generate 5 thick-line art pages with rhyming captions and a custom cover page ready for PDF printing!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Child Name & Theme Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Child Name Input */}
          <div>
            <label htmlFor="childName" className="block text-sm font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-amber-600" />
              <span>Child's Name</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="childName"
              type="text"
              value={childName}
              onChange={(e) => {
                setChildName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Leo, Maya, Oliver"
              maxLength={30}
              disabled={isGenerating}
              className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none text-stone-800 font-medium placeholder:text-stone-400 transition-all bg-stone-50/50 focus:bg-white"
            />
            <p className="text-[11px] text-stone-700 mt-1">
              Appears on the custom cover page & dedication plate.
            </p>
          </div>

          {/* Theme Input */}
          <div>
            <label htmlFor="themeInput" className="block text-sm font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-indigo-600" />
              <span>Coloring Theme</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="themeInput"
              type="text"
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. space dinosaurs, ocean explorers"
              maxLength={80}
              disabled={isGenerating}
              className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none text-stone-800 font-medium placeholder:text-stone-400 transition-all bg-stone-50/50 focus:bg-white"
            />
            <p className="text-[11px] text-stone-700 mt-1">
              Generates 5 distinct thick-line story scenes.
            </p>
          </div>
        </div>

        {/* Quick Theme Chips */}
        <div>
          <span className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Popular Themes (Click to Pick)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {POPULAR_THEMES.map((item) => (
              <button
                key={item.theme}
                type="button"
                onClick={() => handleSelectTheme(item.theme)}
                disabled={isGenerating}
                className={`px-3 py-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                  theme.toLowerCase() === item.theme.toLowerCase()
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs'
                    : 'bg-stone-50/80 hover:bg-amber-50/60 border-stone-200 text-stone-700 font-medium'
                }`}
              >
                <div className="font-semibold">{item.label}</div>
                <div className="text-[10px] text-stone-700 truncate">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Configurations: Resolution & Age Level */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resolution Affordance (1K, 2K, 4K) as required */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Image Resolution (Print Quality)</span>
                </label>
                <span className="text-[11px] font-semibold text-amber-700">gemini-3-pro-image-preview</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setImageSize(res)}
                    disabled={isGenerating}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      imageSize === res
                        ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <span>{res}</span>
                    <span className="block text-[9px] opacity-80 font-normal">
                      {res === '1K' ? 'Standard' : res === '2K' ? 'Crisp HD' : 'Ultra Print'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5 text-rose-500" />
                <span>Line Art Complexity</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'toddler', label: 'Ages 3-5', sub: 'Extra Thick' },
                  { id: 'kids', label: 'Ages 6-8', sub: 'Standard' },
                  { id: 'older', label: 'Ages 9+', sub: 'Detailed' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAgeGroup(item.id as AgeGroup)}
                    disabled={isGenerating}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      ageGroup === item.id
                        ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="block text-[9px] opacity-80 font-normal">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-linear-to-r from-amber-500 via-amber-600 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-[0.99] text-white font-['Fredoka',sans-serif] text-lg font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>{progressStep || 'Creating Your 5-Page Book...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Generate 5-Page Coloring Book</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onLoadDemo(theme, childName)}
            disabled={isGenerating}
            className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-semibold text-xs sm:text-sm border border-stone-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookMarked className="w-4 h-4 text-amber-600" />
            <span>Load Demo Book</span>
          </button>
        </div>
      </form>
    </div>
  );
};
