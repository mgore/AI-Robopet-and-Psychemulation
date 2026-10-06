const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

function drawConnectome(width, height) {
  const png = new PNG({ width, height });
  const scale = width / 512;
  const cornerRadius = 112 * scale;

  function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * 4;
    const srcA = a / 255;
    const dstA = png.data[idx + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA <= 0) return;

    png.data[idx] = Math.min(255, Math.round((r * srcA + png.data[idx] * dstA * (1 - srcA)) / outA));
    png.data[idx + 1] = Math.min(255, Math.round((g * srcA + png.data[idx + 1] * dstA * (1 - srcA)) / outA));
    png.data[idx + 2] = Math.min(255, Math.round((b * srcA + png.data[idx + 2] * dstA * (1 - srcA)) / outA));
    png.data[idx + 3] = Math.min(255, Math.round(outA * 255));
  }

  function addGlow(cx, cy, radius, r, g, b, intensity = 1) {
    const rInt = Math.ceil(radius);
    for (let dy = -rInt; dy <= rInt; dy++) {
      for (let dx = -rInt; dx <= rInt; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
          const falloff = Math.max(0, 1 - dist / radius);
          const alpha = Math.round(255 * falloff * falloff * intensity);
          setPixel(Math.round(cx + dx), Math.round(cy + dy), r, g, b, alpha);
        }
      }
    }
  }

  // 1. Fill base background with squircle mask
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Check rounded corner squircle distance
      let inside = true;
      let alpha = 255;
      const cornerX = x < cornerRadius ? cornerRadius - x : x > width - cornerRadius ? x - (width - cornerRadius) : 0;
      const cornerY = y < cornerRadius ? cornerRadius - y : y > height - cornerRadius ? y - (height - cornerRadius) : 0;
      if (cornerX > 0 && cornerY > 0) {
        const dist = Math.sqrt(cornerX * cornerX + cornerY * cornerY);
        if (dist > cornerRadius) {
          inside = false;
        } else if (dist > cornerRadius - 1.5) {
          alpha = Math.round(255 * (cornerRadius - dist) / 1.5);
        }
      }

      if (inside) {
        // Deep midnight cosmic navy base with radial gradients
        const dxCenter = (x - width * 0.65) / (width * 0.65);
        const dyCenter = (y - height * 0.4) / (height * 0.4);
        const distCenter = Math.min(1, Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter));
        
        let bgR = Math.round(30 * (1 - distCenter) + 5 * distCenter);
        let bgG = Math.round(16 * (1 - distCenter) + 8 * distCenter);
        let bgB = Math.round(55 * (1 - distCenter) + 20 * distCenter);

        // Ambient cyan in lower-left
        const distCyan = Math.hypot(x - width * 0.25, y - height * 0.6) / (width * 0.5);
        if (distCyan < 1) {
          const cF = (1 - distCyan) * 0.3;
          bgR = Math.round(bgR * (1 - cF) + 2 * cF);
          bgG = Math.round(bgG * (1 - cF) + 132 * cF);
          bgB = Math.round(bgB * (1 - cF) + 199 * cF);
        }

        // Ambient magenta in upper-right
        const distMag = Math.hypot(x - width * 0.8, y - height * 0.45) / (width * 0.4);
        if (distMag < 1) {
          const mF = (1 - distMag) * 0.35;
          bgR = Math.round(bgR * (1 - mF) + 219 * mF);
          bgG = Math.round(bgG * (1 - mF) + 39 * mF);
          bgB = Math.round(bgB * (1 - mF) + 119 * mF);
        }

        const idx = (y * width + x) * 4;
        png.data[idx] = bgR;
        png.data[idx + 1] = bgG;
        png.data[idx + 2] = bgB;
        png.data[idx + 3] = alpha;
      }
    }
  }

  // 2. Draw axon tracks with glow
  const axonTracks = [
    { y0: 112, r: 250, g: 204, b: 21, amp: 10, freq: 0.008, phase: 0 },       // Amber Gold
    { y0: 165, r: 244, g: 63, b: 94, amp: 8, freq: 0.01, phase: 1.2 },         // Hot Pink / Magenta
    { y0: 216, r: 34, g: 211, b: 238, amp: 12, freq: 0.007, phase: 2.5 },      // Electric Cyan
    { y0: 268, r: 217, g: 70, b: 239, amp: 9, freq: 0.009, phase: 0.8 },       // Fuchsia
    { y0: 322, r: 6, g: 182, b: 212, amp: 10, freq: 0.008, phase: 3.1 },       // Teal
    { y0: 376, r: 236, g: 72, b: 153, amp: 7, freq: 0.011, phase: 1.7 },       // Magenta Pink
    { y0: 434, r: 132, g: 204, b: 22, amp: 11, freq: 0.008, phase: 0.5 }       // Lime Green
  ];

  // Draw background secondary fibers
  for (let track of axonTracks) {
    for (let x = 10 * scale; x < width - 10 * scale; x += 2) {
      const origX = x / scale;
      const y = (track.y0 + Math.sin(origX * track.freq + track.phase) * track.amp) * scale;
      // Soft wide aura
      addGlow(x, y, 14 * scale, track.r, track.g, track.b, 0.12);
      // Medium glow
      addGlow(x, y, 6 * scale, track.r, track.g, track.b, 0.45);
      // Bright inner core
      addGlow(x, y, 2.2 * scale, Math.min(255, track.r + 50), Math.min(255, track.g + 50), Math.min(255, track.b + 50), 0.95);
    }
  }

  // 3. Connective dendritic filaments between tracks
  const filaments = [
    { x1: 210, y1: 165, x2: 220, y2: 216, r: 34, g: 211, b: 238 },
    { x1: 285, y1: 216, x2: 290, y2: 268, r: 244, g: 63, b: 94 },
    { x1: 330, y1: 268, x2: 340, y2: 322, r: 217, g: 70, b: 239 },
    { x1: 170, y1: 216, x2: 175, y2: 268, r: 250, g: 204, b: 21 },
    { x1: 380, y1: 268, x2: 390, y2: 322, r: 34, g: 211, b: 238 },
    { x1: 200, y1: 322, x2: 205, y2: 376, r: 132, g: 204, b: 22 },
    { x1: 320, y1: 376, x2: 325, y2: 434, r: 244, g: 63, b: 94 }
  ];

  for (let fil of filaments) {
    const steps = 30;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const fx = (fil.x1 + (fil.x2 - fil.x1) * t + Math.sin(t * Math.PI) * 8) * scale;
      const fy = (fil.y1 + (fil.y2 - fil.y1) * t) * scale;
      addGlow(fx, fy, 4 * scale, fil.r, fil.g, fil.b, 0.4);
      addGlow(fx, fy, 1.5 * scale, 255, 255, 255, 0.8);
    }
  }

  // 4. Prominent glowing somas (cell bodies) with radiant dendritic arbors
  const somas = [
    { x: 330, y: 105, r: 250, g: 204, b: 21, radius: 10 },   // Top Gold Soma
    { x: 145, y: 160, r: 163, g: 230, b: 53, radius: 8 },    // Mid-Left Lime
    { x: 435, y: 185, r: 244, g: 63, b: 94, radius: 12 },    // Upper-Right Hot Magenta
    { x: 460, y: 240, r: 34, g: 211, b: 238, radius: 11 },   // Mid-Right Cyan
    { x: 170, y: 360, r: 236, g: 72, b: 153, radius: 9 },    // Lower-Left Pink
    { x: 430, y: 440, r: 132, g: 204, b: 22, radius: 12 }    // Bottom-Right Green
  ];

  for (let soma of somas) {
    const cx = soma.x * scale;
    const cy = soma.y * scale;
    // Dendritic starburst branches
    const branches = 12;
    for (let b = 0; b < branches; b++) {
      const angle = (b / branches) * Math.PI * 2 + (soma.x % 5);
      const bLen = (18 + (b % 4) * 12) * scale;
      for (let d = 0; d < bLen; d += 2) {
        const bx = cx + Math.cos(angle) * d;
        const by = cy + Math.sin(angle) * d;
        const fall = 1 - d / bLen;
        addGlow(bx, by, 3 * scale, soma.r, soma.g, soma.b, 0.35 * fall);
        addGlow(bx, by, 1.2 * scale, 255, 255, 255, 0.7 * fall);
      }
    }
    // Wide halo
    addGlow(cx, cy, (soma.radius + 16) * scale, soma.r, soma.g, soma.b, 0.35);
    // Dense soma
    addGlow(cx, cy, soma.radius * scale, soma.r, soma.g, soma.b, 0.95);
    // Brilliant white hot center
    addGlow(cx, cy, (soma.radius * 0.45) * scale, 255, 255, 255, 1.0);
  }

  // 5. Border stroke on squircle
  const strokeW = 3 * scale;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cornerX = x < cornerRadius ? cornerRadius - x : x > width - cornerRadius ? x - (width - cornerRadius) : 0;
      const cornerY = y < cornerRadius ? cornerRadius - y : y > height - cornerRadius ? y - (height - cornerRadius) : 0;
      let distToBorder = 0;
      if (cornerX > 0 && cornerY > 0) {
        distToBorder = Math.abs(Math.sqrt(cornerX * cornerX + cornerY * cornerY) - cornerRadius);
      } else if (cornerX > 0) {
        distToBorder = Math.min(x, width - x);
      } else if (cornerY > 0) {
        distToBorder = Math.min(y, height - y);
      } else {
        distToBorder = Math.min(x, width - x, y, height - y);
      }

      if (distToBorder <= strokeW) {
        const edgeAlpha = Math.round(180 * (1 - distToBorder / strokeW));
        // Cyan-to-magenta edge highlight
        const ratio = x / width;
        const eR = Math.round(56 * (1 - ratio) + 244 * ratio);
        const eG = Math.round(189 * (1 - ratio) + 63 * ratio);
        const eB = Math.round(248 * (1 - ratio) + 94 * ratio);
        setPixel(x, y, eR, eG, eB, edgeAlpha);
      }
    }
  }

  return png;
}

const p512 = drawConnectome(512, 512);
const buffer512 = PNG.sync.write(p512);
fs.writeFileSync(path.join(__dirname, "../public/icon-512.png"), buffer512);

const p192 = drawConnectome(192, 192);
const buffer192 = PNG.sync.write(p192);
fs.writeFileSync(path.join(__dirname, "../public/icon-192.png"), buffer192);

console.log("Successfully generated public/icon-512.png and public/icon-192.png!");
