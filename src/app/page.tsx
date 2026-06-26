'use client';
import { useState, useEffect } from 'react';
import DownloaderForm from '@/components/DownloaderForm';
import MediaResult from '@/components/MediaResult';
import HistoryPanel from '@/components/HistoryPanel';
import { PinterestMediaResponse, HistoryItem } from '@/types';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PinterestMediaResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('pinstream_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleFetchMedia = async (targetUrl: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      
      const payload: PinterestMediaResponse = await res.json();
      
      if (!payload.success) {
        setError(payload.error || 'Failed to extract asset streams.');
        return;
      }

      setResult(payload);

      // Mutate historical lookup tracking tracking cache array safely
      const updatedHistory: HistoryItem[] = [
        {
          id: Math.random().toString(36).substring(2, 9),
          title: payload.title,
          url: targetUrl,
          mediaType: payload.mediaType,
          thumbnail: payload.previewImage,
          timestamp: Date.now()
        },
        ...history.filter(h => h.url !== targetUrl)
      ].slice(0, 4);

      setHistory(updatedHistory);
      sessionStorage.setItem('pinstream_history', JSON.stringify(updatedHistory));
    } catch {
      setError('An operational error broke execution flow. Double-check your link.');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem('pinstream_history');
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <DownloaderForm onFetch={handleFetchMedia} loading={loading} />

      {error && (
        <div className="w-full max-w-3xl mx-auto my-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 text-sm font-semibold shadow-sm text-center">
          🛑 {error}
        </div>
      )}

      {result && <MediaResult data={result} onClear={() => setResult(null)} />}

      <HistoryPanel items={history} onSelect={handleFetchMedia} onClearHistory={clearHistory} />
    </div>
  );
}
