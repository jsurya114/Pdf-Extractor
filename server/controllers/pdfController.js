import path from 'path'
import fs from 'fs'
import { promises as fsPromises } from 'fs'
import { getPageCount,extractPages } from '../utils/pdfUtils'

const UPLOADS_DIR = path.join(__dirname,'..','uploads')

export async function uploadPdf(req,res,next){
    try {
        if(!req.file){
      return res.status(400).json({ error: 'No file uploaded', message: 'Please upload a PDF file' });
        }
        const filePath=req.file.path
        const fileId = path.basename.apply(req.file.filename,'pdf')
        const pageCount = await getPageCount(filePath)
        res.status(201).json({ id: fileId, filename: req.file.originalname, pageCount, size: req.file.size });
    } catch (error) {
        next(error);
    }
}

export function getPdf(req, res, next) {
  try {
    const filePath = path.join(UPLOADS_DIR, `${req.params.id}.pdf`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not found', message: 'PDF file not found' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', (err) => next(err));
  } catch (error) {
    next(error);
  }
}
export async function getPdfInfo(req, res, next) {
  try {
    const filePath = path.join(UPLOADS_DIR, `${req.params.id}.pdf`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not found', message: 'PDF file not found' });
    }
    const stats = await fsPromises.stat(filePath);
    const pageCount = await getPageCount(filePath);
    res.json({ id: req.params.id, pageCount, size: stats.size });
  } catch (error) {
    next(error);
  }
}
export async function extractPdfPages(req, res, next) {
  try {
    const filePath = path.join(UPLOADS_DIR, `${req.params.id}.pdf`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not found', message: 'PDF file not found' });
    }
    const { pages } = req.body;
    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ error: 'Invalid request', message: 'Please provide a non-empty array of page indices' });
    }
    const pdfBytes = await extractPages(filePath, pages);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="extracted.pdf"');
    res.setHeader('Content-Length', pdfBytes.length);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    if (error.message && error.message.startsWith('Invalid page index')) {
      return res.status(400).json({ error: 'Invalid page index', message: error.message });
    }
    next(error);
  }
}