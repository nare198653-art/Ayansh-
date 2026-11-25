import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Download,
  Paintbrush,
  Eraser,
  Sparkles,
  Check,
  Printer
} from 'lucide-react';
import { ColoringPage } from '../types';

interface ColoringCanvasModalProps {
  page: ColoringPage;
  childName: string;
  onClose: () => void;
}

const CRAYON_PALETTE = [
  '#000000', '#52525b', '#e11d48', '#f97316', '#f59e0b',
  '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#a855f7', '#ec4899', '#f43f5e', '#fb923c', '#fde047',
  '#a3e635', '#34d399', '#38bdf8', '#818cf8', '#c084fc',
  '#f472b6', '#ffffff'
];

export const ColoringCanvasModal: React.FC<ColoringCanvasModalProps> = ({
  page,
  childName,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#e11d48');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'stamp'>('brush');
  const [stamp, setStamp] = useState<string>('⭐');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Load the page's line art image onto the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 600;
      canvas.height = 800;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Save initial snapshot
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([snapshot]);
    };
    img.src = page.imageUrl;
  }, [page.imageUrl]);

  const saveStateToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), snapshot]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const lastState = newHistory[newHistory.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setHistory(newHistory);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (tool === 'stamp') {
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stamp, x, y);
      saveStateToHistory();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.strokeStyle = currentColor;
      // Using 'multiply' keeps the black outlines visible on top of crayon strokes!
      ctx.globalCompositeOperation = 'multiply';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'stamp') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      saveStateToHistory();
    }
  };

  const handleDownloadArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${childName.toLowerCase()}-${page.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-colored.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-amber-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-amber-500 text-white flex items-center justify-between">
          <div>
            <h2 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-bold">
              Coloring Studio: {page.title}
            </h2>
            <p className="text-xs text-amber-100 hidden sm:block">
              Draw and color online with magic crayons! Lines stay sharp automatically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadArtwork}
              className="px-3 py-1.5 rounded-xl bg-white text-amber-900 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Picture</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close coloring canvas"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body: Canvas & Controls */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-y-auto bg-stone-100/60 items-center justify-center">
          {/* Main Drawing Canvas Container */}
          <div className="relative bg-white rounded-2xl shadow-md border-4 border-white overflow-hidden max-w-[480px] w-full aspect-[3/4] flex items-center justify-center touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
              className="w-full h-full object-contain cursor-crosshair"
            />
          </div>

          {/* Right Toolbar: Crayons, Sizes, Stamps */}
          <div className="w-full md:w-64 flex flex-col gap-3.5 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            {/* Tool Selector */}
            <div>
              <span className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">Tool</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTool('brush')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    tool === 'brush'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>Crayon</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTool('eraser')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    tool === 'eraser'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTool('stamp')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    tool === 'stamp'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sticker</span>
                </button>
              </div>
            </div>

            {/* Sticker picker if stamp mode */}
            {tool === 'stamp' ? (
              <div>
                <span className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">Pick Sticker</span>
                <div className="grid grid-cols-5 gap-2">
                  {['⭐', '❤️', '👑', '🚀', '🦖', '✨', '🌈', '🍭', '🎈', '🐾'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStamp(s)}
                      className={`text-2xl p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        stamp === s ? 'bg-amber-100 border-amber-500 scale-110' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Color Swatches */
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-700 uppercase">Crayon Colors</span>
                  <div
                    className="w-4 h-4 rounded-full border border-stone-300"
                    style={{ backgroundColor: currentColor }}
                  />
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {CRAYON_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setCurrentColor(color);
                        if (tool === 'eraser') setTool('brush');
                      }}
                      className="w-7 h-7 rounded-full border border-stone-300/80 hover:scale-115 active:scale-95 transition-transform flex items-center justify-center cursor-pointer shadow-2xs"
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    >
                      {currentColor === color && tool === 'brush' && (
                        <Check className={`w-3.5 h-3.5 ${color === '#ffffff' || color === '#fde047' ? 'text-stone-900' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Brush Size */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-stone-700 uppercase">Tip Width</span>
                <span className="text-xs text-stone-500 font-semibold">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-bold px-1 mt-0.5">
                <span>Fine Tip</span>
                <span>Chubby Crayon</span>
              </div>
            </div>

            {/* Action buttons: Undo & Clear */}
            <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length <= 1}
                className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (!canvas || history.length === 0) return;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  ctx.putImageData(history[0], 0, 0);
                  setHistory([history[0]]);
                }}
                className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
              >
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
