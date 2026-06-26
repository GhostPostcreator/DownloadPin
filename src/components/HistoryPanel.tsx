'use client';
import { HistoryItem } from '@/types';
import { History, ArrowUpRight, Trash2 } from 'lucide-react';

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelect: (url: string) => void;
  onClearHistory: () => void;
}

export default function HistoryPanel({ items, onSelect, onClearHistory }: HistoryPanelProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 border-t border-gray-200 dark:border-zinc-800 pt-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
          <History size={16} /> Recent Queries
        </h3>
        <button onClick={onClearHistory} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors">
          <Trash2 size={12} /> Clear Session History
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelect(item.url)}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-pinterest dark:hover:border-pinterest/60 cursor-pointer transition-all group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.thumbnail} alt="" className="w-11 h-11 object-cover rounded-lg bg-gray-50" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 truncate group-hover:text-pinterest transition-colors">{item.title}</h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-tight font-semibold mt-0.5">{item.mediaType}</p>
            </div>
            <ArrowUpRight size={14} className="text-gray-300 group-hover:text-pinterest transition-colors mr-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
