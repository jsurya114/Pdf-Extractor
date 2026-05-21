import { PDFDocument } from "pdf-lib";
import fs from "fs"

export async function getPageCount(filePath){
    const pdfBytes = await fs.readFile(filePath)
    const pdfDoc = await PDFDocument.load(pdfBytes,{ignoreEncryption:true})
    return pdfDoc.getPageCount()
}

export async function extractPages(sourcePath,pageIndices){
    const sourceBytes = await fs.readFile(sourcePath)
    const sourcePdf = await PDFDocument.load(sourceBytes,{ignoreEncryption:true})
    const totalPages = sourcePdf.getPageCount()

  for (const index of pageIndices) {
    if (!Number.isInteger(index) || index < 0 || index >= totalPages) {
      throw new Error(`Invalid page index: ${index}. Must be between 0 and ${totalPages - 1}`);
    }
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
  for (const page of copiedPages) {
    newPdf.addPage(page);
  }
  return newPdf.save();
}

