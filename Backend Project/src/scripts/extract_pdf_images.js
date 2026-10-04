import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';

async function extract() {
  const pdfPath = 'C:/Users/123ch/OneDrive/Desktop/Shiv Shakti/Catalogues/1788854199906-b627ba68-ce89-47b9-8174-a4d5f062f505.pdf';
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const outDir = 'C:/Users/123ch/OneDrive/Desktop/Shiv Shakti/Project/Shiv-Shakti-Events-Mart/public/machines';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  let count = 0;
  const imageIndex = [];

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const resources = page.node.Resources();
    if (!resources) continue;
    const xObject = resources.lookup(PDFName.of('XObject'));
    if (!xObject) continue;

    const xObjectDict = xObject.dict;
    for (const [key, ref] of xObjectDict.entries()) {
      const obj = pdfDoc.context.lookup(ref);
      if (obj && obj instanceof PDFRawStream) {
        const subtype = obj.dict.lookup(PDFName.of('Subtype'));
        const filter = obj.dict.lookup(PDFName.of('Filter'));
        if (subtype && subtype.toString() === '/Image') {
          const width = obj.dict.lookup(PDFName.of('Width'))?.toString();
          const height = obj.dict.lookup(PDFName.of('Height'))?.toString();
          const filterStr = filter ? filter.toString() : '';
          
          if (filterStr === '/DCTDecode') {
            const imgBytes = obj.contents;
            const cleanKey = key.toString().replace('/', '');
            const fileName = `page_${i + 1}_${cleanKey}_${width}x${height}.jpg`;
            fs.writeFileSync(path.join(outDir, fileName), imgBytes);
            count++;
            imageIndex.push({
              page: i + 1,
              key: cleanKey,
              fileName,
              width: parseInt(width),
              height: parseInt(height),
              sizeBytes: imgBytes.length
            });
            console.log(`Saved: page ${i + 1} (${cleanKey}): ${fileName} (${width}x${height}, ${(imgBytes.length / 1024).toFixed(1)} KB)`);
          }
        }
      }
    }
  }
  fs.writeFileSync(path.join(outDir, 'image_manifest.json'), JSON.stringify(imageIndex, null, 2));
  console.log('Total extracted:', count);
}

extract().catch(console.error);
