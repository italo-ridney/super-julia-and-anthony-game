import { P } from './palette.js';
import { TILE, VIEW_W, VIEW_H } from '../config.js';

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

export function drawBackground(ctx, theme, camera) {
  const bg = THEMES[theme] ?? P.sky;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  const px = camera.x * 0.3;
  if (theme === 'grass' || theme === 'sky') {
    ctx.fillStyle = theme === 'grass' ? '#58a838' : '#a8d8f8';
    ctx.fillRect(Math.floor(40 - px) % VIEW_W - VIEW_W, 160, 80, 24);
    ctx.fillRect(Math.floor(120 - px) % VIEW_W, 150, 96, 32);
    ctx.fillRect(Math.floor(200 - px) % VIEW_W + VIEW_W, 165, 64, 20);
  } else if (theme === 'cave') {
    ctx.fillStyle = '#282848';
    ctx.fillRect(Math.floor(30 - px) % VIEW_W, 40, 48, 80);
    ctx.fillRect(Math.floor(140 - px) % VIEW_W, 60, 56, 64);
  } else if (theme === 'mountain') {
    ctx.fillStyle = '#c07050';
    ctx.fillRect(Math.floor(50 - px) % VIEW_W, 120, 100, 48);
    ctx.fillStyle = '#905040';
    ctx.fillRect(Math.floor(160 - px) % VIEW_W, 100, 80, 64);
  } else if (theme === 'castle') {
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

  if (id === 1) {
    const topGreen = theme === 'grass' || theme === 'sky';
    fill(ctx, topGreen ? P.green : P.ground, sx, sy, TILE, 4);
    fill(ctx, P.ground, sx, sy + 4, TILE, TILE - 4);
    fill(ctx, P.groundD, sx, sy + TILE - 4, TILE, 4);
    return;
  }
  if (id === 2) {
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        fill(ctx, (row + col) % 2 ? P.brown : P.brownD, sx + col * 8, sy + row * 8, 8, 8);
      }
    }
    return;
  }
  if (id === 3 || id === 4) {
    fill(ctx, P.gold, sx + 1, sy + 1, TILE - 2, TILE - 2);
    fill(ctx, P.brownD, sx, sy, TILE, 2);
    fill(ctx, P.brownD, sx, sy + TILE - 2, TILE, 2);
    ctx.fillStyle = P.k;
    ctx.font = '10px monospace';
    ctx.fillText('?', sx + 5, sy + 12);
    return;
  }
  if (id === 5) {
    fill(ctx, P.greenD, sx, sy, TILE, TILE);
    fill(ctx, P.green, sx + 3, sy, 10, TILE);
    return;
  }
  if (id === 6) {
    fill(ctx, P.gray, sx, sy, TILE, TILE);
    fill(ctx, P.k, sx + 6, sy + 6, 4, 4);
    return;
  }
  if (id === 7) {
    if (theme === 'sky') {
      fill(ctx, P.w, sx, sy + 6, TILE, 6);
      fill(ctx, P.cyan, sx + 2, sy + 8, TILE - 4, 4);
    } else {
      fill(ctx, P.brown, sx, sy + 8, TILE, 8);
      fill(ctx, P.brownD, sx, sy + 6, TILE, 2);
    }
    return;
  }
  if (id === 8) {
    const phase = tick % 20 < 10;
    fill(ctx, P.gold, sx + 4, sy + 4 + (phase ? 0 : 1), 8, 8);
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
    return;
  }
}
