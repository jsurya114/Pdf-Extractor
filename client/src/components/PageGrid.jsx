import { useDispatch, useSelector } from 'react-redux';
import { selectAll, deselectAll } from '../store/pdfSlice';
import PageCard from './PageCard';

export default function PageGrid({ thumbnails, onPreview }) {
  const dispatch = useDispatch();
  const selectedPages = useSelector((state) => state.pdf.selectedPages);
  const fileInfo = useSelector((state) => state.pdf.fileInfo);
  const allSelected = selectedPages.length === fileInfo?.pageCount;

  return (
    <div className="animate-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">All Pages</h3>
          <p className="text-sm text-gray-500">{selectedPages.length} of {fileInfo?.pageCount} selected</p>
        </div>
        <button onClick={() => dispatch(allSelected ? deselectAll() : selectAll())}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-white/10 hover:bg-white/[0.08] transition-all duration-300 text-gray-300">
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {thumbnails.map((thumb, index) => (
          <PageCard key={index} pageIndex={index} thumbnail={thumb} onPreview={onPreview} />
        ))}
      </div>
    </div>
  );
}
