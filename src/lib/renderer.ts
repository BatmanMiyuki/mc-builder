/**
 * Rendu isométrique serveur haute qualité (style WBuilds)
 * Utilise node-canvas pour générer des PNG nets
 */
import { createCanvas, CanvasRenderingContext2D } from 'canvas';
import { PlacedBlock } from './types';
import { getBlockColor } from './blocks';

interface RenderOptions {
  width: number;
  height: number;
  currentStep: number;
  showAll: boolean;
  scale?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function darken(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
}

function lighten(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.min(255, Math.round(r + (255 - r) * factor))},${Math.min(255, Math.round(g + (255 - g) * factor))},${Math.min(255, Math.round(b + (255 - b) * factor))})`;
}

export function renderIsometric(blocks: PlacedBlock[], options: RenderOptions): Buffer {
  const { width, height, currentStep, showAll } = options;
  const dpr = options.scale || 2;
  const W = width * dpr;
  const H = height * dpr;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#1a2744');
  grad.addColorStop(0.5, '#162038');
  grad.addColorStop(1, '#0f1a2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  if (!blocks || blocks.length === 0) return canvas.toBuffer('image/png');

  // Filter visible blocks
  const visible = showAll ? blocks : blocks.filter(b => b.step <= currentStep);
  if (visible.length === 0) return canvas.toBuffer('image/png');

  // Calculate bounds
  const xs = visible.map(b => b.position.x);
  const ys = visible.map(b => b.position.y);
  const zs = visible.map(b => b.position.z);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const minZ = Math.min(...zs), maxZ = Math.max(...zs);
  const sizeX = maxX - minX + 1;
  const sizeZ = maxZ - minZ + 1;

  // Isometric projection settings
  const maxDim = Math.max(sizeX, sizeZ, 1);
  const tileW = Math.min(32, Math.floor(width / (maxDim * 1.6)));
  const tileH = tileW * 0.5;
  const blockH = tileH * 0.85;
  const centerX = width / 2;
  const centerY = height * 0.38;

  // Isometric conversion
  const toIso = (x: number, y: number, z: number) => ({
    x: centerX + ((x - minX) - (z - minZ)) * tileW / 2,
    y: centerY + ((x - minX) + (z - minZ)) * tileH / 2 - (y - minY) * blockH,
  });

  // Draw ground grid
  ctx.strokeStyle = 'rgba(42, 74, 42, 0.25)';
  ctx.lineWidth = 0.5;
  for (let gx = -1; gx <= sizeX; gx++) {
    const s = toIso(gx, minY, -1);
    const e = toIso(gx, minY, sizeZ);
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(e.x, e.y); ctx.stroke();
  }
  for (let gz = -1; gz <= sizeZ; gz++) {
    const s = toIso(-1, minY, gz);
    const e = toIso(sizeX, minY, gz);
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(e.x, e.y); ctx.stroke();
  }

  // Sort blocks: back to front, bottom to top
  const sorted = [...visible].sort((a, b) => {
    const dA = (a.position.x - minX) + (a.position.z - minZ) + (a.position.y - minY) * 0.001;
    const dB = (b.position.x - minX) + (b.position.z - minZ) + (b.position.y - minY) * 0.001;
    return dA - dB;
  });

  const hw = tileW / 2;
  const hh = tileH / 2;

  // Draw each block
  for (const block of sorted) {
    const bx = block.position.x - minX;
    const by = block.position.y - minY;
    const bz = block.position.z - minZ;
    const isHighlight = !showAll && block.step === currentStep;
    const baseColor = getBlockColor(block.blockId);

    let topC: string, leftC: string, rightC: string, alpha: number;

    if (isHighlight) {
      topC = lighten(baseColor, 0.15);
      leftC = darken(baseColor, 0.75);
      rightC = darken(baseColor, 0.55);
      alpha = 1;
    } else if (!showAll) {
      topC = '#555560';
      leftC = '#3D3D45';
      rightC = '#2A2A30';
      alpha = 0.4;
    } else {
      topC = lighten(baseColor, 0.1);
      leftC = darken(baseColor, 0.7);
      rightC = darken(baseColor, 0.5);
      alpha = 1;
    }

    const p = toIso(bx, by, bz);

    ctx.globalAlpha = alpha;

    // Top face
    ctx.fillStyle = topC;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - blockH);
    ctx.lineTo(p.x + hw, p.y - blockH + hh);
    ctx.lineTo(p.x, p.y - blockH + tileH);
    ctx.lineTo(p.x - hw, p.y - blockH + hh);
    ctx.closePath();
    ctx.fill();

    // Left face
    ctx.fillStyle = leftC;
    ctx.beginPath();
    ctx.moveTo(p.x - hw, p.y - blockH + hh);
    ctx.lineTo(p.x, p.y - blockH + tileH);
    ctx.lineTo(p.x, p.y + tileH - blockH + blockH);
    ctx.lineTo(p.x - hw, p.y + hh);
    ctx.closePath();
    ctx.fill();

    // Right face
    ctx.fillStyle = rightC;
    ctx.beginPath();
    ctx.moveTo(p.x + hw, p.y - blockH + hh);
    ctx.lineTo(p.x, p.y - blockH + tileH);
    ctx.lineTo(p.x, p.y + tileH - blockH + blockH);
    ctx.lineTo(p.x + hw, p.y + hh);
    ctx.closePath();
    ctx.fill();

    // Edges
    ctx.globalAlpha = alpha * 0.3;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;

    // Top edges
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - blockH);
    ctx.lineTo(p.x + hw, p.y - blockH + hh);
    ctx.lineTo(p.x, p.y - blockH + tileH);
    ctx.lineTo(p.x - hw, p.y - blockH + hh);
    ctx.closePath();
    ctx.stroke();

    ctx.globalAlpha = alpha;

    // Highlight glow for current step
    if (isHighlight) {
      ctx.save();
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
      ctx.lineWidth = 2;

      // Outline
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - blockH);
      ctx.lineTo(p.x + hw, p.y - blockH + hh);
      ctx.lineTo(p.x + hw, p.y + hh);
      ctx.lineTo(p.x, p.y + tileH);
      ctx.lineTo(p.x - hw, p.y + hh);
      ctx.lineTo(p.x - hw, p.y - blockH + hh);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.globalAlpha = 1;

  // Step label
  ctx.font = `bold ${12}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'left';
  ctx.fillText(`Étape ${currentStep}`, 12, height - 14);

  // Legend
  if (!showAll) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(width - 90, height - 17, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('= À placer', width - 80, height - 13);
  }

  // Block count badge
  const currentBlocks = showAll ? visible : visible.filter(b => b.step === currentStep);
  ctx.fillStyle = 'rgba(233, 69, 96, 0.9)';
  const badgeText = `${currentBlocks.length} blocs`;
  ctx.font = 'bold 11px system-ui, sans-serif';
  const tw = ctx.measureText(badgeText).width;
  const bx2 = width - tw - 24;
  ctx.beginPath();
  ctx.roundRect(bx2, 8, tw + 16, 24, 12);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, bx2 + (tw + 16) / 2, 24);

  return canvas.toBuffer('image/png');
}

// Render all steps as separate images
export function renderAllSteps(blocks: PlacedBlock[], totalSteps: number, width: number, height: number): Buffer[] {
  const images: Buffer[] = [];
  for (let step = 1; step <= totalSteps; step++) {
    images.push(renderIsometric(blocks, { width, height, currentStep: step, showAll: false }));
  }
  return images;
}

// Render full structure overview
export function renderOverview(blocks: PlacedBlock[], width: number, height: number): Buffer {
  return renderIsometric(blocks, { width, height, currentStep: 999, showAll: true });
}
