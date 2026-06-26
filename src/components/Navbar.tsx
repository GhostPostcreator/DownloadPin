'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, DownloadCloud } from 'lucide-react';

export default function Navbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setDark(true);
  }, []);

  const toggleDarkMode = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  };

  return (
    <nav className="border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
          <div className="bg-pinterest p-2 rounded-xl text-white shadow-sm">
            <DownloadCloud size={20} />
          </div>
          <span>Pin<span className="text-pinterest">Stream</span></span>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-gray-600 dark:text-zinc-400"
          aria-label="Toggle structural interface theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
