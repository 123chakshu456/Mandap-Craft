import fs from 'fs';

const pages = JSON.parse(fs.readFileSync('src/scripts/pdf_pages.json'));
const images = JSON.parse(fs.readFileSync('../Project/Shiv-Shakti-Events-Mart/public/machines/image_manifest.json'));

let output = '';

pages.forEach((p, idx) => {
  const pageNum = idx + 1;
  const pageImgs = images.filter(img => img.page === pageNum);
  output += `\n=======================================================\n`;
  output += `PAGE ${pageNum} (${pageImgs.length} images)\n`;
  output += `=======================================================\n`;
  output += `Images:\n` + pageImgs.map(i => `  - ${i.fileName} (${i.width}x${i.height}, ${(i.sizeBytes / 1024).toFixed(1)} KB)`).join('\n') + '\n';
  output += `--- Full Text ---\n${p.text}\n`;
});

fs.writeFileSync('src/scripts/full_catalog_analysis.txt', output);
console.log('Saved full_catalog_analysis.txt');
