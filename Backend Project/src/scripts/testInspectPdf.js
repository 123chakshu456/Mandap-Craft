import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';

async function inspectPdf() {
  const pdfPath = 'C:\\Users\\123ch\\OneDrive\\Desktop\\Shiv Shakti\\Catalogues\\1788854199906-b627ba68-ce89-47b9-8174-a4d5f062f505.pdf';
  const pdfBytes = fs.readFileSync(pdfPath);
  const doc = await PDFDocument.load(pdfBytes);
  const pageCount = doc.getPageCount();
  console.log(`Page count: ${pageCount}`);

  for (let i = 0; i < pageCount; i++) {
    const page = doc.getPage(i);
    const resources = page.node.Resources();
    const xObject = resources ? resources.get(PDFName.of('XObject')) : null;
    if (xObject) {
      const xDict = doc.context.lookup(xObject);
      if (xDict && xDict.entries) {
        const entries = xDict.entries();
        console.log(`Page ${i + 1}: ${entries.length} XObjects`);
        for (const [k, v] of entries) {
          const stream = doc.context.lookup(v);
          const subtype = stream?.dict?.get(PDFName.of('Subtype'))?.asString();
          const filter = stream?.dict?.get(PDFName.of('Filter'))?.asString();
          const width = stream?.dict?.get(PDFName.of('Width'))?.toString();
          const height = stream?.dict?.get(PDFName.of('Height'))?.toString();
          console.log(`  - ${k.asString()}: Subtype=${subtype}, Filter=${filter}, Dimensions=${width}x${height}`);
        }
      }
    }
  }
}

inspectPdf().catch(console.error);
