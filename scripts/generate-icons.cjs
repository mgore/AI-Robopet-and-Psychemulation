const fs = require('fs');
const { PNG } = require('pngjs');

function createNeuralIcon(size) {
  const png = new PNG({
    width: size,
    height: size,
    filterType: -1,
  });

  const cx = size / 2;
  const cy = size / 2;

  // Generate neural nodes inspired by the fluorescent multi-color brain neuron image
  const nodes = [
    { x: cx * 0.45, y: cy * 0.45, r: 255, g: 235, b: 50, radius: size * 0.05 },   // Neon yellow
    { x: cx * 1.55, y: cy * 0.45, r: 80, g: 240, b: 120, radius: size * 0.045 },  // Neon green
    { x: cx * 0.35, y: cy * 1.25, r: 40, g: 220, b: 255, radius: size * 0.05 },   // Electric cyan
    { x: cx * 1.6, y: cy * 1.35, r: 255, g: 60, b: 180, radius: size * 0.045 },   // Vibrant magenta
    { x: cx, y: cy * 0.85, r: 160, g: 80, b: 255, radius: size * 0.06 },          // Central indigo
    { x: cx * 0.8, y: cy * 1.55, r: 255, g: 150, b: 40, radius: size * 0.045 },   // Orange
    { x: cx * 1.3, y: cy * 1.6, r: 0, g: 255, b: 200, radius: size * 0.04 },      // Teal
  ];

  // Horizontal multi-colored axon neural branches
  const axons = [
    { y: cy * 0.45, r: 255, g: 225, b: 50, width: size * 0.016 },
    { y: cy * 0.65, r: 255, g: 60, b: 150, width: size * 0.015 },
    { y: cy * 0.85, r: 180, g: 70, b: 240, width: size * 0.017 },
    { y: cy * 1.05, r: 50, g: 230, b: 255, width: size * 0.018 },
    { y: cy * 1.25, r: 40, g: 220, b: 255, width: size * 0.016 },
    { y: cy * 1.45, r: 255, g: 90, b: 180, width: size * 0.015 },
    { y: cy * 1.65, r: 255, g: 180, b: 50, width: size * 0.016 },
  ];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Base background: Dark navy cosmic indigo
      const distFromCenter = Math.hypot(x - cx, y - cy) / (size * 0.7);
      let r = Math.max(8, Math.floor(16 - distFromCenter * 8));
      let g = Math.max(10, Math.floor(20 - distFromCenter * 10));
      let b = Math.max(25, Math.floor(45 - distFromCenter * 15));

      // Draw horizontal neural synaptic paths with organic wave noise
      for (const axon of axons) {
        const wave = Math.sin(x * 0.04 + axon.y) * (size * 0.018) + Math.cos(x * 0.08) * (size * 0.009);
        const dY = Math.abs(y - (axon.y + wave));
        if (dY < axon.width * 5.5) {
          const intensity = Math.exp(-(dY * dY) / (axon.width * axon.width * 2.2));
          r = Math.min(255, r + Math.floor(axon.r * intensity * 0.95));
          g = Math.min(255, g + Math.floor(axon.g * intensity * 0.95));
          b = Math.min(255, b + Math.floor(axon.b * intensity * 0.95));
        }
      }

      // Draw neural nodes (somas) and radiating glow
      for (const node of nodes) {
        const d = Math.hypot(x - node.x, y - node.y);
        if (d < node.radius * 4.5) {
          const glow = Math.exp(-(d * d) / (node.radius * node.radius * 2.2));
          r = Math.min(255, r + Math.floor(node.r * glow));
          g = Math.min(255, g + Math.floor(node.g * glow));
          b = Math.min(255, b + Math.floor(node.b * glow));
        }
      }

      // Full opacity for standard icon compatibility
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = 255;
    }
  }

  return PNG.sync.write(png);
}

const buffer512 = createNeuralIcon(512);
const buffer192 = createNeuralIcon(192);

fs.writeFileSync('public/icon-512.png', buffer512);
fs.writeFileSync('public/icon-192.png', buffer192);

if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/icon-512.png', buffer512);
  fs.writeFileSync('dist/icon-192.png', buffer192);
}

console.log('Successfully generated valid 512x512 and 192x192 PNG neural network icons!');
