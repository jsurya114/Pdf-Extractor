import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function usePdfRenderer(pdfUrl) {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pdfUrl) return;
    let cancelled = false;

    async function render() {
      setLoading(true);
      setError(null);
      setThumbnails([]);
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          pages.push(canvas.toDataURL('image/png'));
        }
        if (!cancelled) setThumbnails(pages);
      } catch (err) {
        if (!cancelled) { setError('Failed to render PDF pages'); console.error(err); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  return { thumbnails, loading, error };
}
