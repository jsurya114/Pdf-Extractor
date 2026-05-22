import { useDispatch, useSelector } from 'react-redux';
import { togglePage } from '../store/pdfSlice';
import { Search, Check } from 'lucide-react';

export default function PageCard({ pageIndex, thumbnail, onPreview }) {
  const dispatch = useDispatch();
  const selectedPages = useSelector((state) => state.pdf.selectedPages);
  const isSelected = selectedPages.includes(pageIndex);

  return (
    <div
      onClick={() => onPreview(pageIndex)}
      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 animate-fade-in
        ${isSelected ? 'ring-2 ring-accent shadow-lg shadow-accent/20 scale-[1.02]' : 'ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.01]'}`}
    >
      <img src={thumbnail} alt={`Page ${pageIndex + 1}`} className="w-full h-auto block" loading="lazy" />
      
      {/* Selection overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${isSelected ? 'bg-accent/10' : 'bg-transparent group-hover:bg-white/[0.03]'}`} />
      
      {/* Zoom / Preview icon on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="p-2.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
          <Search className="w-5 h-5" />
        </div>
      </div>

      {/* Select/Deselect checkbox button */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          dispatch(togglePage(pageIndex));
        }}
        className="absolute top-2 right-2 z-10"
      >
        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300
          ${isSelected ? 'bg-accent text-white shadow-md' : 'bg-black/50 border border-white/20 text-transparent hover:border-white/60 hover:bg-black/75 group-hover:border-white/40 group-hover:text-gray-400'}`}>
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
      </div>

      {/* Page Index Label */}
      <div className="absolute bottom-2 left-2 z-10">
        <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-black/60 backdrop-blur-sm text-gray-300">{pageIndex + 1}</span>
      </div>

      {/* Selected Order Badge */}
      {isSelected && (
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-accent text-white">#{selectedPages.indexOf(pageIndex) + 1}</span>
        </div>
      )}
    </div>
  );
}
