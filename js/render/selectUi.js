import { P } from './palette.js';
import { drawSpriteScaled } from './sprites.js';

export function drawHeroCard(ctx, x, y, w, h, active, tick) {
  const pulse = active && tick % 30 < 20;
  ctx.fillStyle = active ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.55)';
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = active ? P.qBlockSh : P.blueD;
  ctx.fillRect(x, y, w, 3);
  ctx.fillRect(x, y + h - 3, w, 3);
  ctx.fillRect(x, y, 3, h);
  ctx.fillRect(x + w - 3, y, 3, h);

  if (active) {
    ctx.strokeStyle = pulse ? P.gold : P.qBlockHi;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    ctx.strokeStyle = P.w;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
  } else {
    ctx.fillStyle = P.gray;
    ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = P.k;
    ctx.fillRect(x + 6, y + 6, w - 12, h - 12);
    ctx.globalAlpha = 1;
  }
}

export function drawTitleBanner(ctx, text) {
  ctx.font = '11px monospace';
  const tw = ctx.measureText(text).width;
  const bx = Math.floor((256 - tw) / 2) - 10;
  ctx.fillStyle = P.blueD;
  ctx.fillRect(bx, 10, tw + 20, 22);
  ctx.fillStyle = P.redD;
  ctx.fillRect(bx + 2, 12, tw + 16, 3);
  ctx.fillStyle = P.w;
  ctx.fillText(text, Math.floor((256 - tw) / 2), 26);
}

export function drawWrappedTag(ctx, tag, x, y, maxW, lineH = 9) {
  ctx.font = '6px monospace';
  ctx.fillStyle = P.w;
  const parts = tag.split(' · ');
  const lines = [];
  let line = '';
  for (const part of parts) {
    const tryLine = line ? `${line} · ${part}` : part;
    if (ctx.measureText(tryLine).width <= maxW) {
      line = tryLine;
    } else {
      if (line) lines.push(line);
      line = part;
    }
  }
  if (line) lines.push(line);
  lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineH));
  return lines.length;
}

export function drawPartnerRow(ctx, label, partnerSpriteId, x, y, tick) {
  ctx.font = '7px monospace';
  ctx.fillStyle = P.cyan;
  ctx.fillText(label, x, y);
  const bounce = Math.sin(tick / 18) * 1.5;
  drawSpriteScaled(ctx, partnerSpriteId, 'idle', x + 4, y + 6 + bounce, 2, 1);
  ctx.fillStyle = P.w;
  ctx.font = '6px monospace';
  const nameX = x + 40;
  const partnerName =
    partnerSpriteId === 'rosalina' ? 'Princesa Rosalina' : 'Mario';
  ctx.fillText(partnerName, nameX, y + 14);
}

export function drawGroundStrip(ctx, y = 200) {
  for (let tx = 0; tx < 16; tx++) {
    const sx = tx * 16;
    ctx.fillStyle = P.green;
    ctx.fillRect(sx, y, 16, 4);
    ctx.fillStyle = P.ground;
    ctx.fillRect(sx, y + 4, 16, 12);
    ctx.fillStyle = P.groundD;
    ctx.fillRect(sx, y + 14, 16, 2);
  }
}
