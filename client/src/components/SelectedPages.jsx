import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reorderPages, deselectAll, extractPages, clearExtracted, togglePage } from '../store/pdfSlice';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ pageIndex, thumbnail, order }) {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `page-${pageIndex}` });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto' };

  return (
    <div ref={setNodeRef} style={style}
      className={`relative flex-shrink-0 w-20 sm:w-24 rounded-lg overflow-hidden cursor-grab ring-1 ring-white/10 transition-all duration-200
        ${isDragging ? 'opacity-70 scale-105 ring-accent shadow-xl' : 'hover:ring-white/20'}`}>
      <div {...attributes} {...listeners} className="w-full">
        <img src={thumbnail} alt={`Selected page ${pageIndex + 1}`} className="w-full h-auto block pointer-events-none" />
      </div>
      <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-accent text-white">#{order}</span>
      <button onClick={(e) => { e.stopPropagation(); dispatch(togglePage(pageIndex)); }}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center hover:bg-red-500 transition-colors">✕</button>
    </div>
  );
}

export default function SelectedPages({ thumbnails }) {
  const dispatch = useDispatch();
  const selectedPages = useSelector((state) => state.pdf.selectedPages);
  const fileInfo = useSelector((state) => state.pdf.fileInfo);
  const extractStatus = useSelector((state) => state.pdf.extractStatus);
  const extractedBlob = useSelector((state) => state.pdf.extractedBlob);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  useEffect(() => {
    if (extractedBlob) {
      const url = URL.createObjectURL(extractedBlob);
      const a = document.createElement('a');
      a.href = url; a.download = `extracted-${Date.now()}.pdf`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      dispatch(clearExtracted());
    }
  }, [extractedBlob, dispatch]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = selectedPages.findIndex((p) => `page-${p}` === active.id);
    const newIndex = selectedPages.findIndex((p) => `page-${p}` === over.id);
    dispatch(reorderPages(arrayMove(selectedPages, oldIndex, newIndex)));
  }

  function handleExtract() {
    if (!fileInfo || selectedPages.length === 0) return;
    dispatch(extractPages({ id: fileInfo.id, pages: selectedPages }));
  }

  if (selectedPages.length === 0) return null;

  return (
    <div className="glass sticky bottom-0 z-40 p-4 mt-8 animate-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-300">Selected Pages ({selectedPages.length})</h4>
          <p className="text-xs text-gray-500">Drag to reorder • Click ✕ to remove</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => dispatch(deselectAll())}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 hover:bg-white/[0.08] transition-all duration-300 text-gray-400">Clear</button>
          <button onClick={handleExtract} disabled={extractStatus === 'loading'}
            className="px-5 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            {extractStatus === 'loading' ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...
              </span>
            ) : '⬇ Download PDF'}
          </button>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selectedPages.map((p) => `page-${p}`)} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {selectedPages.map((pageIndex, i) => (
              <SortableItem key={pageIndex} pageIndex={pageIndex} thumbnail={thumbnails[pageIndex]} order={i + 1} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
