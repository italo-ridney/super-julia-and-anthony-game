import { P } from './palette.js';
import { TILE, VIEW_W, VIEW_H } from '../config.js';
import { drawInteractiveById } from './interactiveTiles.js';
import { drawSmwGround, drawSmwWater } from './smwTerrain.js';

const THEMES = {
  grass: P.sky,
  cave: P.cave,
  sky: P.sky,
  mountain: '#e89060',
  castle: P.castle,
};

function fill(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/** Parallax em 3 planos (céu fixo, montanhas 0.15×, arbustos/nuvens 0.35×) */
export function drawBackground(ctx, theme, camera) {
  const bg = THEMES[theme] ?? P.sky;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  if (theme === 'grass' || theme === 'sky') {
    const far = camera.x * 0.15;
    const mid = camera.x * 0.28;
    const near = camera.x * 0.42;

    ctx.fillStyle = P.cloud;
    for (const [ox, oy, w, h] of [
      [40, 36, 28, 10],
      [120, 28, 36, 12],
      [200, 44, 24, 8],
    ]) {
      const cx = Math.floor(ox - far) % (VIEW_W + 80) - 40;
      fill(ctx, P.cloud, cx, oy, w, h);
      fill(ctx, P.cloud, cx + 6, oy - 4, w - 8, h);
    }

    ctx.fillStyle = P.hill;
    for (const ox of [20, 90, 170, 240]) {
      const hx = Math.floor(ox - mid) % (VIEW_W + 100) - 50;
      ctx.beginPath();
      ctx.ellipse(hx + 40, 168, 44, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = P.hillSh;
      ctx.beginPath();
      ctx.ellipse(hx + 40, 172, 38, 22, 0, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = P.hill;
      ctx.fillStyle = P.k;
      ctx.fillRect(hx + 34, 158, 3, 3);
      ctx.fillRect(hx + 42, 158, 3, 3);
      ctx.fillStyle = P.hill;
    }

    ctx.fillStyle = P.bush;
    for (const ox of [60, 150, 220]) {
      const bx = Math.floor(ox - near) % (VIEW_W + 60);
      fill(ctx, P.bush, bx, 176, 24, 12);
      fill(ctx, P.bush, bx + 6, 170, 16, 10);
      fill(ctx, P.bush, bx + 14, 174, 14, 10);
    }
  } else if (theme === 'cave') {
    const px = camera.x * 0.2;
    ctx.fillStyle = '#282848';
    ctx.fillRect(Math.floor(30 - px) % VIEW_W, 40, 48, 80);
    ctx.fillRect(Math.floor(140 - px) % VIEW_W, 60, 56, 64);
  } else if (theme === 'mountain') {
    const px = camera.x * 0.25;
    ctx.fillStyle = '#c07050';
    ctx.fillRect(Math.floor(50 - px) % VIEW_W, 120, 100, 48);
    ctx.fillStyle = '#905040';
    ctx.fillRect(Math.floor(160 - px) % VIEW_W, 100, 80, 64);
  } else if (theme === 'castle') {
    const px = camera.x * 0.12;
    ctx.fillStyle = '#303038';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(Math.floor(20 + i * 60 - px) % (VIEW_W + 60), 0, 8, VIEW_H);
    }
  }
}

export function drawTile(ctx, id, x, y, theme, tick = 0) {
  const sx = Math.floor(x);
  const sy = Math.floor(y);
  if (id === 0) return;

  if (drawInteractiveById(ctx, id, sx, sy, theme, tick)) return;

  if (id === 1) {
    drawSmwGround(ctx, sx, sy, theme);
    return;
  }
  if (id === 14) {
    drawSmwWater(ctx, sx, sy, tick);
    return;
  }
  if (id === 7) {
    if (theme === 'sky') {
      fill(ctx, P.w, sx, sy + 5, TILE, 7);
      fill(ctx, P.cyan, sx + 2, sy + 8, TILE - 4, 4);
      fill(ctx, P.k, sx + 4, sy + 9, 2, 2);
      fill(ctx, P.k, sx + 10, sy + 9, 2, 2);
    } else {
      fill(ctx, P.brown, sx, sy + 8, TILE, 8);
      fill(ctx, P.brownD, sx, sy + 6, TILE, 2);
    }
    return;
  }
  if (id === 9) {
    fill(ctx, tick % 16 < 8 ? P.lava : P.red, sx, sy + 8, TILE, 8);
    return;
  }
  if (id === 10) {
    ctx.fillStyle = P.gray;
    ctx.beginPath();
    ctx.moveTo(sx + 8, sy + 4);
    ctx.lineTo(sx + 2, sy + TILE - 2);
    ctx.lineTo(sx + TILE - 2, sy + TILE - 2);
    ctx.closePath();
    ctx.fill();
    return;
  }
  if (id === 11) {
    for (let row = 0; row < TILE; row++) {
      for (let col = 0; col < TILE; col++) {
        fill(ctx, (row + col) % 2 ? P.green : P.w, sx + col, sy + row, 1, 1);
      }
    }
    return;
  }
  if (id === 12) {
    fill(ctx, P.gray, sx + 2, sy, 12, TILE);
    fill(ctx, P.castle, sx + 4, sy + 2, 8, TILE - 4);
    fill(ctx, P.eye, sx + 6, sy + 10, 4, 4);
    return;
  }
  if (id === 13) {
    fill(ctx, P.castle, sx, sy, TILE, TILE);
    fill(ctx, P.k, sx + 2, sy + 2, TILE - 4, TILE - 4);
  }
}
