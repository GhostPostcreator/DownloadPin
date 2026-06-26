'use client';
import React, { useState } from 'react';
import { Clipboard, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface DownloaderFormProps {
  onFetch: (url: string) => Promise<void>;
  loading: boolean;
}

export default function DownloaderForm({ onFetch, loading }: DownloaderFormProps) {
  const [inputUrl, setInputUrl] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputUrl(text);
    } catch {
      alert('Unable to access browser clipboard automation settings.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onFetch(inputUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center my-8 px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30 text-pinterest text-xs font-semibold mb-5">
        <Sparkles size={12} /> Production Grade Engine v2.4
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 dark:text-white mb-4">
        Download Pinterest <span className="text-pinterest">Media Instantly</span>
      </h1>
      <p className="text-gray-600 dark:text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
        Fetch, preview, and download ultra-high-resolution images, videos, and GIFs directly from public pins.
      </p>

      <form onSubmit={handleSubmit} className="relative group p-2 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 focus-within:border-pinterest dark:focus-within:border-pinterest rounded-2xl shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative w-full flex items-center pl-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste pinterest.com/pin/... or pin.it/ link here"
              className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 py-3.5 px-3 focus:outline-none text-base font-medium"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 transition-colors flex items-center gap-1.5"
              title="Paste content from clipboard"
            >
              <Clipboard size={14} /> Paste
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading || !inputUrl.trim()}
            className="w-full md:w-auto px-7 py-4 rounded-xl font-bold text-white bg-pinterest hover:bg-pinterest-hover disabled:bg-gray-300 dark:disabled:bg-zinc-800 disabled:text-gray-500 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Fetching Media...
              </>
            ) : (
              <>
                Fetch Media <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
