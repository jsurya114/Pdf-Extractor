import { useSelector, useDispatch } from 'react-redux';
import { resetAll } from '../store/pdfSlice';
import { FileText } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const fileInfo = useSelector((state) => state.pdf.fileInfo);

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">PDF Extractor</h1>
          <p className="text-xs text-gray-500">Select & extract pages</p>
        </div>
      </div>
      {fileInfo && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-300 truncate max-w-[200px]">{fileInfo.filename}</p>
            <p className="text-xs text-gray-500">{fileInfo.pageCount} pages • {(fileInfo.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={() => dispatch(resetAll())} className="px-4 py-2 text-sm font-medium rounded-lg border border-white/10 hover:bg-white/[0.08] transition-all duration-300 text-gray-300">
            New File
          </button>
        </div>
      )}
    </header>
  );
}
