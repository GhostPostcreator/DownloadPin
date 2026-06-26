'use client';
import { useState } from 'react';
import { PinterestMediaResponse, MediaVariant } from '@/types';
import { Download, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';

interface MediaResultProps {
  data: PinterestMediaResponse;
  onClear: () => void;
}

export default function MediaResult({ data, onClear }: MediaResultProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);
  const currentVariant = data.variants[selectedIdx] || data.variants[0];

  const handleCopyLink = async (url: string, index: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleCopyPinUrl = async () => {
    await navigator.clipboard.writeText(data.originalUrl);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const generateDownloadUrl = (variant: MediaVariant) => {
    const ext = variant.format;
    const cleanTitle = data.title.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 30);
    return `/api/download?url=${encodeURIComponent(variant.url)}&filename=${cleanTitle}.${ext}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl transition-all animate-fade-in mb-12">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 uppercase">
            {data.mediaType}
          </span>
          {data.fallbackNotice && (
            <span className="text-amber-500 text-xs font-medium">⚠️ {data.fallbackNotice}</span>
          )}
        </div>
        <button onClick={onClear} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-2 text-sm flex items-center gap-1.5 font-medium transition-colors">
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Interactive Media Container */}
        <div className="relative group overflow-hidden bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center justify-center min-h-[320px]">
          {data.mediaType === 'video' && currentVariant.url.includes('.mp4') ? (
            <video src={currentVariant.url} controls className="max-h-[480px] w-full rounded-2xl object-contain shadow-sm" poster={data.previewImage} />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.previewImage} alt="Preview element" className="max-h-[480px] object-contain rounded-2xl group-hover:scale-[1.01] transition-transform duration-300" />
          )}
        </div>

        {/* Right Configuration Container */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug">{data.title}</h2>
            <button onClick={handleCopyPinUrl} className="text-xs text-gray-400 hover:text-pinterest mb-6 inline-flex items-center gap-1.5 transition-colors">
              {copiedPin ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />} 
              {copiedPin ? 'Copied Source Link!' : 'Copy Original Pin URL'}
            </button>

            {/* Quality Variant Selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-2.5">Available Resolutions</label>
              <div className="space-y-2">
                {data.variants.map((variant, i) => (
                  <div 
                    key={i}
                    onClick={() => setSelectedIdx(i)}
                    className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      selectedIdx === i 
                        ? 'border-pinterest bg-red-50/40 dark:bg-pinterest/5 ring-1 ring-pinterest' 
                        : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{variant.resolution}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 uppercase tracking-tight">{variant.format}</span>
                        {i === 0 && <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-pinterest text-white scale-90">BEST</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{variant.quality} Output Asset</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyLink(variant.url, i); }}
                      className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-zinc-700"
                      title="Copy asset address stream"
                    >
                      {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Transaction Execution Elements */}
          <div className="space-y-2.5 mt-4">
            <a
              href={generateDownloadUrl(currentVariant)}
              className="w-full bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base"
            >
              <Download size={18} /> Download Selected ({currentVariant.resolution})
            </a>
            {selectedIdx !== 0 && (
              <a
                href={generateDownloadUrl(data.variants[0])}
                className="w-full bg-pinterest hover:bg-pinterest-hover text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                <Download size={16} /> Fast Download Highest Quality
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
