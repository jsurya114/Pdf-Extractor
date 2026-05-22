import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dismissToast } from '../store/pdfSlice';

const icons = { success: '✅', error: '❌', info: 'ℹ️' };
const bgColors = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.pdf.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch(dismissToast()), 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-lg max-w-sm ${bgColors[toast.type]}`}>
        <span className="text-lg">{icons[toast.type]}</span>
        <p className="text-sm font-medium text-gray-200">{toast.message}</p>
        <button onClick={() => dispatch(dismissToast())} className="ml-2 text-gray-500 hover:text-gray-300 transition-colors">✕</button>
      </div>
    </div>
  );
}
