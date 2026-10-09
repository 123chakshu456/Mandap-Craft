import fs from 'fs';
import zlib from 'zlib';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { PDFDocument, PDFName } from 'pdf-lib';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function decodeAscii85(str) {
  let clean = str.replace(/~>[\s\S]*$/, '').replace(/\s+/g, '');
  if (clean.startsWith('<~')) clean = clean.slice(2);
  const out = [];
  for (let i = 0; i < clean.length;) {
    if (clean[i] === 'z') {
      out.push(0, 0, 0, 0);
      i++;
      continue;
    }
    let chunk = clean.slice(i, i + 5);
    let val = 0;
    for (let j = 0; j < chunk.length; j++) {
      val = val * 85 + (chunk.charCodeAt(j) - 33);
    }
    for (let j = chunk.length; j < 5; j++) {
      val = val * 85 + 84;
    }
    const b = [(val >>> 24) & 255, (val >>> 16) & 255, (val >>> 8) & 255, val & 255];
    const take = chunk.length - 1;
    for (let j = 0; j < take; j++) out.push(b[j]);
    i += chunk.length;
  }
  return Buffer.from(out);
}

function rgbToBmp(rgbBuffer, width, height) {
  const rowStride = width * 3;
  const padding = (4 - (rowStride % 4)) % 4;
  const rowSize = rowStride + padding;
  const imageSize = rowSize * height;
  const fileSize = 54 + imageSize;

  const buf = Buffer.alloc(fileSize);

  buf.write('BM', 0, 2, 'ascii');
  buf.writeUInt32LE(fileSize, 2);
  buf.writeUInt16LE(0, 6);
  buf.writeUInt16LE(0, 8);
  buf.writeUInt32LE(54, 10);

  buf.writeUInt32LE(40, 14);
  buf.writeInt32LE(width, 18);
  buf.writeInt32LE(height, 22);
  buf.writeUInt16LE(1, 26);
  buf.writeUInt16LE(24, 28);
  buf.writeUInt32LE(0, 30);
  buf.writeUInt32LE(imageSize, 34);
  buf.writeInt32LE(2835, 38);
  buf.writeInt32LE(2835, 42);
  buf.writeUInt32LE(0, 46);
  buf.writeUInt32LE(0, 50);

  let dstOffset = 54;
  for (let y = height - 1; y >= 0; y--) {
    let srcOffset = y * width * 3;
    for (let x = 0; x < width; x++) {
      const r = rgbBuffer[srcOffset++];
      const g = rgbBuffer[srcOffset++];
      const b = rgbBuffer[srcOffset++];
      buf[dstOffset++] = b;
      buf[dstOffset++] = g;
      buf[dstOffset++] = r;
    }
    for (let p = 0; p < padding; p++) {
      buf[dstOffset++] = 0;
    }
  }

  return buf;
}

async function extractAll() {
  const pdfBytes = fs.readFileSync('C:/Users/123ch/OneDrive/Desktop/Shiv Shakti/Catalogues/Shiv_Shakti_Events_Plastic_Chairs_Catalogue.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const chairs = [
    {
      pageIdx: 1, // Page 2
      keyTarget: 'FormXob.207ff63d58b5ca5e56fb4a8120b83b9f',
      code: 'SSE-PC-S01',
      brand: 'SUPREME',
      name: 'Shiv Shakti Supreme Plastic Chair with Arms',
      publicId: 'sse-pc-s01_supreme_plastic_chair_with_arms',
      fileName: 'sse-pc-s01.bmp',
      previewJpg: 'sse-pc-s01.jpg',
    },
    {
      pageIdx: 1, // Page 2
      keyTarget: 'FormXob.64c9430361bfcca79654a6810a4a6c7b',
      code: 'SSE-PC-S02',
      brand: 'SUPREME',
      name: 'Shiv Shakti Supreme Plastic Chair without Arms',
      publicId: 'sse-pc-s02_supreme_plastic_chair_without_arms',
      fileName: 'sse-pc-s02.bmp',
      previewJpg: 'sse-pc-s02.jpg',
    },
    {
      pageIdx: 2, // Page 3
      keyTarget: 'FormXob.30ad8426f014223ac075ede1ba2e4c12',
      code: 'SSE-PC-H01',
      brand: 'HIMALAYA',
      name: 'Shiv Shakti Himalaya Plastic Chair with Arms',
      publicId: 'sse-pc-h01_himalaya_plastic_chair_with_arms',
      fileName: 'sse-pc-h01.bmp',
      previewJpg: 'sse-pc-h01.jpg',
    },
    {
      pageIdx: 2, // Page 3
      keyTarget: 'FormXob.98a2939103f0704f999d71f31d9c0ce1',
      code: 'SSE-PC-H02',
      brand: 'HIMALAYA',
      name: 'Shiv Shakti Himalaya Plastic Chair without Arms',
      publicId: 'sse-pc-h02_himalaya_plastic_chair_without_arms',
      fileName: 'sse-pc-h02.bmp',
      previewJpg: 'sse-pc-h02.jpg',
    },
  ];

  const results = [];
  const scratchDir = 'C:/Users/123ch/.gemini/antigravity-ide/brain/77ed3725-08c5-461c-b4bb-eefea08acaa9/scratch';
  const mediaDir = 'C:/Users/123ch/.gemini/antigravity-ide/brain/77ed3725-08c5-461c-b4bb-eefea08acaa9/.tempmediaStorage';
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  for (const item of chairs) {
    const page = pdfDoc.getPage(item.pageIdx);
    const resources = page.node.Resources();
    const xObject = resources.lookup(PDFName.of('XObject'));
    
    let targetRef = null;
    for (const [key, ref] of xObject.dict.entries()) {
      if (key.toString().includes(item.keyTarget)) {
        targetRef = ref;
        break;
      }
    }

    if (!targetRef) {
      console.error('Could not find ref for', item.keyTarget);
      continue;
    }

    const obj = pdfDoc.context.lookup(targetRef);
    const asciiStr = Buffer.from(obj.contents).toString('ascii');
    const deflated = decodeAscii85(asciiStr);
    const inflated = zlib.inflateSync(deflated);
    const bmp = rgbToBmp(inflated, 1086, 1448);

    const bmpPath = `${scratchDir}/${item.fileName}`;
    fs.writeFileSync(bmpPath, bmp);
    console.log(`Saved BMP for ${item.code}: ${bmp.length} bytes`);

    console.log(`Uploading ${item.code} to Cloudinary...`);
    const uploadRes = await cloudinary.uploader.upload(bmpPath, {
      folder: 'shiv-shakti-products',
      public_id: item.publicId,
      format: 'jpg',
      overwrite: true,
    });

    console.log(`Uploaded ${item.code}: ${uploadRes.secure_url}`);
    item.cloudinaryUrl = uploadRes.secure_url;
    item.cloudinaryPublicId = uploadRes.public_id;
    results.push(item);
  }

  fs.writeFileSync(`${scratchDir}/chairs_cloudinary_manifest.json`, JSON.stringify(results, null, 2));
  console.log('Finished uploading all 4 chairs!');
}

extractAll().catch(console.error);
