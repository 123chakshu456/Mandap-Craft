import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

async function main() {
  const dataBuffer = fs.readFileSync('C:/Users/123ch/OneDrive/Desktop/Shiv Shakti/Catalogues/1788854199906-b627ba68-ce89-47b9-8174-a4d5f062f505.pdf');
  const p = new PDFParse({ data: dataBuffer });
  const result = await p.getText();
  
  fs.writeFileSync('C:/Users/123ch/OneDrive/Desktop/Shiv Shakti/Backend Project/src/scripts/pdf_pages.json', JSON.stringify(result.pages, null, 2));
  console.log(`Successfully extracted ${result.pages.length} pages, total text length: ${result.text.length}`);
}

main().catch(console.error);
