import fs from 'fs';

const pages = JSON.parse(fs.readFileSync('src/scripts/pdf_pages.json'));
const images = JSON.parse(fs.readFileSync('../Project/Shiv-Shakti-Events-Mart/public/machines/image_manifest.json'));

pages.forEach((p, idx) => {
  const pageNum = idx + 1;
  const pageImgs = images.filter(img => img.page === pageNum);
  const lines = p.text.split('\n').map(l => l.trim()).filter(Boolean);
  console.log(`\n=================== PAGE ${pageNum} (${pageImgs.length} images) ===================`);
  console.log('Images:', pageImgs.map(i => `${i.fileName} (${i.width}x${i.height})`).join(', '));
  console.log('--- Text Preview (first 10 lines) ---');
  console.log(lines.slice(0, 10).join('\n'));
});
