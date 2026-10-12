import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName } from 'pdf-lib';
import zlib from 'zlib';

const pdfPath = 'C:/Users/123ch/.gemini/antigravity-ide/brain/00353ebc-82e5-4cc1-80ac-f6058d8fd0ce/.user_uploaded/media_1791836129775.pdf';

function decodeAscii85(input) {
  let str = input.replace(/\s+/g, '');
  if (str.startsWith('<~')) str = str.slice(2);
  if (str.endsWith('~>')) str = str.slice(0, -2);
  if (str.endsWith('~')) str = str.slice(0, -1);

  const out = [];
  let tuple = 0;
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c === 122 && count === 0) {
      out.push(0, 0, 0, 0);
      continue;
    }
    if (c < 33 || c > 117) continue;

    tuple = tuple * 85 + (c - 33);
    count++;

    if (count === 5) {
      out.push(
        (tuple >>> 24) & 255,
        (tuple >>> 16) & 255,
        (tuple >>> 8) & 255,
        tuple & 255
      );
      tuple = 0;
      count = 0;
    }
  }

  if (count > 1) {
    for (let i = count; i < 5; i++) {
      tuple = tuple * 85 + 84;
    }
    for (let i = 0; i < count - 1; i++) {
      out.push((tuple >>> (24 - i * 8)) & 255);
    }
  }

  return Buffer.from(out);
}

async function run() {
  const buf = fs.readFileSync(pdfPath);
  const doc = await PDFDocument.load(buf);
  const page = doc.getPage(0);
  const contents = page.node.Contents();
  const stream = doc.context.lookup(contents);
  const raw = Buffer.from(stream.getContents()).toString('latin1');
  let text = '';
  try {
    const a85 = decodeAscii85(raw);
    text = zlib.inflateSync(a85).toString('utf8');
  } catch (e) {
    console.log('Inflate error:', e.message);
    text = raw;
  }
  console.log('--- Page Stream Content ---');
  console.log(text);

  // Let's also extract both images and save them locally so we can view them!
  const outDir = path.resolve('extracted_covers');
  const frontendDir = path.resolve('../Project/Shiv-Shakti-Events-Mart/public/catalogue');
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(frontendDir, { recursive: true });

  for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj.dict) {
      const subtype = obj.dict.get(PDFName.of('Subtype'))?.toString();
      if (subtype === '/Image') {
        const num = ref.objectNumber;
        const imgRaw = Buffer.from(obj.getContents()).toString('latin1');
        const imgBytes = decodeAscii85(imgRaw);
        const filename = path.join(outDir, `table_cover_${num}.jpg`);
        fs.writeFileSync(filename, imgBytes);

        // Also save to frontend public/catalogue
        const catFilename = num === 4 
          ? 'cat_wedding_p1_1_gl-tc-001_yellow-top-round-table-cover.jpg'
          : 'cat_wedding_p1_2_gl-tc-002_green-velvet-overlay-table-cover.jpg';
        fs.writeFileSync(path.join(frontendDir, catFilename), imgBytes);

        console.log(`Saved image ${num} to ${filename}, size: ${imgBytes.length} bytes`);
      }
    }
  }
}

run().catch(console.error);
