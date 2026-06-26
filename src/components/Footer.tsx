export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-400 dark:text-zinc-600 transition-colors mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-xs space-y-3">
        <p className="font-medium text-gray-500 dark:text-zinc-400">
          Disclaimer: This utility application matches information strictly using publicly indexed web assets.
        </p>
        <p className="max-w-2xl mx-auto leading-relaxed">
          We do not host or store content. PinStream does not support commercial caching mechanisms or credential bypasses. Users maintain absolute accountability to ensure downloads conform with copyright law and Pinterest terms of distribution.
        </p>
        <p>© 2026 PinStream Systems. Private, local architecture module execution footprint.</p>
      </div>
    </footer>
  );
}
