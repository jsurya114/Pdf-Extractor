import express from 'express'
import upload from '../middleware/upload'
import { uploadPdf,getPdf,getPdfInfo,extractPdfPages } from '../controllers/pdfController'

const router = express.Router()

router.post('/upload', upload.single('pdf'), uploadPdf);
router.get('/:id', getPdf);
router.get('/:id/info', getPdfInfo);
router.post('/:id/extract', extractPdfPages);

export default router
