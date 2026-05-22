import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import Toast from './components/Toast';
import FileUpload from './components/FileUpload';
import PageGrid from './components/PageGrid';
import SelectedPages from './components/SelectedPages';
import PagePreviewModal from './components/PagePreviewModal';
import usePdfRenderer from './hooks/usePdfRenderer';
import { togglePage } from './store/pdfSlice';

export default function App() {
  const dispatch = useDispatch();
  const fileInfo = useSelector((state) => state.pdf.fileInfo);
  const uploadStatus = useSelector((state) => state.pdf.uploadStatus);
  const selectedPages = useSelector((state) => state.pdf.selectedPages);
  
  const [previewIndex, setPreviewIndex] = useState(null);
  
  const pdfUrl = fileInfo ? `/api/pdf/${fileInfo.id}` : null;
  const { thumbnails, loading: renderingPages, error: renderError } = usePdfRenderer(pdfUrl);

  return (
    <div className="min-h-screen flex flex-col">
      <Toast />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {uploadStatus !== 'succeeded' && <FileUpload />}
        {uploadStatus === 'succeeded' && renderingPages && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Rendering pages...</p>
          </div>
        )}
        {renderError && <div className="text-center py-20"><p className="text-danger text-lg font-medium">{renderError}</p></div>}
        {uploadStatus === 'succeeded' && thumbnails.length > 0 && (
          <>
            <PageGrid thumbnails={thumbnails} onPreview={(idx) => setPreviewIndex(idx)} />
            <SelectedPages thumbnails={thumbnails} />
          </>
        )}
      </main>
      
      {/* Conditionally render the Page Preview Modal */}
      {previewIndex !== null && (
        <PagePreviewModal
          pageIndex={previewIndex}
          totalCount={thumbnails.length}
          thumbnail={thumbnails[previewIndex]}
          isSelected={selectedPages.includes(previewIndex)}
          onToggleSelect={() => dispatch(togglePage(previewIndex))}
          onClose={() => setPreviewIndex(null)}
          onPrev={previewIndex > 0 ? () => setPreviewIndex(previewIndex - 1) : null}
          onNext={previewIndex < thumbnails.length - 1 ? () => setPreviewIndex(previewIndex + 1) : null}
          selectedOrder={selectedPages.indexOf(previewIndex) + 1}
        />
      )}

      <footer className="text-center py-4 text-xs text-gray-600 border-t border-white/5">
        PDF Extractor • Built with React, Redux Toolkit & Express
      </footer>
    </div>
  );
}
