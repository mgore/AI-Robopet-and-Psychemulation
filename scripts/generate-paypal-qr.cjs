const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const url = 'https://www.paypal.com/ncp/payment/LGMWY6D9AAFDW';
const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
const size = qr.modules.size; // e.g. 41
const cellSize = 10;
const margin = 32;
const totalSize = size * cellSize + margin * 2;

// Center logo reservation (excavate middle ~22% cells, e.g. 9x9 for 41x41)
const centerSpan = Math.max(7, Math.floor(size * 0.22) | 1); // odd number
const centerStart = Math.floor((size - centerSpan) / 2);
const centerEnd = centerStart + centerSpan - 1;

function isInFinderPattern(row, col) {
  // Top-Left (0..6, 0..6)
  if (row <= 7 && col <= 7) return true;
  // Top-Right (0..6, size-8..size-1)
  if (row <= 7 && col >= size - 8) return true;
  // Bottom-Left (size-8..size-1, 0..7)
  if (row >= size - 8 && col <= 7) return true;
  return false;
}

function isInCenter(row, col) {
  return row >= centerStart && row <= centerEnd && col >= centerStart && col <= centerEnd;
}

let svgElements = [];

// Background
svgElements.push(`<rect width="${totalSize}" height="${totalSize}" fill="#ffffff" rx="24"/>`);

// Draw data dots (rounded circles as seen in PayPal QR code)
for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (isInFinderPattern(r, c) || isInCenter(r, c)) continue;
    if (qr.modules.get(r, c)) {
      const cx = margin + c * cellSize + cellSize / 2;
      const cy = margin + r * cellSize + cellSize / 2;
      const radius = cellSize * 0.44;
      svgElements.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#102b5c"/>`);
    }
  }
}

// Draw custom PayPal-style Finder Patterns
function renderFinder(x, y, innerCutCorner) {
  const outerSize = 7 * cellSize;
  // Outer navy ring
  svgElements.push(`
    <rect x="${x}" y="${y}" width="${outerSize}" height="${outerSize}" rx="${cellSize * 1.5}" fill="none" stroke="#102b5c" stroke-width="${cellSize}"/>
  `);
  // Inner cyan/sky-blue fill
  const innerOffset = 2 * cellSize;
  const innerSize = 3 * cellSize;
  svgElements.push(`
    <rect x="${x + innerOffset}" y="${y + innerOffset}" width="${innerSize}" height="${innerSize}" rx="${cellSize * 0.8}" fill="#0079c1"/>
  `);
}

// Top-Left Finder
renderFinder(margin, margin, 'bl');
// Top-Right Finder
renderFinder(margin + (size - 7) * cellSize, margin, 'bl');
// Bottom-Left Finder
renderFinder(margin, margin + (size - 7) * cellSize, 'tr');

// Center PayPal Logo
const logoX = margin + centerStart * cellSize;
const logoY = margin + centerStart * cellSize;
const logoWidth = (centerEnd - centerStart + 1) * cellSize;
const logoHeight = logoWidth;

// White clean backdrop for logo
svgElements.push(`
  <rect x="${logoX - 4}" y="${logoY - 4}" width="${logoWidth + 8}" height="${logoHeight + 8}" rx="${cellSize}" fill="#ffffff"/>
`);

// Insert PayPal Monogram
svgElements.push(`
  <g transform="translate(${logoX + logoWidth * 0.12}, ${logoY + logoHeight * 0.1}) scale(${logoWidth * 0.022})">
    <path d="M24.25 7.75c-.88-3.5-3.88-5.75-8.5-5.75H6.5c-.83 0-1.5.67-1.67 1.5L1.5 23.5c-.08.42.25.75.67.75h5.5l1.33-8.5h3.5c5.33 0 9.17-2.67 10.33-7.5.33-1.42.33-2.67.08-3.5z" fill="#003087"/>
    <path d="M26.08 12.5c-.83 3.5-3.67 6-8.5 6h-3.33l-1.42 9c-.08.42.25.75.67.75h4.67c.75 0 1.33-.58 1.5-1.33l1.17-7.42h1.5c4.75 0 8.17-2.33 9.25-6.5.33-1.25.33-2.33.08-3.08-.25.83-.83 1.83-1.59 2.58z" fill="#0079c1"/>
    <path d="M17.58 18.5h-3.33l1.42-9h3.5c3.08 0 5.42.83 6.67 2.33-1.58 4.08-4.92 6.67-8.26 6.67z" fill="#002060" opacity="0.35"/>
  </g>
`);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="100%" height="100%">
${svgElements.join('\n')}
</svg>`;

fs.writeFileSync(path.join(__dirname, '../public/paypal-qr.svg'), svgContent);
fs.writeFileSync(path.join(__dirname, '../public/qrcode.svg'), svgContent);
console.log('Successfully generated public/paypal-qr.svg & qrcode.svg, size:', totalSize);

QRCode.toFile(path.join(__dirname, '../public/qrcode.png'), url, {
  color: { dark: '#102b5c', light: '#ffffff' },
  width: 512,
  margin: 2,
  errorCorrectionLevel: 'H'
}, (err) => {
  if (err) console.error('PNG error:', err);
  else console.log('Successfully generated public/qrcode.png');
});
