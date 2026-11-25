import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  RefreshCw,
  Lightbulb,
  BookOpen,
  Feather
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  childName?: string;
  currentTheme?: string;
  onApplyThemeSuggestion?: (theme: string) => void;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  childName = 'Leo',
  currentTheme = 'space dinosaurs',
  onApplyThemeSuggestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Hello there! 🎨 I'm **Barnaby the Coloring Dragon**, your creative studio companion!

I can help you:
• Brainstorm wacky, personalized coloring themes for **${childName}**
• Write magical bedtime rhymes for any page
• Invent fun characters and story adventures!

What would you like to create today?`,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskType, setTaskType] = useState<'general' | 'fast' | 'complex'>('general');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!customText) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, text: m.text })),
          taskType,
          childName,
          currentTheme,
        }),
      });

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || "I'm ready for our next drawing adventure!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          text: "Oops, my dragon ink got smudged! Please check your connection and try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        text: `Fresh canvas! ✨ Ask me anything about themes, rhymes, or coloring stories for **${childName}**.`,
        timestamp: Date.now(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="AI Coloring Studio Assistant Chat"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-amber-200 flex flex-col"
    >
      {/* Top Header */}
      <div className="p-4 bg-linear-to-r from-amber-500 to-rose-500 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-xl">
            🐉
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-['Fredoka',sans-serif] font-bold text-base leading-tight">
                Barnaby the Studio Dragon
              </h3>
            </div>
            <p className="text-[11px] text-amber-100 font-medium">
              Multi-turn Storyteller & Prompt Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Model Affordance Bar */}
      <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200 flex items-center justify-between text-[11px]">
        <span className="font-semibold text-stone-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Gemini Model:</span>
        </span>
        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as any)}
          className="bg-white border border-amber-300 rounded-lg px-2 py-0.5 text-[11px] font-bold text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="general">gemini-3.8-flash (General)</option>
          <option value="fast">gemini-3.1-flash-lite (Fast)</option>
          <option value="complex">gemini-4-argon (Complex)</option>
        </select>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <button
          onClick={() =>
            handleSendMessage(`Give me 3 creative and whimsical coloring book themes suitable for a 6-year-old named ${childName}.`)
          }
          className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 border border-stone-200 text-[11px] font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Lightbulb className="w-3 h-3 text-amber-600" />
          <span>Themes for {childName}</span>
        </button>
        <button
          onClick={() =>
            handleSendMessage(`Write a charming 1-minute bedtime story based on our coloring book about ${currentTheme} starring ${childName}!`)
          }
          className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 border border-stone-200 text-[11px] font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <BookOpen className="w-3 h-3 text-indigo-600" />
          <span>Bedtime Story</span>
        </button>
        <button
          onClick={() =>
            handleSendMessage(`Write 2 fun rhyming lines for a coloring page featuring a flying superhero dragon.`)
          }
          className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 border border-stone-200 text-[11px] font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Feather className="w-3 h-3 text-rose-500" />
          <span>Page Rhyme</span>
        </button>
      </div>

      {/* Scrollable Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs text-xs">
                🐉
              </div>
            )}
            <div
              className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-xs'
                  : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
              }`}
            >
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-stone-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-xs">
              🐉
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-semibold text-stone-500 ml-1">Barnaby is sketching...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Field */}
      <div className="p-3 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask Barnaby about ${childName}'s coloring book...`}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm text-stone-800 placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
