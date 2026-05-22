import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, PlusCircle } from 'lucide-react';

export default function PagePreviewModal({
  pageIndex,
  totalCount,
  thumbnail,
  isSelected,
  onToggleSelect,
  onClose,
  onPrev,
  onNext,
  selectedOrder,
}) {
  // Listen for keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && onPrev) onPrev();
      else if (e.key === 'ArrowRight' && onNext) onNext();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  // Prevent scroll propagation
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Top bar with details and close button */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 z-10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Page {pageIndex + 1}
            <span className="text-xs font-normal text-gray-400">of {totalCount}</span>
          </h3>
          {isSelected && (
            <p className="text-xs text-accent-light font-medium mt-0.5">
              Included in extraction {selectedOrder > 0 ? `(Position #${selectedOrder})` : ''}
            </p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all duration-200"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main interactive area with navigation */}
      <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center min-h-0 py-2">
        {/* Previous Button */}
        {onPrev ? (
          <button
            onClick={onPrev}
            className="absolute left-0 sm:-left-16 p-3 rounded-full bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:bg-black/60 hover:border-white/30 hover:scale-105 active:scale-95 transition-all duration-200 z-10"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="hidden sm:block absolute left-0 sm:-left-16 opacity-10 pointer-events-none p-3">
            <ChevronLeft className="w-6 h-6" />
          </div>
        )}

        {/* The Page Image Display */}
        <div className="relative max-h-full flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/50 border border-white/10 max-w-[90vw] sm:max-w-full">
          <img
            src={thumbnail}
            alt={`Page ${pageIndex + 1} preview`}
            className="object-contain max-h-[65vh] md:max-h-[70vh] w-auto h-auto block select-none"
          />
        </div>

        {/* Next Button */}
        {onNext ? (
          <button
            onClick={onNext}
            className="absolute right-0 sm:-right-16 p-3 rounded-full bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:bg-black/60 hover:border-white/30 hover:scale-105 active:scale-95 transition-all duration-200 z-10"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        ) : (
          <div className="hidden sm:block absolute right-0 sm:-right-16 opacity-10 pointer-events-none p-3">
            <ChevronRight className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="w-full max-w-md flex flex-col items-center gap-3 mt-4 z-10">
        <button
          onClick={onToggleSelect}
          className={`w-full py-3 px-6 font-semibold rounded-xl text-center shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0
            ${isSelected 
              ? 'bg-accent text-white shadow-accent/20 hover:shadow-accent/40 border border-transparent' 
              : 'bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
        >
          {isSelected ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              Selected
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <PlusCircle className="w-5 h-5 text-gray-400" />
              Select Page for Extraction
            </span>
          )}
        </button>
        <p className="text-[11px] text-gray-500 text-center">
          Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">→</kbd> arrow keys to navigate
        </p>
      </div>
    </div>
  );
}
