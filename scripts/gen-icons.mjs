// Generates PWA PNG icons using only Node.js built-ins (no extra deps).
import { writeFileSync, mkdirSync } from 'fs';
import { deflateSync } from 'zlib';

// ── CRC32 ───────────────────────────────────────────────────────────────────
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
  return (c ^ 0xffffffff) >>> 0;
}

// ── PNG chunk ────────────────────────────────────────────────────────────────
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeB, data])), 0);
  return Buffer.concat([len, typeB, data, crc]);
}

// ── draw helpers ─────────────────────────────────────────────────────────────
function inRoundRect(x, y, w, h, r) {
  const cx = w / 2, cy = h / 2;
  const dx = Math.abs(x - cx) - (cx - r);
  const dy = Math.abs(y - cy) - (cy - r);
  if (dx <= 0 || dy <= 0) return true;
  return dx * dx + dy * dy <= r * r;
}
function inCircle(x, y, cx, cy, r) {
  const dx = x - cx, dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}
function inRect(x, y, rx, ry, rw, rh) {
  return x >= rx && x < rx + rw && y >= ry && y < ry + rh;
}
// rounded rect — returns corner radius
function roundedRect(x, y, w, h, r, px, py) {
  const dx = Math.abs(px - (x + w / 2)) - (w / 2 - r);
  const dy = Math.abs(py - (y + h / 2)) - (h / 2 - r);
  if (dx <= 0 || dy <= 0) return true;
  return dx * dx + dy * dy <= r * r;
}

// ── create RGBA PNG ──────────────────────────────────────────────────────────
function createPNG(size) {
  const s = size;
  const AMBER    = [245, 158, 11,  255];  // #f59e0b
  const RING     = [180, 115,  8,  255];  // darker amber ring
  const FACE     = [251, 191, 36,  255];  // #fbbf24 lighter coin face
  const DARK     = [120,  53, 15,  255];  // #78350f dark brown for T
  const CLEAR    = [0, 0, 0, 0];

  const cx = s / 2, cy = s / 2;
  const rr  = s * 0.1875;  // rounded corner radius = ~19% of size
  const outerR = s * 0.346; // coin outer ring radius
  const faceR  = s * 0.297; // coin face radius
  // "T" proportions (scaled to size)
  const tBarX = s * 0.289, tBarY = s * 0.320, tBarW = s * 0.422, tBarH = s * 0.070;
  const tStemX = s * 0.449, tStemY = s * 0.383, tStemW = s * 0.102, tStemH = s * 0.320;
  const tCorner = s * 0.023;

  const rows = [];
  for (let y = 0; y < s; y++) {
    const row = [0]; // filter byte: None
    for (let x = 0; x < s; x++) {
      let px;
      if (!inRoundRect(x, y, s, s, rr)) {
        px = CLEAR;
      } else if (inCircle(x, y, cx, cy, outerR)) {
        if (inCircle(x, y, cx, cy, faceR)) {
          // Is this pixel part of the "T"?
          const inBar  = roundedRect(tBarX,  tBarY,  tBarW, tBarH, tCorner, x, y);
          const inStem = roundedRect(tStemX, tStemY, tStemW, tStemH, tCorner, x, y);
          px = (inBar || inStem) ? DARK : FACE;
        } else {
          px = RING;
        }
      } else {
        px = AMBER;
      }
      row.push(...px);
    }
    rows.push(Buffer.from(row));
  }

  const raw = Buffer.concat(rows);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(s, 0);
  ihdr.writeUInt32BE(s, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── write files ───────────────────────────────────────────────────────────────
const sizes = [
  ['public/pwa-64x64.png',             64],
  ['public/pwa-192x192.png',           192],
  ['public/pwa-512x512.png',           512],
  ['public/maskable-icon-512x512.png', 512],
  ['public/apple-touch-icon-180x180.png', 180],
];

for (const [path, size] of sizes) {
  writeFileSync(path, createPNG(size));
  console.log(`✓ ${path}`);
}
console.log('Done.');
