import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPdf, showToast } from '../store/pdfSlice';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function FileUpload() {
  const dispatch = useDispatch();
  const uploadStatus = useSelector((state) => state.pdf.uploadStatus);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  function validateAndUpload(file) {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      dispatch(showToast({ type: 'error', message: 'Only PDF files are allowed' }));
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      dispatch(showToast({ type: 'error', message: 'File size must be under 50 MB' }));
      return;
    }
    dispatch(uploadPdf(file));
  }

  function handleDrop(e) { e.preventDefault(); setDragActive(false); validateAndUpload(e.dataTransfer.files[0]); }
  function handleDrag(e) {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }
  function handleChange(e) { validateAndUpload(e.target.files[0]); e.target.value = ''; }

  const isLoading = uploadStatus === 'loading';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          Extract pages from your{' '}
          <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">PDF</span>
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">Upload a PDF file, select the pages you need, reorder them, and download a new PDF.</p>
      </div>
      <div
        onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`relative w-full max-w-lg p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 text-center group
          ${dragActive ? 'border-accent bg-accent/10 scale-[1.02]' : 'border-white/10 hover:border-accent/50 hover:bg-white/[0.02]'}
          ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" onChange={handleChange} className="hidden" id="pdf-upload-input" />
        <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 text-accent-light" />
          )}
        </div>
        <p className="text-lg font-semibold text-gray-300 mb-1">{isLoading ? 'Uploading...' : 'Drop your PDF here'}</p>
        <p className="text-sm text-gray-500">{isLoading ? 'Please wait' : 'or click to browse • Max 50 MB'}</p>
        {dragActive && <div className="absolute inset-0 rounded-2xl bg-accent/5 animate-pulse-glow pointer-events-none" />}
      </div>
    </div>
  );
}
